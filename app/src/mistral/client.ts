import { Mistral } from '@mistralai/mistralai'
import { env } from 'wasp/server'

// Initialisation unique du client Mistral (singleton)
let _client: Mistral | null = null

export function getMistralClient(): Mistral {
  if (!_client) {
    _client = new Mistral({ apiKey: env.MISTRAL_API_KEY, timeoutMs: 20_000 })
  }
  return _client
}

// Modèles utilisés selon la complexité de la tâche
export const MODELES = {
  // Chat médical principal — Small suffisant avec RAG + system prompt structuré
  PRINCIPAL: 'mistral-small-latest',
  // Tâches simples : classification d'intention, détection d'urgence
  LEGER: 'mistral-small-latest',
} as const
