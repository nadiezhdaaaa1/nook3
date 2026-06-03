import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

export const Route = createFileRoute("/cookies")({
  head: () => ({
    meta: [
      { title: "Cookie Policy — Nook" },
      { name: "description", content: "How Nook uses cookies and similar technologies." },
      { property: "og:title", content: "Cookie Policy — Nook" },
      { property: "og:description", content: "How Nook uses cookies and similar technologies." },
    ],
  }),
  component: CookiesPage,
});

function CookiesPage() {
  return (
    <LegalPageLayout title="Cookie Policy" lastUpdated="July 2, 2026">
      <h2>1. Introduction</h2>
      <p>
        This Cookie Policy explains how Nook ("we," "us," "our"), operated by Zentaro Systems
        Ltd, uses cookies and similar technologies on thenook.rent and related services (the
        "Service").
      </p>
      <p>
        For information about how we handle personal information generally, see our{" "}
        <Link to="/privacy">Privacy Policy</Link>.
      </p>

      <h2>2. What Are Cookies?</h2>
      <p>
        Cookies are small text files placed on your device when you visit a website. They are
        widely used to make websites work, improve user experience, and provide information to
        the site owner.
      </p>
      <p>We also use similar technologies, including:</p>
      <ul>
        <li><strong>Local storage</strong> — Data stored by your browser</li>
        <li><strong>Session storage</strong> — Temporary data cleared when you close the tab</li>
        <li><strong>Web beacons / pixels</strong> — Small images that track interactions</li>
        <li><strong>SDKs</strong> — Software libraries that may collect data</li>
      </ul>
      <p>
        Throughout this policy, "cookies" refers to all of these technologies unless otherwise
        specified.
      </p>

      <h2>3. Categories of Cookies We Use</h2>

      <h3>3.1 Strictly Necessary Cookies</h3>
      <p>These are essential for the Service to function. They cannot be disabled.</p>
      <ul>
        <li><strong><code>session_id</code></strong> (Nook) — Keep you signed in. Duration: Session</li>
        <li><strong><code>csrf_token</code></strong> (Nook) — Security: prevent cross-site request forgery. Duration: Session</li>
        <li><strong><code>cookie_consent</code></strong> (Nook) — Remember your cookie preferences. Duration: 12 months</li>
      </ul>

      <h3>3.2 Functional Cookies</h3>
      <p>These remember your preferences to enhance your experience.</p>
      <ul>
        <li><strong><code>selected_city</code></strong> (Nook) — Remember your selected city. Duration: 12 months</li>
        <li><strong><code>timezone</code></strong> (Nook) — Display times in your timezone. Duration: 12 months</li>
        <li><strong><code>ui_theme</code></strong> (Nook) — Remember light/dark theme preference. Duration: 12 months</li>
      </ul>

      <h3>3.3 Performance and Analytics Cookies</h3>
      <p>These help us understand how visitors use the Service so we can improve it.</p>
      <ul>
        <li><strong><code>_ga</code>, <code>_ga_*</code></strong> (Google Analytics) — Track unique visitors and sessions. Duration: 2 years</li>
        <li><strong><code>mp_*</code></strong> (Mixpanel) — Product analytics and feature usage. Duration: 1 year</li>
        <li><strong><code>__sentry_*</code></strong> (Sentry) — Error monitoring. Duration: Session</li>
      </ul>

      <h3>3.4 Targeting and Advertising Cookies</h3>
      <p>These may be used to deliver advertising relevant to you on other sites.</p>
      <ul>
        <li><strong><code>_fbp</code></strong> (Meta / Facebook) — Conversion tracking and ad delivery. Duration: 90 days</li>
        <li><strong><code>_gcl_au</code></strong> (Google Ads) — Conversion tracking. Duration: 90 days</li>
      </ul>
      <p>
        We use targeting cookies <strong>only if you opt in</strong> (or where required by
        law, only if you do not opt out).
      </p>

      <h2>4. How We Use Cookies</h2>
      <p>We use cookies to:</p>
      <ul>
        <li>Keep you signed in and maintain your session</li>
        <li>Remember your preferences and settings</li>
        <li>Understand how the Service is used and where to improve</li>
        <li>Detect fraud and security incidents</li>
        <li>Measure the effectiveness of our marketing (where you have consented)</li>
      </ul>

      <h2>5. Your Choices</h2>
      <h3>5.1 Cookie Banner</h3>
      <p>
        When you first visit the Service, you will see a banner asking your preferences. You
        can choose:
      </p>
      <ul>
        <li><strong>Accept all</strong> — Enable all cookie categories</li>
        <li><strong>Reject all</strong> — Decline all non-essential cookies</li>
        <li><strong>Manage preferences</strong> — Customize by category</li>
      </ul>
      <p>Strictly necessary cookies are always enabled.</p>

      <h3>5.2 Changing Your Preferences</h3>
      <p>
        You can change preferences anytime by clicking "Cookie Preferences" in the footer.
      </p>

      <h3>5.3 Browser Controls</h3>
      <p>Most browsers let you:</p>
      <ul>
        <li>View existing cookies</li>
        <li>Block all cookies</li>
        <li>Block third-party cookies</li>
        <li>Clear cookies on close</li>
      </ul>
      <p>Refer to your browser's help section for instructions.</p>

      <h3>5.4 Do Not Track / Global Privacy Control</h3>
      <ul>
        <li>
          We honor <strong>Global Privacy Control (GPC)</strong> signals as a valid opt-out of
          sale/sharing
        </li>
        <li>
          We do not currently respond to legacy "Do Not Track" browser headers (industry
          standards have not been agreed)
        </li>
      </ul>

      <h3>5.5 Opt-Out Tools</h3>
      <p>For analytics and advertising cookies, you can also opt out via:</p>
      <ul>
        <li>
          <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
            Google Analytics Opt-Out
          </a>
        </li>
        <li>
          <a href="https://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer">
            Network Advertising Initiative
          </a>
        </li>
        <li>
          <a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer">
            Digital Advertising Alliance
          </a>
        </li>
      </ul>

      <h2>6. Impact of Disabling Cookies</h2>
      <p>If you disable cookies:</p>
      <ul>
        <li><strong>Strictly necessary disabled:</strong> Service will not function (cannot sign in)</li>
        <li><strong>Functional disabled:</strong> Your preferences will reset on each visit</li>
        <li><strong>Performance disabled:</strong> We won't know how to improve common pain points</li>
        <li><strong>Targeting disabled:</strong> Ads on other sites may be less relevant (but no fewer in number)</li>
      </ul>

      <h2>7. Third-Party Cookies</h2>
      <p>
        Some cookies are set by third parties (e.g., Google Analytics, Stripe). These third
        parties have their own privacy policies. Disabling third-party cookies in your browser
        may affect their functionality.
      </p>
      <p>Current third-party providers:</p>
      <ul>
        <li>Google LLC (Analytics, Ads)</li>
        <li>Meta Platforms, Inc. (Pixel)</li>
        <li>Stripe, Inc. (Payment processing)</li>
        <li>Twilio, Inc. (Email infrastructure)</li>
        <li>Mixpanel, Inc. (Analytics)</li>
        <li>Sentry, Inc. (Error monitoring)</li>
      </ul>
      <p>
        See our <Link to="/subprocessors">Subprocessor List</Link> for additional details.
      </p>

      <h2>8. Children</h2>
      <p>
        We do not knowingly use cookies to collect personal information from children under 13.
      </p>

      <h2>9. Changes to This Policy</h2>
      <p>
        We may update this Cookie Policy from time to time. We will post the updated version
        on this page and update the "Last Updated" date. We will re-prompt you for cookie
        consent if categories or purposes materially change.
      </p>

      <h2>10. Contact</h2>
      <p>Questions about this Cookie Policy?</p>
      <p>
        <strong>Email:</strong> <a href="mailto:privacy@thenook.rent">privacy@thenook.rent</a>
        <br />
        <strong>Mail:</strong> Privacy Officer, Zentaro Systems Ltd, 167-169 Great Portland Street, 5th Floor, London, W1W 5PF,
        United Kingdom
      </p>
    </LegalPageLayout>
  );
}
