import { useEffect, useRef, useState } from "react";
import { ChevronDown, MapPin, Check } from "lucide-react";
import { CITY_LIST } from "@/data/cities";
import { useLandingStore } from "@/lib/landing/landingStore";
import { cn } from "@/lib/utils";

interface Props {
  variant?: "header" | "form";
  className?: string;
}

export function CitySwitcher({ variant = "header", className }: Props) {
  const [open, setOpen] = useState(false);
  const { city, setCity } = useLandingStore();
  const ref = useRef<HTMLDivElement>(null);
  const current = CITY_LIST.find((c) => c.id === city) ?? CITY_LIST[0];

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "inline-flex items-center gap-1.5 font-medium transition-colors",
          variant === "header"
            ? "h-10 px-3.5 rounded-pill border border-charcoal-200 text-sm text-charcoal-800 hover:border-charcoal-950 bg-paper/60"
            : "h-12 w-full px-4 rounded-md border border-border bg-surface-elevated text-sm text-charcoal-950 justify-between",
        )}
      >
        <span className="inline-flex items-center gap-1.5">
          {variant === "header" && <MapPin className="h-3.5 w-3.5" />}
          {current.displayName}
        </span>
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 z-50 mt-2 w-56 max-h-80 overflow-auto rounded-card border border-border bg-paper shadow-elevated py-1 animate-scale-in origin-top-right"
        >
          {CITY_LIST.map((c) => {
            const active = c.id === city;
            return (
              <li key={c.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    setCity(c.id);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full px-3 py-2 text-left text-sm flex items-center justify-between gap-2 hover:bg-charcoal-950/5 transition-colors",
                    active && "text-charcoal-950 font-semibold",
                  )}
                >
                  <span>
                    {c.iconEmoji ?? "📍"} {c.displayName}
                  </span>
                  {active && <Check className="h-3.5 w-3.5 text-sage-700" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
