import { prisma } from 'wasp/server'
import { getMistralClient, MODELES } from '../mistral/client'

// Seuil au-delà duquel on considère qu'une nouvelle session a commencé (2 heures)
const SEUIL_NOUVELLE_SESSION_MS = 2 * 60 * 60 * 1000

/**
 * Vérifie si une nouvelle session vient de commencer (dernier message > 2h).
 * Si oui, génère un résumé cumulatif de la session passée et le persiste.
 * Doit être appelé AVANT d'enregistrer le nouveau message utilisateur.
 */
export async function mettreAJourMemoireSiNouvelleSession(userId: string): Promise<void> {
  const dernierMessage = await prisma.messageChat.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: { createdAt: true },
  })

  if (!dernierMessage) return

  const delai = Date.now() - dernierMessage.createdAt.getTime()
  if (delai < SEUIL_NOUVELLE_SESSION_MS) return

  // Récupérer le résumé existant (pour enrichissement cumulatif)
  const resumeExistant = await prisma.resumConversation.findUnique({
    where: { userId },
    select: { resume: true, derniereSessionAt: true },
  })

  // Récupérer tous les messages depuis le dernier résumé (session passée complète)
  const depuisDate = resumeExistant?.derniereSessionAt ?? new Date(0)
  const messages = await prisma.messageChat.findMany({
    where: { userId, createdAt: { gt: depuisDate } },
    orderBy: { createdAt: 'asc' },
    select: { role: true, contenu: true, onglet: true },
  })

  if (messages.length === 0) return

  const transcription = messages
    .map(m => `[${m.onglet}] ${m.role === 'user' ? 'Patient' : 'IA'}: ${m.contenu}`)
    .join('\n')

  const instructionBase =
    'Tu es un assistant médical. Génère un résumé concis (max 200 mots) ' +
    'des échanges suivants, en retenant uniquement les informations médicalement ' +
    'pertinentes : symptômes décrits, conseils donnés, questions posées, ' +
    'informations de santé mentionnées. Écris en français, de façon neutre et factuelle.'

  const systemPrompt = resumeExistant
    ? `${instructionBase}\n\nRésumé des sessions précédentes à enrichir :\n${resumeExistant.resume}`
    : instructionBase

  try {
    const client = getMistralClient()
    const response = await client.chat.complete({
      model: MODELES.LEGER,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Échanges de la session à intégrer :\n${transcription}` },
      ],
      maxTokens: 350,
      temperature: 0.2,
    })

    const nouveauResume = response.choices?.[0]?.message?.content
    if (!nouveauResume || typeof nouveauResume !== 'string') return

    await prisma.resumConversation.upsert({
      where: { userId },
      create: { userId, resume: nouveauResume, derniereSessionAt: dernierMessage.createdAt },
      update: { resume: nouveauResume, derniereSessionAt: dernierMessage.createdAt },
    })

    console.log(`[MEMOIRE] Résumé mis à jour pour userId=${userId}`)
  } catch (err) {
    // Échec non bloquant — la conversation continue sans mémoire long terme
    console.error(`[MEMOIRE] Erreur génération résumé userId=${userId}:`, err)
  }
}

/**
 * Retourne le résumé cumulatif du patient, ou null si aucune session passée.
 */
export async function obtenirResume(userId: string): Promise<string | null> {
  const resum = await prisma.resumConversation.findUnique({
    where: { userId },
    select: { resume: true },
  })
  return resum?.resume ?? null
}
