import type { PrismaClient } from '@prisma/client'
import { getMistralClient } from '../mistral/client'
import { DOCUMENTS_MEDICAUX } from './documents'

/**
 * Indexe les documents médicaux de référence dans la base de données.
 * À lancer via : wasp db seed seedDocumentsRAG
 * Génère un embedding Mistral pour chaque chunk et le stocke en JSON.
 *
 * Traitement séquentiel avec pause entre chaque doc pour respecter
 * le rate limit Mistral free tier (60 req/min).
 */
export async function seedDocumentsRAG(prismaClient: PrismaClient) {
  const client = getMistralClient()

  console.log(`[RAG] Indexation de ${DOCUMENTS_MEDICAUX.length} documents...`)

  // Vider les documents existants pour éviter les doublons
  await prismaClient.documentRAG.deleteMany({})

  let indexed = 0

  for (const doc of DOCUMENTS_MEDICAUX) {
    let embedding: number[] | null = null
    let tentatives = 0

    // Retry avec backoff exponentiel sur 429
    while (embedding === null) {
      try {
        const response = await client.embeddings.create({
          model: 'mistral-embed',
          inputs: [doc.titre + '\n\n' + doc.contenu],
        })
        embedding = response.data[0].embedding ?? null
      } catch (err: any) {
        tentatives++
        const status = err?.status ?? err?.statusCode ?? 0
        if (status === 429 && tentatives <= 5) {
          const attente = tentatives * 15_000 // 15s, 30s, 45s, 60s, 75s
          console.warn(`[RAG] Rate limit 429 — attente ${attente / 1000}s avant retry (tentative ${tentatives}/5)...`)
          await new Promise((resolve) => setTimeout(resolve, attente))
        } else {
          throw err
        }
      }
    }

    await prismaClient.documentRAG.create({
      data: {
        source: doc.source,
        titre: doc.titre,
        contenu: doc.contenu,
        embedding: embedding,
      },
    })

    indexed++
    console.log(`[RAG] ${indexed}/${DOCUMENTS_MEDICAUX.length} — ${doc.titre}`)

    // Pause entre chaque document : ~1s → ~55 req/min, sous le plafond de 60
    await new Promise((resolve) => setTimeout(resolve, 1100))
  }

  console.log(`[RAG] ${indexed} documents indexés avec succès.`)
}
