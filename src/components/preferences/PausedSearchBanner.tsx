import { Pause, Play } from "lucide-react";
import { useAppStore, useActiveSearch } from "@/lib/store";

/**
 * Inline banner shown when the currently-active search is paused.
 * Paused searches still count toward plan quota (per TZ), so we surface a
 * clear way to resume without leaving the page.
 */
export function PausedSearchBanner() {
  const active = useActiveSearch();
  const resumeSearch = useAppStore((s) => s.resumeSearch);
  if (!active || active.status !== "paused") return null;

  return (
    <div className="mb-6 rounded-card border border-peach-300 bg-peach-100/60 p-4 flex items-center gap-4">
      <div className="h-9 w-9 rounded-pill bg-paper border border-peach-300 flex items-center justify-center shrink-0">
        <Pause className="h-4 w-4 text-peach-900" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-charcoal-950">
          "{active.name}" is paused.
        </div>
        <div className="text-xs text-charcoal-600 mt-0.5">
          No new alerts will be sent for this search until you resume. It still
          counts toward your plan quota.
        </div>
      </div>
      <button
        type="button"
        onClick={() => resumeSearch(active.id)}
        className="h-10 px-4 inline-flex items-center gap-1.5 rounded-pill bg-charcoal-950 text-paper text-xs font-semibold hover:bg-charcoal-800 shrink-0"
      >
        <Play className="h-3.5 w-3.5" /> Resume
      </button>
    </div>
  );
}
