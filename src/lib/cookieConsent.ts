import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CookieCategory = "necessary" | "analytics" | "functional" | "advertising";

export interface CookieConsent {
  necessary: true; // always on
  analytics: boolean;
  functional: boolean;
  advertising: boolean;
}

interface CookieConsentState {
  /** Timestamp (ms) of last consent decision. null = no decision yet. */
  decidedAt: number | null;
  /** Schema version, bump to force re-prompt. */
  version: number;
  consent: CookieConsent;
  /** Manage modal open state (UI). */
  modalOpen: boolean;
  setConsent: (next: Omit<CookieConsent, "necessary">) => void;
  acceptAll: () => void;
  rejectAll: () => void;
  openModal: () => void;
  closeModal: () => void;
  /** True when banner should be shown (no valid decision yet). */
  needsDecision: () => boolean;
}

const TWELVE_MONTHS_MS = 365 * 24 * 60 * 60 * 1000;
const SCHEMA_VERSION = 1;

const defaultConsent: CookieConsent = {
  necessary: true,
  analytics: false,
  functional: false,
  advertising: false,
};

export const useCookieConsent = create<CookieConsentState>()(
  persist(
    (set, get) => ({
      decidedAt: null,
      version: SCHEMA_VERSION,
      consent: defaultConsent,
      modalOpen: false,
      setConsent: (next) =>
        set({
          consent: { ...next, necessary: true },
          decidedAt: Date.now(),
          version: SCHEMA_VERSION,
          modalOpen: false,
        }),
      acceptAll: () =>
        set({
          consent: { necessary: true, analytics: true, functional: true, advertising: true },
          decidedAt: Date.now(),
          version: SCHEMA_VERSION,
          modalOpen: false,
        }),
      rejectAll: () =>
        set({
          consent: defaultConsent,
          decidedAt: Date.now(),
          version: SCHEMA_VERSION,
          modalOpen: false,
        }),
      openModal: () => set({ modalOpen: true }),
      closeModal: () => set({ modalOpen: false }),
      needsDecision: () => {
        const { decidedAt, version } = get();
        if (!decidedAt) return true;
        if (version !== SCHEMA_VERSION) return true;
        if (Date.now() - decidedAt > TWELVE_MONTHS_MS) return true;
        return false;
      },
    }),
    {
      name: "nook-cookie-consent",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        decidedAt: s.decidedAt,
        version: s.version,
        consent: s.consent,
      }),
    },
  ),
);

/** Convenience: open the cookie preferences modal from anywhere. */
export function openCookiePreferences() {
  useCookieConsent.getState().openModal();
}
