import { getMistralClient } from '../mistral/client'

/**
 * Génère un embedding vectoriel pour un texte via Mistral embed.
 * Retourne un tableau de 1024 floats.
 */
export async function genererEmbedding(texte: string): Promise<number[]> {
  const client = getMistralClient()
  const response = await client.embeddings.create({
    model: 'mistral-embed',
    inputs: [texte],
  })
  return response.data[0].embedding ?? []
}
