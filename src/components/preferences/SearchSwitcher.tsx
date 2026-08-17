import { toast } from "sonner";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  Copy,
  Pencil,
  Plus,
  Trash2,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useAppStore,
  selectActiveSearch,
  SEARCH_LIMITS,
  switchActiveSearch,
  hydrateActiveSearchIntoOnboarding,
  syncOnboardingToActiveSearch,
} from "@/lib/store";
import { getCity } from "@/data/cities";
import type { Search } from "@/lib/store";
import { useDeleteSearchMutation, useDuplicateSearchMutation } from "@/lib/queries/searches";
import { NewSearchModal } from "./NewSearchModal";
import { UpgradeModal } from "./UpgradeModal";

/**
 * Multi-search switcher dropdown.
 * Renders the current search name + chip, a list of all searches, quota,
 * and quick actions (new, rename, duplicate, delete).
 */
export function SearchSwitcher() {
  const active = useAppStore(selectActiveSearch);
  const searches = useAppStore((s) => s.searches);
  const user = useAppStore((s) => s.user);
  const quota = useMemo(() => {
    const plan = user?.plan ?? "intro";
    const max = SEARCH_LIMITS[plan];
    const used = searches.length;
    const maxLabel = max === Number.POSITIVE_INFINITY ? "Unlimited" : String(max);
    return {
      used,
      max,
      remaining: max === Number.POSITIVE_INFINITY ? Number.POSITIVE_INFINITY : Math.max(0, max - used),
      label: `${used} of ${maxLabel} used`,
    };
  }, [searches, user?.plan]);
  const duplicateSearch = useAppStore((s) => s.duplicateSearch);
  const deleteSearch = useAppStore((s) => s.deleteSearch);
  const renameSearch = useAppStore((s) => s.renameSearch);
  const deleteMut = useDeleteSearchMutation();
  const dupMut = useDuplicateSearchMutation();
  const adoptServerSearch = useAppStore((s) => s.adoptServerSearch);

  const isUuid = (id: string) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

  const dbAwareDelete = (id: string) => {
    if (isUuid(id)) deleteMut.mutate(id);
    deleteSearch(id);
  };


  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [renamingId, setRenamingId] = useState<string | null>(null);
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
  const plan = user?.plan ?? "intro";

  const liveSearches = searches;

  const handleSwitch = (id: string) => {
    if (renamingId) return;
    switchActiveSearch(id);
    setOpen(false);
  };

  const handleNew = () => {
    setOpen(false);
    if (!canCreate) {
      setUpgradeOpen(true);
      return;
    }
    setModalOpen(true);
  };

  const handleDuplicate = async (id: string) => {
    if (!canCreate) {
      setUpgradeOpen(true);
      return;
    }
    syncOnboardingToActiveSearch();
    const res = duplicateSearch(id);
    if (!res.ok) return;
    hydrateActiveSearchIntoOnboarding();
    setOpen(false);
    if (isUuid(id)) {
      try {
        const row = await dupMut.mutateAsync(id);
        if (row && (row as { id?: string }).id) adoptServerSearch(res.search.id, row as never);
      } catch {
        // mutation surfaces its own toast
      }
    }
  };

  return (
    <>
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
          <ChevronDown
            className={cn("h-3.5 w-3.5 text-charcoal-500 transition-transform", open && "rotate-180")}
          />
        </button>

        {open && (
          <div
            role="listbox"
            className="absolute right-0 lg:left-0 lg:right-auto mt-2 w-[340px] rounded-card bg-paper border border-charcoal-200 shadow-xl z-50 overflow-hidden"
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
              {liveSearches.map((s) => (
                <SearchRow
                  key={s.id}
                  search={s}
                  isActive={s.id === active.id}
                  isRenaming={renamingId === s.id}
                  canDuplicate={canCreate}
                  onSwitch={() => handleSwitch(s.id)}
                  onStartRename={() => setRenamingId(s.id)}
                  onSubmitRename={(name) => {
                    renameSearch(s.id, name);
                    setRenamingId(null);
                  }}
                  onCancelRename={() => setRenamingId(null)}
                  onDuplicate={() => handleDuplicate(s.id)}
                  onDelete={() => {
                    if (
                      confirm(
                        `Delete "${s.name}"? This permanently removes its criteria, alert settings, match history, and the apartments you saved from it.`,
                      )
                    ) {
                      dbAwareDelete(s.id);
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
                className="w-full flex items-center gap-2 h-10 px-3 rounded-md text-sm font-semibold transition-colors text-charcoal-950 hover:bg-charcoal-950/5"
              >
                {canCreate ? <Plus className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                {canCreate ? "New search" : `Upgrade to add more (${quota.label})`}
              </button>
            </div>
          </div>
        )}
      </div>
      {modalOpen && <NewSearchModal onClose={() => setModalOpen(false)} />}
      {upgradeOpen && <UpgradeModal onClose={() => setUpgradeOpen(false)} />}
    </>
  );
}

function SearchRow({
  search,
  isActive,
  isRenaming,
  canDuplicate,
  onSwitch,
  onStartRename,
  onSubmitRename,
  onCancelRename,
  onDuplicate,
  onDelete,
}: {
  search: Search;
  isActive: boolean;
  isRenaming: boolean;
  canDuplicate: boolean;
  onSwitch: () => void;
  onStartRename: () => void;
  onSubmitRename: (name: string) => void;
  onCancelRename: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  const city = getCity(search.cityId);
  const [draft, setDraft] = useState(search.name);

  useEffect(() => {
    if (isRenaming) setDraft(search.name);
  }, [isRenaming, search.name]);

  return (
    <li className={cn("group relative", isActive && "bg-charcoal-950/4")}>
      {isRenaming ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const v = draft.trim();
            if (v.length >= 2 && v.length <= 50) onSubmitRename(v);
            else onCancelRename();
          }}
          className="px-4 py-2.5"
          onClick={(e) => e.stopPropagation()}
        >
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") onCancelRename();
            }}
            onBlur={() => {
              const v = draft.trim();
              if (v.length >= 2 && v.length <= 50 && v !== search.name) onSubmitRename(v);
              else onCancelRename();
            }}
            maxLength={50}
            className="w-full h-8 px-2 text-sm font-semibold bg-paper border border-charcoal-950 rounded-md focus:outline-none"
            placeholder="Search name"
          />
          <div className="text-[10px] text-charcoal-400 mt-1">Enter to save · Esc to cancel</div>
        </form>
      ) : (
        <>
          <button type="button" onClick={onSwitch} className="w-full text-left px-4 py-2.5 pr-28">
            <div className="flex items-center gap-2">
              {isActive && <Check className="h-3.5 w-3.5 text-sage-700 shrink-0" />}
              <span className="text-sm font-semibold text-charcoal-950 truncate">
                {search.name}
              </span>
            </div>
            <div className="text-[11px] text-charcoal-500 mt-0.5 truncate">
              {city?.displayName ?? search.cityId} ·{" "}
              {search.bedrooms.length ? search.bedrooms.join("/") : "any beds"}
              {search.budget ? ` · $${search.budget[0]}–${search.budget[1]}` : ""}
            </div>
          </button>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100">
            <IconBtn title="Rename" onClick={onStartRename}>
              <Pencil className="h-3.5 w-3.5" />
            </IconBtn>
            <IconBtn title="Duplicate" onClick={onDuplicate} disabled={!canDuplicate}>
              <Copy className="h-3.5 w-3.5" />
            </IconBtn>
            <IconBtn title="Delete" onClick={onDelete}>
              <Trash2 className="h-3.5 w-3.5" />
            </IconBtn>
          </div>
        </>
      )}
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

