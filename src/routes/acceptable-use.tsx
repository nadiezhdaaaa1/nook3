import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

export const Route = createFileRoute("/acceptable-use")({
  head: () => ({
    meta: [
      { title: "Acceptable Use Policy — Nook" },
      { name: "description", content: "Rules for using the Nook Service." },
      { property: "og:title", content: "Acceptable Use Policy — Nook" },
      { property: "og:description", content: "Rules for using the Nook Service." },
      { property: "og:url", content: "https://thenook.rent/acceptable-use" }
    ],
    links: [{ rel: "canonical", href: "https://thenook.rent/acceptable-use" }],
  }),
  component: AcceptableUsePage,
});

function AcceptableUsePage() {
  return (
    <LegalPageLayout title="Acceptable Use Policy" lastUpdated="July 2, 2026">
      <p>
        This Acceptable Use Policy ("AUP") applies to all users of Nook, operated by Zentaro
        Systems Ltd. By using the Service, you agree to comply with this AUP. Violations may
        result in account suspension or termination as set out in our{" "}
        <Link to="/terms">Terms of Service</Link>.
      </p>

      <h2>1. General Principles</h2>
      <p>
        Use Nook for its intended purpose: finding rental housing for yourself. Don't use Nook
        to harm others, harm Nook, or circumvent how the Service is designed to work.
      </p>

      <h2>2. Prohibited Activities</h2>
      <p>You may not use Nook to:</p>

      <h3>2.1 Violate Laws</h3>
      <ul>
        <li>Engage in illegal discrimination in housing (Fair Housing Act, state and local laws)</li>
        <li>Solicit illegal activity</li>
        <li>Violate any other applicable law</li>
      </ul>

      <h3>2.2 Misuse Data and Listings</h3>
      <ul>
        <li>Scrape, harvest, or extract listings or other Service data by automated means</li>
        <li>Copy, redistribute, republish, or resell listings or alerts</li>
        <li>Use Service data to train AI models, build competing products, or aggregate for commercial purposes</li>
        <li>Bypass rate limits, paywalls, or access controls</li>
        <li>Reverse engineer, decompile, or extract source code from the Service</li>
      </ul>

      <h3>2.3 Misuse Accounts</h3>
      <ul>
        <li>Create accounts by automated means</li>
        <li>Maintain more than one account per person (other than expressly permitted multi-seat plans)</li>
        <li>Share account credentials with others (other than expressly permitted multi-seat plans)</li>
        <li>Sell, rent, or transfer your account</li>
        <li>Impersonate any person or entity</li>
        <li>Provide false information during signup or in your profile</li>
      </ul>

      <h3>2.4 Abuse the Service</h3>
      <ul>
        <li>Send unsolicited messages through the Service</li>
        <li>Harass, threaten, defame, or harm any user, landlord, agent, or Nook employee</li>
        <li>Submit fraudulent move-out listings, reviews, or referrals</li>
        <li>Manipulate referral programs through fake accounts or self-referrals</li>
        <li>Use abusive, hateful, or harassing language with Wren AI or in support communications</li>
        <li>Submit false reports of listings or other content</li>
      </ul>

      <h3>2.5 Compromise Security</h3>
      <ul>
        <li>Transmit viruses, malware, ransomware, or other harmful code</li>
        <li>Attempt to access accounts, systems, or data you are not authorized to access</li>
        <li>Probe, scan, or test vulnerabilities without our written permission</li>
        <li>Interfere with or disrupt the Service or its infrastructure</li>
        <li>Circumvent authentication, authorization, or rate-limiting</li>
      </ul>

      <h3>2.6 Misuse Wren AI</h3>
      <ul>
        <li>Attempt to extract Wren's system prompts, training data, or model weights</li>
        <li>Use Wren AI to generate harmful, illegal, or discriminatory content</li>
        <li>Submit prompts designed to elicit unsafe outputs</li>
        <li>Rely on Wren AI for legal, financial, medical, or other professional advice without verifying with a qualified professional</li>
      </ul>

      <h3>2.7 Misuse Move-Out Listings</h3>
      <ul>
        <li>Submit listings for properties you do not occupy or have permission to share</li>
        <li>List properties not actually available for rent</li>
        <li>Misrepresent rent, availability, or property details</li>
        <li>Discriminate in tenant selection in violation of Fair Housing laws</li>
        <li>Use move-out listings to harvest contact information for unrelated purposes</li>
      </ul>

      <h2>3. Reporting Violations</h2>
      <p>
        If you believe a user is violating this AUP, report it to{" "}
        <a href="mailto:legal@thenook.rent">legal@thenook.rent</a>. Include:
      </p>
      <ul>
        <li>The user's identifier (if known)</li>
        <li>A description of the violation</li>
        <li>Any supporting evidence</li>
        <li>Your contact information</li>
      </ul>
      <p>
        We investigate reports and take action as appropriate. We may not disclose
        investigation outcomes to reporters.
      </p>

      <h2>4. Enforcement</h2>
      <p>
        If we determine you have violated this AUP, we may, at our discretion and depending on
        severity:
      </p>
      <ul>
        <li>Issue a warning</li>
        <li>Temporarily restrict access to features</li>
        <li>Suspend your account</li>
        <li>Terminate your account</li>
        <li>Reverse referral rewards or other benefits</li>
        <li>Refer the matter to law enforcement</li>
        <li>Take other action permitted by our Terms of Service or law</li>
      </ul>
      <p>
        We may take action without prior notice for serious violations (e.g., security
        threats, fraud, illegal activity).
      </p>
      <p>
        You may appeal enforcement decisions by emailing{" "}
        <a href="mailto:legal@thenook.rent">legal@thenook.rent</a> within 30 days. Appeals
        are reviewed by someone not involved in the original decision.
      </p>

      <h2>5. Changes to This AUP</h2>
      <p>
        We may update this AUP from time to time. Material changes will be communicated by
        email or in-product notice. Continued use of the Service after a change takes effect
        constitutes acceptance.
      </p>

      <h2>6. Contact</h2>
      <p>Questions about this AUP?</p>
      <p>
        <strong>General:</strong> <a href="mailto:hello@thenook.rent">hello@thenook.rent</a>
        <br />
        <strong>Report abuse:</strong>{" "}
        <a href="mailto:legal@thenook.rent">legal@thenook.rent</a>
        <br />
        <strong>Appeals:</strong>{" "}
        <a href="mailto:legal@thenook.rent">legal@thenook.rent</a>
      </p>
    </LegalPageLayout>
  );
}
