import { createFileRoute } from "@tanstack/react-router";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

export const Route = createFileRoute("/subprocessors")({
  head: () => ({
    meta: [
      { title: "Subprocessor List — Nook" },
      { name: "description", content: "Third-party companies Nook uses to deliver the Service." },
      { property: "og:title", content: "Subprocessor List — Nook" },
      { property: "og:description", content: "Third-party companies Nook uses to deliver the Service." },,
      { property: "og:url", content: "https://nook3.lovable.app/subprocessors" }
    ],
    links: [{ rel: "canonical", href: "https://nook3.lovable.app/subprocessors" }],
  }),
  component: SubprocessorsPage,
});

type Row = { name: string; service: string; location: string; data: string };

function Table({ rows }: { rows: Row[] }) {
  return (
    <div style={{ overflowX: "auto", margin: "0 0 1.4em" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "14px",
          lineHeight: 1.5,
        }}
      >
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "1px solid rgba(0,0,0,0.15)" }}>
            <th style={{ padding: "8px 10px 8px 0", fontWeight: 600 }}>Subprocessor</th>
            <th style={{ padding: "8px 10px", fontWeight: 600 }}>Service</th>
            <th style={{ padding: "8px 10px", fontWeight: 600 }}>Location</th>
            <th style={{ padding: "8px 0 8px 10px", fontWeight: 600 }}>Data Processed</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", verticalAlign: "top" }}>
              <td style={{ padding: "10px 10px 10px 0", fontWeight: 500 }}>{r.name}</td>
              <td style={{ padding: "10px" }}>{r.service}</td>
              <td style={{ padding: "10px" }}>{r.location}</td>
              <td style={{ padding: "10px 0 10px 10px" }}>{r.data}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SubprocessorsPage() {
  return (
    <LegalPageLayout title="Subprocessor List" lastUpdated="July 2, 2026">
      <h2>What Are Subprocessors?</h2>
      <p>
        Subprocessors are third-party companies we use to deliver the Service. We share
        limited personal information with them as needed for them to perform their function on
        our behalf. They are bound by contract to handle information securely and only for our
        purposes.
      </p>
      <p>We maintain Data Processing Agreements (DPAs) with each subprocessor.</p>

      <h2>Notification of Changes</h2>
      <p>
        We may add or change subprocessors as our infrastructure evolves. Material changes
        will be reflected on this page. If you have subscribed to subprocessor updates (in
        your account settings, when available), we will notify you by email at least 30 days
        before adding a new subprocessor.
      </p>

      <h2>Current Subprocessors</h2>

      <h3>Infrastructure</h3>
      <Table
        rows={[
          { name: "Amazon Web Services, Inc.", service: "Cloud hosting (or alternative — verify production stack)", location: "United States", data: "All operational data" },
          { name: "Cloudflare, Inc.", service: "CDN, DDoS protection, DNS", location: "Global edge network", data: "IP addresses, request metadata" },
          { name: "Vercel Inc.", service: "Frontend hosting (verify)", location: "United States", data: "Page requests" },
        ]}
      />

      <h3>Authentication and Identity</h3>
      <Table
        rows={[
          { name: "Auth0 / Clerk / Supabase Auth", service: "Authentication (verify which)", location: "United States", data: "Email, password hashes, session data" },
        ]}
      />

      <h3>Payments</h3>
      <Table
        rows={[
          { name: "Stripe, Inc.", service: "Payment processing", location: "United States", data: "Name, email, billing address, payment card" },
        ]}
      />

      <h3>Email Delivery</h3>
      <Table
        rows={[
          { name: "Twilio SendGrid", service: "Transactional and marketing email", location: "United States", data: "Email address, name, email content" },
        ]}
      />

      <h3>AI Processing</h3>
      <Table
        rows={[
          { name: "Anthropic, PBC", service: "Wren AI (Claude model) processing", location: "United States", data: "Chat messages, search context" },
        ]}
      />

      <h3>Analytics and Monitoring</h3>
      <Table
        rows={[
          { name: "Google LLC", service: "Google Analytics", location: "United States", data: "Anonymized usage data" },
          { name: "Mixpanel, Inc.", service: "Product analytics", location: "United States", data: "Anonymized usage data" },
          { name: "Sentry, Inc.", service: "Error monitoring", location: "United States", data: "Error logs (may include user identifiers)" },
        ]}
      />

      <h3>Customer Support</h3>
      <Table
        rows={[
          { name: "[Intercom / Zendesk / HelpScout — verify]", service: "Support ticketing", location: "United States", data: "Name, email, support messages" },
        ]}
      />

      <h3>Data Acquisition</h3>
      <Table
        rows={[
          { name: "Bright Data Ltd.", service: "Proxy infrastructure for public listing data", location: "Global", data: "Public listing URLs (no user PII)" },
        ]}
      />

      <h2>Compliance</h2>
      <p>For each subprocessor, we:</p>
      <ul>
        <li>Conduct a privacy and security review before engagement</li>
        <li>Maintain a written Data Processing Agreement</li>
        <li>Verify they implement appropriate technical and organizational measures</li>
        <li>Periodically review their compliance posture</li>
      </ul>

      <h2>International Transfers</h2>
      <p>
        Many subprocessors are located in the United States. For data subject to UK or EU data
        protection law (limited in our case), we rely on:
      </p>
      <ul>
        <li>Standard Contractual Clauses (SCCs) approved by the UK ICO and European Commission</li>
        <li>Additional safeguards as appropriate (encryption, access controls, data minimization)</li>
      </ul>

      <h2>Removed Subprocessors</h2>
      <p>We will note here when subprocessors are removed.</p>
      <p style={{ color: "rgba(0,0,0,0.55)" }}>— None at this time —</p>

      <h2>Sub-subprocessors</h2>
      <p>
        Some subprocessors use their own sub-vendors (e.g., AWS may host some of Stripe's
        infrastructure). We require subprocessors to maintain equivalent protections in their
        sub-vendor relationships.
      </p>

      <h2>Questions</h2>
      <p>
        <strong>Email:</strong> <a href="mailto:privacy@thenook.rent">privacy@thenook.rent</a>
        <br />
        <strong>Mail:</strong> Privacy Officer, Zentaro Systems Ltd, 167-169 Great Portland Street, 5th Floor, London, W1W 5PF,
        United Kingdom
      </p>
    </LegalPageLayout>
  );
}
