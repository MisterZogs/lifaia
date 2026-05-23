import { HttpError } from 'wasp/server'
import {
  type AjouterEnfant,
  type ModifierEnfant,
  type SupprimerEnfant,
  type GetEnfants,
} from 'wasp/server/operations'
import * as z from 'zod'
import { ensureArgsSchemaOrThrowHttpError } from '../server/validation'

// Schéma d'ajout : seul le prénom est requis
const ajouterEnfantSchema = z.object({
  prenom: z.string().min(1).max(50),
})

// Schéma de modification : prénom requis + données biologiques optionnelles
const modifierEnfantSchema = z.object({
  id: z.string().uuid(),
  prenom: z.string().min(1).max(50),
  sexe: z.enum(['homme', 'femme', 'autre']).optional().nullable(),
  dateNaissance: z.string().optional().nullable(), // ISO 8601
  tailleCm: z.number().int().min(30).max(250).optional().nullable(),
  poidsKg: z.number().min(1).max(200).optional().nullable(),
  groupeSanguin: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional().nullable(),
  medecinRef: z.string().max(100).optional().nullable(),
})

type EnfantReponse = {
  id: string
  prenom: string
  sexe: string | null
  dateNaissance: Date | null
  tailleCm: number | null
  poidsKg: number | null
  groupeSanguin: string | null
  medecinRef: string | null
}

/**
 * Ajoute un profil enfant rattaché au compte de l'utilisateur connecté.
 * Seul le prénom est requis — les données biologiques sont renseignées dans le dossier médical.
 */
export const ajouterEnfant: AjouterEnfant<
  z.infer<typeof ajouterEnfantSchema>,
  EnfantReponse
> = async (rawArgs, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Vous devez être connecté.')
  }

  const { prenom } = ensureArgsSchemaOrThrowHttpError(ajouterEnfantSchema, rawArgs)

  const enfant = await context.entities.Enfant.create({
    data: {
      userId: context.user.id,
      prenom,
    },
  })

  return {
    id: enfant.id,
    prenom: enfant.prenom,
    sexe: enfant.sexe,
    dateNaissance: enfant.dateNaissance,
    tailleCm: enfant.tailleCm,
    poidsKg: enfant.poidsKg,
    groupeSanguin: enfant.groupeSanguin,
    medecinRef: enfant.medecinRef,
  }
}

/**
 * Met à jour les données d'un enfant — vérifie que l'enfant appartient à l'utilisateur connecté.
 */
export const modifierEnfant: ModifierEnfant<
  z.infer<typeof modifierEnfantSchema>,
  void
> = async (rawArgs, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Vous devez être connecté.')
  }

  const { id, prenom, sexe, dateNaissance, tailleCm, poidsKg, groupeSanguin, medecinRef } =
    ensureArgsSchemaOrThrowHttpError(modifierEnfantSchema, rawArgs)

  const enfantExistant = await context.entities.Enfant.findFirst({
    where: { id, userId: context.user.id },
  })
  if (!enfantExistant) {
    throw new HttpError(404, 'Enfant introuvable.')
  }

  await context.entities.Enfant.update({
    where: { id },
    data: {
      prenom,
      sexe: sexe ?? null,
      dateNaissance: dateNaissance ? new Date(dateNaissance) : null,
      tailleCm: tailleCm ?? null,
      poidsKg: poidsKg ?? null,
      groupeSanguin: groupeSanguin ?? null,
      medecinRef: medecinRef ?? null,
    },
  })
}

/**
 * Supprime un profil enfant — vérifie que l'enfant appartient à l'utilisateur connecté.
 */
export const supprimerEnfant: SupprimerEnfant<{ id: string }, void> = async (
  rawArgs,
  context
) => {
  if (!context.user) {
    throw new HttpError(401, 'Vous devez être connecté.')
  }

  const { id } = rawArgs

  const enfantExistant = await context.entities.Enfant.findFirst({
    where: { id, userId: context.user.id },
  })
  if (!enfantExistant) {
    throw new HttpError(404, 'Enfant introuvable.')
  }

  await context.entities.Enfant.delete({ where: { id } })
}

/**
 * Retourne tous les profils enfants de l'utilisateur connecté.
 */
export const getEnfants: GetEnfants<void, EnfantReponse[]> = async (
  _args,
  context
) => {
  if (!context.user) {
    throw new HttpError(401, 'Vous devez être connecté.')
  }

  const enfants = await context.entities.Enfant.findMany({
    where: { userId: context.user.id },
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      prenom: true,
      sexe: true,
      dateNaissance: true,
      tailleCm: true,
      poidsKg: true,
      groupeSanguin: true,
      medecinRef: true,
    },
  })

  return enfants
}
