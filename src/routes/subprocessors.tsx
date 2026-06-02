import { createFileRoute } from "@tanstack/react-router";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

export const Route = createFileRoute("/subprocessors")({
  head: () => ({
    meta: [
      { title: "Subprocessors — Nook" },
      { name: "description", content: "Third-party providers Nook uses to deliver the service." },
      { property: "og:title", content: "Subprocessors — Nook" },
      { property: "og:description", content: "Third-party providers Nook uses to deliver the service." },
    ],
  }),
  component: SubprocessorsPage,
});

const SUBPROCESSORS = [
  { name: "Supabase", purpose: "Database, authentication, file storage", location: "United States" },
  { name: "Lovable Cloud", purpose: "Application hosting & email infrastructure", location: "United States / EU" },
  { name: "Google Maps Platform", purpose: "Geocoding, maps, place search", location: "United States" },
  { name: "Stripe", purpose: "Payment processing (planned)", location: "United States" },
  { name: "Analytics provider", purpose: "Product analytics (planned)", location: "TBD" },
];

function SubprocessorsPage() {
  return (
    <LegalPageLayout title="Subprocessors" lastUpdated="July 2, 2026">
      {/* Replace before launch — to be drafted by legal counsel */}
      <p>
        Nook engages the following third-party subprocessors to help deliver
        the service. We update this list when we add or remove a subprocessor.
      </p>
      <div className="overflow-x-auto mt-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-charcoal-200">
              <th className="py-3 pr-4 font-semibold">Subprocessor</th>
              <th className="py-3 pr-4 font-semibold">Purpose</th>
              <th className="py-3 font-semibold">Location</th>
            </tr>
          </thead>
          <tbody>
            {SUBPROCESSORS.map((s) => (
              <tr key={s.name} className="border-b border-charcoal-100">
                <td className="py-3 pr-4 font-medium">{s.name}</td>
                <td className="py-3 pr-4">{s.purpose}</td>
                <td className="py-3">{s.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-8">
        Subscribe to subprocessor updates: privacy@thenook.rent
      </p>
    </LegalPageLayout>
  );
}
