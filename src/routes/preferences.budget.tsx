import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/preferences/budget")({
  component: () => (
    <div>
      <h2 className="font-display text-2xl font-bold text-charcoal-950">Budget & Criteria</h2>
      <p className="text-sm text-charcoal-600 mt-1">Max rent, move-in date, rent stabilization, broker fee.</p>
      <div className="mt-6 p-6 rounded-card bg-surface-elevated border border-border text-sm text-charcoal-600">
        Full editing UI lands in the next build pass.
      </div>
    </div>
  ),
});
