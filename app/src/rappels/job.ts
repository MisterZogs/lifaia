import { emailSender } from 'wasp/server/email'
import { prisma } from 'wasp/server'
import webpush from 'web-push'

// Initialisation VAPID (requiert VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_EMAIL dans l'env)
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    `mailto:${process.env.VAPID_EMAIL || 'noreply@lifaia.com'}`,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  )
}

/**
 * Job horaire — s'exécute toutes les heures.
 *
 * Deux comportements selon l'heure :
 * - À 8h : envoi de l'email récapitulatif (rappels sans heure + rappels du jour/J+2)
 * - Toutes les heures : push instantané pour les rappels dont l'heure correspond à l'heure courante
 */
export async function envoyerNotificationsRappels(): Promise<void> {
  const maintenant = new Date()
  const heureActuelle = maintenant.getHours()
  const heureStr = String(heureActuelle).padStart(2, '0') // ex: "16"

  const debutAujourdhui = new Date(maintenant)
  debutAujourdhui.setHours(0, 0, 0, 0)

  const finAujourdhui = new Date(maintenant)
  finAujourdhui.setHours(23, 59, 59, 999)

  // ── 1. Push instantané — rappels dont l'heure correspond à l'heure courante ──
  const rappelsPush = await prisma.rappel.findMany({
    where: {
      actif: true,
      // Rappel prévu aujourd'hui
      dateProchaine: { gte: debutAujourdhui, lte: finAujourdhui },
      // L'heure du rappel commence par l'heure courante (ex: "16:00", "16:30")
      heure: { startsWith: heureStr },
      // Pas encore notifié dans cette heure
      OR: [
        { derniereNotifAt: null },
        { derniereNotifAt: { lt: new Date(maintenant.getTime() - 55 * 60 * 1000) } },
      ],
    },
    include: {
      user: { select: { email: true } },
      enfant: { select: { prenom: true } },
    },
  })

  if (rappelsPush.length > 0 && process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
    const parUtilisateurPush = new Map<string, typeof rappelsPush>()
    for (const r of rappelsPush) {
      if (!parUtilisateurPush.has(r.userId)) parUtilisateurPush.set(r.userId, [])
      parUtilisateurPush.get(r.userId)!.push(r)
    }

    for (const [userId, rappelsUser] of parUtilisateurPush) {
      const subscriptions = await prisma.pushSubscription.findMany({ where: { userId } })
      if (subscriptions.length === 0) continue

      for (const r of rappelsUser) {
        const patient = r.enfant ? ` (pour ${r.enfant.prenom})` : ''
        const icone = r.type === 'medicament' ? '💊' : r.type === 'vaccin' ? '💉' : '🩺'
        const payload = JSON.stringify({
          title: `${icone} Rappel Lifaia`,
          body: `${r.titre}${patient} — ${r.heure}`,
          url: '/rappels',
        })

        for (const sub of subscriptions) {
          await webpush.sendNotification(
            { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
            payload
          ).catch((err: any) => {
            if (err.statusCode === 410) {
              prisma.pushSubscription.delete({ where: { endpoint: sub.endpoint } }).catch(() => {})
            }
          })
        }
      }

      // Marquer comme notifiés
      await prisma.rappel.updateMany({
        where: { id: { in: rappelsUser.map((r) => r.id) } },
        data: { derniereNotifAt: maintenant },
      })

      console.log(`[RAPPELS PUSH] ${rappelsUser.length} push envoyé(s) à userId=${userId} (${heureStr}h)`)
    }
  }

  // ── 2. Email récapitulatif — seulement à 8h ───────────────────────────────
  if (heureActuelle !== 8) return

  const dansDeuxJours = new Date(maintenant)
  dansDeuxJours.setDate(dansDeuxJours.getDate() + 2)
  dansDeuxJours.setHours(23, 59, 59, 999)

  const rappelsEmail = await prisma.rappel.findMany({
    where: {
      actif: true,
      dateProchaine: { lte: dansDeuxJours },
      OR: [
        { derniereNotifAt: null },
        { derniereNotifAt: { lt: debutAujourdhui } },
      ],
    },
    include: {
      user: { select: { email: true } },
      enfant: { select: { prenom: true } },
    },
  })

  if (rappelsEmail.length === 0) {
    console.log('[RAPPELS EMAIL] Aucun rappel à notifier ce matin.')
    return
  }

  const parUtilisateur = new Map<string, typeof rappelsEmail>()
  for (const r of rappelsEmail) {
    if (!parUtilisateur.has(r.userId)) parUtilisateur.set(r.userId, [])
    parUtilisateur.get(r.userId)!.push(r)
  }

  let nbEnvoyes = 0

  for (const [, rappelsUser] of parUtilisateur) {
    const email = rappelsUser[0].user.email
    if (!email) continue

    const enRetard = rappelsUser.filter((r) => r.dateProchaine < debutAujourdhui)
    const aujourdhui = rappelsUser.filter((r) => r.dateProchaine >= debutAujourdhui && r.dateProchaine <= finAujourdhui)
    const aVenir = rappelsUser.filter((r) => r.dateProchaine > finAujourdhui)

    const lignesHTML = (titre: string, items: typeof rappelsEmail) => items.length > 0
      ? `<h3 style="margin:16px 0 8px;color:#374151">${titre}</h3><ul style="margin:0;padding-left:20px">${items.map((r) => {
          const patient = r.enfant ? ` <em>(pour ${r.enfant.prenom})</em>` : ''
          const date = new Date(r.dateProchaine).toLocaleDateString('fr-FR')
          const heure = r.heure ? ` à ${r.heure}` : ''
          const icone = r.type === 'medicament' ? '💊' : r.type === 'vaccin' ? '💉' : '🩺'
          return `<li>${icone} <strong>${r.titre}</strong>${patient} — ${date}${heure}</li>`
        }).join('')}</ul>`
      : ''

    const html = `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px">
        <h2 style="color:#1d4ed8;margin-bottom:4px">Lifaia — Vos rappels médicaux</h2>
        <p style="color:#6b7280;margin-top:0">Récapitulatif de vos rappels à venir.</p>
        ${lignesHTML('🔴 En retard', enRetard)}
        ${lignesHTML('🟠 Aujourd\'hui', aujourdhui)}
        ${lignesHTML('🔵 Dans les 2 prochains jours', aVenir)}
        <hr style="margin:24px 0;border:none;border-top:1px solid #e5e7eb"/>
        <p style="color:#6b7280;font-size:14px">
          <a href="https://lifaia.com/rappels" style="color:#1d4ed8">Gérer mes rappels sur Lifaia</a>
        </p>
      </div>
    `

    const texte = rappelsUser.map((r) => {
      const patient = r.enfant ? ` (pour ${r.enfant.prenom})` : ''
      return `• ${r.titre}${patient} — ${new Date(r.dateProchaine).toLocaleDateString('fr-FR')}`
    }).join('\n')

    await emailSender.send({
      to: email,
      subject: `Lifaia — ${rappelsUser.length} rappel(s) médical(aux) à venir`,
      text: `Vos rappels médicaux :\n\n${texte}\n\nConnectez-vous sur https://lifaia.com/rappels pour les gérer.`,
      html,
    })

    // Marquer comme notifiés (seulement les rappels non encore notifiés aujourd'hui)
    await prisma.rappel.updateMany({
      where: {
        id: { in: rappelsUser.map((r) => r.id) },
        OR: [{ derniereNotifAt: null }, { derniereNotifAt: { lt: debutAujourdhui } }],
      },
      data: { derniereNotifAt: maintenant },
    })

    nbEnvoyes += rappelsUser.length
  }

  console.log(`[RAPPELS EMAIL] ${nbEnvoyes} rappel(s) notifié(s) par email à ${parUtilisateur.size} utilisateur(s).`)
}
