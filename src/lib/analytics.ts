/**
 * Minimal analytics dispatch. Events are pushed to gtag when the visitor has
 * accepted analytics cookies (ConsentScripts owns the loader); otherwise the
 * call is a no-op.
 *
 * Event names are intentionally funnel-specific: two buttons that share a
 * label at different funnel points must NOT share an event name, or their
 * conversion rates become unreadable.
 */
export const ANALYTICS_EVENTS = {
  /** Preview screen CTA for a visitor with no active subscription. */
  previewCtaSeePlans: "onboarding_preview_cta_see_plans",
  /** Preview screen CTA for an active/trialing subscriber. */
  previewCtaStartSearch: "onboarding_preview_cta_start_search",
  /** Registration modal shown (params: source, plan, cycle). */
  registrationModalOpened: "registration_modal_opened",
  /** Session established from inside the registration modal. */
  registrationModalAuthed: "registration_modal_authed",
  /** Visitor sent to checkout after a plan decision. */
  planCheckoutRedirect: "plan_checkout_redirect",
} as const;

export function trackEvent(name: string, params?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  const w = window as unknown as { gtag?: (...a: unknown[]) => void; dataLayer?: unknown[] };
  try {
    if (typeof w.gtag === "function") w.gtag("event", name, params ?? {});
    else if (Array.isArray(w.dataLayer)) w.dataLayer.push({ event: name, ...(params ?? {}) });
  } catch {
    /* analytics must never break a CTA */
  }
}
