import { SubscriptionStatus } from './plans'
import type { OngletMedecine } from '../mistral/prompts'

// Nombre maximum de messages par jour pour les utilisateurs gratuits
export const LIMITE_MESSAGES_GRATUIT = 10

// Onglets accessibles sans abonnement
export const ONGLETS_GRATUITS: OngletMedecine[] = [
  'moderne', 'osteopathie', 'phytotherapie', 'nutrition', 'aromatherapie',
  'homeopathie', 'naturopathie', 'chinoise',
]

// Onglets nécessitant un abonnement Premium
export const ONGLETS_PREMIUM: OngletMedecine[] = []

/**
 * Retourne true si l'utilisateur a un abonnement Premium actif.
 */
export function isUserPremium(user: {
  subscriptionStatus?: string | null
  subscriptionPlan?: string | null
}): boolean {
  return (
    user.subscriptionStatus === SubscriptionStatus.Active ||
    user.subscriptionStatus === SubscriptionStatus.CancelAtPeriodEnd
  )
}

/**
 * Retourne true si l'onglet est accessible pour cet utilisateur.
 */
export function isOngletAccessible(
  onglet: OngletMedecine,
  isPremium: boolean
): boolean {
  if (isPremium) return true
  return ONGLETS_GRATUITS.includes(onglet)
}
