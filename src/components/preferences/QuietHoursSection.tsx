import { useEffect, useMemo, useState } from "react";
import { Pencil } from "lucide-react";
import { toast } from "sonner";

import { usePreferencesStore } from "@/lib/preferences/store";
import { detectTimezone, formatTimeLabel } from "@/lib/preferences/notifications";
import { OriginButton } from "@/components/ui/origin-button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

function ToggleSwitch({
  checked,
  onChange,
  color = "#6A820A",
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  color?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex shrink-0 rounded-full transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal-950/30 focus-visible:ring-offset-2 focus-visible:ring-offset-paper",
        !checked && "bg-charcoal-300",
      )}
      style={{ width: 44, height: 24, padding: 0, background: checked ? color : undefined }}
    >
      <span
        aria-hidden="true"
        className="absolute top-1/2 -translate-y-1/2 rounded-full bg-white shadow-sm transition-[left] duration-200 ease-out"
        style={{ width: 20, height: 20, left: checked ? 22 : 2 }}
      />
    </button>
  );
}

/** Summary line: "No alerts during 10:00 PM – 8:00 AM (Europe/Warsaw)". */
export function QuietHoursSummary() {
  const quietHours = usePreferencesStore((s) => s.quietHours);
  const tz = useMemo(() => detectTimezone(), []);
  return (
    <p className="mt-1 text-[12px] leading-relaxed text-charcoal-600">
      No alerts during{" "}
      {quietHours.enabled ? (
        <span className="font-semibold text-charcoal-950">
          {formatTimeLabel(quietHours.start)} – {formatTimeLabel(quietHours.end)}
        </span>
      ) : (
        <span className="font-semibold text-charcoal-950">Off</span>
      )}{" "}
      ({tz})
    </p>
  );
}

/** The shared editing popup — global quiet hours (applies to all searches). */
export function QuietHoursDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const quietHours = usePreferencesStore((s) => s.quietHours);
  const setQuiet = usePreferencesStore((s) => s.setQuiet);
  const tz = useMemo(() => detectTimezone(), []);

  const [draft, setDraft] = useState(quietHours);
  useEffect(() => {
    if (open) setDraft(quietHours);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle className="font-display text-lg font-semibold text-charcoal-950">
            Quiet hours
          </DialogTitle>
          <DialogDescription>Applies to all searches.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="quiet-start"
                className="text-[11px] font-mono uppercase tracking-[0.18em] text-charcoal-500"
              >
                Start
              </label>
              <TimeField
                id="quiet-start"
                aria-label="Quiet hours start"
                value={draft.start}
                onChange={(start) => setDraft({ ...draft, start })}
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="quiet-end"
                className="text-[11px] font-mono uppercase tracking-[0.18em] text-charcoal-500"
              >
                End
              </label>
              <TimeField
                id="quiet-end"
                aria-label="Quiet hours end"
                value={draft.end}
                onChange={(end) => setDraft({ ...draft, end })}
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <span className="block text-[11px] font-mono uppercase tracking-[0.18em] text-charcoal-500">
                Timezone
              </span>
              <div className="flex h-11 w-full items-center justify-between rounded-md border border-border bg-paper-warm/60 px-4 text-sm font-medium text-charcoal-700">
                <span>{tz}</span>
                <span className="text-[11px] text-charcoal-500">detected from your browser</span>
              </div>
            </div>
          </div>
        </div>


        <DialogFooter>
          <OriginButton variant="tertiary" size="medium" onClick={() => onOpenChange(false)}>
            Cancel
          </OriginButton>
          <OriginButton
            variant="main"
            size="medium"
            onClick={() => {
              setQuiet("enabled", draft.enabled);
              setQuiet("start", draft.start);
              setQuiet("end", draft.end);
              onOpenChange(false);
              toast.success("Quiet hours saved");
            }}
          >
            Save
          </OriginButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** Summary row with an Edit button that opens the shared popup. */
export function QuietHoursRow({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={cn("flex items-start justify-between gap-4", className)}>
      <div className="min-w-0">
        <h3 className="font-display text-lg font-semibold text-charcoal-950">Quiet hours</h3>
        <QuietHoursSummary />
      </div>
      <OriginButton
        variant="tertiary"
        size="medium"
        className="h-10 shrink-0 rounded-[12px]"
        onClick={() => setOpen(true)}
      >
        <Pencil className="h-3.5 w-3.5" /> Edit
      </OriginButton>
      <QuietHoursDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}

export { ToggleSwitch as NotificationToggleSwitch };
