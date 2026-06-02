import { createFileRoute } from "@tanstack/react-router";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

export const Route = createFileRoute("/do-not-sell")({
  head: () => ({
    meta: [
      { title: "Your Privacy Choices — Nook" },
      { name: "description", content: "Exercise your CCPA / state privacy rights, including 'Do Not Sell or Share My Personal Information'." },
      { property: "og:title", content: "Your Privacy Choices — Nook" },
      { property: "og:description", content: "Exercise your CCPA / state privacy rights with Nook." },
    ],
  }),
  component: DoNotSellPage,
});

function DoNotSellPage() {
  return (
    <LegalPageLayout title="Your Privacy Choices" lastUpdated="July 2, 2026" draft={false}>
      <p>
        If you are a California resident — or are covered by another US state
        privacy law (CPRA, VCDPA, CPA, CTDPA, UCPA, TDPSA, OCPA) — you can
        request that we stop selling or sharing your personal information for
        cross-context behavioral advertising, and exercise other privacy rights.
      </p>
      <p>
        The interactive request form is coming soon. In the meantime, email{" "}
        <a href="mailto:privacy@thenook.rent">privacy@thenook.rent</a> with the
        subject line <strong>"Privacy Request"</strong> and include:
      </p>
      <ul>
        <li>Your full name and email address on file</li>
        <li>State of residence</li>
        <li>Which rights you want to exercise (opt-out, know, delete, correct, portability, limit sensitive data)</li>
        <li>Whether you are submitting on behalf of someone else</li>
      </ul>
      <p>
        We acknowledge requests within 10 business days and respond within 45
        days, in accordance with applicable law.
      </p>
      <h2>Global Privacy Control (GPC)</h2>
      <p>
        Nook honors the GPC browser signal. When detected, we automatically
        treat your visit as an opt-out of sale and sharing.
      </p>
    </LegalPageLayout>
  );
}
