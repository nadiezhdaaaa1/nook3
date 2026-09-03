import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { HeroAB } from "@/components/landing/HeroAB";
import { HowItWorksThreeSteps } from "@/components/landing/HowItWorksThreeSteps";
import { WhatYouGetGrid } from "@/components/landing/WhatYouGetGrid";
import { TiredOfSection } from "@/components/landing/TiredOfSection";
import { ReviewsMasonry } from "@/components/landing/ReviewsMasonry";
import { PricingThreeTiers, type Tier } from "@/components/landing/PricingThreeTiers";
import { FaqFifteen, FAQS } from "@/components/landing/FaqFifteen";
import { BlogTeaser } from "@/components/landing/BlogTeaser";
import { CtaStrip } from "@/components/marketing/CtaStrip";
import { RegistrationModal } from "@/components/auth/RegistrationModal";
import { usePlanFlow } from "@/lib/onboarding/usePlanFlow";
import type { Plan } from "@/lib/onboarding/store";

type LandingSearch = { plan?: Plan; cycle?: "monthly" | "annual" };

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): LandingSearch => ({
    plan: search.plan === "intro" || search.plan === "pro" ? search.plan : undefined,
    cycle: search.cycle === "monthly" || search.cycle === "annual" ? search.cycle : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Nook — Find your next apartment before it's gone" },
      {
        name: "description",
        content:
          "Nook watches the rental market 24/7 and pings you the moment a real match appears. Verified listings, rent-regulated units flagged, no spam. 3-day trial · Pro $14.99/mo.",
      },
      { property: "og:title", content: "Nook — Find your next apartment before it's gone" },
      {
        property: "og:description",
        content:
          "Real-time alerts the moment a verified rental match appears in your city. Built for renters who are tired of refreshing.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://thenook.rent/" },
    ],
    links: [{ rel: "canonical", href: "https://thenook.rent/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  const { plan, cycle } = Route.useSearch();
  const navigate = useNavigate();
  const cardFlow = usePlanFlow("landing_card");
  const funnelFlow = usePlanFlow("funnel_param");
  const funnelHandled = useRef(false);

  // Funnel arrival: ?plan=&cycle= behaves exactly like clicking the matching
  // card, then the params are dropped so a reload can't re-trigger it.
  useEffect(() => {
    if (!plan || funnelHandled.current) return;
    funnelHandled.current = true;
    const billingCycle = cycle ?? (plan === "pro" ? "monthly" : "monthly");
    void navigate({ to: "/", search: {}, replace: true }).then(() =>
      funnelFlow.selectPlan({ plan, billingCycle, trial: plan === "intro" }),
    );
  }, [plan, cycle, navigate, funnelFlow]);

  const onTierSelect = (tier: Tier) =>
    void cardFlow.selectPlan({
      plan: tier.plan,
      billingCycle: tier.billingCycle,
      trial: tier.id === "intro",
    });

  return (
    <MarketingLayout hideHeader>
      <HeroAB />

      <HowItWorksThreeSteps />
      <WhatYouGetGrid />
      <PricingThreeTiers onTierSelect={onTierSelect} />
      <ReviewsMasonry />
      <TiredOfSection />
      <FaqFifteen />
      <BlogTeaser />
      <CtaStrip />

      <RegistrationModal {...cardFlow.modalProps} />
      <RegistrationModal {...funnelFlow.modalProps} />
    </MarketingLayout>
  );
}
