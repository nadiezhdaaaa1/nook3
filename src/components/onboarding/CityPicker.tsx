import { useState, useMemo } from "react";
import { Search, MapPin, Check } from "lucide-react";
import { CITY_LIST, type CityId, type CityConfig } from "@/data/cities";
import { cn } from "@/lib/utils";

interface Props {
  value: CityId | null;
  onChange: (id: CityId) => void;
}

export function CityPicker({ value, onChange }: Props) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [] as CityConfig[];
    return CITY_LIST.filter(
      (c) =>
        c.displayName.toLowerCase().includes(q) ||
        c.state.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div className="space-y-5">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search cities..."
          className="w-full h-12 pl-11 pr-4 rounded-md bg-surface-elevated border border-border focus:border-charcoal-950 focus:outline-none text-sm font-medium placeholder:text-charcoal-400"
        />
        {filtered.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-surface-elevated border border-border rounded-md shadow-elevated overflow-hidden z-10">
            {filtered.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  onChange(c.id);
                  setQuery("");
                }}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-paper-warm text-left"
              >
                <MapPin className="h-4 w-4 text-charcoal-400" />
                <span className="text-sm font-medium text-charcoal-950">
                  {c.displayName}
                </span>
                <span className="text-xs font-mono text-charcoal-400 ml-auto">
                  {c.state}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-charcoal-500 mb-3">
          Popular cities
        </div>
        <div className="flex flex-wrap gap-2">
          {CITY_LIST.map((c) => {
            const selected = value === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onChange(c.id)}
                className={cn(
                  "h-10 px-4 inline-flex items-center gap-2 rounded-pill border text-sm font-medium transition-colors",
                  selected
                    ? "bg-charcoal-950 text-paper border-charcoal-950"
                    : "bg-transparent border-charcoal-200 text-charcoal-800 hover:border-charcoal-950",
                )}
              >
                {selected && <Check className="h-3.5 w-3.5" />}
                {c.displayName}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
