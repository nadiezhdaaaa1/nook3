import { createFileRoute } from "@tanstack/react-router";
import { MockRepairScreen } from "@/components/billing/MockRepairScreen";

export const Route = createFileRoute("/billing/mock-portal")({
  head: () => ({
    meta: [
      { title: "Update payment method — Nook" },
      {
        name: "description",
        content: "Development stand-in for the Stripe Billing Portal. No real payment is taken.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Update payment method — Nook" },
      {
        property: "og:description",
        content: "Development stand-in for the Stripe Billing Portal.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <MockRepairScreen mode="portal" />,
});
