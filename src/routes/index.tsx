import { createFileRoute } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { HeroDemo } from "@/components/landing/HeroDemo";
import { UrgencyStrip } from "@/components/landing/UrgencyStrip";
import { HowItWorksSection } from "@/components/marketing/HowItWorksSection";
import { SourcesSection } from "@/components/marketing/SourcesSection";
import { StatsSection } from "@/components/marketing/StatsSection";
import { PricingSection } from "@/components/marketing/PricingSection";
import { FaqSection } from "@/components/marketing/FaqSection";
import { CtaStrip } from "@/components/marketing/CtaStrip";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nook — Real-time apartment alerts in 10 US cities" },
      {
        name: "description",
        content:
          "Stop refreshing listings. Get real-time alerts for rent-stabilized and market-rate apartments in NYC, LA, SF Bay, Chicago, DC, Boston, Seattle, Miami, Austin & Philadelphia. Free tier · Premium $14.99/mo.",
      },
      { property: "og:title", content: "Nook — Real-time apartment alerts" },
      {
        property: "og:description",
        content:
          "Real-time alerts the moment a rent-stabilized or market-rate listing hits 100+ rental sources. Median delivery: 47 seconds.",
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
      <section id="hero" className="scroll-mt-20">
        <HeroDemo />
      </section>
      <UrgencyStrip />
      <HowItWorksSection />
      <SourcesSection />
      <StatsSection />
      <PricingSection />
      <FaqSection />
      <CtaStrip />
    </MarketingLayout>
  );
}
