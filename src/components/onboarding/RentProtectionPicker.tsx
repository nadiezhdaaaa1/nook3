import { cn } from "@/lib/utils";
import type { RentProtection } from "@/lib/onboarding/store";
import type { CityConfig } from "@/data/cities";

interface Props {
  city: CityConfig;
  value: RentProtection;
  onChange: (v: RentProtection) => void;
}

export function RentProtectionPicker({ city, value, onChange }: Props) {
  const opts = city.rentProtection.options ?? [];
  if (!city.rentProtection.enabled || opts.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-display text-base font-semibold text-charcoal-950">
          {city.rentProtection.label}
        </h3>
        {city.rentProtection.tooltip && (
          <p className="text-xs text-charcoal-500 max-w-md text-right">
            {city.rentProtection.tooltip}
          </p>
        )}
      </div>
      <div className="grid sm:grid-cols-3 gap-3">
        {opts.map((o) => {
          const selected = value === o.id;
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => onChange(o.id)}
              className={cn(
                "p-4 rounded-card border-2 text-left transition-colors",
                selected
                  ? "border-charcoal-950 bg-surface-elevated"
                  : "border-border bg-transparent hover:border-charcoal-400",
              )}
            >
              <div className="text-sm font-semibold text-charcoal-950 mb-1">
                {o.title}
              </div>
              <div className="text-xs text-charcoal-600 leading-relaxed">
                {o.description}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
