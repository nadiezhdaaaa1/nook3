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
    <LegalPageLayout title="Acceptable Use Policy" lastUpdated="August 19, 2026">
      <p>
        This Acceptable Use Policy (“AUP”) applies to all users of Nook, operated by NORELIX LIMITED. By using the Service, you agree to comply with this AUP. Violations may result in account suspension or termination as set out in our <Link to="/terms">Terms of Service</Link>.
      </p>

      <h2>1. General Principles</h2>
      <p>Use Nook for its intended purpose: finding rental housing for yourself. Do not use Nook to harm others, to harm Nook, or to circumvent how the Service is designed to work.</p>

      <h2>2. Prohibited Activities</h2>
      <p>You may not use Nook to:</p>

      <h3>2.1 Violate Laws</h3>
      <ul>
        <li>Engage in illegal discrimination in housing, under the Fair Housing Act or state and local laws</li>
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
        <li>Maintain more than one account per person</li>
        <li>Share account credentials with others</li>
        <li>Sell, rent, or transfer your account</li>
        <li>Create additional accounts, or use additional payment methods, in order to obtain more than one introductory period</li>
        <li>Impersonate any person or entity</li>
        <li>Provide false information during signup or in your profile</li>
      </ul>

      <h3>2.4 Abuse the Service</h3>
      <ul>
        <li>Send unsolicited messages through the Service</li>
        <li>Harass, threaten, defame, or harm any user, landlord, agent, or Nook employee</li>
        <li>Submit fraudulent reviews or referrals</li>
        <li>Manipulate referral programmes through fake accounts or self-referrals</li>
        <li>Use abusive, hateful, or harassing language in support communications, or with our AI assistant where that feature is available to you</li>
        <li>Submit false reports of listings or other content</li>
      </ul>

      <h3>2.5 Compromise Security</h3>
      <ul>
        <li>Transmit viruses, malware, ransomware, or other harmful code</li>
        <li>Attempt to access accounts, systems, or data you are not authorised to access</li>
        <li>Probe, scan, or test vulnerabilities without our written permission</li>
        <li>Interfere with or disrupt the Service or its infrastructure</li>
        <li>Circumvent authentication, authorisation, or rate-limiting</li>
      </ul>

      <h3>2.6 Misuse the AI Assistant</h3>
      <ul>
        <li>Where the Service includes an AI assistant:</li>
      </ul>
      <ul>
        <li>Attempt to extract its system prompts, training data, or model weights</li>
        <li>Use it to generate harmful, illegal, or discriminatory content</li>
        <li>Submit prompts designed to elicit unsafe outputs</li>
        <li>Rely on it for legal, financial, medical, or other professional advice without verifying with a qualified professional</li>
      </ul>

      <h2>3. Reporting Violations</h2>
      <p>If you believe a user is violating this AUP, report it to <a href="mailto:legal@thenook.rent">legal@thenook.rent</a>. Include:</p>
      <ul>
        <li>The user’s identifier, if known</li>
        <li>A description of the violation</li>
        <li>Any supporting evidence</li>
        <li>Your contact information</li>
      </ul>
      <p>We investigate reports and take action as appropriate. We may not disclose investigation outcomes to reporters.</p>
      <p>Reports about a listing rather than a user — for example a listing that appears fraudulent, is no longer available, is duplicated, or has incorrect details — can be submitted from the listing itself in your dashboard, or by email to <a href="mailto:support@thenook.rent">support@thenook.rent</a>.</p>

      <h2>4. Enforcement</h2>
      <p>If we determine you have violated this AUP, we may, at our discretion and depending on severity:</p>
      <ul>
        <li>Issue a warning</li>
        <li>Temporarily restrict access to features</li>
        <li>Suspend your account</li>
        <li>Terminate your account</li>
        <li>Reverse or suspend referral rewards or other benefits</li>
        <li>Refer the matter to law enforcement</li>
        <li>Take other action permitted by our Terms of Service or by law</li>
      </ul>
      <p>We may take action without prior notice for serious violations, such as security threats, fraud, or illegal activity.</p>
      <p>Temporary enforcement action or suspension does not by itself cancel your subscription. If we terminate your account for a violation of this AUP, we will cancel the subscription and no further charges will be made. Any refund of charges already made is governed by our <Link to="/refunds">Refund Policy</Link> and applicable law.</p>
      <p>You may appeal enforcement decisions by emailing <a href="mailto:legal@thenook.rent">legal@thenook.rent</a> within 30 days. Appeals are reviewed by someone not involved in the original decision.</p>

      <h2>5. Changes to This AUP</h2>
      <p>We may update this AUP from time to time. Material changes will be communicated by email or in-product notice. Continued use of the Service after a change takes effect constitutes acceptance.</p>

      <h2>6. Contact</h2>
      <p>Questions about this AUP?</p>
      <p>
        <strong>General:</strong> <a href="mailto:hello@thenook.rent">hello@thenook.rent</a>
        <br />
        <strong>Report abuse:</strong> <a href="mailto:legal@thenook.rent">legal@thenook.rent</a>
        <br />
        <strong>Report a listing:</strong> <a href="mailto:support@thenook.rent">support@thenook.rent</a>
        <br />
        <strong>Appeals:</strong> <a href="mailto:legal@thenook.rent">legal@thenook.rent</a>
      </p>
    </LegalPageLayout>
  );
}
