import { defineEnvValidationSchema } from 'wasp/env'

import { authEnvSchema } from './auth/env'
import { stripeEnvSchema } from './payment/stripe/env'
import { lemonSqueezyEnvSchema } from './payment/lemonSqueezy/env'
import { polarEnvSchema } from './payment/polar/env'
import { plausibleEnvSchema, googleAnalyticsEnvSchema } from './analytics/env'
import { mistralEnvSchema } from './mistral/env'

// Validation des variables d'environnement au démarrage du serveur.
// Wasp fusionne ce schéma avec ses propres validations internes.
// Pour accéder aux variables validées : `import { env } from 'wasp/server'`
// doc : https://wasp.sh/docs/project/env-vars#custom-env-var-validations
export const serverEnvValidationSchema = defineEnvValidationSchema(
  authEnvSchema
    .merge(stripeEnvSchema)
    .merge(lemonSqueezyEnvSchema)
    .merge(polarEnvSchema)
    .merge(plausibleEnvSchema)
    .merge(googleAnalyticsEnvSchema)
    .merge(mistralEnvSchema)
)
