import { createFileRoute } from "@tanstack/react-router";
import { Gift, Users, Calendar } from "lucide-react";

export const Route = createFileRoute("/preferences/referrals")({
  component: ReferralsPage,
});

function ReferralsPage() {
  const stats = [
    { icon: Users, label: "Friends joined", value: "3" },
    { icon: Calendar, label: "Free days earned", value: "21" },
    { icon: Gift, label: "Pending invites", value: "2" },
  ];
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-charcoal-950">
          <span className="accent-italic">Referrals</span>
        </h2>
        <p className="text-sm text-charcoal-600 mt-1">
          Every friend who joins earns you both +7 days of Premium.
        </p>
      </div>
      <div className="grid sm:grid-cols-3 gap-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-card bg-surface-elevated border border-border p-4">
              <Icon className="h-4 w-4 text-charcoal-500" />
              <div className="font-display text-2xl font-bold text-charcoal-950 mt-2">{s.value}</div>
              <div className="text-xs text-charcoal-600">{s.label}</div>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-charcoal-500">
        Your referral link is in the block below — share it anywhere.
      </p>
    </div>
  );
}
