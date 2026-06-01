import { useEffect, useState } from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import type { CityConfig } from "@/data/cities";

interface Props {
  city: CityConfig;
  value: [number, number];
  onChange: (v: [number, number]) => void;
}

export function RentSlider({ city, value, onChange }: Props) {
  const { min, max, step, median1BR } = city.budget;
  const [local, setLocal] = useState<[number, number]>(value);
  useEffect(() => setLocal(value), [value]);

  const [lo, hi] = local;

  return (
    <div className="space-y-5">
      <div>
        <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-charcoal-500 mb-1">
          Monthly rent range
        </div>
        <div className="font-display text-4xl font-bold text-charcoal-950 tabular-nums">
          ${lo.toLocaleString()} <span className="text-charcoal-400">–</span> ${hi.toLocaleString()}
        </div>
      </div>

      <SliderPrimitive.Root
        min={min}
        max={max}
        step={step}
        value={local}
        minStepsBetweenThumbs={1}
        onValueChange={(v) => setLocal([v[0], v[1]] as [number, number])}
        onValueCommit={(v) => onChange([v[0], v[1]] as [number, number])}
        className="relative flex w-full touch-none select-none items-center h-5"
      >
        <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-charcoal-200">
          <SliderPrimitive.Range className="absolute h-full bg-charcoal-950" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
          aria-label="Minimum rent"
          className="block h-5 w-5 rounded-full bg-charcoal-950 border-2 border-paper shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal-950/30 cursor-grab active:cursor-grabbing"
        />
        <SliderPrimitive.Thumb
          aria-label="Maximum rent"
          className="block h-5 w-5 rounded-full bg-charcoal-950 border-2 border-paper shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal-950/30 cursor-grab active:cursor-grabbing"
        />
      </SliderPrimitive.Root>

      <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.14em] text-charcoal-500">
        <span>${min.toLocaleString()}</span>
        <span className="text-sage-700 hidden sm:block">
          Median 1BR in {city.displayName}: ${median1BR.toLocaleString()}
        </span>
        <span>${max.toLocaleString()}</span>
      </div>
    </div>
  );
}
