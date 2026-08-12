import { useEffect, useRef, useState } from "react";
import { Check, Undo2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { OriginButton } from "@/components/ui/origin-button";

interface StickySaveBarProps<T> {
  state: T;
  onDiscard: (snapshot: T) => void;
  label?: string;
  /** Optional fn returning a list of human-readable labels for changed fields. */
  getChanges?: (baseline: T, current: T) => string[];
  /** Optional success toast message. */
  successMessage?: string;
}

/**
 * Sticky bottom bar that tracks dirty state by JSON comparison.
 * - Snapshot taken on mount and after Save.
 * - Discard restores the snapshot via `onDiscard`.
 * - Changes auto-persist via zustand; Save commits the baseline + toasts.
 */
export function StickySaveBar<T>({ state, onDiscard, label = "Unsaved changes", getChanges, successMessage = "Preferences saved" }: StickySaveBarProps<T>) {
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
    toast.success(successMessage);
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
      <div className="flex items-center gap-4 px-4 py-3 h-16 rounded-pill bg-charcoal-950 text-paper shadow-lg border border-charcoal-800">
        <span className="inline-flex flex-col leading-tight">
          <span className="inline-flex items-center gap-2 text-[15px] font-semibold">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400 animate-pulse" />
            {label}
          </span>
          {getChanges && dirty && (() => {
            try {
              const changes = getChanges(JSON.parse(baseline) as T, state);
              if (changes.length === 0) return null;
              return (
                <span className="text-[12px] text-sage-200/90 mt-0.5 max-w-[280px] truncate">
                  {changes.join(", ")}
                </span>
              );
            } catch {
              return null;
            }
          })()}
        </span>
        <OriginButton
          variant="tertiary"
          size="medium"
          onClick={handleDiscard}
          disabled={saving}
          className="border-paper/20 text-paper hover:bg-paper/10 hover:text-paper"
        >
          <Undo2 className="h-4 w-4" /> Discard
        </OriginButton>
        <OriginButton
          variant="main"
          size="medium"
          onClick={handleSave}
          disabled={saving}
          loading={saving}
        >
          <Check className="h-4 w-4" /> {saving ? "Saving…" : "Save changes"}
        </OriginButton>
      </div>
    </div>
  );
}
