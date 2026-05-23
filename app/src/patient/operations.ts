import { HttpError } from 'wasp/server'
import { type CompleterOnboarding, type UpdateProfilUtilisateur } from 'wasp/server/operations'
import * as z from 'zod'
import { ensureArgsSchemaOrThrowHttpError } from '../server/validation'

// Schéma de validation des données d'onboarding
const completerOnboardingSchema = z.object({
  pays: z
    .string()
    .length(2, 'Le code pays doit être au format ISO 3166-1 alpha-2 (ex: FR, US)')
    .toUpperCase(),
  langue: z
    .string()
    .min(2, 'Le code langue doit être au format BCP 47 (ex: fr-FR, en-US)')
    .max(10),
  cgAcceptee: z.literal(true, {
    message: 'Vous devez accepter les CGU pour continuer.',
  }),
  disclaimerMedicalAccepte: z.literal(true, {
    message: "Vous devez accepter l'avertissement médical pour continuer.",
  }),
  // Informations biologiques — optionnelles à l'onboarding
  sexe: z.enum(['homme', 'femme', 'autre']).optional(),
  dateNaissance: z.string().optional(), // ISO 8601, ex: "1990-04-15"
  tailleCm: z.number().int().min(50).max(250).optional(),
  poidsKg: z.number().min(2).max(500).optional(),
})

type CompleterOnboardingInput = z.infer<typeof completerOnboardingSchema>

/**
 * Persiste les informations d'onboarding du patient.
 * Appelée une seule fois lors du premier accès après inscription.
 * Marque l'onboarding comme terminé une fois les CGU et le disclaimer médical acceptés.
 */
export const completerOnboarding: CompleterOnboarding<
  CompleterOnboardingInput,
  void
> = async (rawArgs, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Vous devez être connecté pour effectuer cette action.')
  }

  const { pays, langue, cgAcceptee, disclaimerMedicalAccepte, sexe, dateNaissance, tailleCm, poidsKg } =
    ensureArgsSchemaOrThrowHttpError(completerOnboardingSchema, rawArgs)

  if (!cgAcceptee || !disclaimerMedicalAccepte) {
    throw new HttpError(
      400,
      "L'acceptation des CGU et du disclaimer médical est obligatoire."
    )
  }

  await context.entities.User.update({
    where: { id: context.user.id },
    data: {
      pays,
      langue,
      cgAccepteeAt: new Date(),
      disclaimerMedicalAccepteAt: new Date(),
      onboardingTermine: true,
      sexe: sexe ?? null,
      dateNaissance: dateNaissance ? new Date(dateNaissance) : null,
      tailleCm: tailleCm ?? null,
      poidsKg: poidsKg ?? null,
    },
  })
}

// Schéma de mise à jour du profil biologique
const updateProfilSchema = z.object({
  sexe: z.enum(['homme', 'femme', 'autre']).optional(),
  dateNaissance: z.string().optional(),
  tailleCm: z.number().int().min(50).max(250).optional().nullable(),
  poidsKg: z.number().min(2).max(500).optional().nullable(),
  groupeSanguin: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional().nullable(),
  medecinTraitant: z.string().max(100).optional().nullable(),
})

type UpdateProfilInput = z.infer<typeof updateProfilSchema>

/**
 * Met à jour le profil biologique de l'utilisateur connecté.
 * Accessible depuis la page Mon Compte.
 */
export const updateProfilUtilisateur: UpdateProfilUtilisateur<
  UpdateProfilInput,
  void
> = async (rawArgs, context) => {
  if (!context.user) {
    throw new HttpError(401, 'Vous devez être connecté.')
  }

  const { sexe, dateNaissance, tailleCm, poidsKg, groupeSanguin, medecinTraitant } =
    ensureArgsSchemaOrThrowHttpError(updateProfilSchema, rawArgs)

  await context.entities.User.update({
    where: { id: context.user.id },
    data: {
      ...(sexe !== undefined && { sexe }),
      ...(dateNaissance !== undefined && {
        dateNaissance: dateNaissance ? new Date(dateNaissance) : null,
      }),
      ...(tailleCm !== undefined && { tailleCm }),
      ...(poidsKg !== undefined && { poidsKg }),
      ...(groupeSanguin !== undefined && { groupeSanguin }),
      ...(medecinTraitant !== undefined && { medecinTraitant }),
    },
  })
}
