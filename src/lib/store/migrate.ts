/**
 * Legacy migration: nook.onboarding.v1 → nook.app.v1.
 *
 * Reads the persisted OnboardingState from localStorage and, if appStore has no
 * searches yet, creates a User + 1 Search from it. Idempotent.
 *
 * Called once on app boot from the root route.
 */
import type { CityId } from "@/data/cities";
import type { OnboardingState } from "@/lib/onboarding/store";
import { useAppStore } from "./appStore";
import { generateId, generateReferralCode, getDefaultSearchName, nowIso } from "./helpers";
import type { Search, User } from "./types";

const LEGACY_KEY = "nook.onboarding.v1";
const LEGACY_REFERRAL_KEY = "nook.referral";
const MIGRATION_FLAG = "nook.app.migrated.v1";

export function ensureMigratedFromLegacy(): void {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(MIGRATION_FLAG) === "1") return;

  const app = useAppStore.getState();
  if (app.searches.length > 0) {
    localStorage.setItem(MIGRATION_FLAG, "1");
    return;
  }

  const legacyRaw = localStorage.getItem(LEGACY_KEY);
  if (!legacyRaw) {
    // No legacy state — leave appStore empty; first onboarding will bootstrap.
    localStorage.setItem(MIGRATION_FLAG, "1");
    return;
  }

  let legacyState: Partial<OnboardingState> | null = null;
  try {
    const parsed = JSON.parse(legacyRaw) as { state?: Partial<OnboardingState> };
    legacyState = parsed?.state ?? null;
  } catch {
    localStorage.setItem(MIGRATION_FLAG, "1");
    return;
  }
  if (!legacyState) {
    localStorage.setItem(MIGRATION_FLAG, "1");
    return;
  }

  // Build User from legacy account-level fields.
  const referralCode = localStorage.getItem(LEGACY_REFERRAL_KEY) ?? generateReferralCode();
  if (!localStorage.getItem(LEGACY_REFERRAL_KEY)) {
    localStorage.setItem(LEGACY_REFERRAL_KEY, referralCode);
  }

  const user: User = {
    id: generateId("u"),
    email: legacyState.email ?? "",
    emailVerified: false,
    phone: legacyState.phone ?? "",
    phoneVerified: false,
    timezone:
      typeof Intl !== "undefined"
        ? Intl.DateTimeFormat().resolvedOptions().timeZone
        : "America/New_York",
    plan: legacyState.selectedPlan ?? "free",
    billingCycle: legacyState.billingCycle ?? "monthly",
    trialActive: legacyState.trialActive ?? false,
    moveOut: legacyState.moveOut,
    referralCode,
    isAffiliate: false,
    completedAt: legacyState.completedAt ?? null,
  };

  // Only build a Search if a city was chosen (otherwise nothing meaningful yet).
  const cityId = legacyState.city as CityId | null | undefined;
  let searches: Search[] = [];
  let activeSearchId: string | null = null;

  if (cityId) {
    const id = generateId();
    const s: Search = {
      id,
      name: getDefaultSearchName(cityId, []),
      cityId,
      createdAt: nowIso(),
      updatedAt: nowIso(),
      status: "active",
      budget: (legacyState.budget as [number, number] | null) ?? null,
      moveIn: legacyState.moveIn ?? { mode: "flexible" },
      bedrooms: legacyState.bedrooms ?? [],
      bathrooms: legacyState.bathrooms ?? "1ba",
      rentProtection: legacyState.rentProtection === "likely" ? "all" : (legacyState.rentProtection ?? "all"),
      includeBrokerFee: legacyState.includeBrokerFee ?? true,
      neighborhoods: legacyState.neighborhoods ?? [],
      amenities: legacyState.amenities ?? {},
      transit: legacyState.transit ?? { hasPreference: false, lines: {} },
      commute: legacyState.commute ?? { maxMinutes: null },
      alertChannel: legacyState.alertChannel ?? "email",
      frequency: legacyState.frequency ?? "balanced",
      totalAlertsReceived: 0,
      alertsLast7Days: 0,
      alertsToday: 0,
    };
    searches = [s];
    activeSearchId = id;
  }

  useAppStore.setState({ user, searches, activeSearchId });
  localStorage.setItem(MIGRATION_FLAG, "1");
}
