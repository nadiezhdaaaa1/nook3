import { createFileRoute } from "@tanstack/react-router";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

export const Route = createFileRoute("/dmca")({
  head: () => ({
    meta: [
      { title: "DMCA Policy — Nook" },
      { name: "description", content: "How to submit a copyright takedown notice to Nook." },
      { property: "og:title", content: "DMCA Policy — Nook" },
      { property: "og:description", content: "How to submit a copyright takedown notice to Nook." },
    ],
  }),
  component: DmcaPage,
});

function DmcaPage() {
  return (
    <LegalPageLayout title="DMCA Policy" lastUpdated="July 2, 2026">
      {/* Replace before launch — to be drafted by legal counsel */}
      <h2>Filing a copyright infringement notice</h2>
      <p>
        If you believe content on Nook infringes your copyright, send a written
        notice that includes the elements required by 17 U.S.C. § 512(c)(3) to
        our designated agent.
      </p>
      <h2>Designated agent</h2>
      <p>
        DMCA Agent, Zentaro Systems Ltd<br />
        dmca@thenook.rent
      </p>
      <h2>Counter-notice</h2>
      <p>Placeholder.</p>
      <h2>Repeat infringers</h2>
      <p>Placeholder.</p>
    </LegalPageLayout>
  );
}
