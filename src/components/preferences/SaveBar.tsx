import { useEffect, useState } from "react";
import { Check } from "lucide-react";

/**
 * Inline confirmation that the store has persisted a change.
 * Watches a `signal` (any value); each change pulses the bar for 1.4s.
 */
export function SaveBar({ signal }: { signal: unknown }) {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!mounted) {
      setMounted(true);
      return;
    }
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 1400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signal]);

  return (
    <div
      aria-live="polite"
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
      }`}
    >
      <div className="px-4 h-10 inline-flex items-center gap-2 rounded-pill bg-charcoal-950 text-paper text-sm font-semibold shadow-lg">
        <Check className="h-4 w-4 text-sage-300" /> Changes saved
      </div>
    </div>
  );
}
