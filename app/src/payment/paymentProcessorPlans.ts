import { env } from "wasp/server";
import { type PaymentPlan, PaymentPlanId } from "./plans";

/**
 * L'identifiant du plan côté processeur de paiement.
 * Pour Stripe : le price ID (ex: price_1ABC...).
 */
export const paymentProcessorPlanIds = {
  [PaymentPlanId.Premium]: env.PAYMENTS_PREMIUM_SUBSCRIPTION_PLAN_ID,
  [PaymentPlanId.PremiumAnnuel]: env.PAYMENTS_PREMIUM_ANNUEL_SUBSCRIPTION_PLAN_ID,
} as const satisfies Record<PaymentPlanId, string>;

export function getPaymentProcessorPlanId(paymentPlan: PaymentPlan): string {
  return paymentProcessorPlanIds[paymentPlan.id];
}

export function getPaymentPlanIdByPaymentProcessorPlanId(
  paymentProcessorPlanId: string,
): PaymentPlanId {
  for (const [planId, processorPlanId] of Object.entries(paymentProcessorPlanIds)) {
    if (processorPlanId === paymentProcessorPlanId) {
      return planId as PaymentPlanId;
    }
  }
  throw new Error(`Unknown payment processor plan ID: ${paymentProcessorPlanId}`);
}
