import * as z from "zod";

export const paymentPlansSchema = z.object({
  PAYMENTS_PREMIUM_SUBSCRIPTION_PLAN_ID: z.string({
    error: "PAYMENTS_PREMIUM_SUBSCRIPTION_PLAN_ID is required",
  }),
  PAYMENTS_PREMIUM_ANNUEL_SUBSCRIPTION_PLAN_ID: z.string({
    error: "PAYMENTS_PREMIUM_ANNUEL_SUBSCRIPTION_PLAN_ID is required",
  }),
});
