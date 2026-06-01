import { cn } from "@/lib/utils";
import type { RentProtection } from "@/lib/onboarding/store";
import type { CityConfig } from "@/data/cities";
import { Shield, Info } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface Props {
  city: CityConfig;
  value: RentProtection;
  onChange: (v: RentProtection) => void;
}

const SHORT_LABELS: Record<string, string> = {
  all: "All",
  likely: "Likely",
  verified: "Verified only",
};

export function RentProtectionPicker({ city, value, onChange }: Props) {
  const opts = city.rentProtection.options ?? [];
  if (!city.rentProtection.enabled || opts.length === 0) return null;

  const active = opts.find((o) => o.id === value);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Shield className="h-4 w-4 text-charcoal-700" />
        <h3 className="font-display text-base font-semibold text-charcoal-950">
          {city.rentProtection.label}
        </h3>
        <Popover>
          <PopoverTrigger
            type="button"
            aria-label="What is this?"
            className="inline-flex items-center justify-center h-5 w-5 rounded-full text-charcoal-500 hover:text-charcoal-950 hover:bg-charcoal-100 transition-colors"
          >
            <Info className="h-3.5 w-3.5" />
          </PopoverTrigger>
          <PopoverContent
            side="top"
            align="start"
            className="w-72 text-xs leading-relaxed text-charcoal-700 bg-paper border border-border rounded-md p-3 shadow-md"
          >
            <p className="mb-2">{city.rentProtection.tooltip}</p>
            <ul className="space-y-1.5">
              {opts.map((o) => (
                <li key={o.id}>
                  <span className="font-semibold text-charcoal-950">{SHORT_LABELS[o.id] ?? o.title}:</span>{" "}
                  <span className="text-charcoal-600">{o.description}</span>
                </li>
              ))}
            </ul>
          </PopoverContent>
        </Popover>
      </div>

      <div
        role="radiogroup"
        aria-label={city.rentProtection.label}
        className="inline-flex w-full sm:w-auto p-1 rounded-pill bg-surface-elevated border border-border"
      >
        {opts.map((o) => {
          const selected = value === o.id;
          return (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(o.id)}
              className={cn(
                "flex-1 sm:flex-initial px-4 h-9 rounded-pill text-sm font-medium transition-colors whitespace-nowrap",
                selected
                  ? "bg-charcoal-950 text-paper shadow-sm"
                  : "text-charcoal-700 hover:text-charcoal-950",
              )}
            >
              {SHORT_LABELS[o.id] ?? o.title}
            </button>
          );
        })}
      </div>

      {active && (
        <p className="text-xs text-charcoal-500">{active.description}</p>
      )}
    </div>
  );
}
