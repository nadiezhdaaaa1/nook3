import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useReducer, useRef, useState } from "react";
import { Check, Circle, Loader2, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding/loading")({
  component: SearchSetupLoader,
});

const STEPS = [
  "Gathering listings from across the web",
  "Merging duplicates, filtering out scams and hidden fees",
  "Scoring how well each place fits you",
] as const;

// Minimum dwell per step in active state (ms)
const STEP_MS = [1200, 1600, 1400] as const;
// Time on step 3 before switching to "Almost there…" copy
const ALMOST_THERE_DELAY = 3000;

function SearchSetupLoader() {
  const navigate = useNavigate();
  // active = index currently in-progress; equals STEPS.length when all done
  const [active, advance] = useReducer((n: number) => n + 1, 0);
  const [almostThere, setAlmostThere] = useState(false);
  const startedRef = useRef(false);

  // Block back-nav while loader is running
  useEffect(() => {
    const block = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", block);
    return () => window.removeEventListener("beforeunload", block);
  }, []);

  // Sequential simulated progress
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    let cancelled = false;
    (async () => {
      for (let i = 0; i < STEPS.length; i++) {
        await new Promise<void>((resolve) => {
          const t = setTimeout(resolve, STEP_MS[i]);
          if (cancelled) clearTimeout(t);
        });
        if (cancelled) return;
        advance();
      }
      // Brief settle pause, then route
      await new Promise((r) => setTimeout(r, 400));
      if (!cancelled) navigate({ to: "/onboarding/preview" });
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  // "Almost there" fallback if step 3 stalls past 3s (won't fire under simulation,
  // but covers slow-backend mode).
  useEffect(() => {
    if (active !== STEPS.length - 1) return;
    const t = setTimeout(() => setAlmostThere(true), ALMOST_THERE_DELAY);
    return () => clearTimeout(t);
  }, [active]);

  const activeLabel = active < STEPS.length ? STEPS[active] : null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={activeLabel ?? "Finishing up"}
      className="fixed inset-0 z-50 flex items-center justify-center bg-paper px-5 sm:px-6"
    >
      <div className="w-full max-w-[520px] flex flex-col items-center text-center">
        {/* Icon badge */}
        <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-sage-100 flex items-center justify-center">
          <Search
            className="h-7 w-7 sm:h-8 sm:w-8 text-sage-700 motion-safe:animate-pulse"
            strokeWidth={2}
            aria-hidden="true"
          />
        </div>

        {/* Heading */}
        <h1 className="mt-8 font-display font-semibold text-[30px] sm:text-[44px] leading-[1.15] text-charcoal-950">
          Finding your <span className="italic text-sage-700">matches</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-3 text-base sm:text-lg text-charcoal-500 leading-snug">
          {almostThere
            ? "Almost there — pulling the last few in…"
            : "This usually takes a few seconds…"}
        </p>

        {/* Steps */}
        <ul className="mt-10 w-full flex flex-col gap-3 text-left">
          {STEPS.map((label, i) => {
            const state: "done" | "active" | "pending" =
              i < active ? "done" : i === active ? "active" : "pending";
            return (
              <li
                key={label}
                aria-label={
                  state === "done"
                    ? `Completed: ${label}`
                    : state === "active"
                      ? `In progress: ${label}`
                      : label
                }
                className={cn(
                  "flex items-center gap-3.5 rounded-2xl px-5 py-[18px]",
                  "transition-[background-color,border-color,opacity,transform] duration-[240ms] ease-out",
                  state === "done" &&
                    "bg-sage-100 border border-sage-300 text-charcoal-950 motion-safe:animate-[settle_200ms_ease-out]",
                  state === "active" &&
                    "bg-paper-elevated border-[1.5px] border-charcoal-950 text-charcoal-950",
                  state === "pending" &&
                    "bg-paper-elevated border border-charcoal-200 text-charcoal-500",
                )}
              >
                <span className="flex-shrink-0 inline-flex items-center justify-center w-5 h-5">
                  {state === "done" ? (
                    <Check className="h-5 w-5 text-sage-700" strokeWidth={2.25} />
                  ) : state === "active" ? (
                    <Loader2
                      className="h-5 w-5 text-charcoal-950 motion-safe:animate-spin"
                      strokeWidth={2}
                    />
                  ) : (
                    <Circle className="h-5 w-5 text-charcoal-200" strokeWidth={1.5} />
                  )}
                </span>
                <span
                  className={cn(
                    "text-base",
                    state === "pending" ? "font-normal" : "font-medium",
                  )}
                >
                  {label}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Local keyframes for the done "settle" pop */}
      <style>{`
        @keyframes settle {
          from { opacity: 0.85; transform: scale(0.985); }
          to   { opacity: 1;    transform: scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          [aria-label^="In progress"] svg { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
