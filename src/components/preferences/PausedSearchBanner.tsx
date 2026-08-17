import { Lock, Pause, Play } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { useAppStore, useActiveSearch, useIsSearchDisabled } from "@/lib/store";

/**
 * Inline banner for the currently-active search when it isn't running.
 *
 * Two cases:
 *  - Disabled: the search is over the plan limit after a downgrade. It can't
 *    be resumed — only deleted, or unlocked by upgrading again.
 *  - Paused: user-paused; can be resumed right away.
 */
export function PausedSearchBanner() {
  const active = useActiveSearch();
  const resumeSearch = useAppStore((s) => s.resumeSearch);
  const isDisabled = useIsSearchDisabled(active?.id);
  const navigate = useNavigate();

  if (!active) return null;

  if (isDisabled) {
    return (
      <div className="mb-6 rounded-card border border-charcoal-200 bg-charcoal-950/[0.04] p-4 flex items-center gap-4">
        <div className="h-9 w-9 rounded-pill bg-paper border border-charcoal-200 flex items-center justify-center shrink-0">
          <Lock className="h-4 w-4 text-charcoal-700" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-charcoal-950">
            "{active.name}" is disabled.
          </div>
          <div className="text-xs text-charcoal-600 mt-0.5">
            It's over the number of searches your plan allows, so it isn't
            running. Upgrade your plan to turn it back on, or delete another
            live search to free up a slot.
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate({ to: "/account" })}
          className="h-10 px-4 inline-flex items-center gap-1.5 rounded-pill bg-charcoal-950 text-paper text-xs font-semibold hover:bg-charcoal-800 shrink-0"
        >
          Upgrade plan
        </button>
      </div>
    );
  }

  if (active.status !== "paused") return null;

  return (
    <div className="mb-6 rounded-card border border-peach-300 bg-peach-100/60 p-4 flex items-center gap-4">
      <div className="h-9 w-9 rounded-pill bg-paper border border-peach-300 flex items-center justify-center shrink-0">
        <Pause className="h-4 w-4 text-peach-900" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-charcoal-950">
          Alerts are off for "{active.name}".
        </div>
        <div className="text-xs text-charcoal-600 mt-0.5">
          No new alerts will be sent for this search until you turn them back
          on. It still counts toward your plan quota.
        </div>
      </div>
      <button
        type="button"
        onClick={() => {
          const res = resumeSearch(active.id);
          if (!res.ok) toast.error("Can't turn alerts on", { description: res.error });
        }}
        className="h-10 px-4 inline-flex items-center gap-1.5 rounded-pill bg-charcoal-950 text-paper text-xs font-semibold hover:bg-charcoal-800 shrink-0"
      >
        <Play className="h-3.5 w-3.5" /> Turn alerts on
      </button>
    </div>
  );
}
