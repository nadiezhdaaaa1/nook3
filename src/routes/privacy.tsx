import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Nook" },
      { name: "description", content: "How Nook collects, uses, shares, and protects your personal information." },
      { property: "og:title", content: "Privacy Policy — Nook" },
      { property: "og:description", content: "How Nook collects, uses, shares, and protects your personal information." },,
      { property: "og:url", content: "https://nook3.lovable.app/privacy" }
    ],
    links: [{ rel: "canonical", href: "https://nook3.lovable.app/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated="July 2, 2026">
      <h2>Summary</h2>
      <p>
        This Privacy Policy describes how Nook collects, uses, shares, and protects your
        personal information when you use our Service. We aim to be transparent about our
        practices and give you control over your data.
      </p>
      <p>
        <strong>Quick links:</strong>
      </p>
      <ul>
        <li><a href="#collect">What we collect</a></li>
        <li><a href="#use">How we use it</a></li>
        <li><a href="#share">Who we share it with</a></li>
        <li><a href="#rights">Your rights</a></li>
        <li><a href="#california">California residents</a></li>
        <li><a href="#other-states">Other US state residents</a></li>
        <li><a href="#dnss">Do Not Sell or Share</a></li>
      </ul>

      <h2>1. Who We Are</h2>
      <p>
        Nook is operated by Zentaro Systems Ltd, a company registered in England and Wales
        under company number 17178666, with registered office at 167-169 Great Portland Street, 5th Floor, London, W1W 5PF.
        We operate in the United States under the trade name "The Nook" via the website
        thenook.rent and related services (the "Service").
      </p>
      <p>
        <strong>Contact for privacy matters:</strong>
        <br />
        Email: <a href="mailto:privacy@thenook.rent">privacy@thenook.rent</a>
        <br />
        Mail: [US_AGENT_ADDRESS]
        <br />
        Data Protection: [DPO_EMAIL]
      </p>

      <h2 id="collect">2. Information We Collect</h2>
      <h3>2.1 Information You Provide</h3>
      <p><strong>Account information:</strong></p>
      <ul>
        <li>Name</li>
        <li>Email address</li>
        <li>Password (stored hashed, never in plain text)</li>
        <li>Phone number (optional, for account security only)</li>
      </ul>
      <p><strong>Profile and preferences:</strong></p>
      <ul>
        <li>City, neighborhoods, and other search criteria</li>
        <li>Budget, bedroom count, amenity preferences</li>
        <li>Move-in date and lease length preferences</li>
        <li>Notification preferences</li>
      </ul>
      <p><strong>Payment information:</strong></p>
      <ul>
        <li>Billing name and address</li>
        <li>Last four digits of payment card</li>
        <li>(Full card numbers are processed by Stripe; we do not store them)</li>
      </ul>
      <p><strong>Move-out listings (if you submit one):</strong></p>
      <ul>
        <li>Property address</li>
        <li>Rent and lease details</li>
        <li>Photos and descriptions you upload</li>
      </ul>
      <p><strong>Communications:</strong></p>
      <ul>
        <li>Messages you send to support</li>
        <li>Conversations with Wren AI</li>
        <li>Survey responses</li>
      </ul>

      <h3>2.2 Information We Collect Automatically</h3>
      <p><strong>Device and usage data:</strong></p>
      <ul>
        <li>IP address</li>
        <li>Browser type and version</li>
        <li>Operating system</li>
        <li>Device identifiers</li>
        <li>Pages visited, features used, time spent</li>
        <li>Referring URL</li>
        <li>Clicks and interaction events</li>
      </ul>
      <p><strong>Cookies and similar technologies:</strong></p>
      <ul>
        <li>Session cookies (functional)</li>
        <li>Analytics cookies (performance)</li>
        <li>See our <Link to="/cookies">Cookie Policy</Link></li>
      </ul>
      <p><strong>Approximate location:</strong></p>
      <ul>
        <li>Derived from IP address</li>
        <li>Used to suggest your city; you can override</li>
      </ul>

      <h3>2.3 Information from Third Parties</h3>
      <p><strong>Listing sources:</strong> We aggregate publicly available rental listing data from agency feeds, public databases, syndicated networks, and similar sources. This data describes properties, not you personally.</p>
      <p><strong>Payment processors:</strong> Stripe provides transaction confirmation, last four digits, and card brand.</p>
      <p><strong>Identity providers</strong> (if you sign in via Google, Apple, etc., when available):</p>
      <ul>
        <li>Email</li>
        <li>Name</li>
        <li>Profile photo (where provided)</li>
      </ul>

      <h3>2.4 Sensitive Personal Information</h3>
      <p>
        We do not knowingly collect sensitive personal information as defined by California or
        other state laws (e.g., government IDs, financial account numbers other than card last
        four, precise geolocation, racial/ethnic origin, religious beliefs, sexual orientation,
        health information, biometric data, contents of private communications).
      </p>
      <p>
        If you choose to include such information in a free-text field (e.g., a message to
        support or to Wren AI), we will handle it according to this Policy but recommend you
        avoid sharing it.
      </p>

      <h2 id="use">3. How We Use Information</h2>
      <p>We use your information for the following purposes:</p>
      <h3>3.1 To Provide the Service</h3>
      <ul>
        <li>Create and maintain your account</li>
        <li>Match listings to your search criteria</li>
        <li>Deliver alerts by email</li>
        <li>Process payments and manage subscriptions</li>
        <li>Provide Wren AI responses</li>
        <li>Verify rent-regulation status against public databases</li>
      </ul>
      <h3>3.2 To Improve the Service</h3>
      <ul>
        <li>Analyze usage patterns</li>
        <li>Test new features</li>
        <li>Debug issues</li>
        <li>Train and evaluate AI systems (Wren AI)</li>
      </ul>
      <h3>3.3 To Communicate with You</h3>
      <ul>
        <li>Send transactional emails (account, billing, alerts)</li>
        <li>Respond to support inquiries</li>
        <li>Send marketing emails (only with your consent; you can opt out anytime)</li>
      </ul>
      <h3>3.4 For Safety and Security</h3>
      <ul>
        <li>Detect and prevent fraud</li>
        <li>Enforce our Terms of Service</li>
        <li>Investigate violations and security incidents</li>
      </ul>
      <h3>3.5 For Legal and Business Purposes</h3>
      <ul>
        <li>Comply with law and respond to legal requests</li>
        <li>Establish, exercise, or defend legal claims</li>
        <li>Conduct business operations (auditing, financial reporting)</li>
      </ul>
      <h3>3.6 Automated Decision-Making</h3>
      <p>We use automated processes to:</p>
      <ul>
        <li>Match listings to your search criteria (rules-based filtering)</li>
        <li>Deduplicate listings (algorithmic similarity)</li>
        <li>Detect fraud (rules-based and machine learning)</li>
        <li>Generate Wren AI responses (large language model)</li>
      </ul>
      <p>
        These processes do not produce legal or similarly significant effects on you. You may
        request human review of any decision by contacting{" "}
        <a href="mailto:privacy@thenook.rent">privacy@thenook.rent</a>.
      </p>

      <h2 id="share">4. How We Share Information</h2>
      <p>We do not sell your personal information. We share it only as described below.</p>
      <h3>4.1 Service Providers</h3>
      <p>We share information with vendors who help us operate the Service, including:</p>
      <ul>
        <li><strong>Stripe, Inc.</strong> — Payment processing</li>
        <li><strong>SendGrid (Twilio, Inc.)</strong> — Email delivery</li>
        <li><strong>Amazon Web Services / Vercel / Cloudflare</strong> — Hosting and infrastructure</li>
        <li><strong>Anthropic, PBC</strong> — Wren AI processing</li>
        <li><strong>Mixpanel / Amplitude</strong> — Product analytics</li>
        <li><strong>Sentry</strong> — Error monitoring</li>
        <li><strong>Google LLC (Analytics)</strong> — Site analytics</li>
      </ul>
      <p>
        These providers are bound by contract to process information only on our behalf and to
        maintain appropriate security. A current list is maintained at{" "}
        <Link to="/subprocessors">/subprocessors</Link>.
      </p>
      <h3>4.2 Legal and Safety</h3>
      <p>We may disclose information if required to:</p>
      <ul>
        <li>Comply with law, court order, or legal process</li>
        <li>Enforce our Terms or other agreements</li>
        <li>Protect the rights, property, or safety of Nook, users, or others</li>
        <li>Detect, prevent, or investigate fraud or security issues</li>
      </ul>
      <h3>4.3 Business Transfers</h3>
      <p>
        If Nook is involved in a merger, acquisition, financing, or sale of assets, your
        information may be transferred. We will notify you of any change in ownership or
        material change in how your information is handled.
      </p>
      <h3>4.4 With Your Consent</h3>
      <p>
        We share information with third parties only with your direction or consent (e.g., if
        you click a link to contact a landlord directly through a listing).
      </p>
      <h3>4.5 Aggregated and De-identified Data</h3>
      <p>
        We may create and share aggregated or de-identified data that cannot reasonably be used
        to identify you (e.g., "average rent in this neighborhood").
      </p>

      <h2>5. Cookies and Tracking</h2>
      <p>
        We use cookies and similar technologies for functionality, analytics, and (with your
        consent) advertising. You can manage cookie preferences:
      </p>
      <ul>
        <li>Via our cookie banner when you first visit</li>
        <li>In your browser settings</li>
        <li>Via the "Cookie Preferences" link in our footer</li>
      </ul>
      <p>
        We honor Global Privacy Control (GPC) signals as a valid opt-out of sale/sharing for
        state privacy law purposes.
      </p>
      <p>
        See our <Link to="/cookies">Cookie Policy</Link> for details.
      </p>

      <h2>6. Data Retention</h2>
      <p>
        We retain personal information for as long as needed to provide the Service and for the
        purposes described in this Policy. General retention periods:
      </p>
      <ul>
        <li><strong>Active account data</strong> — Life of account</li>
        <li><strong>Closed account data</strong> — 30 days after deletion request, then anonymized</li>
        <li><strong>Billing records</strong> — 7 years (US tax/accounting requirements)</li>
        <li><strong>Server logs</strong> — 90 days</li>
        <li><strong>Support tickets</strong> — 24 months</li>
        <li><strong>Wren AI conversation history</strong> — 12 months from last activity</li>
        <li><strong>Marketing email engagement data</strong> — 24 months from last engagement</li>
        <li><strong>Consent records</strong> — 7 years (legal compliance)</li>
      </ul>
      <p>
        We may retain information longer where required by law or for legitimate business
        purposes (e.g., dispute resolution).
      </p>

      <h2 id="rights">7. Your Rights</h2>
      <p>Depending on where you live, you may have the following rights:</p>
      <ul>
        <li><strong>Access</strong> — Know what personal information we have about you</li>
        <li><strong>Portability</strong> — Get a copy in machine-readable format</li>
        <li><strong>Correction</strong> — Update inaccurate information</li>
        <li><strong>Deletion</strong> — Request deletion of your information</li>
        <li><strong>Opt-out</strong> — Decline sale/sharing for cross-context behavioral advertising</li>
        <li><strong>Limit sensitive PI use</strong> — Restrict use of sensitive personal information</li>
        <li><strong>Withdraw consent</strong> — Where processing is based on consent</li>
        <li><strong>Non-discrimination</strong> — Exercise rights without penalty</li>
      </ul>
      <h3>How to Exercise Your Rights</h3>
      <p><strong>Self-service:</strong></p>
      <ul>
        <li>Account settings: Update profile, change preferences, download data, delete account</li>
        <li>Email preferences: Unsubscribe link in any marketing email</li>
        <li>Cookie preferences: "Manage Cookie Preferences" in footer</li>
      </ul>
      <p><strong>Formal requests:</strong></p>
      <ul>
        <li>Web form: <Link to="/do-not-sell">thenook.rent/do-not-sell</Link></li>
        <li>Email: <a href="mailto:privacy@thenook.rent">privacy@thenook.rent</a></li>
        <li>Mail: [US_AGENT_ADDRESS]</li>
      </ul>
      <p>
        We will verify your identity (typically by email confirmation) before processing
        requests. We respond within the timeframe required by your state's law (generally 45
        days, extendable to 90 with notice).
      </p>
      <p>Authorized agents may submit requests on your behalf with proof of authorization.</p>

      <h2 id="california">8. California Residents</h2>
      <p>
        This section describes rights and disclosures under the California Consumer Privacy
        Act (CCPA) as amended by the California Privacy Rights Act (CPRA).
      </p>
      <h3>8.1 Categories of Information We Collect</h3>
      <ul>
        <li><strong>Identifiers</strong> — Name, email, IP address, account ID (from you, your device)</li>
        <li><strong>Customer records</strong> — Billing address, payment last four (from you, Stripe)</li>
        <li><strong>Commercial info</strong> — Subscription history, transaction records (from your activity)</li>
        <li><strong>Internet activity</strong> — Pages visited, clicks, search queries (from your device)</li>
        <li><strong>Geolocation (approximate)</strong> — City-level from IP (from your device)</li>
        <li><strong>Inferences</strong> — Search preferences, likely interests (from your activity)</li>
      </ul>
      <p>
        We do not collect categories of sensitive personal information for purposes that
        require disclosure under CPRA § 1798.121.
      </p>
      <h3>8.2 Business Purposes for Collection</h3>
      <p>
        See <a href="#use">Section 3</a>. We do not use personal information for purposes
        incompatible with those disclosed without giving you notice.
      </p>
      <h3>8.3 Categories Shared</h3>
      <p>
        We share identifiers, internet activity, and inferences with service providers as
        described in <a href="#share">Section 4</a>. We do not "sell" personal information for
        monetary consideration.
      </p>
      <p>
        We may "share" (as defined by CPRA) certain identifiers and internet activity with
        analytics and advertising partners for cross-context behavioral advertising{" "}
        <strong>only if you have not opted out</strong>. See Section 10.
      </p>
      <h3>8.4 Categories Disclosed for Business Purposes</h3>
      <p>
        In the past 12 months, we have disclosed the following categories for business
        purposes to the service provider categories listed in Section 4:
      </p>
      <ul>
        <li>Identifiers</li>
        <li>Customer records</li>
        <li>Commercial info</li>
        <li>Internet activity</li>
        <li>Approximate geolocation</li>
      </ul>
      <h3>8.5 Sources</h3>
      <p>See <a href="#collect">Section 2</a>.</p>
      <h3>8.6 Your CCPA/CPRA Rights</h3>
      <p>California residents may exercise:</p>
      <ul>
        <li>Right to know</li>
        <li>Right to delete</li>
        <li>Right to correct</li>
        <li>Right to opt-out of sale/sharing</li>
        <li>Right to limit use of sensitive PI (we do not currently use sensitive PI for purposes requiring this right)</li>
        <li>Right to non-discrimination</li>
      </ul>
      <p>
        To exercise rights, see <a href="#rights">Section 7</a> or visit{" "}
        <Link to="/do-not-sell">/do-not-sell</Link>.
      </p>
      <h3>8.7 Authorized Agents</h3>
      <p>
        You may designate an authorized agent to submit requests on your behalf. We require
        written authorization (e.g., a power of attorney) and verification of your identity
        before processing agent requests.
      </p>
      <h3>8.8 Metrics Disclosure</h3>
      <p>
        We will publish metrics on requests received and processed in each calendar year as
        required by CCPA § 999.317(g).
      </p>

      <h2 id="other-states">9. Other US State Residents</h2>
      <p>
        If you are a resident of Virginia, Colorado, Connecticut, Utah, Texas, Oregon,
        Montana, Tennessee, Iowa, Indiana, Delaware, Maryland, Minnesota, New Hampshire, New
        Jersey, or any other state with a comprehensive privacy law, you have rights similar
        to those described in Section 7.
      </p>
      <p>
        Submit requests via <a href="mailto:privacy@thenook.rent">privacy@thenook.rent</a> or{" "}
        <Link to="/do-not-sell">/do-not-sell</Link>. We will identify your state of residence
        and apply the appropriate timeline and procedures.
      </p>
      <p>
        For appeals of denied requests, contact{" "}
        <a href="mailto:privacy@thenook.rent">privacy@thenook.rent</a> with subject "Privacy
        Appeal."
      </p>

      <h2 id="dnss">10. Do Not Sell or Share My Personal Information</h2>
      <p>
        You can opt out of sale or sharing of your personal information for cross-context
        behavioral advertising by:
      </p>
      <ul>
        <li>Submitting a request at <Link to="/do-not-sell">/do-not-sell</Link></li>
        <li>Sending a Global Privacy Control (GPC) signal from your browser (we honor these automatically)</li>
        <li>Adjusting your cookie preferences to disable Targeting & Advertising cookies</li>
      </ul>
      <p>
        We will honor opt-out requests for at least 12 months and will not re-enable sharing
        without your renewed consent.
      </p>

      <h2>11. Children's Privacy</h2>
      <p>
        The Service is not directed to children under 13. We do not knowingly collect personal
        information from children under 13. If you believe we have collected information from
        a child under 13, contact{" "}
        <a href="mailto:privacy@thenook.rent">privacy@thenook.rent</a> and we will delete it.
      </p>
      <p>
        For users between 13 and 16 in jurisdictions with age-of-consent requirements, we
        require parental consent before collecting information.
      </p>

      <h2>12. Security</h2>
      <p>
        We implement reasonable technical and organizational measures to protect personal
        information, including:
      </p>
      <ul>
        <li>Encryption in transit (HTTPS/TLS) and at rest</li>
        <li>Access controls and authentication</li>
        <li>Regular security audits</li>
        <li>Employee training and access limitations</li>
        <li>Incident response procedures</li>
      </ul>
      <p>
        No system is perfectly secure. We cannot guarantee absolute security and are not
        liable for unauthorized access despite our reasonable efforts.
      </p>
      <p>
        If we become aware of a security incident affecting your information, we will notify
        you and applicable regulators as required by law.
      </p>

      <h2>13. International Transfers</h2>
      <p>
        We are based in the United Kingdom but operate primarily in the United States. Your
        information may be transferred to, stored in, and processed in the United States, the
        United Kingdom, and other countries where our service providers operate.
      </p>
      <p>
        For users in the United Kingdom or European Economic Area (where applicable), we rely
        on Standard Contractual Clauses approved by the UK ICO and European Commission to
        safeguard international transfers.
      </p>

      <h2>14. Third-Party Links</h2>
      <p>
        The Service may contain links to third-party websites or services (e.g., listing
        landlord contact pages). We are not responsible for their privacy practices. Review
        their policies before providing information.
      </p>

      <h2>15. Changes to This Policy</h2>
      <p>We may update this Privacy Policy from time to time. When we do, we will:</p>
      <ul>
        <li>Update the "Last Updated" date</li>
        <li>Post the new version on this page</li>
        <li>
          For material changes, notify you by email or in-product notification at least 14
          days before the change takes effect
        </li>
      </ul>
      <p>Continued use of the Service after a change takes effect constitutes acceptance.</p>

      <h2>16. Contact</h2>
      <p>Questions, requests, or complaints:</p>
      <p>
        <strong>Email:</strong> <a href="mailto:privacy@thenook.rent">privacy@thenook.rent</a>
        <br />
        <strong>Mail:</strong>
        <br />
        Privacy Officer
        <br />
        Zentaro Systems Ltd
        <br />
        167-169 Great Portland Street, 5th Floor, London, W1W 5PF
        <br />
        United Kingdom
      </p>
      <p>
        <strong>For US legal process or formal privacy requests:</strong>
        <br />
        [US_AGENT_NAME]
        <br />
        [US_AGENT_ADDRESS]
      </p>
      <p>
        You also have the right to contact your state attorney general or other regulator if
        you believe we have violated applicable law.
      </p>
    </LegalPageLayout>
  );
}
