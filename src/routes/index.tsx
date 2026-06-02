import { createFileRoute } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { HeroCityAware } from "@/components/landing/HeroCityAware";
import { HowItWorksThreeSteps } from "@/components/landing/HowItWorksThreeSteps";
import { WhatYouGetGrid } from "@/components/landing/WhatYouGetGrid";
import { TiredOfSection } from "@/components/landing/TiredOfSection";
import { ReviewsMasonry } from "@/components/landing/ReviewsMasonry";
import { PricingThreeTiers } from "@/components/landing/PricingThreeTiers";
import { FaqFifteen } from "@/components/landing/FaqFifteen";
import { BlogTeaser } from "@/components/landing/BlogTeaser";
import { CtaStrip } from "@/components/marketing/CtaStrip";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nook — Find your next apartment before it's gone" },
      {
        name: "description",
        content:
          "Nook watches the rental market 24/7 and pings you the moment a real match appears. Verified listings, rent-regulated units flagged, no spam. Free tier · Premium $14.99/mo.",
      },
      { property: "og:title", content: "Nook — Find your next apartment before it's gone" },
      {
        property: "og:description",
        content:
          "Real-time alerts the moment a verified rental match appears in your city. Built for renters who are tired of refreshing.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://nook3.lovable.app/" },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <MarketingLayout>
      <HeroCityAware />
      <HowItWorksThreeSteps />
      <WhatYouGetGrid />
      <TiredOfSection />
      <PricingThreeTiers />
      <ReviewsMasonry />
      <FaqFifteen />
      <BlogTeaser />
      <CtaStrip />
    </MarketingLayout>
  );
}
