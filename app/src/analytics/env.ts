import * as z from "zod";

// Plausible est optionnel en développement (pas de cookie, RGPD-friendly)
export const plausibleEnvSchema = z.object({
  PLAUSIBLE_API_KEY: z.string().optional(),
  PLAUSIBLE_SITE_ID: z.string().optional(),
  PLAUSIBLE_BASE_URL: z.string().optional(),
});

// Google Analytics non recommandé pour données de santé (RGPD) — optionnel
export const googleAnalyticsEnvSchema = z.object({
  GOOGLE_ANALYTICS_CLIENT_EMAIL: z.string().optional(),
  GOOGLE_ANALYTICS_PRIVATE_KEY: z.string().optional(),
  GOOGLE_ANALYTICS_PROPERTY_ID: z.string().optional(),
});
