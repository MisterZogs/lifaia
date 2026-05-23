import { getMistralClient, MODELES } from './client'

// Mots-clés d'urgence vitale détectés sans appel LLM (garde-fou instantané)
// Exportés pour réutilisation dans le module de pré-traitement
export const MOTS_CLES_URGENCE_RAPIDE = [
  'douleur thoracique', 'douleur poitrine', 'infarctus', 'crise cardiaque',
  'mal au coeur', 'oppression thoracique',
  'essoufflement aigu', 'je ne respire plus', 'je suffoque', 'detresse respiratoire',
  'avc', 'accident vasculaire', 'visage qui tombe', 'bras paralysé', 'parole difficile',
  'pensées suicidaires', 'envie de mourir', 'je veux mourir', 'me suicider',
  'mettre fin à ma vie', 'en finir',
  'perte de conscience', 'convulsions', 'hémorragie', 'sang qui coule',
  'brûlure grave', 'empoisonnement', 'overdose', 'surdosage',
  'réaction allergique grave', 'anaphylaxie',
]

// Alias local
const MOTS_CLES_URGENCE = MOTS_CLES_URGENCE_RAPIDE

// Numéros d'urgence par pays
export const URGENCES_PAR_PAYS: Record<string, { numero: string; label: string }[]> = {
  FR: [
    { numero: '15', label: 'SAMU' },
    { numero: '18', label: 'Pompiers' },
    { numero: '112', label: 'Numéro européen' },
    { numero: '3114', label: 'Numéro national prévention suicide' },
  ],
  BE: [
    { numero: '112', label: 'Urgences' },
    { numero: '0800 32 123', label: 'Centre de Prévention du Suicide' },
  ],
  CH: [
    { numero: '144', label: 'Ambulance' },
    { numero: '143', label: 'La Main Tendue (détresse psychologique)' },
  ],
  US: [
    { numero: '911', label: 'Emergency' },
    { numero: '988', label: 'Suicide & Crisis Lifeline' },
  ],
  GB: [
    { numero: '999', label: 'Emergency' },
    { numero: '116 123', label: 'Samaritans' },
  ],
  DEFAULT: [
    { numero: '112', label: 'Numéro européen' },
  ],
}

/**
 * Détection d'urgence vitale en deux étapes :
 * 1. Correspondance instantanée par mots-clés (sans LLM)
 * 2. Si pas détecté, classification rapide via Mistral Small
 *
 * Retourne true si une urgence est suspectée.
 * Priorité absolue : cette fonction est appelée AVANT tout autre traitement.
 */
export async function detecterUrgence(message: string): Promise<boolean> {
  const messageLower = message.toLowerCase()

  // Étape 1 : correspondance instantanée par mots-clés
  const urgenceParMotsCles = MOTS_CLES_URGENCE.some((mot) =>
    messageLower.includes(mot)
  )
  if (urgenceParMotsCles) return true

  // Étape 2 : classification LLM pour les cas ambigus
  try {
    const client = getMistralClient()
    const debut = Date.now()

    const reponse = await client.chat.complete({
      model: MODELES.LEGER,
      messages: [
        {
          role: 'system',
          content: `Tu es un système de triage médical d'urgence.
Réponds UNIQUEMENT par "OUI" ou "NON".
Est-ce que le message suivant décrit une urgence médicale vitale immédiate
(risque de mort, AVC, infarctus, détresse respiratoire, pensées suicidaires, convulsions, etc.) ?`,
        },
        {
          role: 'user',
          content: message,
        },
      ],
      maxTokens: 5,
      temperature: 0,
    })

    const latence = Date.now() - debut
    // Log sans PII pour monitoring
    console.log(`[URGENCE-CHECK] latence=${latence}ms modele=${MODELES.LEGER}`)

    const texte = reponse.choices?.[0]?.message?.content ?? ''
    return texte.toString().trim().toUpperCase().startsWith('OUI')
  } catch (err) {
    // En cas d'erreur LLM, on ne bloque pas — on laisse passer prudemment
    console.error('[URGENCE-CHECK] Erreur classification LLM:', err)
    return false
  }
}

/**
 * Génère le message d'urgence affiché à l'utilisateur.
 * Bypass complet du chat normal — priorité absolue.
 */
export function genererMessageUrgence(pays: string): string {
  const urgences = URGENCES_PAR_PAYS[pays] ?? URGENCES_PAR_PAYS['DEFAULT']
  const lignes = urgences
    .map((u) => `📞 **${u.numero}** — ${u.label}`)
    .join('\n')

  return `🚨 **URGENCE MÉDICALE DÉTECTÉE**

Votre message suggère une situation médicale grave nécessitant une aide immédiate.

**Appelez maintenant :**
${lignes}

---
*Contactez les secours immédiatement.*`
}
