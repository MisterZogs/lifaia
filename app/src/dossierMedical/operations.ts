import { HttpError } from 'wasp/server'
import type {
  AjouterAllergie, ModifierAllergie, SupprimerAllergie,
  AjouterTraitement, ModifierTraitement, SupprimerTraitement,
  AjouterAntecedent, ModifierAntecedent, SupprimerAntecedent,
  AjouterAntecedentFamilial, ModifierAntecedentFamilial, SupprimerAntecedentFamilial,
  AjouterVaccination, ModifierVaccination, SupprimerVaccination,
  GetDossierMedical,
} from 'wasp/server/operations'

// ─── Types partagés ───────────────────────────────────────────────────────────

type ContextePatient = { enfantId?: string | null }

// Vérifie qu'un enregistrement appartient à l'utilisateur connecté
async function verifierAppartenance(
  findFn: (args: { where: { id: string; userId: string } }) => Promise<unknown>,
  id: string,
  userId: string
): Promise<void> {
  const enreg = await findFn({ where: { id, userId } })
  if (!enreg) throw new HttpError(404, 'Enregistrement introuvable.')
}

// ─── Allergies ────────────────────────────────────────────────────────────────

type AllergieInput = ContextePatient & {
  nom: string
  type: string
  severite: string
  notes?: string | null
}

type AllergieReponse = {
  id: string; nom: string; type: string; severite: string; notes: string | null; enfantId: string | null
}

export const ajouterAllergie: AjouterAllergie<AllergieInput, AllergieReponse> = async (args, context) => {
  if (!context.user) throw new HttpError(401)
  const { enfantId, nom, type, severite, notes } = args
  if (!nom?.trim()) throw new HttpError(400, 'Le nom est requis.')

  const a = await context.entities.Allergie.create({
    data: { userId: context.user.id, enfantId: enfantId ?? null, nom: nom.trim(), type, severite, notes: notes ?? null },
  })
  return { id: a.id, nom: a.nom, type: a.type, severite: a.severite, notes: a.notes, enfantId: a.enfantId }
}

export const modifierAllergie: ModifierAllergie<AllergieInput & { id: string }, void> = async (args, context) => {
  if (!context.user) throw new HttpError(401)
  await verifierAppartenance(context.entities.Allergie.findFirst as any, args.id, context.user.id)
  await context.entities.Allergie.update({
    where: { id: args.id },
    data: { nom: args.nom.trim(), type: args.type, severite: args.severite, notes: args.notes ?? null },
  })
}

export const supprimerAllergie: SupprimerAllergie<{ id: string }, void> = async (args, context) => {
  if (!context.user) throw new HttpError(401)
  await verifierAppartenance(context.entities.Allergie.findFirst as any, args.id, context.user.id)
  await context.entities.Allergie.delete({ where: { id: args.id } })
}

// ─── Traitements ─────────────────────────────────────────────────────────────

type TraitementInput = ContextePatient & {
  nom: string
  dose?: string | null
  frequence?: string | null
  depuis?: string | null
  notes?: string | null
}

type TraitementReponse = {
  id: string; nom: string; dose: string | null; frequence: string | null
  depuis: Date | null; notes: string | null; enfantId: string | null
}

export const ajouterTraitement: AjouterTraitement<TraitementInput, TraitementReponse> = async (args, context) => {
  if (!context.user) throw new HttpError(401)
  if (!args.nom?.trim()) throw new HttpError(400, 'Le nom est requis.')

  const t = await context.entities.Traitement.create({
    data: {
      userId: context.user.id,
      enfantId: args.enfantId ?? null,
      nom: args.nom.trim(),
      dose: args.dose ?? null,
      frequence: args.frequence ?? null,
      depuis: args.depuis ? new Date(args.depuis) : null,
      notes: args.notes ?? null,
    },
  })
  return { id: t.id, nom: t.nom, dose: t.dose, frequence: t.frequence, depuis: t.depuis, notes: t.notes, enfantId: t.enfantId }
}

export const modifierTraitement: ModifierTraitement<TraitementInput & { id: string }, void> = async (args, context) => {
  if (!context.user) throw new HttpError(401)
  await verifierAppartenance(context.entities.Traitement.findFirst as any, args.id, context.user.id)
  await context.entities.Traitement.update({
    where: { id: args.id },
    data: {
      nom: args.nom.trim(),
      dose: args.dose ?? null,
      frequence: args.frequence ?? null,
      depuis: args.depuis ? new Date(args.depuis) : null,
      notes: args.notes ?? null,
    },
  })
}

export const supprimerTraitement: SupprimerTraitement<{ id: string }, void> = async (args, context) => {
  if (!context.user) throw new HttpError(401)
  await verifierAppartenance(context.entities.Traitement.findFirst as any, args.id, context.user.id)
  await context.entities.Traitement.delete({ where: { id: args.id } })
}

// ─── Antécédents médicaux personnels ─────────────────────────────────────────

type AntecedentInput = ContextePatient & {
  categorie: string
  description: string
  annee?: number | null
  notes?: string | null
}

type AntecedentReponse = {
  id: string; categorie: string; description: string; annee: number | null; notes: string | null; enfantId: string | null
}

export const ajouterAntecedent: AjouterAntecedent<AntecedentInput, AntecedentReponse> = async (args, context) => {
  if (!context.user) throw new HttpError(401)
  if (!args.description?.trim()) throw new HttpError(400, 'La description est requise.')

  const a = await context.entities.AntecedentMedical.create({
    data: {
      userId: context.user.id,
      enfantId: args.enfantId ?? null,
      categorie: args.categorie,
      description: args.description.trim(),
      annee: args.annee ?? null,
      notes: args.notes ?? null,
    },
  })
  return { id: a.id, categorie: a.categorie, description: a.description, annee: a.annee, notes: a.notes, enfantId: a.enfantId }
}

export const modifierAntecedent: ModifierAntecedent<AntecedentInput & { id: string }, void> = async (args, context) => {
  if (!context.user) throw new HttpError(401)
  await verifierAppartenance(context.entities.AntecedentMedical.findFirst as any, args.id, context.user.id)
  await context.entities.AntecedentMedical.update({
    where: { id: args.id },
    data: {
      categorie: args.categorie,
      description: args.description.trim(),
      annee: args.annee ?? null,
      notes: args.notes ?? null,
    },
  })
}

export const supprimerAntecedent: SupprimerAntecedent<{ id: string }, void> = async (args, context) => {
  if (!context.user) throw new HttpError(401)
  await verifierAppartenance(context.entities.AntecedentMedical.findFirst as any, args.id, context.user.id)
  await context.entities.AntecedentMedical.delete({ where: { id: args.id } })
}

// ─── Antécédents familiaux ────────────────────────────────────────────────────

type AntecedentFamilialInput = {
  relation: string
  maladie: string
  notes?: string | null
}

type AntecedentFamilialReponse = {
  id: string; relation: string; maladie: string; notes: string | null
}

export const ajouterAntecedentFamilial: AjouterAntecedentFamilial<AntecedentFamilialInput, AntecedentFamilialReponse> = async (args, context) => {
  if (!context.user) throw new HttpError(401)
  if (!args.maladie?.trim()) throw new HttpError(400, 'La maladie est requise.')

  const a = await context.entities.AntecedentFamilial.create({
    data: { userId: context.user.id, relation: args.relation, maladie: args.maladie.trim(), notes: args.notes ?? null },
  })
  return { id: a.id, relation: a.relation, maladie: a.maladie, notes: a.notes }
}

export const modifierAntecedentFamilial: ModifierAntecedentFamilial<AntecedentFamilialInput & { id: string }, void> = async (args, context) => {
  if (!context.user) throw new HttpError(401)
  await verifierAppartenance(context.entities.AntecedentFamilial.findFirst as any, args.id, context.user.id)
  await context.entities.AntecedentFamilial.update({
    where: { id: args.id },
    data: { relation: args.relation, maladie: args.maladie.trim(), notes: args.notes ?? null },
  })
}

export const supprimerAntecedentFamilial: SupprimerAntecedentFamilial<{ id: string }, void> = async (args, context) => {
  if (!context.user) throw new HttpError(401)
  await verifierAppartenance(context.entities.AntecedentFamilial.findFirst as any, args.id, context.user.id)
  await context.entities.AntecedentFamilial.delete({ where: { id: args.id } })
}

// ─── Vaccinations ─────────────────────────────────────────────────────────────

type VaccinationInput = ContextePatient & {
  vaccin: string
  dateDernierDose: string
  prochainRappel?: string | null
  notes?: string | null
}

type VaccinationReponse = {
  id: string; vaccin: string; dateDernierDose: Date; prochainRappel: Date | null; notes: string | null; enfantId: string | null
}

export const ajouterVaccination: AjouterVaccination<VaccinationInput, VaccinationReponse> = async (args, context) => {
  if (!context.user) throw new HttpError(401)
  if (!args.vaccin?.trim()) throw new HttpError(400, 'Le nom du vaccin est requis.')

  const v = await context.entities.Vaccination.create({
    data: {
      userId: context.user.id,
      enfantId: args.enfantId ?? null,
      vaccin: args.vaccin.trim(),
      dateDernierDose: new Date(args.dateDernierDose),
      prochainRappel: args.prochainRappel ? new Date(args.prochainRappel) : null,
      notes: args.notes ?? null,
    },
  })
  return { id: v.id, vaccin: v.vaccin, dateDernierDose: v.dateDernierDose, prochainRappel: v.prochainRappel, notes: v.notes, enfantId: v.enfantId }
}

export const modifierVaccination: ModifierVaccination<VaccinationInput & { id: string }, void> = async (args, context) => {
  if (!context.user) throw new HttpError(401)
  await verifierAppartenance(context.entities.Vaccination.findFirst as any, args.id, context.user.id)
  await context.entities.Vaccination.update({
    where: { id: args.id },
    data: {
      vaccin: args.vaccin.trim(),
      dateDernierDose: new Date(args.dateDernierDose),
      prochainRappel: args.prochainRappel ? new Date(args.prochainRappel) : null,
      notes: args.notes ?? null,
    },
  })
}

export const supprimerVaccination: SupprimerVaccination<{ id: string }, void> = async (args, context) => {
  if (!context.user) throw new HttpError(401)
  await verifierAppartenance(context.entities.Vaccination.findFirst as any, args.id, context.user.id)
  await context.entities.Vaccination.delete({ where: { id: args.id } })
}

// ─── Lecture complète du dossier ─────────────────────────────────────────────

export type DossierMedicalData = {
  allergies: { id: string; nom: string; type: string; severite: string; notes: string | null; enfantId: string | null }[]
  traitements: { id: string; nom: string; dose: string | null; frequence: string | null; depuis: Date | null; notes: string | null; enfantId: string | null }[]
  antecedents: { id: string; categorie: string; description: string; annee: number | null; notes: string | null; enfantId: string | null }[]
  antecedentsFamiliaux: { id: string; relation: string; maladie: string; notes: string | null }[]
  vaccinations: { id: string; vaccin: string; dateDernierDose: Date; prochainRappel: Date | null; notes: string | null; enfantId: string | null }[]
}

/**
 * Retourne le dossier médical complet de l'utilisateur connecté.
 * Utilisé à la fois pour l'UI et pour enrichir le system prompt.
 * enfantId = null → données de l'utilisateur, string → données d'un enfant spécifique
 */
export const getDossierMedical: GetDossierMedical<
  { enfantId?: string | null },
  DossierMedicalData
> = async (args, context) => {
  if (!context.user) throw new HttpError(401)

  const userId = context.user.id
  const enfantId = args?.enfantId ?? null
  const filtreEnfant = enfantId === null ? { enfantId: null } : { enfantId }

  const [allergies, traitements, antecedents, antecedentsFamiliaux, vaccinations] = await Promise.all([
    context.entities.Allergie.findMany({
      where: { userId, ...filtreEnfant },
      orderBy: { createdAt: 'asc' },
      select: { id: true, nom: true, type: true, severite: true, notes: true, enfantId: true },
    }),
    context.entities.Traitement.findMany({
      where: { userId, ...filtreEnfant },
      orderBy: { createdAt: 'asc' },
      select: { id: true, nom: true, dose: true, frequence: true, depuis: true, notes: true, enfantId: true },
    }),
    context.entities.AntecedentMedical.findMany({
      where: { userId, ...filtreEnfant },
      orderBy: { createdAt: 'asc' },
      select: { id: true, categorie: true, description: true, annee: true, notes: true, enfantId: true },
    }),
    // Antécédents familiaux : toujours liés à l'utilisateur, pas aux enfants
    enfantId === null
      ? context.entities.AntecedentFamilial.findMany({
          where: { userId },
          orderBy: { createdAt: 'asc' },
          select: { id: true, relation: true, maladie: true, notes: true },
        })
      : Promise.resolve([]),
    context.entities.Vaccination.findMany({
      where: { userId, ...filtreEnfant },
      orderBy: { dateDernierDose: 'desc' },
      select: { id: true, vaccin: true, dateDernierDose: true, prochainRappel: true, notes: true, enfantId: true },
    }),
  ])

  return { allergies, traitements, antecedents, antecedentsFamiliaux, vaccinations }
}
