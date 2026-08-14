import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { motion, useReducedMotion } from "framer-motion";
import { toast } from "sonner";
import { Mail } from "lucide-react";
import { useOnboardingStore, type Plan } from "@/lib/onboarding/store";
import { WARM_BG } from "@/components/landing/PricingThreeTiers";

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
import { getDefaultSearchName } from "@/lib/store";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";
import googleIcon from "@/assets/Google_Favicon_2025.svg.asset.json";
import { useHasSession } from "@/lib/queries/useHasSession";
import { accessQueryKey, accessQueryOptions } from "@/lib/queries/access";
import { commitOnboarding, getSearchFreshness } from "@/lib/onboarding.functions";
import { pickSuccessVariant, successConfig } from "@/lib/onboarding/successVariant";
import type { AccessState } from "@/lib/profile.functions";


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
  intro: { name: "Intro", price: { monthly: "$0", annual: "$0" }, suffix: "for 3 days" },
  pro: { name: "Pro", price: { monthly: "$14.99", annual: "$7.99" }, suffix: "/month" },
};

const PLAN_VARIANT: Record<Plan, "light" | "warm" | "cool"> = {
  intro: "light",
  pro: "warm",
};

const AMENITY_LABELS: Record<string, string> = Object.fromEntries(

  AMENITY_GROUPS.flatMap((g) => g.items.map((i) => [i.id, i.label])),
);

const money = (n: number) => `$${n.toLocaleString("en-US")}`;

function Success() {
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const qc = useQueryClient();
  const hasSession = useHasSession();
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
    frequency,
  } = useOnboardingStore();

  const accessQ = useQuery({
    ...accessQueryOptions(),
    enabled: hasSession,
    retry: false,
  });
  const access = (accessQ.data ?? null) as AccessState | null;

  const variant = pickSuccessVariant(hasSession ? access : null);
  const cfg = successConfig(variant, access);

  const freshnessQ = useQuery({
    queryKey: ["search-freshness"],
    queryFn: () => getSearchFreshness(),
    enabled: hasSession && cfg.showExistingSearches,
    retry: false,
    staleTime: 60_000,
  });

  const commit = useServerFn(commitOnboarding);

  const cityConfig = getCity(city);
  const plan = (access?.plan ?? selectedPlan ?? "intro") as Plan;
  const cycle = (access?.billingCycle ?? billingCycle) as "monthly" | "annual";
  const planMeta = PLAN_META[plan];
  const planVariant = PLAN_VARIANT[plan];
  const isPaid = plan !== "intro";
  const dark = planVariant !== "light";

  const cardStyle: React.CSSProperties = dark
    ? {
        backgroundColor: "#2c2415",
        backgroundImage: WARM_BG,
        boxShadow:
          "0px 2px 1px rgba(36,28,18,0.08), 0px 24px 14px rgba(36,28,18,0.28)",
        color: "#f8f3e1",
        borderRadius: 24,
      }
    : {
        background: "#ffffff",
        border: "1px solid rgba(0,0,0,0.20)",
        color: "#241c12",
        borderRadius: 24,
      };

  const ink = dark ? "#f8f3e1" : "#241c12";
  const muted = dark ? "rgba(248,243,225,0.72)" : "#5a5a55";
  const subtle = dark ? "rgba(248,243,225,0.70)" : "#5a5a55";


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

  const accountEmail = access?.email ?? "";

  async function onGoogle() {
    setBusy(true);
    try {
      sessionStorage.setItem("nook:postAuthPath", "/onboarding/success");
      if (cfg.lockEmail && accountEmail) {
        sessionStorage.setItem("nook:expectedEmail", accountEmail);
      } else {
        sessionStorage.removeItem("nook:expectedEmail");
      }
    } catch {
      /* ignore */
    }
    const res = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/auth/callback",
      ...(cfg.lockEmail && accountEmail
        ? { extraParams: { login_hint: accountEmail, prompt: "select_account" } }
        : {}),
    });
    setBusy(false);
    if (res?.error) {
      toast.error("Google sign up failed", { description: res.error.message });
      return;
    }
    if (res?.redirected) return;

    // Popup flow: the session is already set here, so the lock has to be
    // enforced on this path too — the callback route never runs.
    if (cfg.lockEmail && accountEmail) {
      const { data } = await supabase.auth.getSession();
      const got = data.session?.user.email ?? "";
      if (got && got.toLowerCase() !== accountEmail.toLowerCase()) {
        await supabase.auth.signOut();
        try {
          sessionStorage.removeItem("nook:expectedEmail");
        } catch {
          /* ignore */
        }
        toast.error("Wrong Google account", {
          description: `That Google account is ${got}. Your subscription is on ${accountEmail} — use that account, or pick a password instead.`,
        });
        return;
      }
      try {
        sessionStorage.removeItem("nook:expectedEmail");
      } catch {
        /* ignore */
      }
    }
    navigate({ to: "/onboarding/success", replace: true });
  }

  /**
   * The single write point. Search insert + `completed_at` are committed
   * together server-side; `completed_at` means "finished setting up", so it is
   * written before checkout — an abandoned payment returns as an onboarded user
   * who owes payment, not into onboarding again.
   */
  async function onPrimary() {
    if (busy) return;
    setBusy(true);
    try {
      if (cfg.commitOnCta) {
        const o = useOnboardingStore.getState();
        const payload =
          o.city && !o.handoffCompleted
            ? {
                name: getDefaultSearchName(o.city, []),
                cityId: o.city,
                budget: o.budget,
                moveIn: o.moveIn,
                bedrooms: o.bedrooms,
                bathrooms: o.bathrooms,
                rentProtection: o.rentProtection,
                includeBrokerFee: o.includeBrokerFee,
                neighborhoods: o.neighborhoods,
                amenities: o.amenities,
                transit: o.transit,
                commute: o.commute,
                frequency: o.frequency ?? frequency,
              }
            : null;

        const res = await commit({ data: { search: payload, phone: o.phone || undefined } });
        if (res?.searchId) {
          useOnboardingStore.getState().setHandoffCompleted(true);
          useOnboardingStore.getState().setEditingSearch(res.searchId);
        }
        if (res?.completedAt) {
          useOnboardingStore.getState().set("completedAt", res.completedAt);
        }
        await qc.invalidateQueries({ queryKey: accessQueryKey });
      }
      navigate({ to: cfg.ctaTarget, replace: cfg.ctaTarget === "/home" });
    } catch (e) {
      toast.error("We couldn't finish setting up", {
        description: e instanceof Error ? e.message : "Please try again.",
      });
    } finally {
      setBusy(false);
    }
  }

  const freshness = freshnessQ.data ?? [];

  return (
    <>
    <motion.div
      variants={stepVariants}
      initial={stepVariants ? "hidden" : undefined}
      animate={stepVariants ? "visible" : undefined}
      className="mx-auto w-full max-w-[800px] pb-[104px]"
    >
      <motion.div variants={sectionVariants}>
        <h1 className="font-display ob-h1" style={OB_H1}>
          {cfg.heading}
        </h1>
        <p style={OB_SUB}>{cfg.sub}</p>
      </motion.div>

      {/* Chosen plan */}
      {cfg.showPlan && (
      <motion.div
        variants={sectionVariants}
        className="mt-8 p-8"
        style={cardStyle}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div
              className="text-[11px] font-semibold uppercase tracking-[0.16em]"
              style={{ color: muted }}
            >
              Your plan
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span
                className="font-display"
                style={{ fontWeight: 700, fontSize: 26, color: ink }}
              >
                {planMeta.name}
                {isPaid && cycle === "annual" ? " (annual)" : ""}
              </span>
              <span
                className="text-[16px] font-semibold"
                style={{ color: ink }}
              >
                {planMeta.price[cycle]}
              </span>
              <span className="text-[14px]" style={{ color: subtle }}>
                {planMeta.suffix}
              </span>
            </div>
            {isPaid && (
              <div
                className="mt-1 text-[14px]"
                style={{ color: muted }}
              >
                {trialActive ? "3-day free trial, then " : ""}
                billed {cycle === "annual" ? "annually" : "monthly"} · cancel anytime
              </div>
            )}
          </div>
          {cfg.allowChangePlan ? (
            <OriginButton
              size="medium"
              variant={plan === "pro" ? "premium" : "tertiary"}
              style={{ borderRadius: 12 }}
              onClick={() => navigate({ to: "/onboarding/pricing" })}
            >
              Change plan
            </OriginButton>
          ) : (
            <div className="max-w-[88px] text-[14px]" style={{ color: muted }}>
              You will be able to change the plan in your Account
            </div>
          )}
        </div>
      </motion.div>
      )}


      {/* Summary */}
      {cfg.showSummary && (
      <motion.div
        variants={sectionVariants}
        className="mt-12 overflow-hidden rounded-[16px] border border-black/20 bg-white"
      >
        <div className="flex items-center justify-between border-b border-black/10 px-6 py-4">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-charcoal-500">
            Your search
          </div>
          <Link
            to="/onboarding/step/$step"
            params={{ step: "1" }}
            className="text-[13px] font-semibold text-charcoal-500 underline decoration-black/20 hover:text-charcoal-950"
          >
            Edit
          </Link>
        </div>
        <dl className="divide-y divide-black/10">
          {rows.map((r) => (
            <div
              key={r.label}
              className="flex flex-col gap-1 px-6 py-3 sm:flex-row sm:items-baseline sm:gap-6"
            >
              <dt className="w-[168px] shrink-0 text-[14px] text-charcoal-500">{r.label}</dt>
              <dd className="m-0 flex-1 text-[16px] text-charcoal-950">{r.value}</dd>
            </div>
          ))}
        </dl>
      </motion.div>
      )}

      {/* Existing searches + freshness (reactivation) */}
      {cfg.showExistingSearches && (
        <motion.div
          variants={sectionVariants}
          className="mt-12 overflow-hidden rounded-[16px] border border-black/20 bg-white"
        >
          <div className="border-b border-black/10 px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-charcoal-500">
            Your searches
          </div>
          <ul className="m-0 list-none divide-y divide-black/10 p-0">
            {freshnessQ.isLoading && (
              <li className="px-6 py-4 text-[14px] text-charcoal-500">Checking for new matches…</li>
            )}
            {freshness.map((f) => {
              const searchCity = getCity(f.cityId as never) as { displayName?: string } | null;
              return (
                <li key={f.searchId} className="px-6 py-4">
                  <div className="text-[16px] font-semibold text-charcoal-950">{f.name}</div>
                  <div className="mt-1 text-[14px] text-charcoal-500">
                    {f.count != null
                      ? `${f.count} new ${f.count === 1 ? "match" : "matches"} in the last ${
                          f.window === "24h" ? "24 hours" : "7 days"
                        }`
                      : `${searchCity?.displayName ?? f.cityId} · we're watching your saved criteria`}
                  </div>
                </li>
              );
            })}
            {!freshnessQ.isLoading && freshness.length === 0 && (
              <li className="px-6 py-4 text-[14px] text-charcoal-500">
                Your saved searches are ready to resume.
              </li>
            )}
          </ul>
        </motion.div>
      )}


      </motion.div>

      {/* Sticky bottom bar */}
      <div
        className="fixed bottom-0 left-1/2 z-40 w-full max-w-[800px] -translate-x-1/2"
        style={{
          padding: "40px 20px 24px",
          background:
            "linear-gradient(180deg, rgba(250,246,238,0) 0%, #FAF6EE 16%, #FAF6EE 100%)",
        }}
      >
        <div className="flex flex-col items-center gap-4">
          {cfg.showAuth ? (
            <>
              {variant === "B" && accountEmail ? (
                <div className="w-full">
                  <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8a8177]">
                    Paid with
                  </p>
                  <p className="m-0 mt-1 text-[16px] font-semibold text-charcoal-950">
                    {accountEmail}
                  </p>
                  <p className="m-0 mt-2 text-[14px] leading-[1.45] text-[#6e6459]">
                    Your subscription is on this email. Pick a password for it, or continue with the
                    Google account that uses it.
                  </p>
                </div>
              ) : null}

              <div className="flex w-full gap-3">
                <OriginButton
                  type="button"
                  variant="tertiary"
                  size="big"
                  className="flex-1"
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
                  className="flex-1"
                  disabled={busy}
                  onClick={() =>
                    navigate({
                      to: "/signup",
                      search: {
                        redirect: "/onboarding/success",
                        ...(cfg.lockEmail ? { lockEmail: 1 as const } : {}),
                      },
                    })
                  }
                >
                  <Mail className="h-4 w-4" />
                  <span>{cfg.lockEmail ? "Pick a password" : "Continue with email"}</span>
                </OriginButton>
              </div>

              {variant === "B" ? null : (
              <p className="m-0 text-center text-[14px] text-[#6e6459]">
                Already have an account?{" "}
                <Link to="/login" search={{ redirect: "/onboarding/success" }} className="text-charcoal-950 underline">
                  Sign in
                </Link>
              </p>
              )}
            </>
          ) : (
            <OriginButton
              type="button"
              variant="main"
              size="big"
              className="w-full"
              disabled={busy || accessQ.isLoading}
              onClick={onPrimary}
            >
              {busy ? "Setting things up…" : cfg.ctaLabel}
            </OriginButton>
          )}
        </div>
      </div>
    </>
  );
}
