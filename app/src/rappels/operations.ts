import { HttpError } from 'wasp/server'
import type {
  AjouterRappel, ModifierRappel, SupprimerRappel, MarquerRappelFait,
  GetRappels,
} from 'wasp/server/operations'

// ─── Types ────────────────────────────────────────────────────────────────────

type TypeRappel = 'medicament' | 'vaccin' | 'checkup'
type FrequenceRappel = 'unique' | 'quotidien' | 'hebdomadaire' | 'mensuel' | 'annuel'

type RappelInput = {
  enfantId?: string | null
  type: TypeRappel
  titre: string
  dateProchaine: string // ISO 8601
  frequence: FrequenceRappel
  heure?: string | null  // "HH:MM", uniquement pour type='medicament'
  notes?: string | null
}

export type RappelData = {
  id: string
  type: string
  titre: string
  dateProchaine: Date
  frequence: string
  heure: string | null
  actif: boolean
  notes: string | null
  enfantId: string | null
}

// ─── Calcul de la prochaine date selon la fréquence ──────────────────────────

function prochaineDateApres(date: Date, frequence: FrequenceRappel): Date {
  const d = new Date(date)
  switch (frequence) {
    case 'quotidien':    d.setDate(d.getDate() + 1); break
    case 'hebdomadaire': d.setDate(d.getDate() + 7); break
    case 'mensuel':      d.setMonth(d.getMonth() + 1); break
    case 'annuel':       d.setFullYear(d.getFullYear() + 1); break
    default: break
  }
  return d
}

// ─── CRUD ─────────────────────────────────────────────────────────────────────

export const ajouterRappel: AjouterRappel<RappelInput, RappelData> = async (args, context) => {
  if (!context.user) throw new HttpError(401)
  if (!args.titre?.trim()) throw new HttpError(400, 'Le titre est requis.')

  const r = await context.entities.Rappel.create({
    data: {
      userId: context.user.id,
      enfantId: args.enfantId ?? null,
      type: args.type,
      titre: args.titre.trim(),
      dateProchaine: new Date(args.dateProchaine),
      frequence: args.frequence,
      heure: args.type === 'medicament' ? (args.heure ?? null) : null,
      notes: args.notes ?? null,
    },
  })
  return { id: r.id, type: r.type, titre: r.titre, dateProchaine: r.dateProchaine, frequence: r.frequence, heure: r.heure, actif: r.actif, notes: r.notes, enfantId: r.enfantId }
}

export const modifierRappel: ModifierRappel<RappelInput & { id: string }, void> = async (args, context) => {
  if (!context.user) throw new HttpError(401)
  const existant = await context.entities.Rappel.findFirst({ where: { id: args.id, userId: context.user.id } })
  if (!existant) throw new HttpError(404, 'Rappel introuvable.')

  await context.entities.Rappel.update({
    where: { id: args.id },
    data: {
      type: args.type,
      titre: args.titre.trim(),
      dateProchaine: new Date(args.dateProchaine),
      frequence: args.frequence,
      heure: args.type === 'medicament' ? (args.heure ?? null) : null,
      notes: args.notes ?? null,
      derniereNotifAt: null,
    },
  })
}

export const supprimerRappel: SupprimerRappel<{ id: string }, void> = async (args, context) => {
  if (!context.user) throw new HttpError(401)
  const existant = await context.entities.Rappel.findFirst({ where: { id: args.id, userId: context.user.id } })
  if (!existant) throw new HttpError(404, 'Rappel introuvable.')
  await context.entities.Rappel.delete({ where: { id: args.id } })
}

/**
 * Marque un rappel comme effectué.
 * - unique : désactive le rappel
 * - récurrent : avance la date à la prochaine occurrence
 */
export const marquerRappelFait: MarquerRappelFait<{ id: string }, void> = async (args, context) => {
  if (!context.user) throw new HttpError(401)
  const rappel = await context.entities.Rappel.findFirst({ where: { id: args.id, userId: context.user.id } })
  if (!rappel) throw new HttpError(404, 'Rappel introuvable.')

  if (rappel.frequence === 'unique') {
    await context.entities.Rappel.update({ where: { id: args.id }, data: { actif: false } })
  } else {
    const prochaine = prochaineDateApres(rappel.dateProchaine, rappel.frequence as FrequenceRappel)
    await context.entities.Rappel.update({
      where: { id: args.id },
      data: { dateProchaine: prochaine, derniereNotifAt: null },
    })
  }
}

// ─── Lecture ──────────────────────────────────────────────────────────────────

export const getRappels: GetRappels<
  { enfantId?: string | null },
  RappelData[]
> = async (args, context) => {
  if (!context.user) throw new HttpError(401)

  const enfantId = args?.enfantId ?? null
  const filtreEnfant = enfantId === null ? { enfantId: null } : { enfantId }

  return context.entities.Rappel.findMany({
    where: { userId: context.user.id, ...filtreEnfant },
    orderBy: { dateProchaine: 'asc' },
    select: { id: true, type: true, titre: true, dateProchaine: true, frequence: true, heure: true, actif: true, notes: true, enfantId: true },
  })
}
