import { createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { AlertTriangle, Loader2, Lock } from "lucide-react";
import { toast } from "sonner";

import { OriginButton } from "@/components/ui/origin-button";
import { useOnboardingStore } from "@/lib/onboarding/store";
import { devSetAccountState } from "@/lib/dev.functions";
import { accessQueryKey } from "@/lib/queries/access";
import { profileQueryKey } from "@/lib/queries/profile";
import stripeWordmark from "@/assets/stripe-wordmark.svg?url";

/**
 * MOCK CHECKOUT — stand-in for Stripe Checkout.
 *
 * When Stripe is wired up, this screen becomes a redirect to the real
 * Checkout Session URL, and the subscription state write below moves to the
 * `checkout.session.completed` webhook (which is the only trustworthy source
 * of "payment happened"). See the equivalent note on `updatePlan` in
 * `src/lib/billing.functions.ts`.
 */

export const Route = createFileRoute("/checkout/mock")({
  head: () => ({
    meta: [
      { title: "Mock checkout — Nook" },
      {
        name: "description",
        content: "Development stand-in for Stripe Checkout. No real payment is taken.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Mock checkout — Nook" },
      {
        property: "og:description",
        content: "Development stand-in for Stripe Checkout.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: MockCheckout,
});

type Summary = {
  planName: string;
  cadence: string;
  today: string;
  then: string;
};

function summaryFor(plan: "intro" | "pro", cycle: "monthly" | "annual"): Summary {
  if (plan === "intro") {
    return {
      planName: "Intro — 3 days free",
      cadence: "Monthly after the trial",
      today: "$0.00",
      then: "$14.99/month",
    };
  }
  if (cycle === "annual") {
    return {
      planName: "Pro (annual)",
      cadence: "Billed yearly",
      today: "$95.88",
      then: "$95.88/year",
    };
  }
  return {
    planName: "Pro",
    cadence: "Billed monthly",
    today: "$14.99",
    then: "$14.99/month",
  };
}

function MockCheckout() {
  const navigate = useNavigate();
  const router = useRouter();
  const qc = useQueryClient();
  const setState = useServerFn(devSetAccountState);
  const [busy, setBusy] = useState(false);

  const { selectedPlan, billingCycle } = useOnboardingStore();
  const plan = selectedPlan ?? "intro";
  const s = summaryFor(plan, billingCycle);

  async function onPay() {
    setBusy(true);
    try {
      await setState({
        data: {
          plan,
          billingCycle,
          status: plan === "intro" ? "trialing" : "active",
          clearPastDue: true,
          hasEverSubscribed: true,
        } as never,
      });
      await qc.invalidateQueries({ queryKey: accessQueryKey });
      await qc.invalidateQueries({ queryKey: profileQueryKey });
      await router.invalidate();
      navigate({ to: "/thanks" });
    } catch (e) {
      setBusy(false);
      toast.error("Mock checkout failed", {
        description: e instanceof Error ? e.message : "Try again",
      });
    }
  }

  function onCancel() {
    // The plan stays in the onboarding store, so the abandoned-checkout state
    // is reachable and the user returns with their choice intact.
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.history.back();
      return;
    }
    navigate({ to: "/onboarding/pricing" });
  }

  return (
    <div className="min-h-dvh bg-[#FAF6EE]">
      {/* Persistent mock warning — deliberately unlike product chrome. */}
      <div
        role="status"
        className="sticky top-0 z-40 flex items-center justify-center gap-2 bg-[#FFE7A3] px-4 py-2.5 text-center text-[13px] font-semibold text-[#5A4200]"
        style={{ borderBottom: "2px dashed #C99700" }}
      >
        <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>MOCK CHECKOUT — no real payment is taken.</span>
      </div>

      <div className="mx-auto w-full max-w-[520px] px-5 py-10">
        <div className="flex items-center justify-between gap-4">
          <h1 className="font-display m-0 text-[26px] font-bold text-charcoal-950">
            Confirm your plan
          </h1>
          <img src={stripeWordmark} alt="Stripe" height={26} className="h-[26px] w-auto" />
        </div>

        <div className="mt-6 rounded-[16px] border border-black/20 bg-white p-6">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-charcoal-500">
            Order summary
          </div>
          <div className="mt-3 flex items-baseline justify-between gap-4">
            <div className="text-[18px] font-semibold text-charcoal-950">{s.planName}</div>
            <div className="text-[20px] font-semibold text-charcoal-950">{s.today}</div>
          </div>
          <div className="mt-1 flex items-baseline justify-between gap-4 text-[14px] text-charcoal-500">
            <span>{s.cadence}</span>
            <span>due today</span>
          </div>
          <div className="mt-4 border-t border-black/10 pt-4 text-[14px] text-charcoal-500">
            Then {s.then} · cancel anytime
          </div>
        </div>

        <div className="mt-6 rounded-[16px] border border-black/20 bg-white p-6">
          <div className="flex items-center gap-2 text-[13px] text-charcoal-500">
            <Lock className="h-4 w-4" aria-hidden="true" />
            <span>Card details are not collected in this mock screen.</span>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <OriginButton
            type="button"
            variant="main"
            size="big"
            className="w-full"
            disabled={busy}
            onClick={onPay}
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            <span>Save card and continue</span>
          </OriginButton>
          <OriginButton
            type="button"
            variant="tertiary"
            size="big"
            className="w-full"
            disabled={busy}
            onClick={onCancel}
          >
            Cancel and go back
          </OriginButton>
        </div>
      </div>
    </div>
  );
}
