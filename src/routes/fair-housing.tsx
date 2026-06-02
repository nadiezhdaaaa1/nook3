import { createFileRoute } from "@tanstack/react-router";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

export const Route = createFileRoute("/fair-housing")({
  head: () => ({
    meta: [
      { title: "Fair Housing Statement — Nook" },
      { name: "description", content: "Nook's commitment to fair housing and equal opportunity." },
      { property: "og:title", content: "Fair Housing Statement — Nook" },
      { property: "og:description", content: "Nook's commitment to fair housing and equal opportunity." },
    ],
  }),
  component: FairHousingPage,
});

function FairHousingPage() {
  return (
    <LegalPageLayout title="Fair Housing Statement" lastUpdated="July 2, 2026">
      {/* Replace before launch — to be drafted by legal counsel */}
      <p>
        Nook is committed to the principles of the federal Fair Housing Act
        and to providing equal housing opportunity for all renters.
      </p>
      <h2>Protected categories</h2>
      <p>
        We do not discriminate based on race, color, religion, national origin,
        sex, familial status, disability, source of income, sexual orientation,
        gender identity, age, military status, or any other category protected
        by federal, state, or local law.
      </p>
      <h2>Reporting discrimination</h2>
      <p>
        If you believe you have experienced housing discrimination, contact us
        at fairhousing@thenook.rent. You may also file a complaint with the
        U.S. Department of Housing and Urban Development (HUD) at{" "}
        <a href="https://www.hud.gov/fairhousing" target="_blank" rel="noopener noreferrer">
          hud.gov/fairhousing
        </a>
        .
      </p>
    </LegalPageLayout>
  );
}
