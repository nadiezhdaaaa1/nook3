import { createFileRoute } from "@tanstack/react-router";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

export const Route = createFileRoute("/accessibility")({
  head: () => ({
    meta: [
      { title: "Accessibility Statement — Nook" },
      { name: "description", content: "Nook's commitment to accessible design and WCAG 2.1 AA." },
      { property: "og:title", content: "Accessibility Statement — Nook" },
      { property: "og:description", content: "Nook's commitment to accessible design and WCAG 2.1 AA." },
      { property: "og:url", content: "https://nook3.lovable.app/accessibility" }
    ],
    links: [{ rel: "canonical", href: "https://nook3.lovable.app/accessibility" }],
  }),
  component: AccessibilityPage,
});

function AccessibilityPage() {
  return (
    <LegalPageLayout title="Accessibility Statement" lastUpdated="July 2, 2026">
      <h2>Our Commitment</h2>
      <p>
        Nook is committed to making our Service accessible to people with disabilities. We aim
        to conform with the Web Content Accessibility Guidelines (WCAG) 2.1 at Level AA.
      </p>
      <p>We continually work to improve accessibility through:</p>
      <ul>
        <li>Regular accessibility testing</li>
        <li>Staff training</li>
        <li>User feedback</li>
        <li>Third-party audits</li>
      </ul>

      <h2>What We Do</h2>
      <p>Our Service is designed to support:</p>
      <ul>
        <li><strong>Keyboard navigation</strong> — All interactive elements are reachable via keyboard</li>
        <li><strong>Screen readers</strong> — Tested with NVDA (Windows) and VoiceOver (macOS/iOS)</li>
        <li><strong>Color contrast</strong> — Text meets WCAG AA contrast ratios</li>
        <li><strong>Resizable text</strong> — Content remains usable when zoomed to 200%</li>
        <li><strong>Reduced motion</strong> — Animations respect the user's <code>prefers-reduced-motion</code> setting</li>
        <li><strong>Alternative text</strong> — Informational images include descriptive alt text</li>
        <li><strong>Form labels</strong> — All form fields have associated labels and clear error messages</li>
        <li><strong>Focus indicators</strong> — Visible keyboard focus on interactive elements</li>
      </ul>

      <h2>Known Limitations</h2>
      <p>
        Despite our efforts, some content or functionality may not be fully accessible. Known
        areas where we are working to improve:
      </p>
      <ul>
        <li>Listing photos uploaded by users may lack alt text</li>
        <li>Older Wren AI conversations may use formatting that screen readers handle imperfectly</li>
        <li>Some PDF documents (e.g., billing receipts) may not be fully tagged</li>
      </ul>
      <p>We are actively working on these issues.</p>

      <h2>Standards</h2>
      <p>
        We aim for <strong>WCAG 2.1 Level AA</strong> conformance. We test using:
      </p>
      <ul>
        <li>Automated tools (axe DevTools, Lighthouse)</li>
        <li>Manual testing with assistive technologies</li>
        <li>Third-party audits (planned annually)</li>
      </ul>
      <p>We do not currently claim Level AAA conformance.</p>

      <h2>Last Audit</h2>
      <ul>
        <li><strong>Internal review:</strong> July 2, 2026</li>
        <li><strong>Third-party audit:</strong> Planned for Q4 2026</li>
      </ul>

      <h2>Feedback</h2>
      <p>
        We welcome feedback on the accessibility of our Service. If you encounter
        accessibility barriers:
      </p>
      <p>
        <strong>Email:</strong>{" "}
        <a href="mailto:accessibility@thenook.rent">accessibility@thenook.rent</a>
        <br />
        <strong>Subject line:</strong> Accessibility feedback
      </p>
      <p>Please include:</p>
      <ul>
        <li>A description of the barrier</li>
        <li>The URL or screen where you encountered it</li>
        <li>The assistive technology you were using (if applicable)</li>
        <li>Your contact information (if you would like a response)</li>
      </ul>
      <p>
        We aim to respond to feedback within 5 business days and to resolve issues as quickly
        as practical.
      </p>

      <h2>Alternative Access</h2>
      <p>
        If you have difficulty using any part of the Service, you can reach us for alternative
        assistance:
      </p>
      <p>
        <strong>Email:</strong> <a href="mailto:hello@thenook.rent">hello@thenook.rent</a>
      </p>
      <p>We can assist with:</p>
      <ul>
        <li>Account management</li>
        <li>Subscription changes</li>
        <li>Submitting move-out listings</li>
        <li>Other tasks usually performed through the Service</li>
      </ul>

      <h2>Continuous Improvement</h2>
      <p>
        We treat accessibility as an ongoing commitment, not a one-time project. Our roadmap
        includes:
      </p>
      <ul>
        <li>Annual third-party audits</li>
        <li>Staff accessibility training</li>
        <li>User research with people who use assistive technologies</li>
        <li>Implementation of fixes within reasonable timeframes</li>
      </ul>

      <h2>Contact</h2>
      <p>
        <strong>Accessibility:</strong>{" "}
        <a href="mailto:accessibility@thenook.rent">accessibility@thenook.rent</a>
        <br />
        <strong>General:</strong> <a href="mailto:hello@thenook.rent">hello@thenook.rent</a>
      </p>
    </LegalPageLayout>
  );
}
