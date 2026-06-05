import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

export const Route = createFileRoute("/fair-housing")({
  head: () => ({
    meta: [
      { title: "Fair Housing Statement — Nook" },
      { name: "description", content: "Nook's commitment to equal housing opportunity and non-discrimination." },
      { property: "og:title", content: "Fair Housing Statement — Nook" },
      { property: "og:description", content: "Nook's commitment to equal housing opportunity and non-discrimination." },
      { property: "og:url", content: "https://thenook.rent/fair-housing" }
    ],
    links: [{ rel: "canonical", href: "https://thenook.rent/fair-housing" }],
  }),
  component: FairHousingPage,
});

function FairHousingPage() {
  return (
    <LegalPageLayout title="Fair Housing Statement" lastUpdated="July 2, 2026">
      <h2>Our Commitment</h2>
      <p>
        Nook supports equal housing opportunity. We comply with the federal Fair Housing Act
        (42 U.S.C. § 3601 et seq.) and applicable state and local fair housing laws.
      </p>
      <p>
        We do not discriminate, and we do not knowingly facilitate discrimination, on the
        basis of:
      </p>
      <p><strong>Federally protected categories:</strong></p>
      <ul>
        <li>Race</li>
        <li>Color</li>
        <li>National origin</li>
        <li>Religion</li>
        <li>Sex (including sexual orientation and gender identity)</li>
        <li>Familial status</li>
        <li>Disability</li>
      </ul>
      <p><strong>Additional categories protected in many states and localities:</strong></p>
      <ul>
        <li>Age</li>
        <li>Marital status</li>
        <li>Source of income (including housing vouchers and Section 8)</li>
        <li>Military or veteran status</li>
        <li>Citizenship or immigration status</li>
        <li>Genetic information</li>
        <li>Domestic violence survivor status</li>
        <li>Arrest or conviction history (where applicable)</li>
        <li>Other categories protected under your state or local law</li>
      </ul>

      <h2>How This Applies to Nook</h2>
      <h3>Our Role</h3>
      <p>
        Nook is not a landlord, broker, or agent. We do not own, manage, or list properties on
        behalf of landlords. We aggregate publicly available rental information and notify
        subscribers when listings matching their criteria become available.
      </p>
      <h3>Filter Choices</h3>
      <p>
        Our filtering options reflect typical legal rental criteria (price, size, location,
        amenities). We do not offer filters that would directly or indirectly discriminate
        against protected categories.
      </p>
      <h3>What We Do</h3>
      <ul>
        <li>Treat all users equally regardless of protected status</li>
        <li>Provide the same access to listings and features to all qualifying subscribers</li>
        <li>Do not display "preferences" for or against protected groups</li>
        <li>Educate Wren AI to avoid discriminatory advice</li>
        <li>Investigate reports of discrimination</li>
      </ul>
      <h3>What We Cannot Verify</h3>
      <p>
        We cannot verify the fair housing practices of every landlord or agent whose listings
        appear in our system. Landlord conduct in tenant selection is outside our control.
      </p>
      <p>
        If you encounter discriminatory conduct from a landlord, agent, or building in
        connection with a listing you found through Nook, please report it (see below) and
        consider filing a complaint with the relevant authorities.
      </p>

      <h2>Reporting Discrimination</h2>
      <h3>Report to Nook</h3>
      <p>
        If you believe a listing, landlord, or other party connected with Nook has engaged in
        discrimination, contact us:
      </p>
      <p>
        <strong>Email:</strong>{" "}
        <a href="mailto:legal@thenook.rent">legal@thenook.rent</a>
        <br />
        <strong>Mail:</strong> Fair Housing Reports, Zentaro Systems Ltd, 167-169 Great Portland Street, 5th Floor, London, W1W 5PF,
        United Kingdom
      </p>
      <p>Please include:</p>
      <ul>
        <li>The listing or party involved</li>
        <li>A description of the conduct</li>
        <li>Dates and locations</li>
        <li>Any supporting documentation</li>
        <li>Your contact information (or anonymous if preferred)</li>
      </ul>
      <p>
        We will review reports and take appropriate action, which may include removing
        listings, banning users, and reporting to authorities.
      </p>

      <h3>Report to Federal and State Authorities</h3>
      <p><strong>U.S. Department of Housing and Urban Development (HUD)</strong></p>
      <ul>
        <li>Phone: 1-800-669-9777 (toll-free)</li>
        <li>TTY: 1-800-927-9275</li>
        <li>
          Online:{" "}
          <a href="https://www.hud.gov/fairhousing" target="_blank" rel="noopener noreferrer">
            https://www.hud.gov/fairhousing
          </a>
        </li>
      </ul>
      <p><strong>State Fair Housing Agencies</strong></p>
      <p>
        Many states have their own fair housing agencies. Visit{" "}
        <a
          href="https://www.hud.gov/program_offices/fair_housing_equal_opp/partners/FHAP"
          target="_blank"
          rel="noopener noreferrer"
        >
          HUD FHAP partners
        </a>{" "}
        for a list.
      </p>
      <p><strong>State Attorneys General</strong></p>
      <p>
        You can also contact your state attorney general's office, which often handles fair
        housing complaints.
      </p>

      <h2>Accessibility</h2>
      <p>
        We strive to make Nook accessible to users with disabilities. See our{" "}
        <Link to="/accessibility">Accessibility Statement</Link>.
      </p>
      <p>
        If you need assistance using Nook because of a disability, contact{" "}
        <a href="mailto:support@thenook.rent">support@thenook.rent</a>.
      </p>

      <h2>Equal Housing Opportunity Logo</h2>
      <p>
        We display the federal Equal Housing Opportunity logo on our site and marketing
        materials in support of the fair housing principles described above.
      </p>

      <h2>Questions</h2>
      <p>
        <strong>Email:</strong>{" "}
        <a href="mailto:legal@thenook.rent">legal@thenook.rent</a>
        <br />
        <strong>General:</strong> <a href="mailto:hello@thenook.rent">hello@thenook.rent</a>
      </p>
    </LegalPageLayout>
  );
}
