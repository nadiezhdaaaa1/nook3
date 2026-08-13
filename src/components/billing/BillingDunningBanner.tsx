import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, CheckCircle2, CreditCard, Loader2, X } from "lucide-react";

import { OriginButton } from "@/components/ui/origin-button";
import { accessQueryKey, accessQueryOptions } from "@/lib/queries/access";
import { useHasSession } from "@/lib/queries/useHasSession";
import {
  createPaymentRepairSession,
  dunningCopy,
  dunningState,
} from "@/lib/dunning";

/**
 * App-wide dunning notice for the `past_due` window. Access and digests keep
 * running for all seven days — this banner is the entire intervention, so it
 * has to carry the amount, the deadline and a one-click repair path.
 *
 * Dismissal is session-scoped: the deadline is real, so it comes back on the
 * next visit.
 */
const DISMISS_KEY = "nook.billing.dunningDismissed";
export const BILLING_RETURN_KEY = "nook.billing.returning";

type Mode = "idle" | "creating" | "error" | "checking" | "recovered";

export function BillingDunningBanner() {
  const hasSession = useHasSession();
  const qc = useQueryClient();
  const { data: access } = useQuery({
    ...accessQueryOptions(),
    enabled: hasSession,
    retry: false,
  });

  const [mode, setMode] = useState<Mode>("idle");
  const [dismissed, setDismissed] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setDismissed(window.sessionStorage.getItem(DISMISS_KEY) === "1");
  }, []);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // Returning from the portal / invoice page. Stripe's webhook lands a moment
  // after the redirect, so the honest state here is "checking", not "fixed".
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.sessionStorage.getItem(BILLING_RETURN_KEY) !== "1") return;
    window.sessionStorage.removeItem(BILLING_RETURN_KEY);
    window.sessionStorage.removeItem(DISMISS_KEY);
    setDismissed(false);
    setMode("checking");
    later(() => {
      void qc.invalidateQueries({ queryKey: accessQueryKey });
    }, 900);
    later(() => {
      const fresh = qc.getQueryData<{ status?: string }>(accessQueryKey);
      if (fresh?.status === "past_due") {
        setMode("idle");
        return;
      }
      setMode("recovered");
      later(() => setMode("idle"), 6000);
    }, 3000);
  }, [qc, later]);

  const state = dunningState(access ?? null);

  async function openRepair() {
    if (!state) return;
    setMode("creating");
    try {
      const url = await createPaymentRepairSession(state.destination);
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(BILLING_RETURN_KEY, "1");
        window.location.assign(url);
      }
    } catch {
      setMode("error");
    }
  }

  function dismiss() {
    if (typeof window !== "undefined") window.sessionStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  }

  if (mode === "recovered") {
    return (
      <Shell tone="good">
        <span className="flex items-center gap-2 text-sm font-semibold">
          <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden />
          Payment received — you&rsquo;re all set.
        </span>
      </Shell>
    );
  }

  if (mode === "checking") {
    return (
      <Shell tone="warn">
        <span className="flex items-center gap-2 text-sm font-semibold">
          <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
          Checking your payment… this takes a few seconds.
        </span>
      </Shell>
    );
  }

  if (!state || dismissed) return null;

  const copy = dunningCopy(state);

  return (
    <Shell tone="warn" onDismiss={dismiss}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4 w-full">
        <p className="m-0 flex items-start gap-2 text-sm leading-relaxed">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <span>
            <span className="font-semibold">{copy.headline}</span>{" "}
            {mode === "error" ? (
              <span className="opacity-80">
                Couldn&rsquo;t open the payment page.
              </span>
            ) : (
              <span className="opacity-80">
                Your searches and alerts keep running until then.
              </span>
            )}
          </span>
        </p>
        <div className="shrink-0">
          <OriginButton
            variant="dark"
            size="medium"
            onClick={() => void openRepair()}
            disabled={mode === "creating"}
          >
            {mode === "creating" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Opening…
              </>
            ) : mode === "error" ? (
              "Retry"
            ) : (
              <>
                <CreditCard className="h-4 w-4" aria-hidden /> {copy.ctaLabel}
              </>
            )}
          </OriginButton>
        </div>
      </div>
    </Shell>
  );
}

function Shell({
  tone,
  children,
  onDismiss,
}: {
  tone: "warn" | "good";
  children: React.ReactNode;
  onDismiss?: () => void;
}) {
  const style =
    tone === "good"
      ? { background: "#EEF4DA", color: "#3A4606", borderBottom: "1px solid rgba(0,0,0,0.12)" }
      : { background: "#FFF1CF", color: "#5A4200", borderBottom: "1px solid rgba(0,0,0,0.12)" };
  return (
    <div role="status" aria-live="polite" className="sticky top-0 z-50" style={style}>
      <div className="mx-auto flex max-w-[1440px] items-center gap-3 px-6 py-3">
        {children}
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss"
            className="ml-1 shrink-0 rounded-full p-1 opacity-60 transition hover:opacity-100"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        )}
      </div>
    </div>
  );
}
