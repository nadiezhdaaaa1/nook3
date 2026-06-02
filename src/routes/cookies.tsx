import { createFileRoute } from "@tanstack/react-router";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

export const Route = createFileRoute("/cookies")({
  head: () => ({
    meta: [
      { title: "Cookie Policy — Nook" },
      { name: "description", content: "How Nook uses cookies and similar technologies." },
      { property: "og:title", content: "Cookie Policy — Nook" },
      { property: "og:description", content: "How Nook uses cookies and similar technologies." },
    ],
  }),
  component: CookiesPage,
});

function CookiesPage() {
  return (
    <LegalPageLayout title="Cookie Policy" lastUpdated="July 2, 2026">
      {/* Replace before launch — to be drafted by legal counsel */}
      <h2>What are cookies?</h2>
      <p>Placeholder.</p>
      <h2>Categories of cookies we use</h2>
      <ul>
        <li><strong>Strictly necessary</strong> — required for the site to function.</li>
        <li><strong>Performance &amp; analytics</strong> — help us understand usage.</li>
        <li><strong>Functional</strong> — remember your preferences.</li>
        <li><strong>Targeting &amp; advertising</strong> — used for personalized ads.</li>
      </ul>
      <h2>Manage your preferences</h2>
      <p>
        You can change your choices at any time using the{" "}
        <strong>Manage cookie preferences</strong> button below (coming soon).
      </p>
      <h2>Contact</h2>
      <p>privacy@thenook.rent</p>
    </LegalPageLayout>
  );
}
