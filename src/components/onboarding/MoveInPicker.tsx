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

  const effective = date ?? defaultDate;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const picked = mode === "specific" ? new Date(effective + "T00:00:00") : null;
  const isPast = picked ? picked.getTime() < today.getTime() : false;
  const sixMonths = new Date();
  sixMonths.setMonth(sixMonths.getMonth() + 6);
  const isFarOut = picked ? picked.getTime() > sixMonths.getTime() : false;

  return (
    <div className="space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onChange("specific", effective)}
          className={cn(
            "p-5 rounded-card border-2 text-left transition-colors",
            mode === "specific"
              ? "border-charcoal-950 bg-surface-elevated"
              : "border-border bg-transparent hover:border-charcoal-400",
          )}
        >
          <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-charcoal-500 mb-2">
            📅 Specific date
          </div>
          <input
            type="date"
            value={effective}
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
            ⏰ Flexible
          </div>
          <div className="text-base font-semibold text-charcoal-950">
            I'm exploring
          </div>
        </button>
      </div>

      {isPast && (
        <div className="rounded-md border border-peach-500 bg-peach-100 text-peach-900 text-xs px-3 py-2">
          Move-in date must be in the future.
        </div>
      )}
      {!isPast && isFarOut && (
        <div className="rounded-md border border-charcoal-200 bg-paper-warm text-charcoal-700 text-xs px-3 py-2">
          Your move is far out. We'll keep alerts on standby and ramp up 60 days before.
        </div>
      )}
    </div>
  );
}
