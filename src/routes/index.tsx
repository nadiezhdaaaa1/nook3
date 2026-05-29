import { createFileRoute } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/marketing/MarketingLayout";
import { HeroSection } from "@/components/marketing/HeroSection";
import { HowItWorksSection } from "@/components/marketing/HowItWorksSection";
import { SourcesSection } from "@/components/marketing/SourcesSection";
import { StatsSection } from "@/components/marketing/StatsSection";
import { PricingSection } from "@/components/marketing/PricingSection";
import { FaqSection } from "@/components/marketing/FaqSection";
import { CtaStrip } from "@/components/marketing/CtaStrip";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nook — Be first to every apartment in NYC" },
      {
        name: "description",
        content:
          "Stop refreshing StreetEasy. Nook monitors 104+ NYC rental sources and alerts you the second a rent-stabilized listing or price drop matches your search.",
      },
      { property: "og:title", content: "Nook — Be first to every apartment in NYC" },
      {
        property: "og:description",
        content:
          "Real-time NYC apartment alerts. Rent-stabilized first. 53k+ renters trust Nook.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <MarketingLayout>
      <HeroSection />
      <HowItWorksSection />
      <SourcesSection />
      <StatsSection />
      <PricingSection />
      <FaqSection />
      <CtaStrip />
    </MarketingLayout>
  );
}
