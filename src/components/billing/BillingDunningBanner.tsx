import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, CheckCircle2, CreditCard, Loader2, X } from "lucide-react";

import { accessQueryKey, accessQueryOptions } from "@/lib/queries/access";
import { useHasSession } from "@/lib/queries/useHasSession";
import {
  createPaymentRepairSession,
  dunningCopy,
  dunningState,
} from "@/lib/dunning";
import { OriginButton } from "@/components/ui/origin-button";

/**
 * App-wide dunning notice for the `past_due` window. Access and digests keep
 * running for all seven days — this banner is the entire intervention, so it
 * has to carry the amount, the deadline and a one-click repair path.
 *
 * Dismissal is page-scoped: it lives in component state and resets on every
 * pathname change (and on reload).
 */
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

  const pathname = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => {
    setDismissed(false);
  }, [pathname]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // Returning from the portal / invoice page. Stripe's webhook lands a moment
  // after the redirect, so the honest state here is "checking", not "fixed".
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.sessionStorage.getItem(BILLING_RETURN_KEY) !== "1") return;
    window.sessionStorage.removeItem(BILLING_RETURN_KEY);
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
    setDismissed(true);
  }

  if (mode === "recovered") {
    return (
      <Shell tone="good">
        <span className="flex items-center gap-2 text-[13px] font-semibold">
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden />
          Payment received — you&rsquo;re all set.
        </span>
      </Shell>
    );
  }

  if (mode === "checking") {
    return (
      <Shell tone="warn">
        <span className="flex items-center gap-2 text-[13px] font-semibold">
          <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" aria-hidden />
          Checking your payment… this takes a few seconds.
        </span>
      </Shell>
    );
  }

  if (!state || dismissed) return null;

  const copy = dunningCopy(state);

  return (
    <Shell tone="warn" onDismiss={dismiss}>
      <div className="flex w-full min-w-0 items-center justify-between gap-3">
        <p className="m-0 flex min-w-0 items-center gap-2 text-[13px] leading-snug">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <span className="min-w-0 truncate sm:whitespace-normal">
            <span className="font-semibold">{copy.headline}</span>{" "}
            <span>
              {mode === "error"
                ? <>Couldn&rsquo;t open the payment page.</>
                : "Your searches and alerts keep running until then."}
            </span>
          </span>
        </p>
        <OriginButton
          type="button"
          variant="dark"
          size="medium"
          onClick={() => void openRepair()}
          disabled={mode === "creating"}
          className="!h-[32px] !px-3.5 !text-[13px] shrink-0 focus-visible:!ring-white focus-visible:!ring-offset-0"
        >
          {mode === "creating" ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden /> Opening…
            </>
          ) : mode === "error" ? (
            "Retry"
          ) : (
            <>
              <CreditCard className="h-3.5 w-3.5" aria-hidden /> {copy.ctaLabel}
            </>
          )}
        </OriginButton>
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
      ? { background: "#EEF4DA", color: "#3A4606" }
      : { background: "#d66c38", color: "#ffffff" };
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const root = document.documentElement;
    const apply = () => {
      const h = el.offsetHeight;
      setHeight(h);
      root.style.setProperty("--dunning-banner-h", `${h}px`);
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => {
      ro.disconnect();
      root.style.removeProperty("--dunning-banner-h");
    };
  }, []);
  return (
    <>
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        className="fixed inset-x-0 top-0 z-[55]"
        style={style}
      >
        <div className="mx-auto flex max-w-[1440px] items-center gap-2 px-4 py-[6px] sm:px-6">
          {children}
          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              aria-label="Dismiss"
              className="shrink-0 rounded-full p-1 opacity-60 transition hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
            >
              <X className="h-3.5 w-3.5" aria-hidden />
            </button>
          )}
        </div>
      </div>
      <div aria-hidden style={{ height }} />
    </>
  );
}
