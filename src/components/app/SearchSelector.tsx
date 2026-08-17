import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Archive,
  Check,
  Lock,
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
  useDisabledSearchIds,
  type Search,
} from "@/lib/store";
import { getCity } from "@/data/cities";
import { OriginButton } from "@/components/ui/origin-button";
import { NewSearchModal } from "@/components/preferences/NewSearchModal";
import { UpgradeModal } from "@/components/preferences/UpgradeModal";

const TOTAL_SLOTS = 3;

function cityLabel(cityId: string) {
  return getCity(cityId as never)?.shortName ?? cityId;
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
 * Header search selector: shows city + name, and opens a dropdown with
 * "New search" on top and every saved search (with brief info and a pencil to
 * edit).
 */
export function SearchSelector() {
  const active = useAppStore(selectActiveSearch);
  const searches = useAppStore((s) => s.searches);
  const plan = useAppStore((s) => s.user?.plan ?? "intro");

  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const quota = useMemo(() => {
    const max = SEARCH_LIMITS[plan];
    const used = searches.length;
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

  const live = searches;
  const disabledIds = useDisabledSearchIds();
  const canCreate = quota.remaining > 0;
  const planLimit = Number.isFinite(SEARCH_LIMITS[plan]) ? SEARCH_LIMITS[plan] : TOTAL_SLOTS;

  const handleNew = () => {
    setOpen(false);
    if (!canCreate) {
      setUpgradeOpen(true);
      return;
    }
    navigate({ to: "/search/new/$step", params: { step: "1" } });
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
              <span className="min-w-0 truncate text-sm font-semibold text-charcoal-950">

                {active.name}
              </span>
              <span className="shrink-0 text-sm text-charcoal-500">
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
            className="absolute left-0 z-50 mt-2 w-[min(380px,calc(100vw-32px))] overflow-hidden rounded-[12px] border border-black/20 bg-white shadow-[0_16px_32px_rgba(36,28,18,0.12)] backdrop-blur-md"
          >
            <div className="flex items-center justify-between px-4 pt-3 pb-1">
              <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-charcoal-500">
                Searches
              </span>
              <span className="text-[11px] text-charcoal-500">
                {quota.used} of {quota.maxLabel} used
              </span>
            </div>

            <ul className="max-h-[420px] space-y-1.5 overflow-y-auto p-1.5">
              {Array.from({ length: TOTAL_SLOTS }).map((_, i) => {
                const s = live[i];
                if (s) {
                  const isDisabled = disabledIds.has(s.id);
                  return (
                    <li key={s.id}>
                      <div
                        className={cn(
                          "flex items-center gap-3 rounded-[10px] border border-black/[0.12] bg-white px-3 py-3 transition-colors hover:bg-charcoal-950/[0.03]",
                          s.id === active?.id && "border-charcoal-950/40 bg-charcoal-950/[0.03]",
                          isDisabled && "opacity-60",
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
                          className="min-w-0 flex-1 text-left"
                        >
                          <span className="flex items-center gap-1.5">
                            {s.id === active?.id && (
                              <Check className="h-4 w-4 shrink-0 text-sage-700" />
                            )}
                            <span className="truncate text-[15px] font-semibold text-charcoal-950">
                              {s.name}
                            </span>
                          </span>
                          <span className="mt-1 block truncate text-xs text-charcoal-500">
                            {cityLabel(s.cityId)}
                            {isDisabled ? " · Disabled" : ""} · {summary(s)}
                          </span>

                        </button>
                        <OriginButton
                          variant="tertiary"
                          size="medium"
                          aria-label={`Edit ${s.name}`}
                          className="h-9 w-9 rounded-[8px] p-0"
                          onClick={() => {
                            setOpen(false);
                            navigate({ to: "/search/$searchId/budget", params: { searchId: s.id } });
                          }}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </OriginButton>
                      </div>
                    </li>
                  );
                }

                const locked = i >= planLimit;
                return (
                  <li key={`slot-${i}`}>
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        if (locked) setUpgradeOpen(true);
                        else navigate({ to: "/search/new/$step", params: { step: "1" } });
                      }}
                      className="flex w-full items-center justify-center gap-2 rounded-[10px] border border-dashed border-black/25 px-3 py-4 text-left transition-colors hover:border-charcoal-950 hover:bg-charcoal-950/[0.03]"
                    >
                      {locked ? (
                        <Lock className="h-4 w-4 shrink-0 text-charcoal-500" />
                      ) : (
                        <Plus className="h-4 w-4 shrink-0 text-charcoal-700" />
                      )}
                      <span className="text-sm font-semibold text-charcoal-700">
                        {locked ? "Add a search with Pro" : "New search"}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>


          </div>
        )}
      </div>

      {modalOpen && <NewSearchModal onClose={() => setModalOpen(false)} />}
      {upgradeOpen && <UpgradeModal onClose={() => setUpgradeOpen(false)} />}
    </>
  );
}
