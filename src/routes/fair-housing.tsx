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
    <LegalPageLayout title="Fair Housing Statement" lastUpdated="August 19, 2026">
      <h2>Our Commitment</h2>
      <p>
        Nook supports equal housing opportunity. We comply with the federal Fair Housing Act
        (42 U.S.C. § 3601 et seq.) and applicable state and local fair housing laws.
      </p>
      <p>
        We do not discriminate, and we do not knowingly facilitate discrimination, on the basis
        of:
      </p>
      <p><strong>Federally protected categories</strong></p>
      <ul>
        <li>Race</li>
        <li>Color</li>
        <li>National origin</li>
        <li>Religion</li>
        <li>Sex (including sexual orientation and gender identity)</li>
        <li>Familial status</li>
        <li>Disability</li>
      </ul>
      <p><strong>Additional categories protected in many states and localities</strong></p>
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
        behalf of landlords. We aggregate rental information from licensed sources and notify
        subscribers when listings matching their criteria become available.
      </p>
      <h3>Filter Choices</h3>
      <p>
        Our filtering options reflect typical legal rental criteria: price, size, location, and
        amenities. We do not offer filters that would directly or indirectly discriminate
        against protected categories.
      </p>

      <h2>How Our Matching System Is Built</h2>
      <p>
        Our system scores each listing against the criteria you set, and the information
        available to that scoring process is deliberately limited.
      </p>
      <p>
        The following are not available to it, and cannot be used to rank or filter listings:
      </p>
      <ul>
        <li>School ratings</li>
        <li>Crime statistics or neighborhood “safety” scores</li>
        <li>Demographic data about neighborhoods or buildings</li>
        <li>
          Any data describing the people who live in an area rather than the property itself
        </li>
      </ul>
      <p>
        This is a technical restriction rather than an internal instruction: the scoring process
        does not receive these categories of information at all.
      </p>
      <p>
        The list of categories excluded in each market is maintained separately for each city we
        serve, because protected categories differ between jurisdictions. We review that list
        before opening a new city.
      </p>

      <h2>What We Do</h2>
      <ul>
        <li>Treat all users equally regardless of protected status</li>
        <li>Provide the same access to listings and features to all subscribers on the same plan</li>
        <li>Do not display “preferences” for or against protected groups</li>
        <li>Do not rank or describe neighborhoods as better or worse than one another</li>
        <li>
          Where the Service includes an AI assistant, restrict it from using protected
          characteristics, or proxies for them, to rank, filter, recommend, or otherwise
          influence housing-related results.
        </li>
        <li>Investigate reports of discrimination</li>
      </ul>

      <h2>What We Cannot Verify</h2>
      <p>
        We cannot verify the fair housing practices of every landlord or agent whose listings
        appear in our system. Landlord conduct in tenant selection is outside our control.
      </p>
      <p>
        If you encounter discriminatory conduct from a landlord, agent, or building in connection
        with a listing you found through Nook, please report it to us and consider filing a
        complaint with the relevant authorities.
      </p>

      <h2>Reporting Discrimination</h2>
      <h3>Report to Nook</h3>
      <p>
        If you believe a listing, landlord, or other party connected with Nook has engaged in
        discrimination, contact us:
      </p>
      <p>
        <strong>Email:</strong> <a href="mailto:legal@thenook.rent">legal@thenook.rent</a>
        <br />
        <strong>Mail:</strong> Fair Housing Reports, NORELIX LIMITED, The Black Church, St.
        Mary’s Place, Dublin 7, D07 P4AX, Ireland
      </p>
      <p>Please include:</p>
      <ul>
        <li>The listing or party involved</li>
        <li>A description of the conduct</li>
        <li>Dates and locations</li>
        <li>Any supporting documentation</li>
        <li>Your contact information, or anonymous if you prefer</li>
      </ul>
      <p>
        We will review reports and take appropriate action, which may include removing or
        suppressing listings from the Service, restricting accounts where applicable, and
        reporting matters to relevant authorities.
      </p>

      <h3>Report to Federal and State Authorities</h3>
      <p>
        <strong>U.S. Department of Housing and Urban Development (HUD)</strong>
      </p>
      <ul>
        <li>Phone: 1-800-669-9777 (toll-free)</li>
        <li>TTY: 1-800-927-9275</li>
        <li>
          Online:{" "}
          <a href="https://www.hud.gov/fairhousing" target="_blank" rel="noopener noreferrer">
            hud.gov/fairhousing
          </a>
        </li>
      </ul>
      <p>
        <strong>State fair housing agencies.</strong> Many states have their own fair housing
        agencies. HUD publishes a list of its Fair Housing Assistance Program partners.
      </p>
      <p>
        <strong>State attorneys general.</strong> You can also contact your state attorney
        general’s office, which often handles fair housing complaints.
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
        <strong>Email:</strong> <a href="mailto:legal@thenook.rent">legal@thenook.rent</a>
        <br />
        <strong>General:</strong> <a href="mailto:hello@thenook.rent">hello@thenook.rent</a>
      </p>
    </LegalPageLayout>
  );
}
