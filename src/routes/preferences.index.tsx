import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/preferences/")({
  component: NotificationsTab,
});

function NotificationsTab() {
  return (
    <div className="space-y-8">
      <header>
        <h2 className="font-display text-2xl font-bold text-charcoal-950">
          Notification settings
        </h2>
        <p className="text-charcoal-600 text-sm mt-1">
          Choose how you'd like to receive your alerts.
        </p>
      </header>

      <section className="p-6 rounded-card bg-surface-elevated border border-border">
        <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-sage-700 mb-2">
          Coming next
        </div>
        <p className="text-sm text-charcoal-600">
          Subscription plan cards, alert channel selector, and frequency radio cards
          land in the next build pass. Your stored preferences will be applied automatically.
        </p>
      </section>
    </div>
  );
}
