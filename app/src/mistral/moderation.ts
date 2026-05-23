import { getMistralClient, MODELES } from './client'

/**
 * Classification d'intention : détermine si le message est dans le champ médical/santé.
 * Appelée avant le prompt principal pour bloquer les questions hors-sujet.
 *
 * Retourne true si la question est pertinente (santé, médecine, nutrition, bien-être,
 * sport/activité physique, médicaments, symptômes, etc.)
 * Retourne false si la question est clairement hors-champ (code, météo, poèmes, définitions, etc.)
 */
export async function estQuestionMedicale(message: string): Promise<boolean> {
  try {
    const client = getMistralClient()

    const reponse = await client.chat.complete({
      model: MODELES.LEGER,
      messages: [
        {
          role: 'system',
          content: `Tu es un classificateur de messages pour une application de santé.
Réponds UNIQUEMENT par "OUI" ou "NON".

Réponds OUI si le message concerne : symptômes, maladies, médicaments, santé, nutrition, alimentation, bien-être, sport et activité physique, médecine (toutes formes), vaccins, anatomie, pharmacologie, santé mentale, douleurs, pathologies, soins, hygiène de vie, terminologie médicale ou scientifique (définitions de termes médicaux, anatomiques, pharmacologiques), questions sur le corps humain, questions sur des traitements ou thérapies.

Réponds NON SEULEMENT si le message est clairement sans aucun lien avec la santé : programmation informatique, météo, événements historiques non médicaux, littérature générale, poèmes, recettes de cuisine ordinaires, jeux vidéo, films, musique, sport en tant que divertissement (résultats de matchs, etc.), mathématiques, géographie.

En cas de doute, réponds OUI.`,
        },
        {
          role: 'user',
          content: message,
        },
      ],
      maxTokens: 5,
      temperature: 0,
    })

    const texte = reponse.choices?.[0]?.message?.content ?? ''
    return texte.toString().trim().toUpperCase().startsWith('OUI')
  } catch (err) {
    // En cas d'erreur de classification, on laisse passer (ne pas bloquer l'utilisateur)
    console.error('[MODERATION] Erreur classification intention:', err)
    return true
  }
}
