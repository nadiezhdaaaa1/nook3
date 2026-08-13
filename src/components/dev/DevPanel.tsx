import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";

import { devSetAccountState, type DevAccountStateInput } from "@/lib/dev.functions";
import { accessQueryKey, accessQueryOptions } from "@/lib/queries/access";
import { profileQueryKey } from "@/lib/queries/profile";
import { useOnboardingStore } from "@/lib/onboarding/store";
import { supabase } from "@/integrations/supabase/client";
import { useHasSession } from "@/lib/queries/useHasSession";
import { cn } from "@/lib/utils";

/**
 * Dev-only account state panel. Renders in development builds only (see the
 * `import.meta.env.DEV` guard at the call site in `__root.tsx`).
 *
 * Plan / subscription columns are trigger-protected, so every write goes
 * through `devSetAccountState`, which refuses to run in production.
 */

const STATUSES = ["none", "trialing", "active", "past_due", "canceled"] as const;

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/50">
        {label}
      </span>
      <div className="flex flex-wrap gap-1">{children}</div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-md border px-2 py-1 text-[11px] font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BBD453] focus-visible:ring-offset-1 focus-visible:ring-offset-[#141414]",
        active
          ? "border-[#BBD453] bg-[#BBD453] text-black"
          : "border-white/20 bg-white/5 text-white/80 hover:bg-white/15",
      )}
    >
      {children}
    </button>
  );
}

export function DevPanel() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [dayOffset, setDayOffset] = useState(0);
  const qc = useQueryClient();
  const router = useRouter();
  const navigate = useNavigate();
  const hasSession = useHasSession();
  const setState = useServerFn(devSetAccountState);

  const access = useQuery({ ...accessQueryOptions(), enabled: !!hasSession && open });

  async function apply(patch: DevAccountStateInput, to?: string) {
    setBusy(true);
    try {
      await setState({ data: patch as never });
      await qc.invalidateQueries({ queryKey: accessQueryKey });
      await qc.invalidateQueries({ queryKey: profileQueryKey });
      await router.invalidate();
      if (to) navigate({ to, replace: true } as never);
    } catch (e) {
      toast.error("Dev write failed", {
        description: e instanceof Error ? e.message : "Unknown error",
      });
    } finally {
      setBusy(false);
    }
  }

  async function resetToAnonymous() {
    setBusy(true);
    try {
      await setState({
        data: {
          plan: "intro",
          billingCycle: "monthly",
          status: "none",
          clearPastDue: true,
          onboarded: false,
          hasEverSubscribed: false,
          noCredentials: false,
        } as never,
      });
    } catch {
      /* not signed in — nothing to reset server-side */
    }
    useOnboardingStore.getState().setHandoffCompleted(false);
    useOnboardingStore.getState().reset();
    try {
      await supabase.auth.signOut();
    } catch {
      /* ignore */
    }
    qc.clear();
    setBusy(false);
    window.location.href = "/";
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 left-4 z-[100] rounded-full bg-[#141414] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#BBD453] shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BBD453]"
        aria-label="Open dev panel"
      >
        Dev
      </button>
    );
  }

  const a = access.data;

  return (
    <div className="fixed bottom-4 left-4 z-[100] max-h-[80dvh] w-[calc(100vw-32px)] max-w-[320px] overflow-y-auto rounded-2xl bg-[#141414] p-4 text-white shadow-2xl">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#BBD453]">
          Dev panel
        </span>
        <div className="flex items-center gap-2">
          {(busy || access.isFetching) && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close dev panel"
            className="rounded p-1 text-white/60 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BBD453]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Flag readout — which gate row am I in? */}
      <div className="mt-3 rounded-lg bg-white/5 p-2 text-[11px] leading-5 text-white/80">
        {!hasSession ? (
          <span>Signed out (anonymous)</span>
        ) : a ? (
          <>
            <div>
              credentials: <b>{a.credentials ? "set" : "none"}</b>
            </div>
            <div>
              status: <b>{a.status}</b>
              {a.status === "past_due" && a.pastDueSince
                ? ` (day ${Math.floor((Date.now() - new Date(a.pastDueSince).getTime()) / 86400000)})`
                : ""}
            </div>
            <div>
              onboarded: <b>{a.onboarded ? "yes" : "no"}</b>
            </div>
            <div>
              plan: <b>{a.plan}</b> / {a.billingCycle} · everSubscribed:{" "}
              <b>{a.hasEverSubscribed ? "yes" : "no"}</b>
            </div>
          </>
        ) : (
          <span>Loading access state…</span>
        )}
      </div>

      <div className="mt-3 flex flex-col gap-3">
        <Row label="credentials">
          <Chip active={a?.credentials === true} onClick={() => apply({ noCredentials: false })}>
            set
          </Chip>
          <Chip active={a?.credentials === false} onClick={() => apply({ noCredentials: true })}>
            none
          </Chip>
        </Row>

        <Row label="subscription_status">
          {STATUSES.map((s) => (
            <Chip
              key={s}
              active={a?.status === s}
              onClick={() =>
                apply(
                  s === "past_due"
                    ? { status: s, pastDueDayOffset: dayOffset }
                    : { status: s, clearPastDue: true },

                )
              }
            >
              {s}
            </Chip>
          ))}
        </Row>

        <Row label={`past_due_since — day ${dayOffset}`}>
          {[0, 1, 2, 3, 4, 5, 6, 7].map((d) => (
            <Chip
              key={d}
              active={dayOffset === d}
              onClick={() => {
                setDayOffset(d);
                apply({ status: "past_due", pastDueDayOffset: d });
              }}
            >
              {d}
            </Chip>
          ))}
        </Row>

        <Row label="onboarded">
          <Chip active={a?.onboarded === true} onClick={() => apply({ onboarded: true })}>
            yes
          </Chip>
          <Chip active={a?.onboarded === false} onClick={() => apply({ onboarded: false })}>
            no
          </Chip>
        </Row>

        <Row label="plan">
          <Chip active={a?.plan === "intro"} onClick={() => apply({ plan: "intro" })}>
            intro
          </Chip>
          <Chip active={a?.plan === "pro"} onClick={() => apply({ plan: "pro" })}>
            pro
          </Chip>
        </Row>

        <Row label="billing_cycle">
          <Chip
            active={a?.billingCycle === "monthly"}
            onClick={() => apply({ billingCycle: "monthly" })}
          >
            monthly
          </Chip>
          <Chip
            active={a?.billingCycle === "annual"}
            onClick={() => apply({ billingCycle: "annual" })}
          >
            annual
          </Chip>
        </Row>

        <Row label="hasEverSubscribed">
          <Chip
            active={a?.hasEverSubscribed === true}
            onClick={() => apply({ hasEverSubscribed: true })}
          >
            yes
          </Chip>
          <Chip
            active={a?.hasEverSubscribed === false}
            onClick={() => apply({ hasEverSubscribed: false })}
          >
            no
          </Chip>
        </Row>

        <Row label="jump to gate row">
          <Chip
            onClick={() =>
              apply({ noCredentials: true, status: "active", onboarded: true }, "/home")
            }
          >
            1 · no credentials
          </Chip>
          <Chip
            onClick={() =>
              apply(
                { noCredentials: false, status: "canceled", clearPastDue: true, onboarded: true },
                "/home",
              )
            }
          >
            2 · unpaid + onboarded
          </Chip>
          <Chip
            onClick={() =>
              apply(
                { noCredentials: false, status: "none", clearPastDue: true, onboarded: false },
                "/home",
              )
            }
          >
            3 · unpaid + setup
          </Chip>
          <Chip
            onClick={() =>
              apply(
                {
                  noCredentials: false,
                  status: "trialing",
                  clearPastDue: true,
                  onboarded: false,
                  plan: "intro",
                },
                "/home",
              )
            }
          >
            4 · paid + setup
          </Chip>
          <Chip
            onClick={() =>
              apply(
                {
                  noCredentials: false,
                  status: "active",
                  clearPastDue: true,
                  onboarded: true,
                  plan: "pro",
                  hasEverSubscribed: true,
                },
                "/home",
              )
            }
          >
            5 · in app
          </Chip>
          <Chip
            onClick={() =>
              apply(
                {
                  noCredentials: false,
                  status: "past_due",
                  pastDueDayOffset: dayOffset,
                  onboarded: true,
                },
                "/home",
              )
            }
          >
            6 · past_due grace
          </Chip>
        </Row>

        <div className="flex flex-wrap gap-2 border-t border-white/10 pt-3">
          <Chip onClick={() => navigate({ to: "/checkout/mock" } as never)}>
            → /checkout/mock
          </Chip>
          <Chip onClick={() => navigate({ to: "/thanks" } as never)}>→ /thanks</Chip>
          <button
            type="button"
            onClick={resetToAnonymous}
            className="rounded-md border border-[#DF4400] bg-[#DF4400]/20 px-2 py-1 text-[11px] font-semibold text-[#ffb59a] hover:bg-[#DF4400]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DF4400]"
          >
            Reset to anonymous
          </button>
        </div>
      </div>
    </div>
  );
}

export default DevPanel;
