import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { OriginButton } from "@/components/ui/origin-button";
import { openCookiePreferences } from "@/lib/cookieConsent";

export const Route = createFileRoute("/cookies")({
  head: () => ({
    meta: [
      { title: "Cookie Policy — Nook" },
      { name: "description", content: "How Nook uses cookies and similar technologies." },
      { property: "og:title", content: "Cookie Policy — Nook" },
      { property: "og:description", content: "How Nook uses cookies and similar technologies." },
      { property: "og:url", content: "https://thenook.rent/cookies" }
    ],
    links: [{ rel: "canonical", href: "https://thenook.rent/cookies" }],
  }),
  component: CookiesPage,
});

function CookiesPage() {
  return (
    <LegalPageLayout title="Cookie Policy" lastUpdated="September 21, 2026">
      <div style={{ margin: "0 0 1.6em" }}>
        <OriginButton variant="tertiary" onClick={openCookiePreferences}>
          Manage Cookie Preferences
        </OriginButton>
      </div>

      <h2>1. Introduction</h2>
      <p>
        This Cookie Policy explains how Nook (“we,” “us,” “our”), operated by NORELIX LIMITED, uses cookies and similar technologies on thenook.rent and related services (the “Service”). For information about how we handle personal information generally, see our <Link to="/privacy">Privacy Policy</Link>.
      </p>

      <h2>2. What Are Cookies?</h2>
      <p>
        Cookies are small text files placed on your device when you visit a website. They are widely used to make websites work, to improve user experience, and to provide information to the site owner.
      </p>
      <p>We also use similar technologies, including:</p>
      <ul>
        <li>Local storage — data stored by your browser</li>
        <li>Session storage — temporary data cleared when you close the tab</li>
        <li>Web beacons and pixels — small images that record interactions</li>
      </ul>
      <p>Throughout this policy, “cookies” refers to all of these technologies unless otherwise specified.</p>

      <h2>3. Categories of Cookies We Use</h2>

      <h3>3.1 Strictly Necessary Cookies</h3>
      <p>These are essential for the Service to function, to keep it secure, and to process the payments you request. They cannot be disabled.</p>
      <table>
        <thead>
          <tr>
            <th>Cookie</th>
            <th>Provider</th>
            <th>Purpose</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>session_id</td>
            <td>Nook</td>
            <td>Keep you signed in</td>
            <td>Session</td>
          </tr>
          <tr>
            <td>csrf_token</td>
            <td>Nook</td>
            <td>Security: prevent cross-site request forgery</td>
            <td>Session</td>
          </tr>
          <tr>
            <td>cookie_consent</td>
            <td>Nook</td>
            <td>Remember your cookie preferences</td>
            <td>12 months</td>
          </tr>
          <tr>
            <td>cf_clearance, __cf_bm and related cookies</td>
            <td>Cloudflare</td>
            <td>Bot detection and Web Application Firewall, so the Service stays available and secure</td>
            <td>Set by Cloudflare, typically 30 minutes to 1 year</td>
          </tr>
          <tr>
            <td>__stripe_mid, __stripe_sid and related cookies</td>
            <td>Stripe, Inc.</td>
            <td>Process your subscription payment and detect payment fraud</td>
            <td>Set by Stripe, typically session to 1 year</td>
          </tr>
        </tbody>
      </table>

      <h3>3.2 Functional Cookies</h3>
      <p>These remember your preferences so that you do not have to set them again.</p>
      <table>
        <thead>
          <tr>
            <th>Cookie</th>
            <th>Purpose</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>selected_city</td>
            <td>Remember the city you selected</td>
            <td>12 months</td>
          </tr>
          <tr>
            <td>timezone</td>
            <td>Show dates and times in your timezone</td>
            <td>12 months</td>
          </tr>
        </tbody>
      </table>

      <h3>3.3 Performance and Analytics Cookies</h3>
      <p>These help us understand how visitors use the Service so that we can improve it. They are set only if you turn this category on.</p>
      <table>
        <thead>
          <tr>
            <th>Provider</th>
            <th>Purpose</th>
            <th>Typical duration</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Google Analytics (GA4)</td>
            <td>Measures traffic, page views and conversion funnels</td>
            <td>Up to 2 years</td>
          </tr>
          <tr>
            <td>Mixpanel</td>
            <td>Tracks product usage and feature adoption</td>
            <td>Up to 1 year</td>
          </tr>
        </tbody>
      </table>

      <h3>3.4 Targeting and Advertising Cookies</h3>
      <p>These are used to measure the effectiveness of our advertising and to show you advertising on other sites. They are off unless you turn them on. We do not set them by default.</p>
      <table>
        <thead>
          <tr>
            <th>Provider</th>
            <th>Purpose</th>
            <th>Typical duration</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Meta Pixel</td>
            <td>Measures ad performance on Facebook/Instagram and builds retargeting audiences</td>
            <td>Up to 90 days</td>
          </tr>
          <tr>
            <td>Google Ads</td>
            <td>Measures ad performance and conversions from Google Ads campaigns</td>
            <td>Up to 90 days</td>
          </tr>
        </tbody>
      </table>
      <p>
        If your browser sends a Global Privacy Control (GPC) signal, we treat it as a request to opt out of the sale or sharing of personal information and do not use targeting or advertising cookies for cross-context behavioural advertising.
      </p>

      <h2>4. How We Use Cookies</h2>
      <ul>
        <li>Keep you signed in and maintain your session</li>
        <li>Remember your city, timezone, and other preferences</li>
        <li>Understand how the Service is used and where to improve it, where you have consented</li>
        <li>Detect fraud, block malicious bot traffic, and protect account security</li>
        <li>Process subscription payments</li>
        <li>Measure the effectiveness of our marketing, where you have consented</li>
      </ul>

      <h2>5. Your Choices</h2>

      <h3>5.1 Cookie Banner</h3>
      <p>When you first visit the Service you will see a banner asking your preferences. You can choose:</p>
      <ul>
        <li>Accept all — enable all cookie categories</li>
        <li>Essential only — decline all non-essential cookies (Strictly Necessary cookies remain active, since the Service cannot function without them)</li>
        <li>Manage preferences — choose category by category</li>
      </ul>
      <p>Strictly necessary cookies are always enabled. Every other category starts switched off. Nothing beyond the strictly necessary category is set until you choose to enable it.</p>
      <p>Choosing “Essential only” is a single action, offered on the same screen as accepting all. Your choice is stored so that you are not asked again.</p>

      <h3>5.2 Changing Your Preferences</h3>
      <p>You can change your preferences at any time by clicking “Cookie Preferences” in our footer. Withdrawing consent is as easy as giving it.</p>

      <h3>5.3 Browser Controls</h3>
      <p>Most browsers let you view existing cookies, block all cookies, block third-party cookies, and clear cookies when you close the browser. Refer to your browser’s help section for instructions.</p>

      <h3>5.4 Global Privacy Control and Do Not Track</h3>
      <p>We honour Global Privacy Control (GPC) signals as a valid request to opt out of the sale or sharing of personal information, as required by applicable law. If your browser sends a recognised GPC signal, we apply that preference automatically.</p>
      <p>We do not currently respond to the legacy “Do Not Track” browser header, as no industry standard for it was agreed.</p>

      <h3>5.5 Opt-Out Tools</h3>
      <p>
        For analytics and advertising cookies, you can also opt out via the tools published by the relevant industry bodies, including the <a href="https://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer">Network Advertising Initiative</a> and the <a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer">Digital Advertising Alliance</a>, and via any opt-out mechanism offered by the provider concerned.
      </p>

      <h2>6. Impact of Disabling Cookies</h2>
      <table>
        <thead>
          <tr>
            <th>Category disabled</th>
            <th>Effect</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Strictly necessary</td>
            <td>The Service will not function; you cannot sign in and cannot complete a payment</td>
          </tr>
          <tr>
            <td>Functional</td>
            <td>Your city and timezone will need to be set again on each visit</td>
          </tr>
          <tr>
            <td>Performance</td>
            <td>We will not see where users have difficulty, which slows down improvements</td>
          </tr>
          <tr>
            <td>Targeting</td>
            <td>Advertising you see on other sites may be less relevant, but you will not see less of it</td>
          </tr>
        </tbody>
      </table>
      <p>Disabling any category does not affect the rental alerts you have subscribed to. Those are sent by email and do not depend on cookies.</p>

      <h2>7. Third-Party Cookies</h2>
      <p>Some cookies are set by third parties. Those parties have their own privacy policies, and disabling third-party cookies in your browser may affect their functionality. The providers we use are:</p>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Provider(s)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Security / bot protection</td>
            <td>Cloudflare</td>
          </tr>
          <tr>
            <td>Payment processing</td>
            <td>Stripe, Inc.</td>
          </tr>
          <tr>
            <td>Product and site analytics</td>
            <td>Google Analytics (GA4), Mixpanel</td>
          </tr>
          <tr>
            <td>Advertising measurement</td>
            <td>Meta Pixel, Google Ads — only where you have enabled targeting cookies</td>
          </tr>
        </tbody>
      </table>
      <p>This list reflects the providers active on the Service as of the effective date above. If you have questions about a specific provider, email <a href="mailto:privacy@thenook.rent">privacy@thenook.rent</a>.</p>

      <h2>8. Children</h2>
      <p>The Service is intended only for users who are at least 18 years old. We do not knowingly use cookies to collect personal information from anyone under 18.</p>

      <h2>9. Changes to This Policy</h2>
      <p>We may update this Cookie Policy from time to time. We will post the updated version on this page and update the “Last Updated” date.</p>
      <p>If we add a category or change the purpose of an existing one, we will ask for your consent again rather than relying on a choice you made about a different set of cookies.</p>

      <h2>10. Contact</h2>
      <p>Questions about this Cookie Policy?</p>
      <p>
        <strong>Email:</strong> <a href="mailto:privacy@thenook.rent">privacy@thenook.rent</a>
        <br />
        <strong>Mail:</strong> Privacy Officer, NORELIX LIMITED, The Black Church, St. Mary’s Place, Dublin 7, D07 P4AX, Ireland
      </p>
    </LegalPageLayout>
  );
}
