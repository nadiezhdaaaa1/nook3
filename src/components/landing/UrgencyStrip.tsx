import { useEffect, useState } from "react";

const CITY_BREAKDOWN = [
  ["NYC", 23],
  ["LA", 11],
  ["SF", 7],
  ["Chicago", 3],
  ["DC", 2],
  ["Boston", 1],
] as const;

export function UrgencyStrip() {
  const [hourly, setHourly] = useState(47);
  const [removed, setRemoved] = useState(12);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const tick = () => {
      setHourly((c) => c + 1);
    };
    let id = window.setTimeout(function loop() {
      tick();
      id = window.setTimeout(loop, 30000 + Math.random() * 60000);
    }, 30000 + Math.random() * 60000);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    let id = window.setTimeout(function loop() {
      setRemoved((c) => c + 1);
      id = window.setTimeout(loop, 120000 + Math.random() * 60000);
    }, 120000 + Math.random() * 60000);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <section
      className="relative bg-charcoal-950 text-paper border-y border-charcoal-800"
      aria-label="Live listings activity"
    >
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full px-6 py-3.5 flex items-center justify-center gap-3 text-center text-xs sm:text-sm font-medium hover:bg-charcoal-900 transition-colors"
      >
        <span className="relative inline-flex items-center gap-1.5 text-peach-300">
          <span className="relative h-2 w-2">
            <span className="absolute inset-0 rounded-pill bg-peach-500 animate-ping opacity-75" />
            <span className="relative block h-2 w-2 rounded-pill bg-peach-500" />
          </span>
          LIVE
        </span>
        <span className="hidden sm:inline text-charcoal-400">·</span>
        <span>
          <span className="font-display font-bold tabular-nums">{hourly}</span> listings posted across our cities in the last hour
        </span>
        <span className="hidden md:inline text-charcoal-400">·</span>
        <span className="hidden md:inline text-charcoal-300">
          <span className="font-display font-bold tabular-nums">{removed}</span> already removed
        </span>
      </button>

      {expanded && (
        <div className="px-6 pb-4 text-center text-xs text-charcoal-300 font-mono animate-fade-in">
          {CITY_BREAKDOWN.map(([c, n], i) => (
            <span key={c}>
              {c}: <span className="text-paper font-semibold">{n} new</span>
              {i < CITY_BREAKDOWN.length - 1 && <span className="mx-2 text-charcoal-500">·</span>}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}
