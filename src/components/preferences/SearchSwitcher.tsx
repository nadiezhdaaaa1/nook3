import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Copy, Pause, Play, Plus, Trash2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useAppStore,
  selectActiveSearch,
  selectQuota,
  switchActiveSearch,
  hydrateActiveSearchIntoOnboarding,
  syncOnboardingToActiveSearch,
} from "@/lib/store";
import { getCity } from "@/data/cities";
import type { Search } from "@/lib/store";
import { NewSearchModal } from "./NewSearchModal";

/**
 * Multi-search switcher dropdown.
 * Renders the current search name + chip, a list of all searches, quota,
 * and quick actions (new, duplicate, pause/resume, delete).
 */
export function SearchSwitcher() {
  const active = useAppStore(selectActiveSearch);
  const searches = useAppStore((s) => s.searches);
  const quota = useAppStore(selectQuota);
  const user = useAppStore((s) => s.user);
  const createSearch = useAppStore((s) => s.createSearch);
  const duplicateSearch = useAppStore((s) => s.duplicateSearch);
  const pauseSearch = useAppStore((s) => s.pauseSearch);
  const resumeSearch = useAppStore((s) => s.resumeSearch);
  const deleteSearch = useAppStore((s) => s.deleteSearch);

  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [open]);

  if (!active) return null;

  const canCreate = quota.remaining > 0;
  const plan = user?.plan ?? "free";

  const handleSwitch = (id: string) => {
    switchActiveSearch(id);
    setOpen(false);
  };

  const handleNew = () => {
    if (!canCreate) return;
    setOpen(false);
    setModalOpen(true);
  };

  const handleDuplicate = (id: string) => {
    if (!canCreate) return;
    syncOnboardingToActiveSearch();
    const res = duplicateSearch(id);
    if (res.ok) {
      hydrateActiveSearchIntoOnboarding();
      setOpen(false);
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 h-10 px-3 rounded-pill border border-charcoal-200 bg-paper hover:border-charcoal-950 transition-colors"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-charcoal-500">
          Editing
        </span>
        <span className="text-sm font-semibold text-charcoal-950 truncate max-w-[180px]">
          {active.name}
        </span>
        <StatusDot status={active.status} />
        <ChevronDown className={cn("h-3.5 w-3.5 text-charcoal-500 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 lg:left-0 lg:right-auto mt-2 w-[320px] rounded-card bg-paper border border-charcoal-200 shadow-xl z-50 overflow-hidden"
        >
          <div className="px-4 py-3 border-b border-charcoal-950/8 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-charcoal-500">
                Your searches
              </div>
              <div className="text-xs text-charcoal-700 mt-0.5">{quota.label}</div>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-charcoal-500">
              {plan}
            </span>
          </div>

          <ul className="max-h-[320px] overflow-y-auto py-1">
            {searches
              .filter((s) => s.status !== "archived")
              .map((s) => (
                <SearchRow
                  key={s.id}
                  search={s}
                  isActive={s.id === active.id}
                  canDuplicate={canCreate}
                  canDelete={searches.filter((x) => x.status !== "archived").length > 1}
                  onSwitch={() => handleSwitch(s.id)}
                  onDuplicate={() => handleDuplicate(s.id)}
                  onPauseToggle={() =>
                    s.status === "paused" ? resumeSearch(s.id) : pauseSearch(s.id)
                  }
                  onDelete={() => {
                    if (confirm(`Delete "${s.name}"? This cannot be undone.`)) {
                      deleteSearch(s.id);
                      hydrateActiveSearchIntoOnboarding();
                    }
                  }}
                />
              ))}
          </ul>

          <div className="border-t border-charcoal-950/8 p-2">
            <button
              type="button"
              onClick={handleNew}
              disabled={!canCreate}
              className={cn(
                "w-full flex items-center gap-2 h-10 px-3 rounded-md text-sm font-semibold transition-colors",
                canCreate
                  ? "text-charcoal-950 hover:bg-charcoal-950/5"
                  : "text-charcoal-400 cursor-not-allowed",
              )}
            >
              {canCreate ? <Plus className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
              {canCreate ? "New search" : `Upgrade to add more (${quota.label})`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SearchRow({
  search,
  isActive,
  canDuplicate,
  canDelete,
  onSwitch,
  onDuplicate,
  onPauseToggle,
  onDelete,
}: {
  search: Search;
  isActive: boolean;
  canDuplicate: boolean;
  canDelete: boolean;
  onSwitch: () => void;
  onDuplicate: () => void;
  onPauseToggle: () => void;
  onDelete: () => void;
}) {
  const city = getCity(search.cityId);
  return (
    <li className={cn("group relative", isActive && "bg-charcoal-950/4")}>
      <button
        type="button"
        onClick={onSwitch}
        className="w-full text-left px-4 py-2.5 pr-24"
      >
        <div className="flex items-center gap-2">
          {isActive && <Check className="h-3.5 w-3.5 text-sage-700 shrink-0" />}
          <span className="text-sm font-semibold text-charcoal-950 truncate">{search.name}</span>
          <StatusDot status={search.status} />
        </div>
        <div className="text-[11px] text-charcoal-500 mt-0.5 truncate">
          {city?.displayName ?? search.cityId} · {search.bedrooms.length ? search.bedrooms.join("/") : "any beds"}
          {search.budget ? ` · $${search.budget[0]}–${search.budget[1]}` : ""}
        </div>
      </button>
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100">
        <IconBtn title={search.status === "paused" ? "Resume" : "Pause"} onClick={onPauseToggle}>
          {search.status === "paused" ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
        </IconBtn>
        <IconBtn title="Duplicate" onClick={onDuplicate} disabled={!canDuplicate}>
          <Copy className="h-3.5 w-3.5" />
        </IconBtn>
        {canDelete && (
          <IconBtn title="Delete" onClick={onDelete}>
            <Trash2 className="h-3.5 w-3.5" />
          </IconBtn>
        )}
      </div>
    </li>
  );
}

function IconBtn({
  children,
  onClick,
  title,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) onClick();
      }}
      className={cn(
        "h-7 w-7 inline-flex items-center justify-center rounded-md",
        disabled
          ? "text-charcoal-300 cursor-not-allowed"
          : "text-charcoal-600 hover:bg-charcoal-950/8 hover:text-charcoal-950",
      )}
    >
      {children}
    </button>
  );
}

function StatusDot({ status }: { status: Search["status"] }) {
  if (status === "active") {
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-pill bg-sage-100 text-[9px] font-mono uppercase tracking-[0.14em] text-sage-700">
        <span className="h-1.5 w-1.5 rounded-full bg-sage-700" /> Active
      </span>
    );
  }
  if (status === "paused") {
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-pill bg-peach-100 text-[9px] font-mono uppercase tracking-[0.14em] text-peach-700">
        <span className="h-1.5 w-1.5 rounded-full bg-peach-700" /> Paused
      </span>
    );
  }
  return null;
}
