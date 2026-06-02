import { createFileRoute } from "@tanstack/react-router";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Nook" },
      { name: "description", content: "How Nook collects, uses, and protects your personal information." },
      { property: "og:title", content: "Privacy Policy — Nook" },
      { property: "og:description", content: "How Nook collects, uses, and protects your personal information." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated="July 2, 2026" effective="July 9, 2026">
      {/* Replace before launch — to be drafted by legal counsel */}
      <h2>1. Information We Collect</h2>
      <p>Placeholder.</p>
      <h2>2. How We Use Your Information</h2>
      <p>Placeholder.</p>
      <h2>3. Cookies &amp; Tracking</h2>
      <p>Placeholder. See our <a href="/cookies">Cookie Policy</a>.</p>
      <h2>4. Sharing &amp; Disclosure</h2>
      <p>Placeholder. See our <a href="/subprocessors">Subprocessor List</a>.</p>
      <h2>5. Your Privacy Rights (CCPA, CPRA, GDPR)</h2>
      <p>
        Placeholder. California residents and residents of other US states with
        comprehensive privacy laws can submit requests via our{" "}
        <a href="/do-not-sell">Privacy Choices form</a>.
      </p>
      <h2>6. Data Retention</h2>
      <p>Placeholder.</p>
      <h2>7. Security</h2>
      <p>Placeholder.</p>
      <h2>8. International Transfers</h2>
      <p>Placeholder.</p>
      <h2>9. Children's Privacy</h2>
      <p>Placeholder.</p>
      <h2>10. Contact</h2>
      <p>privacy@thenook.rent</p>
    </LegalPageLayout>
  );
}
