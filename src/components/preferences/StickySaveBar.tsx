import { useEffect, useRef, useState } from "react";
import { Check, Undo2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface StickySaveBarProps<T> {
  state: T;
  onDiscard: (snapshot: T) => void;
  label?: string;
}

/**
 * Sticky bottom bar that tracks dirty state by JSON comparison.
 * - Snapshot taken on mount and after Save.
 * - Discard restores the snapshot via `onDiscard`.
 * - Changes auto-persist via zustand; Save commits the baseline + toasts.
 */
export function StickySaveBar<T>({ state, onDiscard, label = "Unsaved changes" }: StickySaveBarProps<T>) {
  const [baseline, setBaseline] = useState<string>(() => JSON.stringify(state));
  const [saving, setSaving] = useState(false);
  const mounted = useRef(false);

  // Re-baseline if the underlying record is swapped (e.g. user changes active search)
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
  }, []);

  const current = JSON.stringify(state);
  const dirty = current !== baseline;

  // Warn on tab close with unsaved changes
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const handleSave = async () => {
    setSaving(true);
    // Simulated commit; state already persisted in zustand
    await new Promise((r) => setTimeout(r, 250));
    setBaseline(current);
    setSaving(false);
    toast.success("Preferences saved");
  };

  const handleDiscard = () => {
    try {
      const snap = JSON.parse(baseline) as T;
      onDiscard(snap);
      toast("Changes discarded");
    } catch {
      toast.error("Couldn't restore previous state");
    }
  };

  return (
    <div
      aria-live="polite"
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300",
        dirty ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none",
      )}
    >
      <div className="flex items-center gap-3 pl-5 pr-2 h-14 rounded-pill bg-charcoal-950 text-paper shadow-lg border border-charcoal-800">
        <span className="inline-flex items-center gap-2 text-sm font-semibold">
          <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
          {label}
        </span>
        <button
          type="button"
          onClick={handleDiscard}
          disabled={saving}
          className="inline-flex items-center gap-1.5 h-10 px-3 rounded-pill text-sm font-semibold text-paper/80 hover:text-paper hover:bg-charcoal-800 transition-colors disabled:opacity-50"
        >
          <Undo2 className="h-3.5 w-3.5" /> Discard
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-1.5 h-10 px-4 rounded-pill bg-paper text-charcoal-950 text-sm font-semibold hover:bg-paper-warm transition-colors disabled:opacity-50"
        >
          <Check className="h-3.5 w-3.5" /> {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </div>
  );
}
