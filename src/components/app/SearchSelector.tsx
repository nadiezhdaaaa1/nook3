import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Archive,
  Check,
  ChevronDown,
  Pencil,
  Plus,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useAppStore,
  selectActiveSearch,
  SEARCH_LIMITS,
  switchActiveSearch,
  type Search,
} from "@/lib/store";
import { getCity } from "@/data/cities";
import { NewSearchModal } from "@/components/preferences/NewSearchModal";
import { UpgradeModal } from "@/components/preferences/UpgradeModal";

function cityLabel(cityId: string) {
  return getCity(cityId as never)?.shortName ?? cityId;
}

function statusLabel(s: Search) {
  return s.status === "active" ? "Live" : s.status === "paused" ? "Paused" : "Archived";
}

function StatusDot({ status }: { status: Search["status"] }) {
  return (
    <span
      aria-hidden
      className={cn(
        "h-2 w-2 rounded-full shrink-0",
        status === "active" ? "bg-sage-700" : status === "paused" ? "bg-peach-700" : "bg-charcoal-300",
      )}
    />
  );
}

function summary(s: Search) {
  const bits: string[] = [];
  if (s.budget) {
    bits.push(`$${Math.round(s.budget[0] / 100) / 10}k–$${Math.round(s.budget[1] / 100) / 10}k`);
  }
  if (s.bedrooms.length) bits.push(s.bedrooms.join("/"));
  bits.push(
    s.neighborhoods.length
      ? `${s.neighborhoods.length} area${s.neighborhoods.length === 1 ? "" : "s"}`
      : "Anywhere",
  );
  if (s.totalAlertsReceived > 0) bits.push(`${s.totalAlertsReceived} alerts`);
  return bits.join(" · ");
}

/**
 * Header search selector: shows Live/Paused status + city + name, and opens a
 * dropdown with "New search" on top, every saved search (with brief info and a
 * pencil to edit), and a collapsed archived section.
 */
export function SearchSelector() {
  const active = useAppStore(selectActiveSearch);
  const searches = useAppStore((s) => s.searches);
  const plan = useAppStore((s) => s.user?.plan ?? "free");
  const restoreSearch = useAppStore((s) => s.restoreSearch);

  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  const quota = useMemo(() => {
    const max = SEARCH_LIMITS[plan];
    const used = searches.filter((s) => s.status !== "archived").length;
    return {
      used,
      maxLabel: max === Number.POSITIVE_INFINITY ? "Unlimited" : String(max),
      remaining: max === Number.POSITIVE_INFINITY ? Number.POSITIVE_INFINITY : Math.max(0, max - used),
    };
  }, [plan, searches]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const live = searches.filter((s) => s.status !== "archived");
  const archived = searches.filter((s) => s.status === "archived");
  const canCreate = quota.remaining > 0;

  const handleNew = () => {
    setOpen(false);
    if (!canCreate) {
      setUpgradeOpen(true);
      return;
    }
    setModalOpen(true);
  };

  return (
    <>
      <div ref={ref} className="relative min-w-0">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className="inline-flex max-w-[280px] items-center gap-2 rounded-[12px] border border-black/20 bg-white/45 px-4 py-3 backdrop-blur-sm transition-colors hover:bg-white/70"
        >
          {active ? (
            <>
              <StatusDot status={active.status} />
              <span className="min-w-0 truncate text-sm font-semibold text-charcoal-950">
                {active.name}
              </span>
              <span className="min-w-0 truncate text-sm text-charcoal-500">
                {cityLabel(active.cityId)}
              </span>
            </>
          ) : (
            <span className="text-sm font-semibold text-charcoal-950">No search yet</span>
          )}
          <ChevronDown
            className={cn("h-3.5 w-3.5 shrink-0 text-charcoal-500 transition-transform", open && "rotate-180")}
            aria-hidden
          />
        </button>

        {open && (
          <div
            role="listbox"
            className="absolute left-0 z-50 mt-2 w-[340px] overflow-hidden rounded-[12px] border border-black/20 bg-white/60 shadow-[0_16px_32px_rgba(36,28,18,0.12)] backdrop-blur-md"
          >
            {/* New search — pinned on top */}
            <button
              type="button"
              onClick={handleNew}
              className="mx-1.5 mt-1.5 flex w-[calc(100%-12px)] items-center gap-3 rounded-[8px] px-3 py-2.5 text-left hover:bg-charcoal-950/[0.04]"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-pill bg-charcoal-950 text-paper">
                <Plus className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-charcoal-950">New search</span>
                <span className="block text-[11px] text-charcoal-500">
                  {quota.used} of {quota.maxLabel} used
                  {!canCreate ? " · upgrade to add more" : ""}
                </span>
              </span>
            </button>

            <ul className="max-h-[320px] overflow-y-auto border-t border-black/[0.06] py-1">
              {live.map((s) => (
                <li key={s.id}>
                  <div
                    className={cn(
                      "flex items-center gap-2 px-3 py-2",
                      s.id === active?.id && "bg-charcoal-950/[0.04]",
                    )}
                  >
                    <button
                      type="button"
                      role="option"
                      aria-selected={s.id === active?.id}
                      onClick={() => {
                        switchActiveSearch(s.id);
                        setOpen(false);
                      }}
                      className="min-w-0 flex-1 rounded-md px-1 py-1 text-left hover:bg-charcoal-950/[0.04]"
                    >
                      <span className="flex items-center gap-1.5">
                        <StatusDot status={s.status} />
                        <span className="truncate text-sm font-semibold text-charcoal-950">{s.name}</span>
                        {s.id === active?.id && <Check className="h-3.5 w-3.5 shrink-0 text-sage-700" />}
                      </span>
                      <span className="mt-0.5 block truncate text-[11px] text-charcoal-500">
                        {cityLabel(s.cityId)} · {statusLabel(s)} · {summary(s)}
                      </span>
                    </button>
                    <Link
                      to="/search/$searchId/budget"
                      params={{ searchId: s.id }}
                      onClick={() => setOpen(false)}
                      aria-label={`Edit ${s.name}`}
                      title="Edit search"
                      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-pill border border-black/10 text-charcoal-600 hover:border-charcoal-950 hover:text-charcoal-950"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </li>
              ))}
              {live.length === 0 && (
                <li className="px-4 py-3 text-xs text-charcoal-500">No active searches yet.</li>
              )}
            </ul>

            {archived.length > 0 && (
              <div className="border-t border-black/[0.06]">
                <button
                  type="button"
                  onClick={() => setShowArchived((v) => !v)}
                  aria-expanded={showArchived}
                  className="flex h-9 w-full items-center justify-between px-4 text-[11px] font-mono uppercase tracking-[0.16em] text-charcoal-500 hover:bg-charcoal-950/[0.04]"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <Archive className="h-3 w-3" /> Archived ({archived.length})
                  </span>
                  <ChevronDown className={cn("h-3 w-3 transition-transform", showArchived && "rotate-180")} />
                </button>
                {showArchived && (
                  <ul className="max-h-[180px] overflow-y-auto bg-charcoal-950/[0.02] py-1">
                    {archived.map((s) => (
                      <li key={s.id} className="flex items-center gap-2 px-4 py-2">
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm text-charcoal-700">{s.name}</span>
                          <span className="block truncate text-[11px] text-charcoal-500">
                            {cityLabel(s.cityId)} · {summary(s)}
                          </span>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const res = restoreSearch(s.id);
                            if (!res.ok) setUpgradeOpen(true);
                          }}
                          className="inline-flex h-8 items-center gap-1.5 rounded-pill border border-black/10 px-3 text-[11px] font-semibold text-charcoal-700 hover:border-charcoal-950"
                        >
                          <RotateCcw className="h-3 w-3" /> Restore
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {modalOpen && <NewSearchModal onClose={() => setModalOpen(false)} />}
      {upgradeOpen && <UpgradeModal onClose={() => setUpgradeOpen(false)} />}
    </>
  );
}
