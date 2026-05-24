import type { Request, Response } from 'express'
import { prisma } from 'wasp/server'
import { getMistralClient, MODELES } from '../mistral/client'
import { genererMessageUrgence } from '../mistral/urgences'
import { getSystemPrompt, getMessageHorsChamp, calculerAge, type OngletMedecine, type ProfilPatient } from '../mistral/prompts'
import { pretraiterMessage } from '../mistral/pretraitement'
import { rechercherDocuments, formaterContexteRAG } from '../rag/retrieval'
import { isUserPremium, isOngletAccessible, LIMITE_MESSAGES_GRATUIT } from '../payment/freemium'
import { mettreAJourMemoireSiNouvelleSession, obtenirResume } from './memory'

const ONGLETS_VALIDES: OngletMedecine[] = [
  'moderne', 'osteopathie', 'phytotherapie', 'nutrition',
  'aromatherapie', 'homeopathie', 'naturopathie', 'chinoise',
]

/**
 * Handler SSE pour le streaming du chat médical.
 * Les tokens Mistral sont envoyés au client au fur et à mesure.
 * Format : Server-Sent Events (text/event-stream)
 *
 * Événements émis :
 * - data: {"token": "..."} — token de réponse
 * - data: {"urgence": true} — urgence vitale détectée
 * - data: {"done": true, "messageId": "..."} — fin du stream
 * - data: {"error": "..."} — erreur
 */
export const chatStreamHandler = async (
  req: Request & { user?: { id: string } },
  res: Response,
  _context: unknown
): Promise<void> => {
  // Vérification d'authentification
  if (!req.user?.id) {
    res.status(401).json({ error: 'Non authentifié.' })
    return
  }

  const { contenu, onglet: ongletBrut, contexteEnfantId } = req.body
  const onglet: OngletMedecine = ONGLETS_VALIDES.includes(ongletBrut)
    ? ongletBrut
    : 'moderne'

  if (!contenu || typeof contenu !== 'string' || contenu.trim().length === 0) {
    res.status(400).json({ error: 'Message vide.' })
    return
  }

  if (contenu.length > 2000) {
    res.status(400).json({ error: 'Message trop long.' })
    return
  }

  const userId = req.user.id

  // En-têtes SSE
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.setHeader('X-Accel-Buffering', 'no') // Désactive le buffering nginx si présent
  res.flushHeaders()

  // Fonction utilitaire pour envoyer un événement SSE
  const envoyer = (data: object) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`)
  }

  try {
    // Récupération du profil patient
    const utilisateur = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        pays: true, langue: true, onboardingTermine: true,
        sexe: true, dateNaissance: true, tailleCm: true, poidsKg: true,
        groupeSanguin: true, medecinTraitant: true,
        subscriptionStatus: true, subscriptionPlan: true,
      },
    })

    if (!utilisateur?.onboardingTermine) {
      envoyer({ error: "Veuillez compléter l'onboarding." })
      res.end()
      return
    }

    const premium = isUserPremium(utilisateur)

    // Vérification accès à l'onglet
    if (!isOngletAccessible(onglet, premium)) {
      envoyer({ error: 'PREMIUM_REQUIRED' })
      res.end()
      return
    }

    // Vérification limite totale pour les utilisateurs gratuits
    if (!premium) {
      const nbMessagesTotal = await prisma.messageChat.count({
        where: { userId, role: 'user' },
      })
      if (nbMessagesTotal >= LIMITE_MESSAGES_GRATUIT) {
        envoyer({ error: 'DAILY_LIMIT_REACHED' })
        res.end()
        return
      }
    }

    const pays = utilisateur.pays ?? 'FR'
    const langue = utilisateur.langue ?? 'fr-FR'

    // Récupération du dossier médical (filtré selon le patient actif)
    const enfantIdFiltre = (contexteEnfantId && typeof contexteEnfantId === 'string') ? contexteEnfantId : null
    const filtreDossier = enfantIdFiltre === null ? { enfantId: null } : { enfantId: enfantIdFiltre }

    // Mise à jour de la mémoire long terme si nouvelle session (non bloquant)
    mettreAJourMemoireSiNouvelleSession(userId).catch(() => {})

    const [allergies, traitements, antecedents, antecedentsFamiliaux, vaccinations, docsRAG, pretraitement, resumeMemoire] = await Promise.all([
      prisma.allergie.findMany({
        where: { userId, ...filtreDossier },
        select: { nom: true, type: true, severite: true },
      }),
      prisma.traitement.findMany({
        where: { userId, ...filtreDossier },
        select: { nom: true, dose: true, frequence: true },
      }),
      prisma.antecedentMedical.findMany({
        where: { userId, ...filtreDossier },
        select: { categorie: true, description: true, annee: true },
      }),
      enfantIdFiltre === null
        ? prisma.antecedentFamilial.findMany({
            where: { userId },
            select: { relation: true, maladie: true },
          })
        : Promise.resolve([]),
      prisma.vaccination.findMany({
        where: { userId, ...filtreDossier },
        select: { vaccin: true, dateDernierDose: true, prochainRappel: true },
      }),
      Promise.race([
        rechercherDocuments(contenu),
        new Promise<any[]>((resolve) => setTimeout(() => resolve([]), 3000)),
      ]).catch(() => []) as Promise<any[]>,
      // Pré-traitement en parallèle : urgence + modération (ne dépend que de contenu)
      // Timeout 8s — si Mistral est lent, on laisse passer (fail-safe)
      Promise.race([
        pretraiterMessage(contenu),
        new Promise<{ estUrgence: boolean; estMedical: boolean }>((resolve) =>
          setTimeout(() => resolve({ estUrgence: false, estMedical: true }), 8_000)
        ),
      ]).catch(() => ({ estUrgence: false, estMedical: true })),
      obtenirResume(userId),
    ])

    // Construction du profil à passer au system prompt
    // Si un contexteEnfantId est fourni, on consulte pour cet enfant
    let profil: ProfilPatient = {
      pays,
      langue,
      sexe: utilisateur.sexe ?? undefined,
      ageAns: utilisateur.dateNaissance ? calculerAge(utilisateur.dateNaissance) : undefined,
      tailleCm: utilisateur.tailleCm ?? undefined,
      poidsKg: utilisateur.poidsKg ?? undefined,
      groupeSanguin: utilisateur.groupeSanguin ?? undefined,
      medecinTraitant: utilisateur.medecinTraitant ?? undefined,
      dossier: { allergies, traitements, antecedents, antecedentsFamiliaux, vaccinations },
    }

    if (enfantIdFiltre) {
      const enfant = await prisma.enfant.findFirst({
        where: { id: enfantIdFiltre, userId },
        select: { prenom: true, sexe: true, dateNaissance: true, tailleCm: true, poidsKg: true, groupeSanguin: true, medecinRef: true },
      })
      if (enfant) {
        profil = {
          pays,
          langue,
          estEnfant: true,
          prenomEnfant: enfant.prenom,
          sexe: enfant.sexe ?? undefined,
          ageAns: enfant.dateNaissance ? calculerAge(enfant.dateNaissance) : undefined,
          tailleCm: enfant.tailleCm ?? undefined,
          poidsKg: enfant.poidsKg ?? undefined,
          groupeSanguin: enfant.groupeSanguin ?? undefined,
          medecinTraitant: enfant.medecinRef ?? undefined,
          dossier: { allergies, traitements, antecedents, antecedentsFamiliaux: [], vaccinations },
        }
      }
    }

    // Persistance du message utilisateur
    await prisma.messageChat.create({
      data: { userId, role: 'user', contenu: contenu.trim(), onglet },
    })

    const { estUrgence, estMedical } = pretraitement

    // Cas urgence vitale
    if (estUrgence) {
      const contenuUrgence = genererMessageUrgence(profil.pays)
      envoyer({ urgence: true })
      envoyer({ token: contenuUrgence })

      await prisma.messageChat.create({
        data: {
          userId, role: 'assistant', contenu: contenuUrgence,
          onglet, urgenceDetectee: true, modeleUtilise: 'urgence-bypass',
        },
      })

      console.log(`[AUDIT] userId=${userId} urgence=true timestamp=${new Date().toISOString()}`)
      envoyer({ done: true })
      res.end()
      return
    }

    // Cas hors-champ médical
    if (!estMedical) {
      const contenuRefus = getMessageHorsChamp(profil.langue)
      envoyer({ token: contenuRefus })

      await prisma.messageChat.create({
        data: {
          userId, role: 'assistant', contenu: contenuRefus,
          onglet, modeleUtilise: 'hors-champ-bypass',
        },
      })

      envoyer({ done: true })
      res.end()
      return
    }

    // Récupération de l'historique pour le contexte
    const historique = await prisma.messageChat.findMany({
      where: { userId, onglet },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: { role: true, contenu: true },
    })
    const historiqueChronologique = historique.reverse()

    // Appel Mistral en mode streaming
    const client = getMistralClient()
    const debut = Date.now()
    let contenuComplet = ''

    const stream = await client.chat.stream({
      model: MODELES.PRINCIPAL,
      messages: [
        {
          role: 'system',
          content: (() => {
            const base = getSystemPrompt(onglet, profil)
            const contexteRAG = formaterContexteRAG(docsRAG)
            const avecRAG = contexteRAG ? `${base}\n\n${contexteRAG}` : base
            if (!resumeMemoire) return avecRAG
            return `${avecRAG}\n\n## Mémoire des sessions précédentes\n${resumeMemoire}`
          })(),
        },
        ...historiqueChronologique.map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.contenu,
        })),
        { role: 'user', content: contenu },
      ],
      maxTokens: 1000,
      temperature: 0.3,
    })

    // Envoi des tokens au fur et à mesure
    for await (const chunk of stream) {
      const token = chunk.data.choices[0]?.delta?.content
      if (token) {
        contenuComplet += token
        envoyer({ token })
      }
    }

    const latenceMs = Date.now() - debut

    // Persistance de la réponse complète
    const messageAssistant = await prisma.messageChat.create({
      data: {
        userId, role: 'assistant', contenu: contenuComplet,
        onglet, modeleUtilise: MODELES.PRINCIPAL, latenceMs,
      },
    })

    console.log(
      `[AUDIT] userId=${userId} modele=${MODELES.PRINCIPAL} latence=${latenceMs}ms onglet=${onglet} docsRAG=${docsRAG.length}`
    )

    envoyer({ done: true, messageId: messageAssistant.id })
    res.end()
  } catch (err: any) {
    const status = err?.status ?? err?.statusCode ?? err?.response?.status ?? 0
    console.error(`[STREAM] Erreur (status=${status}):`, err?.message ?? err)

    if (status === 429) {
      envoyer({ error: 'Quota API temporairement dépassé. Réessayez dans quelques secondes.' })
    } else if (status === 401 || status === 403) {
      envoyer({ error: 'Clé API invalide ou expirée.' })
    } else {
      envoyer({ error: 'Service temporairement indisponible.' })
    }
    res.end()
  }
}
