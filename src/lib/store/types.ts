import type { CityId } from "@/data/cities";
import type {
  BillingCycle,
  Frequency,
  MoveOutInfo,
  OnboardingState,
  Plan,
  RentProtection,
  TriState,
} from "@/lib/onboarding/store";

export type SearchStatus = "active" | "paused" | "archived";

/** Per-search snapshot. Mirrors the filter fields of OnboardingState. */
export interface Search {
  id: string;
  name: string;
  cityId: CityId;

  createdAt: string; // ISO
  updatedAt: string; // ISO
  status: SearchStatus; // active | paused | archived
  archivedAt?: string; // ISO, set when status === "archived"

  // Filters (mirror of OnboardingState)
  budget: [number, number] | null;
  moveIn: { mode: "specific" | "flexible"; date?: string };
  bedrooms: string[];
  bathrooms: string;
  rentProtection: RentProtection;
  includeBrokerFee: boolean;
  neighborhoods: string[];
  amenities: Record<string, TriState>;
  transit: {
    hasPreference: boolean;
    lines: Record<string, TriState>;
  };
  commute: { maxMinutes: number | null };

  // Per-search notifications
  frequency: Frequency;

  // Stats (mock for demo)
  totalAlertsReceived: number;
  alertsLast7Days: number;
  alertsToday: number;
}

/** User-level account data — one per account, independent of searches. */
export interface User {
  id: string;

  // Contact (shared across searches)
  email: string;
  emailVerified: boolean;
  phone: string;
  phoneVerified: boolean;
  timezone: string;

  // Plan
  plan: Plan;
  billingCycle: BillingCycle;
  trialActive: boolean;
  trialStartedAt?: string;
  trialEndsAt?: string;

  // Account-level features
  moveOut?: MoveOutInfo;
  referralCode: string;
  isAffiliate: boolean;

  // Lifecycle
  completedAt: string | null;
  hasPassword?: boolean;
  deletionRequestedAt?: string | null;
  deletionScheduledAt?: string | null;
  deletionCancelSubscription?: boolean | null;
  subscriptionCanceledAt?: string | null;
  subscriptionPeriodEnd?: string | null;
  /** Whether the subscription is paid for. Backend-owned. */
  subscriptionStatus?: "none" | "trialing" | "active" | "past_due" | "canceled";
  pastDueSince?: string | null;
  updatedAt?: string;
}

export interface SearchQuota {
  used: number;
  max: number;
  remaining: number;
  label: string; // "1 of 1 used" | "2 of 3 used"
}

/**
 * Search limits by tier. `intro` (3-day intro) → 1 search, `pro` → 3.
 */
export const SEARCH_LIMITS: Record<Plan, number> = {
  intro: 1,
  pro: 3,
};

export type { OnboardingState, MoveOutInfo, Plan, Frequency, BillingCycle };
