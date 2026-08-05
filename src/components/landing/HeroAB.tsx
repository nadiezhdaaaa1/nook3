import { useState } from "react";
import { HeroA } from "./heroA/HeroA";
import { HeroB } from "./heroB/HeroB";
import { HeroScrollNav } from "./shared/HeroScrollNav";

// TODO: remove before production — A/B presentation switcher
export function HeroAB() {
  const [variant, setVariant] = useState<"A" | "B">("B");

  return (
    <div className="relative">
      <HeroScrollNav />
      {/* Both variants stay mounted so toggling never re-runs the load animation. */}
      <div style={{ display: variant === "A" ? "block" : "none" }}>
        <HeroA />
      </div>
      <div style={{ display: variant === "B" ? "block" : "none" }}>
        <HeroB />
      </div>

      {/* TODO: remove before production — A/B presentation switcher */}
      <div
        className="absolute bottom-6 right-6 z-30 inline-flex h-7 items-center rounded-[80px] border p-0.5"
        style={{
          backgroundColor: "rgba(255,255,255,0.4)",
          borderColor: "#b3aea6",
          backdropFilter: "blur(8px)",
        }}
        role="group"
        aria-label="Hero version"
      >
        {(["A", "B"] as const).map((v) => {
          const active = variant === v;
          return (
            <button
              key={v}
              type="button"
              onClick={() => setVariant(v)}
              aria-pressed={active}
              className="inline-flex h-6 min-w-7 items-center justify-center rounded-[80px] text-xs font-medium transition-colors"
              style={{
                backgroundColor: active ? "#241c12" : "transparent",
                color: active ? "#f4f1ea" : "#241c12",
                outlineOffset: 2,
              }}
            >
              {v}
            </button>
          );
        })}
      </div>
    </div>
  );
}
