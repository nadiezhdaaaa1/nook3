import { createFileRoute } from "@tanstack/react-router";
import { MockRepairScreen } from "@/components/billing/MockRepairScreen";

export const Route = createFileRoute("/billing/mock-invoice")({
  head: () => ({
    meta: [
      { title: "Confirm payment — Nook" },
      {
        name: "description",
        content: "Development stand-in for the Stripe hosted invoice page. No real payment is taken.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Confirm payment — Nook" },
      {
        property: "og:description",
        content: "Development stand-in for the Stripe hosted invoice page.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <MockRepairScreen mode="invoice" />,
});
