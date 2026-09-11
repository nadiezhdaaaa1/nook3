import { useAppStore } from "@/lib/store";
import { useOnboardingStore, type Frequency } from "@/lib/onboarding/store";
import { usePreferencesStore } from "@/lib/preferences/store";

/**
 * Single write path for notification settings so every surface
 * (per-search Notifications tab, Account → Communications, the public
 * unsubscribe page) stays in sync. The Search snapshot is the source of
 * truth; the legacy onboarding buffer is mirrored when it owns the search.
 */

export function setSearchFrequency(searchId: string, frequency: Frequency): void {
  useAppStore.getState().updateSearch(searchId, { frequency });
  const o = useOnboardingStore.getState();
  if (o.editingSearchId === searchId) o.set("frequency", frequency);
}

export function setSearchAlertsEnabled(searchId: string, enabled: boolean): void {
  useAppStore.getState().updateSearch(searchId, { alertsEnabled: enabled });
}

/** Turns off match alerts on every search plus the optional email streams. */
export function disableAllNotifications(): void {
  const app = useAppStore.getState();
  for (const s of app.searches) {
    if (s.alertsEnabled) app.updateSearch(s.id, { alertsEnabled: false });
  }
  const prefs = usePreferencesStore.getState();
  prefs.setPref("productUpdates", false);
  prefs.setPref("marketingEmails", false);
}

export function detectTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "America/New_York";
  } catch {
    return "America/New_York";
  }
}

export function formatTimeLabel(hhmm: string): string {
  const [hStr, mStr] = hhmm.split(":");
  const h = Number(hStr);
  const m = Number(mStr ?? "0");
  if (Number.isNaN(h)) return hhmm;
  const period = h >= 12 ? "PM" : "AM";
  const h12 = ((h + 11) % 12) + 1;
  return `${h12}:${m.toString().padStart(2, "0")} ${period}`;
}

export const FREQUENCY_LABELS: { id: Frequency; label: string; desc: string }[] = [
  { id: "maximum", label: "Instant", desc: "Every match, the moment it's listed." },
  { id: "balanced", label: "Balanced", desc: "Top matches, grouped 2–3 times a day." },
  { id: "minimal", label: "Daily", desc: "One roundup a day with your strongest matches." },
  { id: "weekly", label: "Weekly", desc: "One curated digest every week." },
];
