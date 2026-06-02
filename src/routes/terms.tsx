import { createFileRoute } from "@tanstack/react-router";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Nook" },
      { name: "description", content: "The Terms of Service that govern your use of Nook." },
      { property: "og:title", content: "Terms of Service — Nook" },
      { property: "og:description", content: "The Terms of Service that govern your use of Nook." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <LegalPageLayout title="Terms of Service" lastUpdated="July 2, 2026" effective="July 9, 2026">
      {/* Replace before launch — to be drafted by legal counsel */}
      <h2>1. Acceptance of Terms</h2>
      <p>Placeholder. By creating an account or using Nook, you agree to these Terms.</p>
      <h2>2. Eligibility</h2>
      <p>Placeholder.</p>
      <h2>3. Account &amp; Security</h2>
      <p>Placeholder.</p>
      <h2>4. Subscriptions, Trials &amp; Billing</h2>
      <p>Placeholder. Includes auto-renewal terms in accordance with US state Automatic Renewal Laws.</p>
      <h2>5. Acceptable Use</h2>
      <p>Placeholder. See our Acceptable Use Policy for details.</p>
      <h2>6. Intellectual Property</h2>
      <p>Placeholder.</p>
      <h2>7. Disclaimers &amp; Limitation of Liability</h2>
      <p>Placeholder.</p>
      <h2>8. Termination</h2>
      <p>Placeholder.</p>
      <h2>9. Governing Law &amp; Disputes</h2>
      <p>Placeholder.</p>
      <h2>10. Changes to These Terms</h2>
      <p>Placeholder.</p>
    </LegalPageLayout>
  );
}
