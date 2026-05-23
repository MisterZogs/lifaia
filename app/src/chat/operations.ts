import { HttpError } from 'wasp/server'
import { type EnvoyerMessage, type GetHistoriqueChat, type EffacerHistoriqueChat } from 'wasp/server/operations'
import * as z from 'zod'
import { getMistralClient, MODELES } from '../mistral/client'
import { genererMessageUrgence } from '../mistral/urgences'
import { getSystemPrompt, getMessageHorsChamp, calculerAge } from '../mistral/prompts'
import { pretraiterMessage } from '../mistral/pretraitement'
import { ensureArgsSchemaOrThrowHttpError } from '../server/validation'

// Schéma de validation du message entrant
const envoyerMessageSchema = z.object({
  contenu: z
    .string()
    .min(1, 'Le message ne peut pas être vide.')
    .max(2000, 'Le message ne peut pas dépasser 2000 caractères.'),
  onglet: z.enum(['moderne', 'osteopathie', 'phytotherapie', 'nutrition', 'aromatherapie', 'homeopathie', 'naturopathie', 'chinoise']).default('moderne'),
})

type EnvoyerMessageInput = z.infer<typeof envoyerMessageSchema>

type MessageReponse = {
  id: string
  role: string
  contenu: string
  urgenceDetectee: boolean
  createdAt: Date
}

/**
 * Action principale du chat médical.
 * Flux : validation → détection urgence → system prompt → Mistral → persistance → retour
 *
 * Garde-fous appliqués dans l'ordre :
 * 1. Détection d'urgence vitale (bypass immédiat si positif)
 * 2. System prompt avec règles médicales strictes
 * 3. Pas de logging du contenu PII en production
 */
export const envoyerMessage: EnvoyerMessage<
  EnvoyerMessageInput,
  MessageReponse
> = async (rawArgs, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Vous devez être connecté pour utiliser le chat.')
  }

  const { contenu, onglet } = ensureArgsSchemaOrThrowHttpError(
    envoyerMessageSchema,
    rawArgs
  )

  // Récupération du profil patient pour personnaliser les réponses
  const utilisateur = await context.entities.User.findUnique({
    where: { id: context.user.id },
    select: {
      pays: true, langue: true, onboardingTermine: true,
      sexe: true, dateNaissance: true, tailleCm: true, poidsKg: true,
    },
  })

  if (!utilisateur?.onboardingTermine) {
    throw new HttpError(403, "Veuillez compléter l'onboarding avant d'utiliser le chat.")
  }

  const pays = utilisateur.pays ?? 'FR'
  const langue = utilisateur.langue ?? 'fr-FR'

  const profil = {
    pays,
    langue,
    sexe: utilisateur.sexe ?? undefined,
    ageAns: utilisateur.dateNaissance ? calculerAge(utilisateur.dateNaissance) : undefined,
    tailleCm: utilisateur.tailleCm ?? undefined,
    poidsKg: utilisateur.poidsKg ?? undefined,
  }

  // Persistance du message utilisateur (avant l'appel LLM)
  const messageUtilisateur = await context.entities.MessageChat.create({
    data: {
      userId: context.user.id,
      role: 'user',
      contenu,
      onglet,
    },
  })

  // --- GARDE-FOUS 1+2 : urgence + modération en un seul appel LLM ---
  const { estUrgence, estMedical } = await pretraiterMessage(contenu)

  if (estUrgence) {
    const contenuUrgence = genererMessageUrgence(pays)

    const messageUrgence = await context.entities.MessageChat.create({
      data: {
        userId: context.user.id,
        role: 'assistant',
        contenu: contenuUrgence,
        onglet,
        urgenceDetectee: true,
        modeleUtilise: 'urgence-bypass',
      },
    })

    // Log d'audit sans PII (exigence HDS)
    console.log(
      `[AUDIT] userId=${context.user.id} urgence=true timestamp=${new Date().toISOString()}`
    )

    return {
      id: messageUrgence.id,
      role: messageUrgence.role,
      contenu: messageUrgence.contenu,
      urgenceDetectee: true,
      createdAt: messageUrgence.createdAt,
    }
  }

  // --- GARDE-FOU 2 : Hors-champ médical ---
  if (!estMedical) {
    const contenuRefus = getMessageHorsChamp(langue)
    const messageRefus = await context.entities.MessageChat.create({
      data: {
        userId: context.user.id,
        role: 'assistant',
        contenu: contenuRefus,
        onglet,
        modeleUtilise: 'hors-champ-bypass',
      },
    })
    return {
      id: messageRefus.id,
      role: messageRefus.role,
      contenu: messageRefus.contenu,
      urgenceDetectee: false,
      createdAt: messageRefus.createdAt,
    }
  }

  // --- Récupération de l'historique récent pour le contexte ---
  const historique = await context.entities.MessageChat.findMany({
    where: { userId: context.user.id, onglet },
    orderBy: { createdAt: 'desc' },
    take: 10, // 5 échanges (user + assistant) pour le contexte
    select: { role: true, contenu: true },
  })

  // Inversion pour l'ordre chronologique
  const historiqueChronologique = historique.reverse()

  // --- Appel Mistral avec system prompt médical ---
  const debut = Date.now()
  let contenuReponse: string
  let modeleUtilise: string = MODELES.PRINCIPAL

  try {
    const client = getMistralClient()

    const reponse = await client.chat.complete({
      model: MODELES.PRINCIPAL,
      messages: [
        {
          role: 'system',
          content: getSystemPrompt(onglet, profil),
        },
        // Historique de la conversation
        ...historiqueChronologique.map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.contenu,
        })),
        // Nouveau message de l'utilisateur
        { role: 'user', content: contenu },
      ],
      maxTokens: 1500,
      temperature: 0.3, // Faible température pour des réponses médicales cohérentes
    })

    contenuReponse =
      reponse.choices?.[0]?.message?.content?.toString() ??
      getMessageHorsChamp(langue)
    modeleUtilise = reponse.model ?? MODELES.PRINCIPAL
  } catch (err) {
    console.error('[CHAT] Erreur appel Mistral:', err)
    throw new HttpError(503, "Le service d'assistance est temporairement indisponible. Veuillez réessayer dans quelques instants.")
  }

  const latenceMs = Date.now() - debut

  // Log d'audit sans PII (exigence HDS)
  console.log(
    `[AUDIT] userId=${context.user.id} modele=${modeleUtilise} latence=${latenceMs}ms onglet=${onglet} timestamp=${new Date().toISOString()}`
  )

  // Persistance de la réponse IA
  const messageAssistant = await context.entities.MessageChat.create({
    data: {
      userId: context.user.id,
      role: 'assistant',
      contenu: contenuReponse,
      onglet,
      urgenceDetectee: false,
      modeleUtilise,
      latenceMs,
    },
  })

  return {
    id: messageAssistant.id,
    role: messageAssistant.role,
    contenu: messageAssistant.contenu,
    urgenceDetectee: false,
    createdAt: messageAssistant.createdAt,
  }
}

// Schéma pour la query de l'historique
const getHistoriqueChatSchema = z.object({
  onglet: z.enum(['moderne', 'osteopathie', 'phytotherapie', 'nutrition', 'aromatherapie', 'homeopathie', 'naturopathie', 'chinoise']).default('moderne'),
  limite: z.number().min(1).max(200).default(30),
})

type GetHistoriqueChatInput = z.infer<typeof getHistoriqueChatSchema>

/**
 * Récupère l'historique des messages du chat pour l'utilisateur connecté.
 */
export const getHistoriqueChat: GetHistoriqueChat<
  GetHistoriqueChatInput,
  MessageReponse[]
> = async (rawArgs, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Vous devez être connecté.')
  }

  const { onglet, limite } = ensureArgsSchemaOrThrowHttpError(
    getHistoriqueChatSchema,
    rawArgs
  )

  // On prend les N derniers messages (desc), puis on les inverse pour l'affichage chronologique
  const messages = await context.entities.MessageChat.findMany({
    where: { userId: context.user.id, onglet },
    orderBy: { createdAt: 'desc' },
    take: limite,
    select: {
      id: true,
      role: true,
      contenu: true,
      urgenceDetectee: true,
      createdAt: true,
    },
  })

  return messages.reverse()
}

// Schéma pour l'action d'effacement de l'historique
const effacerHistoriqueChatSchema = z.object({
  onglet: z.enum(['moderne', 'osteopathie', 'phytotherapie', 'nutrition', 'aromatherapie', 'homeopathie', 'naturopathie', 'chinoise']),
})

/**
 * Supprime tous les messages de l'onglet indiqué pour l'utilisateur connecté.
 * Utilisé par le bouton "Nouvelle conversation" dans ChatPage.
 */
export const effacerHistoriqueChat: EffacerHistoriqueChat<
  { onglet: string },
  { ok: boolean }
> = async (rawArgs, context) => {
  if (!context.user) throw new HttpError(401, 'Non authentifié.')
  const { onglet } = ensureArgsSchemaOrThrowHttpError(effacerHistoriqueChatSchema, rawArgs)
  await context.entities.MessageChat.deleteMany({
    where: { userId: context.user.id, onglet }
  })
  return { ok: true }
}
