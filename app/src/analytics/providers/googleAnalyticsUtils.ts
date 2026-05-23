// Google Analytics non utilisé dans Lifaia.
// Plausible (sans cookie, RGPD-friendly) est l'outil d'analytique prévu.
// Ces fonctions sont des stubs pour éviter les erreurs de compilation.

export async function getSources(): Promise<never[]> {
  return []
}

export async function getDailyPageViews(): Promise<{ totalViews: number; prevDayViewsChangePercent: string }> {
  return { totalViews: 0, prevDayViewsChangePercent: '0' }
}
