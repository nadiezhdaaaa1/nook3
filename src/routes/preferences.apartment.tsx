import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/preferences/apartment")({
  component: () => (
    <div>
      <h2 className="font-display text-2xl font-bold text-charcoal-950">Apartment Details</h2>
      <p className="text-sm text-charcoal-600 mt-1">Beds, baths, amenities (tri-state).</p>
      <div className="mt-6 p-6 rounded-card bg-surface-elevated border border-border text-sm text-charcoal-600">
        Full editing UI lands in the next build pass.
      </div>
    </div>
  ),
});
