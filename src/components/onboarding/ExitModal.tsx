import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onStay: () => void;
  onExit: () => void;
}

export function ExitModal({ open, onStay, onExit }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onStay();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onStay]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-modal-title"
    >
      <div
        className="absolute inset-0 bg-charcoal-950/40 backdrop-blur-sm animate-in fade-in"
        onClick={onStay}
      />
      <div
        className={cn(
          "relative w-full max-w-md bg-paper rounded-card shadow-elevated border border-charcoal-950/8",
          "animate-in fade-in zoom-in-95 duration-150",
        )}
      >
        <button
          type="button"
          onClick={onStay}
          aria-label="Close"
          className="absolute right-3 top-3 h-8 w-8 inline-flex items-center justify-center rounded-pill hover:bg-charcoal-950/5"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="p-7 pt-8">
          <h2
            id="exit-modal-title"
            className="font-display text-2xl font-bold text-charcoal-950 leading-tight tracking-[-0.01em]"
          >
            Exit onboarding?
          </h2>
          <p className="mt-2 text-sm text-charcoal-600">
            Your progress is saved on this device. You can come back anytime
            and pick up exactly where you left off.
          </p>
          <div className="mt-6 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onExit}
              className="h-11 px-4 inline-flex items-center text-sm font-semibold text-charcoal-600 hover:text-charcoal-950"
            >
              Exit
            </button>
            <button
              type="button"
              onClick={onStay}
              className="h-11 px-5 inline-flex items-center rounded-pill bg-charcoal-950 text-paper text-sm font-semibold hover:bg-charcoal-800"
            >
              Stay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
