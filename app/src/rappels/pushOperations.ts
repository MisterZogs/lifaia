import { HttpError } from 'wasp/server'
import * as z from 'zod'
import { type AbonnerNotificationsPush, type DesabonnerNotificationsPush } from 'wasp/server/operations'
import { ensureArgsSchemaOrThrowHttpError } from '../server/validation'

// Schéma de validation d'une subscription Web Push
const subscriptionSchema = z.object({
  endpoint: z.string().url(),
  p256dh: z.string(),
  auth: z.string(),
})

/**
 * Enregistre ou met à jour une subscription push pour l'utilisateur courant.
 * Utilise un upsert sur l'endpoint (unique par appareil/navigateur).
 */
export const abonnerNotificationsPush: AbonnerNotificationsPush<
  z.infer<typeof subscriptionSchema>,
  { ok: boolean }
> = async (rawArgs, context) => {
  if (!context.user) throw new HttpError(401, 'Non authentifié.')
  const { endpoint, p256dh, auth } = ensureArgsSchemaOrThrowHttpError(subscriptionSchema, rawArgs)

  await context.entities.PushSubscription.upsert({
    where: { endpoint },
    create: { userId: context.user.id, endpoint, p256dh, auth },
    update: { userId: context.user.id, p256dh, auth },
  })

  return { ok: true }
}

/**
 * Supprime la subscription push identifiée par son endpoint
 * pour l'utilisateur courant.
 */
export const desabonnerNotificationsPush: DesabonnerNotificationsPush<
  { endpoint: string },
  { ok: boolean }
> = async (rawArgs, context) => {
  if (!context.user) throw new HttpError(401, 'Non authentifié.')
  const schema = z.object({ endpoint: z.string() })
  const { endpoint } = ensureArgsSchemaOrThrowHttpError(schema, rawArgs)

  await context.entities.PushSubscription.deleteMany({
    where: { userId: context.user.id, endpoint },
  })

  return { ok: true }
}
