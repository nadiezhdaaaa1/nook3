import { cn } from "@/lib/utils";
import type { RentProtection } from "@/lib/onboarding/store";
import type { CityConfig } from "@/data/cities";
import { Shield, Check } from "lucide-react";

interface Props {
  city: CityConfig;
  value: RentProtection;
  onChange: (v: RentProtection) => void;
  /** Number of selected neighborhoods (drives breadth multiplier). */
  neighborhoodCount?: number;
}

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, "")}k`;
  return n.toString();
}

export function RentProtectionPicker({
  city,
  value,
  onChange,
  neighborhoodCount = 0,
}: Props) {
  if (!city.rentProtection.enabled) return null;

  // Normalize legacy "likely" -> "all"
  const current: "all" | "verified" = value === "verified" ? "verified" : "all";

  const baseline = city.rentProtection.matchBaseline ?? 5000;
  // Breadth multiplier: more neighborhoods -> more matches. Cap at 1.0.
  const breadth = neighborhoodCount > 0
    ? Math.min(1, Math.max(0.15, neighborhoodCount / 10))
    : 1;
  const N1 = Math.max(50, Math.round(baseline * breadth));
  const N2 = Math.max(5, Math.round(N1 * 0.03));

  const cards: Array<{
    id: "all" | "verified";
    title: string;
    body: string;
    badge: string;
    count: number;
  }> = [
    {
      id: "all",
      title: "Show all apartments",
      body:
        "Include all matching listings. We'll mark rent-stabilized ones in your alerts.",
      badge: "Recommended",
      count: N1,
    },
    {
      id: "verified",
      title: `${city.rentProtection.label?.includes("Rent Control") ? "Rent-controlled" : "Rent-stabilized"} only`,
      body: `Only show verified ${city.rentProtection.label?.includes("Rent Control") ? "rent-controlled" : "rent-stabilized"} units.`,
      badge: "Stricter",
      count: N2,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Shield className="h-4 w-4 text-charcoal-700" />
        <h3 className="font-display text-base font-semibold text-charcoal-950">
          {city.rentProtection.label}
        </h3>
      </div>

      {city.rentProtection.tooltipShort && (
        <p className="text-sm leading-relaxed text-charcoal-600">
          {city.rentProtection.tooltipShort}
        </p>
      )}

      <div role="radiogroup" aria-label={city.rentProtection.label} className="space-y-2">
        {cards.map((c) => {
          const selected = current === c.id;
          return (
            <button
              key={c.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(c.id)}
              className={cn(
                "w-full text-left rounded-card border p-4 transition-all",
                selected
                  ? "border-charcoal-950 bg-charcoal-950/[0.03] shadow-sm"
                  : "border-border bg-surface-elevated hover:border-charcoal-400",
              )}
            >
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                    selected
                      ? "border-charcoal-950 bg-charcoal-950 text-paper"
                      : "border-charcoal-400 bg-paper",
                  )}
                  aria-hidden
                >
                  {selected && <Check className="h-3 w-3" strokeWidth={3} />}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-charcoal-950">
                    {c.title}
                  </div>
                  <div className="mt-1 text-xs text-charcoal-600 leading-relaxed">
                    {c.body}
                  </div>
                  <div className="mt-2 text-[11px] font-mono uppercase tracking-[0.14em] text-charcoal-500">
                    <span
                      className={
                        c.id === "all" ? "text-peach-700" : "text-charcoal-700"
                      }
                    >
                      {c.badge}
                    </span>
                    <span className="mx-2 text-charcoal-300">·</span>
                    <span>~{formatCount(c.count)} matches/week</span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
