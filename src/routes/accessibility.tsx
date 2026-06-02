import { createFileRoute } from "@tanstack/react-router";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

export const Route = createFileRoute("/accessibility")({
  head: () => ({
    meta: [
      { title: "Accessibility Statement — Nook" },
      { name: "description", content: "Nook's commitment to digital accessibility." },
      { property: "og:title", content: "Accessibility Statement — Nook" },
      { property: "og:description", content: "Nook's commitment to digital accessibility." },
    ],
  }),
  component: AccessibilityPage,
});

function AccessibilityPage() {
  return (
    <LegalPageLayout title="Accessibility Statement" lastUpdated="July 2, 2026">
      {/* Replace before launch — to be drafted by legal counsel */}
      <p>
        Nook is committed to ensuring digital accessibility for people with
        disabilities. We aim to conform to WCAG 2.1 Level AA.
      </p>
      <h2>Feedback</h2>
      <p>
        If you encounter an accessibility barrier on Nook, please contact us at
        accessibility@thenook.rent and we will work to resolve it.
      </p>
      <h2>Alternative formats</h2>
      <p>
        We can provide information from this site in alternative formats on
        request.
      </p>
    </LegalPageLayout>
  );
}
