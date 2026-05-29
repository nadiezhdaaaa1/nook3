import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface PillOption {
  id: string;
  label: string;
  sub?: string;
}

interface Props {
  options: PillOption[];
  value: string | string[];
  onChange: (id: string) => void;
  multi?: boolean;
  size?: "md" | "lg";
}

export function PillGroup({ options, value, onChange, multi, size = "md" }: Props) {
  const isSelected = (id: string) =>
    multi ? (value as string[]).includes(id) : value === id;

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const selected = isSelected(opt.id);
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={cn(
              "inline-flex items-center gap-2 rounded-pill border text-sm font-medium transition-colors",
              size === "lg" ? "h-12 px-5" : "h-10 px-4",
              selected
                ? "bg-charcoal-950 text-paper border-charcoal-950"
                : "bg-transparent border-charcoal-200 text-charcoal-800 hover:border-charcoal-950",
            )}
          >
            {selected && <Check className="h-3.5 w-3.5" />}
            <span>{opt.label}</span>
            {opt.sub && (
              <span className={cn("text-xs", selected ? "text-paper/70" : "text-charcoal-500")}>
                {opt.sub}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
