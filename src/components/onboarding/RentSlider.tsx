import { useEffect, useState } from "react";
import type { CityConfig } from "@/data/cities";

interface Props {
  city: CityConfig;
  value: number;
  onChange: (v: number) => void;
}

export function RentSlider({ city, value, onChange }: Props) {
  const { min, max, step, median1BR } = city.budget;
  const [local, setLocal] = useState(value);
  useEffect(() => setLocal(value), [value]);

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-charcoal-500 mb-1">
            Maximum monthly rent
          </div>
          <div className="font-display text-4xl font-bold text-charcoal-950 tabular-nums">
            ${local.toLocaleString()}
          </div>
        </div>
        <input
          type="number"
          value={local}
          min={min}
          max={max}
          step={step}
          onChange={(e) => {
            const v = Math.max(min, Math.min(max, Number(e.target.value) || min));
            setLocal(v);
            onChange(v);
          }}
          className="w-32 h-11 px-3 rounded-md bg-surface-elevated border border-border focus:border-charcoal-950 focus:outline-none text-sm font-mono text-right"
        />
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={local}
        onChange={(e) => {
          const v = Number(e.target.value);
          setLocal(v);
          onChange(v);
        }}
        className="w-full accent-charcoal-950 cursor-pointer"
      />

      <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.14em] text-charcoal-500">
        <span>${min.toLocaleString()}</span>
        <span className="text-sage-700">
          Median 1BR in {city.displayName}: ${median1BR.toLocaleString()}
        </span>
        <span>${max.toLocaleString()}</span>
      </div>
    </div>
  );
}
