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
    <LegalPageLayout title="Cookie Policy" lastUpdated="August 19, 2026">
      <div style={{ margin: "0 0 1.6em" }}>
        <OriginButton variant="tertiary" onClick={openCookiePreferences}>
          Manage Cookie Preferences
        </OriginButton>
      </div>

      <h2>1. Introduction</h2>
      <p>
        This Cookie Policy explains how Nook (“we,” “us,” “our”), operated by NORELIX LIMITED, uses cookies and similar technologies on thenook.rent and related services (the “Service”).
      </p>
      <p>
        For information about how we handle personal information generally, see our <Link to="/privacy">Privacy Policy</Link>.
      </p>

      <h2>2. What Are Cookies?</h2>
      <p>Cookies are small text files placed on your device when you visit a website. They are widely used to make websites work, to improve user experience, and to provide information to the site owner.</p>
      <p>We also use similar technologies, including:</p>
      <ul>
        <li>Local storage — data stored by your browser</li>
        <li>Session storage — temporary data cleared when you close the tab</li>
        <li>Web beacons and pixels — small images that record interactions</li>
      </ul>
      <p>Throughout this policy, “cookies” refers to all of these technologies unless otherwise specified.</p>

      <h2>3. Categories of Cookies We Use</h2>

      <h3>3.1 Strictly Necessary Cookies</h3>
      <p>These are essential for the Service to function. They cannot be disabled.</p>
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
            <td>session_id (Nook)</td>
            <td>Keep you signed in</td>
            <td>Session</td>
          </tr>
          <tr>
            <td>csrf_token (Nook)</td>
            <td>Security: prevent cross-site request forgery</td>
            <td>Session</td>
          </tr>
          <tr>
            <td>cookie_consent (Nook)</td>
            <td>Remember your cookie preferences</td>
            <td>12 months</td>
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
            <td>selected_city (Nook)</td>
            <td>Remember the city you selected</td>
            <td>12 months</td>
          </tr>
          <tr>
            <td>timezone (Nook)</td>
            <td>Show dates and times in your timezone</td>
            <td>12 months</td>
          </tr>
        </tbody>
      </table>

      <h3>3.3 Performance and Analytics Cookies</h3>
      <p>These help us understand how visitors use the Service so that we can improve it. They are set only if you turn this category on.</p>
      <p>We use one product analytics provider and one error monitoring provider. Cookie names begin with a provider-specific prefix and typically expire between one session and two years, depending on the provider.</p>
      <p>The specific providers we use are available on request from <a href="mailto:privacy@thenook.rent">privacy@thenook.rent</a>.</p>

      <h3>3.4 Targeting and Advertising Cookies</h3>
      <p>These may be used to measure the effectiveness of our advertising and to show you advertising on other sites.</p>
      <p>These cookies are off unless you turn them on. We do not set them by default. If your browser sends a Global Privacy Control (GPC) signal, we treat it as a request to opt out of the sale or sharing of personal information and do not use targeting or advertising cookies for cross-context behavioural advertising.</p>
      <p>The specific providers we use are available on request.</p>

      <h2>4. How We Use Cookies</h2>
      <p>We use cookies to:</p>
      <ul>
        <li>Keep you signed in and maintain your session</li>
        <li>Remember your city, timezone, and other preferences</li>
        <li>Understand how the Service is used and where to improve it, where you have consented</li>
        <li>Detect fraud and security incidents</li>
        <li>Measure the effectiveness of our marketing, where you have consented</li>
      </ul>

      <h2>5. Your Choices</h2>
      <h3>5.1 Cookie Banner</h3>
      <p>When you first visit the Service you will see a banner asking your preferences. You can choose:</p>
      <ul>
        <li>Accept all — enable all cookie categories</li>
        <li>Reject all — decline all non-essential cookies</li>
        <li>Manage preferences — choose category by category</li>
      </ul>
      <p>Strictly necessary cookies are always enabled. Every other category starts switched off. Nothing beyond the strictly necessary category is set until you choose to enable it.</p>
      <p>Rejecting all is a single action and is offered with the same prominence as accepting all. Your choice is stored so that you are not asked again.</p>

      <h3>5.2 Changing Your Preferences</h3>
      <p>You can change your preferences at any time by clicking “Cookie Preferences” in our footer. Withdrawing consent is as easy as giving it.</p>

      <h3>5.3 Browser Controls</h3>
      <p>Most browsers let you:</p>
      <ul>
        <li>View existing cookies</li>
        <li>Block all cookies</li>
        <li>Block third-party cookies</li>
        <li>Clear cookies when you close the browser</li>
      </ul>
      <p>Refer to your browser’s help section for instructions.</p>

      <h3>5.4 Global Privacy Control and Do Not Track</h3>
      <p>We honour Global Privacy Control (GPC) signals as a valid request to opt out of the sale or sharing of personal information, as required by applicable law. If your browser sends a recognised GPC signal, we apply that preference automatically.</p>
      <p>We do not currently respond to the legacy “Do Not Track” browser header, as no industry standard for it was agreed.</p>

      <h3>5.5 Opt-Out Tools</h3>
      <p>For analytics and advertising cookies, you can also opt out via the tools published by the relevant industry bodies, including the <a href="https://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer">Network Advertising Initiative</a> and the <a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer">Digital Advertising Alliance</a>, and via any opt-out mechanism offered by the provider concerned.</p>

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
            <td>The Service will not function; you cannot sign in</td>
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
      <p>Some cookies are set by third parties. Those parties have their own privacy policies, and disabling third-party cookies in your browser may affect their functionality.</p>
      <p>We use third-party providers in the following categories:</p>
      <ul>
        <li>Payment processing — currently Stripe, Inc.</li>
        <li>Product and site analytics</li>
        <li>Error monitoring</li>
        <li>Email delivery</li>
        <li>Advertising measurement, only where you have enabled targeting cookies</li>
      </ul>
      <p>A current list of the specific providers we use is available on request from <a href="mailto:privacy@thenook.rent">privacy@thenook.rent</a>.</p>

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
