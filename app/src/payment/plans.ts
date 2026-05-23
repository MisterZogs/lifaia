export enum SubscriptionStatus {
  PastDue = "past_due",
  CancelAtPeriodEnd = "cancel_at_period_end",
  Active = "active",
  Deleted = "deleted",
}

export enum PaymentPlanId {
  Premium = "premium",
  PremiumAnnuel = "premium_annuel",
}

export interface PaymentPlan {
  id: PaymentPlanId;
  effect: PaymentPlanEffect;
}

export type PaymentPlanEffect =
  | { kind: "subscription" }
  | { kind: "credits"; amount: number };

export const paymentPlans = {
  [PaymentPlanId.Premium]: {
    id: PaymentPlanId.Premium,
    effect: { kind: "subscription" },
  },
  [PaymentPlanId.PremiumAnnuel]: {
    id: PaymentPlanId.PremiumAnnuel,
    effect: { kind: "subscription" },
  },
} as const satisfies Record<PaymentPlanId, PaymentPlan>;

export function prettyPaymentPlanName(planId: PaymentPlanId): string {
  const planToName: Record<PaymentPlanId, string> = {
    [PaymentPlanId.Premium]: "Premium mensuel",
    [PaymentPlanId.PremiumAnnuel]: "Premium annuel",
  };
  return planToName[planId];
}

export function parsePaymentPlanId(planId: string): PaymentPlanId {
  if ((Object.values(PaymentPlanId) as string[]).includes(planId)) {
    return planId as PaymentPlanId;
  } else {
    throw new Error(`Invalid PaymentPlanId: ${planId}`);
  }
}

export function getSubscriptionPaymentPlanIds(): PaymentPlanId[] {
  return Object.values(PaymentPlanId).filter(
    (planId) => paymentPlans[planId].effect.kind === "subscription",
  );
}
