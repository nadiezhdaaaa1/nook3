import { useEffect, useRef, useState } from "react";
import { ChevronDown, MapPin, Check, Clock } from "lucide-react";
import { CITY_LIST, type CityId } from "@/data/cities";
import { useLandingStore } from "@/lib/landing/landingStore";
import { cn } from "@/lib/utils";
import { WaitlistDialog } from "./WaitlistDialog";

// Only NYC is active at launch. Others appear in the picker with a
// "Coming soon" tag and add the user to a (front-end-only) waitlist toast.
const ACTIVE: CityId[] = ["nyc"];
const COMING_SOON: CityId[] = ["la", "sf-bay", "chicago"];

interface Props {
  className?: string;
  size?: "sm" | "md";
}

export function LandingCitySelector({ className, size = "md" }: Props) {
  const [open, setOpen] = useState(false);
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const [waitlistCity, setWaitlistCity] = useState<{ id: string | null; label: string | null }>({
    id: null,
    label: null,
  });
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

  const handlePick = (id: CityId, status: "active" | "soon") => {
    if (status === "active") {
      setCity(id);
      setOpen(false);
      return;
    }
    const c = CITY_LIST.find((x) => x.id === id);
    setWaitlistCity({ id, label: c?.displayName ?? null });
    setOpen(false);
    setWaitlistOpen(true);
  };

  const handleOther = () => {
    setWaitlistCity({ id: null, label: null });
    setOpen(false);
    setWaitlistOpen(true);
  };

  return (
    <div ref={ref} className={cn("relative inline-block", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "inline-flex items-center gap-2 rounded-pill border bg-[var(--color-brand-soft)] font-medium text-[var(--color-brand-charcoal)] transition-all hover:border-[var(--color-brand-charcoal)] hover:shadow-subtle",
          size === "sm" ? "h-9 px-3 text-xs" : "h-11 px-4 text-sm",
        )}
        style={{ borderColor: "var(--color-brand-clay)" }}
      >
        <MapPin className="h-3.5 w-3.5 text-[var(--color-brand-terracotta)]" />
        <span className="text-[var(--color-charcoal-500)]">Looking in</span>
        <span className="font-semibold">{current.displayName}</span>
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute left-0 z-50 mt-2 w-72 max-h-96 overflow-auto rounded-card border bg-[var(--color-brand-soft)] shadow-elevated py-2 animate-scale-in origin-top-left"
          style={{ borderColor: "var(--color-brand-clay)" }}
        >
          <SectionLabel>Available now</SectionLabel>
          {ACTIVE.map((id) => {
            const c = CITY_LIST.find((x) => x.id === id);
            if (!c) return null;
            const active = c.id === city;
            return (
              <li key={c.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => handlePick(c.id, "active")}
                  className={cn(
                    "w-full px-4 py-2.5 text-left text-sm flex items-center justify-between gap-2 hover:bg-[var(--color-brand-cream)] transition-colors",
                    active && "font-semibold",
                  )}
                >
                  <span className="inline-flex items-center gap-2">
                    <span>{c.iconEmoji ?? "📍"}</span>
                    {c.displayName}
                  </span>
                  {active && <Check className="h-4 w-4 text-[var(--color-brand-sage)]" />}
                </button>
              </li>
            );
          })}

          <SectionLabel>Coming soon</SectionLabel>
          {COMING_SOON.map((id) => {
            const c = CITY_LIST.find((x) => x.id === id);
            if (!c) return null;
            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => handlePick(c.id, "soon")}
                  className="w-full px-4 py-2.5 text-left text-sm flex items-center justify-between gap-2 hover:bg-[var(--color-brand-cream)] transition-colors"
                >
                  <span className="inline-flex items-center gap-2 text-[var(--color-charcoal-700)]">
                    <span>{c.iconEmoji ?? "📍"}</span>
                    {c.displayName}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-[0.14em] text-[var(--color-brand-sage)]">
                    <Clock className="h-3 w-3" />
                    Soon
                  </span>
                </button>
              </li>
            );
          })}

          <div className="my-1.5 mx-4 h-px bg-[var(--color-brand-clay)]" />
          <li>
            <button
              type="button"
              onClick={handleOther}
              className="w-full px-4 py-2.5 text-left text-sm hover:bg-[var(--color-brand-cream)] transition-colors text-[var(--color-brand-terracotta)] font-medium"
            >
              Other city — join waitlist →
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-4 pt-2 pb-1 text-[10px] font-mono uppercase tracking-[0.16em] text-[var(--color-charcoal-500)]">
      {children}
    </div>
  );
}
