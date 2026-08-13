import { PAST_DUE_GRACE_DAYS, type AccessState } from "@/lib/profile.functions";

/**
 * Dunning model for the `past_due` seven-day window.
 *
 * Timeline (Stripe smart retries): charge fails day 0, retried day 3 and
 * day 5, subscription canceled day 7. Access AND digests continue for the
 * whole window on purpose — the marginal cost of another week is one email,
 * and cutting someone off over an expired card turns an accident into churn.
 *
 * REPAIR vs CHECKOUT — never confuse the two:
 *   past_due  -> Stripe Billing Portal (or the hosted invoice URL for a 3DS
 *                confirmation). The subscription still exists; it needs a
 *                working payment method, not a new subscription.
 *   canceled  -> Checkout. The subscription is gone, so a new one is correct.
 * Creating a Checkout Session to repair `past_due` produces a second
 * subscription on the same customer and bills them twice.
 */

export const DUNNING_WINDOW_DAYS = PAST_DUE_GRACE_DAYS;
/** Day offset at which the copy switches from "outstanding" to a countdown. */
export const DUNNING_URGENT_DAY = 5;

/**
 * Why the charge is stuck. A declined card is repaired with a new payment
 * method (portal). A bank confirmation (3DS/SCA) can only be completed on the
 * hosted invoice page — adding a new card does not resolve the prompt.
 */
export type DunningReason = "card_declined" | "requires_confirmation";

export interface DunningInfo {
  reason: DunningReason;
  /** Last four of the card on file. Comes from Stripe once wired up. */
  cardLast4: string;
}

export interface DunningState {
  /** Whole days since the first failed charge (0-based). */
  day: number;
  daysLeft: number;
  /** Date the subscription is canceled if payment never lands. */
  cancelAt: Date;
  outstanding: string;
  reason: DunningReason;
  cardLast4: string;
  /** Where the repair happens — see the REPAIR vs CHECKOUT note above. */
  destination: "portal" | "invoice";
}

/** Mock payment-method details. Replaced by the Stripe customer's card. */
export const MOCK_DUNNING: DunningInfo = {
  reason: "card_declined",
  cardLast4: "4242",
};

const DEV_REASON_KEY = "nook.dev.dunningReason";

/**
 * Dev-only override so the bank-confirmation variant is reachable without a
 * real 3DS invoice. In production the reason comes from the Stripe invoice.
 */
export function getDunningReasonOverride(): DunningReason | null {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(DEV_REASON_KEY);
  return v === "requires_confirmation" || v === "card_declined" ? v : null;
}

export function setDunningReasonOverride(reason: DunningReason | null): void {
  if (typeof window === "undefined") return;
  if (reason) window.localStorage.setItem(DEV_REASON_KEY, reason);
  else window.localStorage.removeItem(DEV_REASON_KEY);
}

export function outstandingAmount(
  plan: "intro" | "pro",
  cycle: "monthly" | "annual",
): string {
  // Intro's first charge lands after the 3 free days, at the monthly price.
  if (plan === "pro" && cycle === "annual") return "$95.88";
  return "$14.99";
}

export function formatDunningDate(d: Date): string {
  try {
    return d.toLocaleDateString("en-US", { day: "numeric", month: "long" });
  } catch {
    return d.toISOString().slice(0, 10);
  }
}

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Returns null when the account is not in dunning. `pastDueSince` is the
 * server-side anchor; nothing here trusts a client clock for entitlement,
 * only for copy.
 */
export function dunningState(
  access: Pick<AccessState, "status" | "pastDueSince" | "plan" | "billingCycle"> | null | undefined,
  info: DunningInfo = MOCK_DUNNING,
): DunningState | null {
  if (!access || access.status !== "past_due" || !access.pastDueSince) return null;
  const since = new Date(access.pastDueSince).getTime();
  if (Number.isNaN(since)) return null;

  const day = Math.max(0, Math.floor((Date.now() - since) / DAY_MS));
  const cancelAt = new Date(since + DUNNING_WINDOW_DAYS * DAY_MS);
  const daysLeft = Math.max(0, Math.ceil((cancelAt.getTime() - Date.now()) / DAY_MS));
  const reason = getDunningReasonOverride() ?? info.reason;

  return {
    day,
    daysLeft,
    cancelAt,
    outstanding: outstandingAmount(access.plan, access.billingCycle),
    reason,
    cardLast4: info.cardLast4,
    destination: reason === "requires_confirmation" ? "invoice" : "portal",
  };
}

export interface DunningCopy {
  headline: string;
  ctaLabel: string;
}

export function dunningCopy(s: DunningState): DunningCopy {
  if (s.reason === "requires_confirmation") {
    return {
      headline: "Your bank needs to confirm this payment.",
      ctaLabel: "Confirm payment",
    };
  }
  if (s.day >= DUNNING_URGENT_DAY) {
    return {
      headline: `Your alerts stop in ${s.daysLeft} ${s.daysLeft === 1 ? "day" : "days"}. We still can't charge your card ending ${s.cardLast4}.`,
      ctaLabel: "Update payment method",
    };
  }
  return {
    headline: `We couldn't charge your card ending ${s.cardLast4}. ${s.outstanding} outstanding — your alerts stop on ${formatDunningDate(s.cancelAt)}.`,
    ctaLabel: "Update payment method",
  };
}

/**
 * Stand-in for `POST /billing_portal/sessions` (or reading the invoice's
 * hosted URL). Returns the URL to send the user to. The dev error toggle
 * exercises the banner's failure state.
 */
export async function createPaymentRepairSession(
  destination: "portal" | "invoice",
): Promise<string> {
  await new Promise((r) => setTimeout(r, 650));
  if (
    typeof window !== "undefined" &&
    window.localStorage.getItem("nook.dev.dunningSessionError") === "1"
  ) {
    throw new Error("Billing portal session could not be created");
  }
  return destination === "invoice" ? "/billing/mock-invoice" : "/billing/mock-portal";
}
