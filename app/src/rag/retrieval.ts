import { prisma } from 'wasp/server'
import { genererEmbedding } from './client'

type DocumentPertinent = {
  source: string
  titre: string
  contenu: string
  similarite: number
}

// Similarité cosinus entre deux vecteurs
function cosineSimdist(a: number[], b: number[]): number {
  let dot = 0, normA = 0, normB = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB)
  return denom === 0 ? 0 : dot / denom
}

// Seuil minimal de pertinence
const SEUIL_SIMILARITE = 0.65

/**
 * Recherche les documents les plus pertinents pour une requête.
 * Lance en parallèle : génération embedding + chargement documents.
 */
export async function rechercherDocuments(
  query: string,
  topK = 3
): Promise<DocumentPertinent[]> {
  const [queryEmbedding, docs] = await Promise.all([
    genererEmbedding(query),
    prisma.documentRAG.findMany({
      select: { source: true, titre: true, contenu: true, embedding: true },
    }),
  ])

  if (docs.length === 0) return []

  return docs
    .filter((d) => Array.isArray(d.embedding))
    .map((d) => ({
      source: d.source,
      titre: d.titre,
      contenu: d.contenu,
      similarite: cosineSimdist(queryEmbedding, d.embedding as number[]),
    }))
    .filter((d) => d.similarite >= SEUIL_SIMILARITE)
    .sort((a, b) => b.similarite - a.similarite)
    .slice(0, topK)
}

/**
 * Formate les documents pertinents en section à injecter dans le system prompt.
 */
export function formaterContexteRAG(docs: DocumentPertinent[]): string {
  if (docs.length === 0) return ''

  const sections = docs
    .map((d) => `**[${d.titre}]** *(source : ${d.source})*\n${d.contenu}`)
    .join('\n\n---\n\n')

  return `## Extraits de sources médicales de référence\n\nLes extraits suivants proviennent de recommandations officielles. Appuie ta réponse sur ces sources et cite-les explicitement.\n\n${sections}`
}
