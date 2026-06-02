import { useEffect, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  Copy,
  Pause,
  Pencil,
  Play,
  Plus,
  Trash2,
  Lock,
  Archive,
  RotateCcw,
} from "lucide-react";
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
import { useDeleteSearchMutation } from "@/lib/queries/searches";
import { NewSearchModal } from "./NewSearchModal";
import { UpgradeModal } from "./UpgradeModal";

/**
 * Multi-search switcher dropdown.
 * Renders the current search name + chip, a list of all searches, quota,
 * and quick actions (new, rename, duplicate, pause/resume, archive, delete).
 */
export function SearchSwitcher() {
  const active = useAppStore(selectActiveSearch);
  const searches = useAppStore((s) => s.searches);
  const quota = useAppStore(selectQuota);
  const user = useAppStore((s) => s.user);
  const duplicateSearch = useAppStore((s) => s.duplicateSearch);
  const pauseSearch = useAppStore((s) => s.pauseSearch);
  const resumeSearch = useAppStore((s) => s.resumeSearch);
  const archiveSearch = useAppStore((s) => s.archiveSearch);
  const restoreSearch = useAppStore((s) => s.restoreSearch);
  const deleteSearch = useAppStore((s) => s.deleteSearch);
  const renameSearch = useAppStore((s) => s.renameSearch);
  const deleteMut = useDeleteSearchMutation();

  const isUuid = (id: string) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

  const dbAwareDelete = (id: string) => {
    if (isUuid(id)) deleteMut.mutate(id);
    deleteSearch(id);
  };


  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
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
  const plan = user?.plan ?? "free";

  const liveSearches = searches.filter((s) => s.status !== "archived");
  const archivedSearches = searches.filter((s) => s.status === "archived");

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

  const handleDuplicate = (id: string) => {
    if (!canCreate) {
      setUpgradeOpen(true);
      return;
    }
    syncOnboardingToActiveSearch();
    const res = duplicateSearch(id);
    if (res.ok) {
      hydrateActiveSearchIntoOnboarding();
      setOpen(false);
    }
  };

  const handleRestore = (id: string) => {
    const res = restoreSearch(id);
    if (!res.ok) setUpgradeOpen(true);
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
          <StatusDot status={active.status} />
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
                  canArchive={liveSearches.length > 1}
                  onSwitch={() => handleSwitch(s.id)}
                  onStartRename={() => setRenamingId(s.id)}
                  onSubmitRename={(name) => {
                    renameSearch(s.id, name);
                    setRenamingId(null);
                  }}
                  onCancelRename={() => setRenamingId(null)}
                  onDuplicate={() => handleDuplicate(s.id)}
                  onPauseToggle={() =>
                    s.status === "paused" ? resumeSearch(s.id) : pauseSearch(s.id)
                  }
                  onArchive={() => archiveSearch(s.id)}
                  onDelete={() => {
                    if (confirm(`Delete "${s.name}"? This cannot be undone.`)) {
                      deleteSearch(s.id);
                      hydrateActiveSearchIntoOnboarding();
                    }
                  }}
                />
              ))}
            </ul>

            {archivedSearches.length > 0 && (
              <div className="border-t border-charcoal-950/8">
                <button
                  type="button"
                  onClick={() => setShowArchived((v) => !v)}
                  className="w-full flex items-center justify-between px-4 h-9 text-[11px] font-mono uppercase tracking-[0.16em] text-charcoal-500 hover:bg-charcoal-950/5"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <Archive className="h-3 w-3" />
                    Archived ({archivedSearches.length})
                  </span>
                  <ChevronDown
                    className={cn("h-3 w-3 transition-transform", showArchived && "rotate-180")}
                  />
                </button>
                {showArchived && (
                  <ul className="max-h-[180px] overflow-y-auto py-1 bg-charcoal-950/[0.02]">
                    {archivedSearches.map((s) => (
                      <ArchivedRow
                        key={s.id}
                        search={s}
                        onRestore={() => handleRestore(s.id)}
                        onDelete={() => {
                          if (confirm(`Permanently delete "${s.name}"?`)) deleteSearch(s.id);
                        }}
                      />
                    ))}
                  </ul>
                )}
              </div>
            )}

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
  canArchive,
  onSwitch,
  onStartRename,
  onSubmitRename,
  onCancelRename,
  onDuplicate,
  onPauseToggle,
  onArchive,
  onDelete,
}: {
  search: Search;
  isActive: boolean;
  isRenaming: boolean;
  canDuplicate: boolean;
  canArchive: boolean;
  onSwitch: () => void;
  onStartRename: () => void;
  onSubmitRename: (name: string) => void;
  onCancelRename: () => void;
  onDuplicate: () => void;
  onPauseToggle: () => void;
  onArchive: () => void;
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
              <StatusDot status={search.status} />
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
            <IconBtn
              title={search.status === "paused" ? "Resume" : "Pause"}
              onClick={onPauseToggle}
            >
              {search.status === "paused" ? (
                <Play className="h-3.5 w-3.5" />
              ) : (
                <Pause className="h-3.5 w-3.5" />
              )}
            </IconBtn>
            <IconBtn title="Duplicate" onClick={onDuplicate} disabled={!canDuplicate}>
              <Copy className="h-3.5 w-3.5" />
            </IconBtn>
            {canArchive && (
              <IconBtn title="Archive" onClick={onArchive}>
                <Archive className="h-3.5 w-3.5" />
              </IconBtn>
            )}
            {canArchive && (
              <IconBtn title="Delete" onClick={onDelete}>
                <Trash2 className="h-3.5 w-3.5" />
              </IconBtn>
            )}
          </div>
        </>
      )}
    </li>
  );
}

function ArchivedRow({
  search,
  onRestore,
  onDelete,
}: {
  search: Search;
  onRestore: () => void;
  onDelete: () => void;
}) {
  const city = getCity(search.cityId);
  return (
    <li className="group relative flex items-center px-4 py-2">
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-charcoal-700 truncate">{search.name}</div>
        <div className="text-[11px] text-charcoal-400 truncate">
          {city?.displayName ?? search.cityId}
          {search.archivedAt
            ? ` · archived ${new Date(search.archivedAt).toLocaleDateString()}`
            : ""}
        </div>
      </div>
      <div className="flex items-center gap-0.5 shrink-0">
        <IconBtn title="Restore" onClick={onRestore}>
          <RotateCcw className="h-3.5 w-3.5" />
        </IconBtn>
        <IconBtn title="Delete forever" onClick={onDelete}>
          <Trash2 className="h-3.5 w-3.5" />
        </IconBtn>
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
