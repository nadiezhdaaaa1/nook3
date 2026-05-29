import { cn } from "@/lib/utils";

interface Props {
  mode: "specific" | "flexible";
  date?: string;
  onChange: (mode: "specific" | "flexible", date?: string) => void;
}

export function MoveInPicker({ mode, date, onChange }: Props) {
  const defaultDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().slice(0, 10);
  })();

  return (
    <div className="grid sm:grid-cols-2 gap-3">
      <button
        type="button"
        onClick={() => onChange("specific", date ?? defaultDate)}
        className={cn(
          "p-5 rounded-card border-2 text-left transition-colors",
          mode === "specific"
            ? "border-charcoal-950 bg-surface-elevated"
            : "border-border bg-transparent hover:border-charcoal-400",
        )}
      >
        <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-charcoal-500 mb-2">
          Specific date
        </div>
        <input
          type="date"
          value={date ?? defaultDate}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => onChange("specific", e.target.value)}
          className="w-full bg-transparent text-base font-semibold text-charcoal-950 focus:outline-none"
        />
      </button>

      <button
        type="button"
        onClick={() => onChange("flexible")}
        className={cn(
          "p-5 rounded-card border-2 text-left transition-colors",
          mode === "flexible"
            ? "border-charcoal-950 bg-surface-elevated"
            : "border-border bg-transparent hover:border-charcoal-400",
        )}
      >
        <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-charcoal-500 mb-2">
          Flexible
        </div>
        <div className="text-base font-semibold text-charcoal-950">
          I'm exploring
        </div>
      </button>
    </div>
  );
}
