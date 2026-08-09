import { useEffect, useState } from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import type { CityConfig } from "@/data/cities";

interface Props {
  city: CityConfig;
  value: [number, number];
  onChange: (v: [number, number]) => void;
}

const META: React.CSSProperties = {
  fontWeight: 500,
  fontSize: 12,
  lineHeight: "16px",
  letterSpacing: "1.54px",
  textTransform: "uppercase",
  color: "#6e6459",
};

export function RentSlider({ city, value, onChange }: Props) {
  const { min, max, step, median1BR } = city.budget;
  const [local, setLocal] = useState<[number, number]>(value);
  useEffect(() => setLocal(value), [value]);

  const [lo, hi] = local;

  return (
    <div>
      <div
        className="font-display tabular-nums"
        style={{
          fontWeight: 700,
          fontSize: 36,
          lineHeight: "40px",
          letterSpacing: "-0.54px",
          color: "#241c12",
        }}
      >
        ${lo.toLocaleString()} <span style={{ color: "#6e6459" }}>–</span> ${hi.toLocaleString()}
      </div>

      <SliderPrimitive.Root
        min={min}
        max={max}
        step={step}
        value={local}
        minStepsBetweenThumbs={1}
        onValueChange={(v) => setLocal([v[0], v[1]] as [number, number])}
        onValueCommit={(v) => onChange([v[0], v[1]] as [number, number])}
        className="relative flex w-full touch-none select-none items-center"
        style={{ marginTop: 20, height: 20 }}
      >
        <SliderPrimitive.Track
          className="relative w-full grow overflow-hidden"
          style={{ height: 6, borderRadius: 999, background: "#d8d5cd" }}
        >
          <SliderPrimitive.Range className="absolute h-full" style={{ background: "#B94613" }} />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb aria-label="Minimum rent" className="ob-thumb" />
        <SliderPrimitive.Thumb aria-label="Maximum rent" className="ob-thumb" />
      </SliderPrimitive.Root>

      <div className="flex items-center justify-between gap-3" style={{ marginTop: 20 }}>
        <span style={META}>${min.toLocaleString()}</span>
        <span style={META} className="hidden sm:block">
          Median 1BR in {city.displayName}: ${median1BR.toLocaleString()}
        </span>
        <span style={META}>${max.toLocaleString()}</span>
      </div>
    </div>
  );
}
