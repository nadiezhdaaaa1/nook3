import { createFileRoute } from "@tanstack/react-router";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

export const Route = createFileRoute("/acceptable-use")({
  head: () => ({
    meta: [
      { title: "Acceptable Use Policy — Nook" },
      { name: "description", content: "What you can and cannot do when using Nook." },
      { property: "og:title", content: "Acceptable Use Policy — Nook" },
      { property: "og:description", content: "What you can and cannot do when using Nook." },
    ],
  }),
  component: AcceptableUsePage,
});

function AcceptableUsePage() {
  return (
    <LegalPageLayout title="Acceptable Use Policy" lastUpdated="July 2, 2026">
      {/* Replace before launch — to be drafted by legal counsel */}
      <h2>Prohibited activities</h2>
      <p>Placeholder.</p>
      <h2>Automated access &amp; scraping</h2>
      <p>Placeholder.</p>
      <h2>Reporting abuse</h2>
      <p>abuse@thenook.rent</p>
    </LegalPageLayout>
  );
}
