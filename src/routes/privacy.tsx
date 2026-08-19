import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Nook" },
      { name: "description", content: "How Nook collects, uses, shares, and protects your personal information." },
      { property: "og:title", content: "Privacy Policy — Nook" },
      { property: "og:description", content: "How Nook collects, uses, shares, and protects your personal information." },
      { property: "og:url", content: "https://thenook.rent/privacy" }
    ],
    links: [{ rel: "canonical", href: "https://thenook.rent/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated="August 19, 2026">
      <h2>Summary</h2>
      <p>
        This Privacy Policy describes how Nook collects, uses, shares, and protects your personal information when you use our Service. We aim to be transparent about our practices and give you control over your data.
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

      <h2 id="who">1. Who We Are</h2>
      <p>
        Nook is operated by NORELIX LIMITED, a company registered in Ireland under company number 817569, with a registered office at The Black Church, St. Mary’s Place, Dublin 7, D07 P4AX, Ireland. We operate in the United States under the trade name “The Nook” via the website thenook.rent and related services (the “Service”).
      </p>
      <p>
        <strong>Contact for privacy matters:</strong>{" "}
        <a href="mailto:privacy@thenook.rent">privacy@thenook.rent</a>
      </p>

      <h2 id="collect">2. Information We Collect</h2>

      <h3>2.1 Information You Provide</h3>
      <p><strong>Account information:</strong></p>
      <ul>
        <li>Email address</li>
        <li>Password (stored hashed, never in plain text)</li>
      </ul>
      <p>We do not ask for your name, and there is no name field in the Service. We do not collect a phone number.</p>
      <p><strong>Search criteria and preferences:</strong></p>
      <ul>
        <li>City, neighbourhoods, and transit lines</li>
        <li>Budget range, bedroom and bathroom counts, home type</li>
        <li>Move-in date window and date flexibility</li>
        <li>Amenity requirements, including which of them are essential to you</li>
        <li>Alert frequency and quiet hours, set for each search</li>
        <li>Timezone</li>
      </ul>
      <p><strong>Payment information:</strong></p>
      <ul>
        <li>Billing name and address</li>
        <li>Last four digits of your payment card</li>
        <li>Card brand and expiry</li>
      </ul>
      <p>Full card numbers are processed by Stripe. We never receive or store them.</p>
      <p><strong>Communications:</strong></p>
      <ul>
        <li>Messages you send to support, including any name you choose to put in the contact form</li>
        <li>Survey responses</li>
        <li>Reports you submit about a listing</li>
      </ul>

      <h3>2.2 Information We Collect Automatically</h3>
      <p><strong>Device and usage data:</strong></p>
      <ul>
        <li>IP address</li>
        <li>Browser type and version</li>
        <li>Operating system</li>
        <li>Pages visited, features used, time spent</li>
        <li>Referring URL</li>
        <li>Clicks and interaction events, including which listing you opened and from where</li>
      </ul>
      <p><strong>Cookies and similar technologies:</strong></p>
      <ul>
        <li>Strictly necessary cookies</li>
        <li>Functional cookies</li>
        <li>Analytics cookies, where you have consented</li>
      </ul>
      <p>See our <Link to="/cookies">Cookie Policy</Link>.</p>
      <p><strong>Approximate location:</strong></p>
      <ul>
        <li>Derived from IP address</li>
        <li>Used to suggest your city and set your timezone; you can override both</li>
      </ul>

      <h3>2.3 Information from Third Parties</h3>
      <p><strong>Listing sources.</strong> We aggregate rental listing data from licensed third-party sources. This data describes properties, not you personally.</p>
      <p><strong>Payment processor.</strong> Stripe provides transaction confirmation, the last four digits of your card, the card brand, and the outcome of each charge.</p>
      <p><strong>Identity provider.</strong> If you sign in with Google, we receive your email address and whether it is verified. We discard the name and profile photo Google returns; we do not store them.</p>

      <h3>2.4 Sensitive Personal Information</h3>
      <p>
        We do not knowingly collect sensitive personal information as defined by California or other state laws (for example government identifiers, financial account numbers other than card last four, precise geolocation, racial or ethnic origin, religious beliefs, sexual orientation, health information, biometric data, or the contents of private communications).
      </p>
      <p>
        If you choose to include such information in a free-text field, for example in a message to support, we will handle it according to this Policy, but we recommend that you avoid sharing it.
      </p>
      <p>
        We do not use any protected characteristic, or any proxy for one, when deciding which listings to send you. See Section 3.6 and our <Link to="/fair-housing">Fair Housing Statement</Link>.
      </p>

      <h2 id="use">3. How We Use Information</h2>

      <h3>3.1 To Provide the Service</h3>
      <ul>
        <li>Create and maintain your account</li>
        <li>Match listings against the criteria of each of your searches</li>
        <li>Deliver alerts by email at the frequency and within the quiet hours you set</li>
        <li>Show the same matches in your dashboard</li>
        <li>Process payments and manage your subscription</li>
      </ul>

      <h3>3.2 To Improve the Service</h3>
      <ul>
        <li>Analyse usage patterns</li>
        <li>Measure whether the listings we send are relevant, using clicks and the actions you take on a listing</li>
        <li>Test new features</li>
        <li>Debug issues</li>
      </ul>

      <h3>3.3 To Communicate with You</h3>
      <ul>
        <li>Send account, security, billing, and legal emails, which are required and cannot be switched off while your account is active</li>
        <li>Send the rental alerts you signed up for</li>
        <li>Respond to support enquiries</li>
        <li>Send product news and our blog newsletter, which you can turn off at any time</li>
      </ul>

      <h3>3.4 For Safety and Security</h3>
      <ul>
        <li>Detect and prevent fraud, including abuse of the introductory period and of any referral programme</li>
        <li>Enforce our <Link to="/terms">Terms of Service</Link> and <Link to="/acceptable-use">Acceptable Use Policy</Link></li>
        <li>Investigate violations and security incidents</li>
      </ul>

      <h3>3.5 For Legal and Business Purposes</h3>
      <ul>
        <li>Comply with law and respond to legal requests</li>
        <li>Establish, exercise, or defend legal claims</li>
        <li>Conduct business operations such as auditing and financial reporting</li>
      </ul>

      <h3>3.6 Automated Decision-Making</h3>
      <p>We use automated processes to:</p>
      <ul>
        <li>Filter listings against the requirements you marked as essential</li>
        <li>Score the remaining listings against your other criteria and rank them</li>
        <li>Remove duplicate listings</li>
        <li>Detect fraud and suspicious listings</li>
      </ul>
      <p>
        These processes do not use, and are not given access to, any protected characteristic or any proxy for one. The scoring function does not receive school ratings, crime statistics, neighbourhood “safety” scores, demographic data, or information about who lives in a building.
      </p>
      <p>
        These processes do not produce legal or similarly significant effects on you. You may request human review of any decision by contacting{" "}
        <a href="mailto:privacy@thenook.rent">privacy@thenook.rent</a>.
      </p>

      <h2 id="share">4. How We Share Information</h2>
      <p>
        We do not sell personal information for monetary consideration. We share it only as described below.
      </p>

      <h3>4.1 Service Providers</h3>
      <p>
        We share information with vendors who help us operate the Service. We use providers in the following categories:
      </p>
      <ul>
        <li>Payment processing — currently Stripe, Inc.</li>
        <li>Hosting and infrastructure</li>
        <li>Email delivery</li>
        <li>Product and site analytics</li>
        <li>Error monitoring</li>
      </ul>
      <p>
        Each provider receives only the information it needs for its function. All are bound by contract to process information solely on our behalf and to maintain appropriate security.
      </p>
      <p>
        A current list of the specific providers we use, and what each receives, is available on request from{" "}
        <a href="mailto:privacy@thenook.rent">privacy@thenook.rent</a>.
      </p>

      <h3>4.2 Legal and Safety</h3>
      <p>We may disclose information if required to:</p>
      <ul>
        <li>Comply with law, court order, or legal process</li>
        <li>Enforce our Terms or other agreements</li>
        <li>Protect the rights, property, or safety of Nook, our users, or others</li>
        <li>Detect, prevent, or investigate fraud or security issues</li>
      </ul>

      <h3>4.3 Business Transfers</h3>
      <p>
        If Nook is involved in a merger, acquisition, financing, or sale of assets, your information may be transferred. We will notify you of any change in ownership or any material change in how your information is handled.
      </p>

      <h3>4.4 With Your Consent</h3>
      <p>
        We share information with third parties only with your direction or consent.
      </p>
      <p>
        When you open a listing from an alert or from your dashboard, you leave our Service and go to the source website. We do not send your personal information to that site, and we do not contact landlords or agents on your behalf.
      </p>

      <h3>4.5 Aggregated and De-identified Data</h3>
      <p>
        We may create and share aggregated or de-identified data that cannot reasonably be used to identify you, for example median rents by neighbourhood.
      </p>

      <h2>5. Cookies and Tracking</h2>
      <p>
        We use cookies and similar technologies for functionality, analytics, and, with your consent, advertising. You can manage cookie preferences:
      </p>
      <ul>
        <li>Via our cookie banner when you first visit</li>
        <li>In your browser settings</li>
        <li>Via the “Cookie Preferences” link in our footer</li>
      </ul>
      <p>
        Non-essential cookies are off until you turn them on. We honour Global Privacy Control (GPC) signals as a valid request to opt out of the sale or sharing of personal information, as required by applicable law.
      </p>
      <p>
        See our <Link to="/cookies">Cookie Policy</Link> for details.
      </p>

      <h2>6. Data Retention</h2>
      <p>
        We retain personal information for as long as needed to provide the Service and for the purposes described in this Policy. General retention periods:
      </p>
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Retention</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Active account data</td>
            <td>Life of account</td>
          </tr>
          <tr>
            <td>Account, search, and preference data</td>
            <td>Deleted within 30 days after a verified deletion request, subject to applicable legal exceptions</td>
          </tr>
          <tr>
            <td>Billing records</td>
            <td>7 years (US tax and accounting requirements)</td>
          </tr>
          <tr>
            <td>Server logs</td>
            <td>90 days</td>
          </tr>
          <tr>
            <td>Support tickets</td>
            <td>24 months</td>
          </tr>
          <tr>
            <td>Service incident records</td>
            <td>24 months, so that refund requests can be assessed</td>
          </tr>
          <tr>
            <td>Marketing email engagement data</td>
            <td>24 months from last engagement</td>
          </tr>
          <tr>
            <td>Consent records</td>
            <td>at least three (3) years, or one (1) year after the subscription terminates, whichever period is longer, and longer where required by applicable law</td>
          </tr>
        </tbody>
      </table>
      <p>
        We may retain information longer where required by law or for legitimate business purposes such as dispute resolution.
      </p>
      <p>
        When you delete your account, your searches, criteria, alert history, and notification settings are deleted. Records of which listings were opened are anonymised rather than deleted: they tell us whether our matching works, not who you are. Billing records and consent records are retained for the periods above because we are required to keep them.
      </p>

      <h2 id="rights">7. Your Rights</h2>
      <p>Depending on where you live, you may have the following rights:</p>
      <ul>
        <li>Access — know what personal information we have about you</li>
        <li>Portability — get a copy of your information</li>
        <li>Correction — update inaccurate information</li>
        <li>Deletion — request deletion of your information</li>
        <li>Opt-out — decline sale or sharing for cross-context behavioural advertising</li>
        <li>Limit sensitive PI use — restrict use of sensitive personal information</li>
        <li>Withdraw consent — where processing is based on consent</li>
        <li>Non-discrimination — exercise rights without penalty</li>
      </ul>

      <h2>How to Exercise Your Rights</h2>
      <p><strong>In your account:</strong></p>
      <ul>
        <li>Update your search criteria and notification settings</li>
        <li>Change your timezone and password</li>
        <li>Delete your account</li>
      </ul>
      <p><strong>Email preferences:</strong> the unsubscribe link in any alert or marketing email, or the preference page linked from those emails. You do not need to sign in to use it.</p>
      <p><strong>Cookie preferences:</strong> “Manage Cookie Preferences” in our footer.</p>
      <p><strong>Requests for a copy of your data, correction, or opt-out:</strong></p>
      <ul>
        <li>Web form: <Link to="/do-not-sell">thenook.rent/do-not-sell</Link></li>
        <li>Email: <a href="mailto:privacy@thenook.rent">privacy@thenook.rent</a></li>
      </ul>
      <p>
        A copy of your data is provided on request rather than as an instant download. We will verify your identity, usually by confirming from your account email address, and then send you your data securely. We respond within the timeframe required by your state’s law, generally within 45 days, with one additional 45-day extension where permitted by applicable law and with notice to you.
      </p>
      <p>Authorised agents may submit requests on your behalf with proof of authorisation.</p>

      <h2 id="california">8. California Residents</h2>
      <p>
        This section describes rights and disclosures under the California Consumer Privacy Act (CCPA) as amended by the California Privacy Rights Act (CPRA).
      </p>

      <h3>8.1 Categories of Information We Collect</h3>
      <ul>
        <li><strong>Identifiers</strong> — email, IP address, account ID (from you, your device)</li>
        <li><strong>Customer records</strong> — billing address, payment card last four (from you, Stripe)</li>
        <li><strong>Commercial information</strong> — subscription history, transaction records (from your activity)</li>
        <li><strong>Internet activity</strong> — pages visited, clicks, listings opened (from your device)</li>
        <li><strong>Geolocation (approximate)</strong> — city level from IP (from your device)</li>
        <li><strong>Inferences</strong> — search preferences (from your activity)</li>
      </ul>
      <p>
        We do not collect categories of sensitive personal information for purposes that require disclosure under CPRA § 1798.121.
      </p>

      <h3>8.2 Business Purposes for Collection</h3>
      <p>
        See <a href="#use">Section 3</a>. We do not use personal information for purposes incompatible with those disclosed without giving you notice.
      </p>

      <h3>8.3 Categories Shared</h3>
      <p>
        We share identifiers, internet activity, and inferences with service providers as described in <a href="#share">Section 4</a>. We do not “sell” personal information for monetary consideration.
      </p>
      <p>
        We may “share” (as defined by CPRA) certain identifiers and internet activity with analytics and advertising partners for cross-context behavioural advertising only if you have turned those cookies on. See <a href="#dnss">Section 10</a>.
      </p>

      <h3>8.4 Categories Disclosed for Business Purposes</h3>
      <p>
        In the past 12 months, we have disclosed the following categories for business purposes to the service provider categories listed in Section 4:
      </p>
      <ul>
        <li>Identifiers</li>
        <li>Customer records</li>
        <li>Commercial information</li>
        <li>Internet activity</li>
        <li>Approximate geolocation</li>
      </ul>

      <h3>8.5 Sources</h3>
      <p>
        See <a href="#collect">Section 2</a>.
      </p>

      <h3>8.6 Your CCPA/CPRA Rights</h3>
      <p>California residents may exercise:</p>
      <ul>
        <li>Right to know</li>
        <li>Right to delete</li>
        <li>Right to correct</li>
        <li>Right to opt out of sale or sharing</li>
        <li>Right to limit use of sensitive personal information (we do not currently use sensitive personal information for purposes requiring this right)</li>
        <li>Right to non-discrimination</li>
      </ul>
      <p>
        To exercise rights, see <a href="#rights">Section 7</a> or visit <Link to="/do-not-sell">/do-not-sell</Link>.
      </p>

      <h3>8.7 Authorised Agents</h3>
      <p>
        You may designate an authorised agent to submit requests on your behalf. We require written authorisation, for example a power of attorney, and verification of your identity before processing agent requests.
      </p>

      <h3>8.8 Metrics Disclosure</h3>
      <p>
        We will publish metrics on requests received and processed in each calendar year as required by CCPA § 999.317(g).
      </p>

      <h2 id="other-states">9. Other US State Residents</h2>
      <p>
        If you are a resident of Virginia, Colorado, Connecticut, Utah, Texas, Oregon, Montana, Tennessee, Iowa, Indiana, Delaware, Maryland, Minnesota, New Hampshire, New Jersey, or any other state with a comprehensive privacy law, you have rights similar to those described in <a href="#rights">Section 7</a>.
      </p>
      <p>
        Submit requests via <a href="mailto:privacy@thenook.rent">privacy@thenook.rent</a> or <Link to="/do-not-sell">/do-not-sell</Link>. We will identify your state of residence and apply the appropriate timeline and procedures.
      </p>
      <p>
        For appeals of denied requests, contact <a href="mailto:privacy@thenook.rent">privacy@thenook.rent</a> with the subject “Privacy Appeal.”
      </p>

      <h2 id="dnss">10. Do Not Sell or Share My Personal Information</h2>
      <p>
        You can opt out of sale or sharing of your personal information for cross-context behavioural advertising by:
      </p>
      <ul>
        <li>Submitting a request at <Link to="/do-not-sell">/do-not-sell</Link></li>
        <li>Sending a Global Privacy Control (GPC) signal from your browser, which we honour automatically</li>
        <li>Turning off Targeting and Advertising cookies in your cookie preferences</li>
      </ul>
      <p>
        We will honour opt-out requests for at least 12 months and will not re-enable sharing without your renewed consent.
      </p>

      <h2>11. Children’s Privacy</h2>
      <p>
        The Service is not directed to children and is intended only for users who are at least 18 years old, as described in our <Link to="/terms">Terms of Service</Link>. We do not knowingly collect personal information from anyone under 18, and we do not knowingly permit anyone under 18 to create an account.
      </p>
      <p>
        If you believe we have collected personal information from a person under 18, please contact <a href="mailto:privacy@thenook.rent">privacy@thenook.rent</a> and we will take appropriate steps to delete it.
      </p>

      <h2>12. Security</h2>
      <p>
        We implement reasonable technical and organisational measures to protect personal information, including:
      </p>
      <ul>
        <li>Encryption in transit (HTTPS/TLS) and at rest</li>
        <li>Access controls and authentication</li>
        <li>Regular security audits</li>
        <li>Employee training and access limitations</li>
        <li>Incident response procedures</li>
        <li>Logging of any manual access to an individual account by our staff, recorded against the support request that prompted it</li>
      </ul>
      <p>
        No system is perfectly secure. We cannot guarantee absolute security and are not liable for unauthorised access despite our reasonable efforts.
      </p>
      <p>
        If we become aware of a security incident affecting your information, we will notify you and applicable regulators as required by law.
      </p>

      <h2>13. International Transfers</h2>
      <p>
        We are based in Ireland and operate in the United States. Your information may be transferred to, stored in, and processed in the United States, Ireland, and other countries where our service providers operate.
      </p>

      <h2>14. Third-Party Links</h2>
      <p>
        The Service contains links to third-party websites, in particular the source websites where listings are published. We are not responsible for their privacy practices. Review their policies before providing information.
      </p>

      <h2>15. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. When we do, we will:
      </p>
      <ul>
        <li>Update the “Last Updated” date</li>
        <li>Post the new version on this page</li>
        <li>For material changes, notify you by email or in-product notification at least 14 days before the change takes effect</li>
      </ul>
      <p>
        Continued use of the Service after a change takes effect constitutes acceptance.
      </p>

      <h2>16. Contact</h2>
      <p>
        <strong>Questions, requests, or complaints:</strong>
        <br />
        Email: <a href="mailto:privacy@thenook.rent">privacy@thenook.rent</a>
        <br />
        Mail: Privacy Officer, NORELIX LIMITED, The Black Church, St. Mary’s Place, Dublin 7, D07 P4AX, Ireland
      </p>
      <p>
        You also have the right to contact your state attorney general or other regulator if you believe we have violated applicable law.
      </p>
    </LegalPageLayout>
  );
}
