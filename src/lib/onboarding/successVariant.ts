import type { AccessState } from "@/lib/profile.functions";

export type SuccessVariant = "A" | "B" | "C" | "D" | "E";

export interface SuccessConfig {
  variant: SuccessVariant;
  heading: string;
  sub: string;
  /** Show the chosen-plan card. */
  showPlan: boolean;
  /** Allow jumping back to pricing. */
  allowChangePlan: boolean;
  /** Show the onboarding answers summary (with Edit). */
  showSummary: boolean;
  /** Show existing searches + freshness counts (reactivation). */
  showExistingSearches: boolean;
  /** Show the create-credentials block. */
  showAuth: boolean;
  /** Lock the email field to the address already on file. */
  lockEmail: boolean;
  ctaLabel: string;
  /** Where the CTA goes once the writes have committed. */
  ctaTarget: "/checkout/mock" | "/home";
  /** Whether the CTA must commit the onboarding writes first. */
  commitOnCta: boolean;
}

/**
 * Variant is a pure function of the three access flags. `access === null` means
 * anonymous — the fresh quiz-taker, i.e. variant A without credentials.
 */
export function pickSuccessVariant(access: AccessState | null): SuccessVariant {
  if (!access) return "A";
  const paid = access.accessAllowed;
  if (paid && !access.credentials) return "B";
  if (paid && access.credentials && !access.onboarded) return "D";
  if (!paid && access.credentials && access.onboarded) {
    // E is C with a different opening: they did not choose to leave, the card
    // did. "We couldn't take payment" converts better than a re-sell, so it
    // must not share copy with the churn pitch.
    if (access.status === "canceled" && access.pastDueSince) return "E";
    return "C";
  }
  return "A";
}

export function successConfig(variant: SuccessVariant, access: AccessState | null): SuccessConfig {
  const hasCredentials = !!access?.credentials;
  const planLabel = access?.plan === "pro" ? "Pro" : "Intro";

  switch (variant) {
    case "B":
      return {
        variant,
        heading: "Last step — pick a password.",
        sub: `You're on ${planLabel}. No further charge. Set a password so you can get back in later.`,
        showPlan: true,
        allowChangePlan: false,
        showSummary: true,
        showExistingSearches: false,
        showAuth: true,
        lockEmail: true,
        ctaLabel: "Start my apartment search",
        ctaTarget: "/home",
        commitOnCta: true,
      };
    case "E": {
      const last4 = "4242";
      return {
        variant,
        heading: "Your alerts are off.",
        sub: `We tried your card ending ${last4} a few times over the past week and couldn't take payment, so we've switched your alerts off. Nothing's lost — your searches are exactly where you left them.`,
        showPlan: true,
        allowChangePlan: true,
        showSummary: false,
        showExistingSearches: true,
        showAuth: false,
        lockEmail: false,
        // The subscription is gone by now, so Checkout is correct here —
        // unlike the past_due window, which is repaired in the portal.
        ctaLabel: "Restart my alerts",
        ctaTarget: "/checkout/mock",
        commitOnCta: false,
      };
    }
    case "C":
      return {
        variant,
        heading: "Turn your alerts back on.",
        sub: "Your searches are still here. Restart your plan and we'll start sending matches again.",
        showPlan: true,
        allowChangePlan: true,
        showSummary: false,
        showExistingSearches: true,
        showAuth: false,
        lockEmail: false,
        ctaLabel: "Turn my alerts back on",
        ctaTarget: "/checkout/mock",
        commitOnCta: false,
      };
    case "D":
      return {
        variant,
        heading: "You're all set.",
        sub: "Your plan is active. Let's finish setting up the search we'll watch for you.",
        showPlan: true,
        allowChangePlan: false,
        showSummary: true,
        showExistingSearches: false,
        showAuth: false,
        lockEmail: false,
        ctaLabel: "Start my apartment search",
        ctaTarget: "/home",
        commitOnCta: true,
      };
    case "A":
    default:
      return {
        variant: "A",
        heading: hasCredentials
          ? "One step left — start your plan."
          : "Create your account to go live.",
        sub: "Here's what we'll watch for you. You can change any of it later in your preferences.",
        showPlan: true,
        allowChangePlan: true,
        showSummary: true,
        showExistingSearches: false,
        showAuth: !hasCredentials,
        lockEmail: false,
        ctaLabel: "Pay and start watching",
        ctaTarget: "/checkout/mock",
        commitOnCta: true,
      };
  }
}
