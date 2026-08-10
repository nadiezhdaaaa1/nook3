import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { toast } from "sonner";
import { CreditCard, Mail, Pencil } from "lucide-react";
import { useOnboardingStore, type Plan } from "@/lib/onboarding/store";
import {
  OB_H1,
  OB_SUB,
  OB_SECTION_VARIANTS,
  OB_STEP_VARIANTS,
} from "@/components/onboarding/stepStyles";
import { OriginButton } from "@/components/ui/origin-button";
import { getCity } from "@/data/cities";
import { AMENITY_GROUPS } from "@/data/amenities";
import { RENT_PROTECTION_OPTIONS } from "@/data/cities/types";
import { syncOnboardingToActiveSearch, syncOnboardingToUser } from "@/lib/store";
import { lovable } from "@/integrations/lovable";
import googleIcon from "@/assets/Google_Favicon_2025.svg.asset.json";

export const Route = createFileRoute("/onboarding/success")({
  head: () => ({
    meta: [
      { title: "Create your account — Nook" },
      {
        name: "description",
        content: "Review your search and create your Nook account to start receiving alerts.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Success,
});

const PLAN_META: Record<Plan, { name: string; price: Record<"monthly" | "annual", string>; suffix: string }> = {
  free: { name: "Free", price: { monthly: "$0", annual: "$0" }, suffix: "forever" },
  premium: { name: "Premium", price: { monthly: "$14.99", annual: "$7.99" }, suffix: "/month" },
  max: { name: "Max", price: { monthly: "$29", annual: "$19.08" }, suffix: "/month" },
};

const AMENITY_LABELS: Record<string, string> = Object.fromEntries(
  AMENITY_GROUPS.flatMap((g) => g.items.map((i) => [i.id, i.label])),
);

const money = (n: number) => `$${n.toLocaleString("en-US")}`;

function Success() {
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const [busy, setBusy] = useState(false);

  const {
    city,
    budget,
    moveIn,
    bedrooms,
    bathrooms,
    rentProtection,
    includeBrokerFee,
    neighborhoods,
    amenities,
    transit,
    commute,
    selectedPlan,
    billingCycle,
    trialActive,
    set,
  } = useOnboardingStore();

  useEffect(() => {
    if (!useOnboardingStore.getState().completedAt) {
      set("completedAt", new Date().toISOString());
    }
    syncOnboardingToActiveSearch();
    syncOnboardingToUser();
  }, [set]);

  const cityConfig = getCity(city);
  const plan = selectedPlan ?? "free";
  const planMeta = PLAN_META[plan];
  const isPaid = plan !== "free";

  const rows = useMemo(() => {
    const out: { label: string; value: string; step: string }[] = [];

    out.push({
      label: "City",
      value: cityConfig ? `${cityConfig.displayName}, ${cityConfig.state}` : "Not selected",
      step: "1",
    });

    if (budget) {
      out.push({ label: "Budget", value: `${money(budget[0])} – ${money(budget[1])}/mo`, step: "1" });
    }

    out.push({
      label: "Move-in",
      value:
        moveIn.mode === "specific" && moveIn.date
          ? new Date(moveIn.date).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })
          : "Flexible",
      step: "1",
    });

    if (bedrooms.length) {
      out.push({ label: "Bedrooms", value: bedrooms.join(", "), step: "2" });
    }
    if (bathrooms) {
      out.push({ label: "Bathrooms", value: bathrooms, step: "2" });
    }

    const protectionLabel = RENT_PROTECTION_OPTIONS.find((o) => o.id === rentProtection)?.title;
    if (protectionLabel) {
      out.push({ label: "Rent protection", value: protectionLabel, step: "2" });
    }
    out.push({
      label: "Broker fee",
      value: includeBrokerFee ? "Include fee listings" : "No-fee listings only",
      step: "2",
    });

    out.push({
      label: "Neighborhoods",
      value: neighborhoods.length ? neighborhoods.join(", ") : "Anywhere in the city",
      step: "3",
    });

    const must = Object.entries(amenities)
      .filter(([, s]) => s === "required")
      .map(([id]) => AMENITY_LABELS[id] ?? id);
    const nice = Object.entries(amenities)
      .filter(([, s]) => s === "nice")
      .map(([id]) => AMENITY_LABELS[id] ?? id);
    if (must.length) out.push({ label: "Must have", value: must.join(", "), step: "4" });
    if (nice.length) out.push({ label: "Nice to have", value: nice.join(", "), step: "4" });

    const lines = Object.keys(transit.lines);
    if (transit.hasPreference && lines.length && cityConfig) {
      const labels = lines.map(
        (id) => cityConfig.transit.lines.find((l) => l.id === id)?.label ?? id,
      );
      out.push({ label: cityConfig.transit.label, value: labels.join(", "), step: "4" });
    }
    if (commute.maxMinutes) {
      out.push({ label: "Max commute", value: `${commute.maxMinutes} min`, step: "4" });
    }

    return out;
  }, [
    cityConfig,
    budget,
    moveIn,
    bedrooms,
    bathrooms,
    rentProtection,
    includeBrokerFee,
    neighborhoods,
    amenities,
    transit,
    commute,
  ]);

  const stepVariants = reduce ? undefined : OB_STEP_VARIANTS;
  const sectionVariants = reduce ? undefined : OB_SECTION_VARIANTS;

  async function onGoogle() {
    setBusy(true);
    const res = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${window.location.origin}/preferences`,
    });
    setBusy(false);
    if (res?.error) {
      toast.error("Google sign up failed", { description: res.error.message });
    }
  }

  return (
    <motion.div
      variants={stepVariants}
      initial={stepVariants ? "hidden" : undefined}
      animate={stepVariants ? "visible" : undefined}
      className="mx-auto w-full max-w-[800px] pb-16"
    >
      <motion.div variants={sectionVariants}>
        <h1 className="font-display ob-h1" style={OB_H1}>
          Create your account to go <span className="accent-italic">live</span>.
        </h1>
        <p style={OB_SUB}>
          Here's what we'll watch for you. You can change any of it later in your preferences.
        </p>
      </motion.div>

      {/* Chosen plan */}
      <motion.div
        variants={sectionVariants}
        className="mt-8 rounded-[16px] border border-black/20 bg-white p-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-charcoal-500">
              Your plan
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span
                className="font-display"
                style={{ fontWeight: 700, fontSize: 26, color: "#241c12" }}
              >
                {planMeta.name}
              </span>
              <span className="text-[16px] font-semibold text-charcoal-950">
                {planMeta.price[billingCycle]}
              </span>
              <span className="text-[14px] text-charcoal-500">{planMeta.suffix}</span>
            </div>
            {isPaid && (
              <div className="mt-1 text-[14px] text-charcoal-600">
                {trialActive ? "3-day free trial, then " : ""}
                billed {billingCycle === "annual" ? "annually" : "monthly"} · cancel anytime
              </div>
            )}
          </div>
          <Link
            to="/onboarding/pricing"
            className="inline-flex h-[40px] items-center gap-2 rounded-[10px] border border-black/10 px-4 text-[14px] font-semibold text-charcoal-950 transition-colors hover:border-charcoal-950"
          >
            <Pencil className="h-3.5 w-3.5" /> Change plan
          </Link>
        </div>
      </motion.div>

      {/* Summary */}
      <motion.div
        variants={sectionVariants}
        className="mt-4 overflow-hidden rounded-[16px] border border-black/20 bg-white"
      >
        <div className="border-b border-black/10 px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-charcoal-500">
          Your search
        </div>
        <dl className="divide-y divide-black/10">
          {rows.map((r) => (
            <div
              key={r.label}
              className="flex flex-col gap-1 px-6 py-3 sm:flex-row sm:items-baseline sm:gap-6"
            >
              <dt className="w-[168px] shrink-0 text-[14px] text-charcoal-500">{r.label}</dt>
              <dd className="m-0 flex-1 text-[16px] text-charcoal-950">{r.value}</dd>
              <Link
                to="/onboarding/step/$step"
                params={{ step: r.step }}
                className="text-[13px] font-semibold text-charcoal-500 underline decoration-black/20 hover:text-charcoal-950"
              >
                Edit
              </Link>
            </div>
          ))}
        </dl>
      </motion.div>

      {/* Payment note */}
      <motion.div
        variants={sectionVariants}
        className="mt-4 flex items-start gap-3 rounded-[16px] border border-black/10 bg-[#ebf0d5] px-5 py-4"
      >
        <CreditCard className="mt-0.5 h-4 w-4 shrink-0 text-[#6a820a]" />
        <p className="m-0 text-[14px] leading-[22px] text-charcoal-800">
          {isPaid ? (
            <>
              After creating your account you'll be taken to the payment screen to start your{" "}
              {planMeta.name} plan. Payments aren't live yet, so for now we'll take you straight
              into the app with {planMeta.name} enabled.
            </>
          ) : (
            <>
              No payment needed for the Free plan — you'll go straight into the app after creating
              your account.
            </>
          )}
        </p>
      </motion.div>

      {/* Account creation */}
      <motion.div variants={sectionVariants} className="mt-8 flex flex-col gap-3">
        <OriginButton
          type="button"
          variant="tertiary"
          size="big"
          className="w-full"
          onClick={onGoogle}
          disabled={busy}
        >
          <img src={googleIcon.url} alt="" width={24} height={24} aria-hidden="true" />
          <span>Continue with Google</span>
        </OriginButton>

        <OriginButton
          type="button"
          variant="main"
          size="big"
          className="w-full"
          disabled={busy}
          onClick={() => navigate({ to: "/signup", search: { redirect: "/preferences" } })}
        >
          <Mail className="h-4 w-4" />
          <span>Continue with email</span>
        </OriginButton>

        <p className="m-0 text-center text-[14px] text-charcoal-500">
          Already have an account?{" "}
          <Link to="/login" search={{ redirect: "/preferences" }} className="text-charcoal-950 underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
}
