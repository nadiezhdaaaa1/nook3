import { createFileRoute } from "@tanstack/react-router";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

export const Route = createFileRoute("/refunds")({
  head: () => ({
    meta: [
      { title: "Refund Policy — Nook" },
      { name: "description", content: "Nook's refund and cancellation policy." },
      { property: "og:title", content: "Refund Policy — Nook" },
      { property: "og:description", content: "Nook's refund and cancellation policy." },
    ],
  }),
  component: RefundsPage,
});

function RefundsPage() {
  return (
    <LegalPageLayout title="Refund Policy" lastUpdated="July 2, 2026">
      {/* Replace before launch — to be drafted by legal counsel */}
      <h2>Free trial</h2>
      <p>
        Cancel any time during your free trial and you will not be charged.
      </p>
      <h2>Monthly subscriptions</h2>
      <p>
        Subscriptions are billed in advance. You can cancel any time; access
        continues until the end of the current billing period.
      </p>
      <h2>Annual subscriptions</h2>
      <p>Placeholder — typically a pro-rated refund window applies.</p>
      <h2>Requesting a refund</h2>
      <p>billing@thenook.rent</p>
    </LegalPageLayout>
  );
}
