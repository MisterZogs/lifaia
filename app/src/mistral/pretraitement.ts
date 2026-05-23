import { getMistralClient, MODELES } from './client'
import { MOTS_CLES_URGENCE_RAPIDE } from './urgences'

type ResultatPretraitement = {
  estUrgence: boolean
  estMedical: boolean
}

/**
 * Pré-traitement en un seul appel LLM :
 * combine la détection d'urgence ET la classification d'intention.
 * Réduit la latence de 2 appels séquentiels (~3s chacun) à 1 seul appel (~2s).
 *
 * Retourne un objet avec estUrgence et estMedical.
 */
export async function pretraiterMessage(
  message: string
): Promise<ResultatPretraitement> {
  // Vérification instantanée par mots-clés (sans LLM) — urgences évidentes
  const messageLower = message.toLowerCase()
  const urgenceParMotsCles = MOTS_CLES_URGENCE_RAPIDE.some((mot) =>
    messageLower.includes(mot)
  )
  if (urgenceParMotsCles) {
    return { estUrgence: true, estMedical: true }
  }

  // Les messages très courts (≤ 10 caractères) sont des réponses conversationnelles
  // dans le contexte du chat médical — on les laisse passer sans appel LLM.
  // Ex : "oui", "non", "ok", "merci", "et ?", "pourquoi ?"
  if (message.trim().length <= 10) {
    return { estUrgence: false, estMedical: true }
  }

  try {
    const client = getMistralClient()
    const debut = Date.now()

    const reponse = await client.chat.complete({
      model: MODELES.LEGER,
      messages: [
        {
          role: 'system',
          content: `Tu es un système de triage pour une application de santé.
Analyse le message et réponds UNIQUEMENT avec un JSON valide sur une seule ligne, sans markdown :
{"urgence": boolean, "medical": boolean}

- urgence: true si le message décrit une urgence médicale vitale (infarctus, AVC, détresse respiratoire, pensées suicidaires, convulsions, hémorragie grave, etc.)
- medical: true si le message concerne la santé, la médecine, les symptômes, les médicaments, la nutrition, le bien-être, l'anatomie, la terminologie médicale, OU s'il s'agit d'une question sur le contexte de la conversation (pour quel patient l'IA répond, quel profil est actif, etc.). false SEULEMENT si le sujet est clairement sans rapport avec la santé (code informatique, météo, poèmes, etc.). En cas de doute, mettre true.`,
        },
        {
          role: 'user',
          content: message,
        },
      ],
      maxTokens: 30,
      temperature: 0,
    })

    const latence = Date.now() - debut
    console.log(`[PRETRAITEMENT] latence=${latence}ms`)

    const texte = (reponse.choices?.[0]?.message?.content ?? '').toString().trim()

    // Extraction du JSON de la réponse
    const match = texte.match(/\{[^}]+\}/)
    if (match) {
      const parsed = JSON.parse(match[0])
      return {
        estUrgence: parsed.urgence === true,
        estMedical: parsed.medical !== false, // défaut à true si incertain
      }
    }

    // En cas de parsing échoué, on laisse passer (fail-safe)
    return { estUrgence: false, estMedical: true }
  } catch (err) {
    console.error('[PRETRAITEMENT] Erreur:', err)
    // En cas d'erreur, on laisse passer sans bloquer
    return { estUrgence: false, estMedical: true }
  }
}
