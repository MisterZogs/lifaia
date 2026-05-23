import * as z from 'zod'

// Validation de la clé API Mistral au démarrage du serveur
export const mistralEnvSchema = z.object({
  MISTRAL_API_KEY: z.string().min(1, 'MISTRAL_API_KEY est requis pour le chat médical'),
})
