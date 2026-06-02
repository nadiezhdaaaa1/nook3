import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Bell,
  Heart,
  Mail,
  X,
  Inbox,
  Sparkles,
  ExternalLink,
  Check,
  Layers,
  Loader2,
} from "lucide-react";
import type { AlertStatus, SavedAlert } from "@/data/savedAlerts";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import {
  useAlertsQuery,
  useUpdateAlertStatusMutation,
} from "@/lib/queries/alerts";
import type { AlertRow } from "@/lib/alerts.functions";

export const Route = createFileRoute("/_authenticated/preferences/alerts")({
  component: SavedAlertsPage,
});

type Filter = "all" | "new" | "saved" | "contacted" | "dismissed";

const FILTERS: { key: Filter; label: string; icon: any }[] = [
  { key: "all", label: "All", icon: Inbox },
  { key: "new", label: "New", icon: Bell },
  { key: "saved", label: "Saved", icon: Heart },
  { key: "contacted", label: "Contacted", icon: Mail },
  { key: "dismissed", label: "Dismissed", icon: X },
];

function rowToSavedAlert(r: AlertRow): SavedAlert {
  const l = r.listing as Partial<SavedAlert>;
  return {
    id: r.id,
    searchId: r.searchId ?? undefined,
    title: l.title ?? "Listing",
    neighborhood: l.neighborhood ?? "—",
    beds: l.beds ?? 0,
    baths: l.baths ?? 1,
    price: l.price ?? 0,
    receivedAt: l.receivedAt ?? r.createdAt,
    source: (l.source as SavedAlert["source"]) ?? "StreetEasy",
    status: r.status as AlertStatus,
    tags: l.tags ?? [],
    imageHue: l.imageHue ?? 200,
  };
}

function SavedAlertsPage() {
  const allSearches = useAppStore((s) => s.searches);
  const activeSearchId = useAppStore((s) => s.activeSearchId);
  const searches = useMemo(
    () => allSearches.filter((x) => x.status !== "archived"),
    [allSearches],
  );

  const [filter, setFilter] = useState<Filter>("all");
  const [scope, setScope] = useState<string>("all"); // "all" | searchId
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [compareOpen, setCompareOpen] = useState(false);

  const alertsQuery = useAlertsQuery();
  const updateStatusMutation = useUpdateAlertStatusMutation();

  const items: SavedAlert[] = useMemo(
    () => (alertsQuery.data ?? []).map(rowToSavedAlert),
    [alertsQuery.data],
  );

  // searchId is required at DB level — no round-robin needed.
  const itemsWithSearch = items;

  const scopeFiltered = useMemo(
    () => (scope === "all" ? itemsWithSearch : itemsWithSearch.filter((a) => a.searchId === scope)),
    [itemsWithSearch, scope],
  );

  const filtered = useMemo(
    () => (filter === "all" ? scopeFiltered : scopeFiltered.filter((a) => a.status === filter)),
    [scopeFiltered, filter],
  );

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: scopeFiltered.length, new: 0, saved: 0, contacted: 0, dismissed: 0 };
    scopeFiltered.forEach((a) => (c[a.status as Exclude<Filter, "all">] += 1));
    return c;
  }, [scopeFiltered]);

  const updateStatus = (id: string, status: AlertStatus) =>
    updateStatusMutation.mutate({ id, status });

  const toggle = (id: string) =>
    setSelected((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else if (next.size < 3) next.add(id);
      return next;
    });

  const selectedItems = itemsWithSearch.filter((a) => selected.has(a.id));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-charcoal-950">
          Saved <span className="accent-italic">Alerts</span>
        </h2>
        <p className="text-sm text-charcoal-600 mt-1">
          Every listing we've sent you. Select 2–3 to compare with Wren AI.
        </p>
      </div>

      {/* Per-search scope chips — only if user has more than one search */}
      {searches.length > 1 && (
        <div className="flex gap-2 overflow-x-auto -mx-6 px-6 lg:mx-0 lg:px-0 pb-1 border-b border-border pb-3">
          <ScopeChip
            label="All searches"
            icon={Layers}
            active={scope === "all"}
            count={itemsWithSearch.length}
            onClick={() => setScope("all")}
          />
          {searches.map((s) => {
            const cnt = itemsWithSearch.filter((a) => a.searchId === s.id).length;
            return (
              <ScopeChip
                key={s.id}
                label={s.name}
                active={scope === s.id}
                count={cnt}
                highlight={s.id === activeSearchId}
                onClick={() => setScope(s.id)}
              />
            );
          })}
        </div>
      )}

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto -mx-6 px-6 lg:mx-0 lg:px-0 pb-1">
        {FILTERS.map((f) => {
          const Icon = f.icon;
          const active = filter === f.key;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={cn(
                "shrink-0 inline-flex items-center gap-2 h-9 px-4 rounded-pill text-xs font-semibold transition-colors",
                active
                  ? "bg-charcoal-950 text-paper"
                  : "bg-paper border border-charcoal-200 text-charcoal-700 hover:border-charcoal-950",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {f.label}
              <span className={cn("text-[10px] font-mono", active ? "text-paper/70" : "text-charcoal-500")}>
                {counts[f.key]}
              </span>
            </button>
          );
        })}
      </div>

      {/* List, loading, or empty */}
      {alertsQuery.isLoading ? (
        <div className="flex items-center justify-center py-16 text-charcoal-500">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState filter={filter} />
      ) : (
        <ul className="space-y-3">
          {filtered.map((a) => (
            <AlertRow
              key={a.id}
              alert={a}
              selected={selected.has(a.id)}
              onToggle={() => toggle(a.id)}
              onAction={(s) => updateStatus(a.id, s)}
              compareDisabled={!selected.has(a.id) && selected.size >= 3}
            />
          ))}
        </ul>
      )}

      {/* Compare bar */}
      {selected.size >= 2 && (
        <div className="sticky bottom-4 z-30 mx-auto max-w-2xl">
          <div className="rounded-pill bg-charcoal-950 text-paper shadow-xl px-4 py-2 flex items-center justify-between gap-3">
            <div className="text-xs">
              <span className="font-mono text-paper/70">{selected.size} selected</span>
              <span className="hidden sm:inline text-paper/60 ml-2">· up to 3</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelected(new Set())}
                className="text-xs text-paper/70 hover:text-paper px-2"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() => setCompareOpen(true)}
                className="inline-flex items-center gap-2 h-9 px-4 rounded-pill bg-sage-200 text-charcoal-950 text-xs font-semibold hover:bg-sage-100"
              >
                <Sparkles className="h-3.5 w-3.5" /> Compare with Wren AI
              </button>
            </div>
          </div>
        </div>
      )}

      {compareOpen && (
        <WrenCompareModal items={selectedItems} onClose={() => setCompareOpen(false)} />
      )}
    </div>
  );
}

/* ---------- Row ---------- */
function AlertRow({
  alert,
  selected,
  onToggle,
  onAction,
  compareDisabled,
}: {
  alert: SavedAlert;
  selected: boolean;
  onToggle: () => void;
  onAction: (s: AlertStatus) => void;
  compareDisabled: boolean;
}) {
  const days = Math.floor((Date.now() - new Date(alert.receivedAt).getTime()) / 86400000);
  const ago = days === 0 ? "today" : days === 1 ? "1d ago" : `${days}d ago`;
  return (
    <li
      className={cn(
        "rounded-card border bg-surface-elevated p-4 flex gap-4 items-start transition-colors",
        selected ? "border-charcoal-950 ring-1 ring-charcoal-950" : "border-border hover:border-charcoal-300",
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        disabled={compareDisabled}
        aria-pressed={selected}
        className={cn(
          "shrink-0 mt-1 h-5 w-5 rounded-md border flex items-center justify-center transition-colors",
          selected ? "bg-charcoal-950 border-charcoal-950 text-paper" : "border-charcoal-300 hover:border-charcoal-950",
          compareDisabled && "opacity-40 cursor-not-allowed",
        )}
      >
        {selected && <Check className="h-3 w-3" />}
      </button>

      <div
        className="shrink-0 h-14 w-14 rounded-md"
        style={{ background: `hsl(${alert.imageHue} 40% 80%)` }}
        aria-hidden
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div className="min-w-0">
            <div className="text-sm font-semibold text-charcoal-950 truncate">{alert.title}</div>
            <div className="text-xs text-charcoal-600 mt-0.5">
              {alert.neighborhood} · {alert.beds === 0 ? "Studio" : `${alert.beds}BR`}/{alert.baths}BA ·{" "}
              <span className="font-medium text-charcoal-800">${alert.price.toLocaleString()}/mo</span>
            </div>
          </div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-charcoal-500 shrink-0">
            {alert.source} · {ago}
          </div>
        </div>

        {alert.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {alert.tags.map((t) => (
              <span
                key={t}
                className="text-[10px] font-medium px-2 py-0.5 rounded-pill bg-sage-100 text-sage-800"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        <div className="mt-3 flex items-center gap-1.5 flex-wrap">
          <StatusBadge status={alert.status} />
          <span className="flex-1" />
          {alert.status !== "saved" && (
            <RowAction icon={Heart} label="Save" onClick={() => onAction("saved")} />
          )}
          {alert.status !== "contacted" && (
            <RowAction icon={Mail} label="Contacted" onClick={() => onAction("contacted")} />
          )}
          {alert.status !== "dismissed" && (
            <RowAction icon={X} label="Dismiss" onClick={() => onAction("dismissed")} />
          )}
          <RowAction icon={ExternalLink} label="View" onClick={() => {}} />
        </div>
      </div>
    </li>
  );
}

function RowAction({ icon: Icon, label, onClick }: { icon: any; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 h-8 px-2.5 rounded-pill border border-charcoal-200 text-[11px] font-semibold text-charcoal-700 hover:border-charcoal-950 hover:text-charcoal-950"
    >
      <Icon className="h-3 w-3" /> {label}
    </button>
  );
}

function ScopeChip({
  label,
  icon: Icon,
  active,
  count,
  highlight,
  onClick,
}: {
  label: string;
  icon?: typeof Layers;
  active: boolean;
  count: number;
  highlight?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "shrink-0 inline-flex items-center gap-2 h-9 px-3.5 rounded-pill text-xs font-semibold transition-colors",
        active
          ? "bg-sage-700 text-paper"
          : "bg-paper border border-charcoal-200 text-charcoal-700 hover:border-charcoal-950",
        !active && highlight && "border-charcoal-950",
      )}
    >
      {Icon && <Icon className="h-3.5 w-3.5" />}
      <span className="max-w-[140px] truncate">{label}</span>
      <span className={cn("text-[10px] font-mono", active ? "text-paper/70" : "text-charcoal-500")}>
        {count}
      </span>
    </button>
  );
}


function StatusBadge({ status }: { status: AlertStatus }) {
  const map: Record<AlertStatus, { label: string; cls: string }> = {
    new: { label: "New", cls: "bg-peach-100 text-peach-900" },
    saved: { label: "Saved", cls: "bg-sage-200 text-sage-900" },
    contacted: { label: "Contacted", cls: "bg-charcoal-200 text-charcoal-800" },
    dismissed: { label: "Dismissed", cls: "bg-charcoal-100 text-charcoal-600" },
  };
  const m = map[status];
  return (
    <span className={cn("text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-pill", m.cls)}>
      {m.label}
    </span>
  );
}

/* ---------- Empty ---------- */
function EmptyState({ filter }: { filter: Filter }) {
  const copy: Record<Filter, { title: string; sub: string }> = {
    all: { title: "No alerts yet", sub: "Your matched listings will land here as soon as they appear." },
    new: { title: "All caught up", sub: "Nothing new since last visit. We'll ping you the moment something matches." },
    saved: { title: "Nothing saved", sub: "Tap the heart on an alert to keep it for later." },
    contacted: { title: "No outreach yet", sub: "Mark listings as contacted to track who you've reached out to." },
    dismissed: { title: "Inbox zero", sub: "Listings you dismiss show up here in case you change your mind." },
  };
  const m = copy[filter];
  return (
    <div className="rounded-card border border-dashed border-charcoal-200 bg-paper-warm/50 p-10 text-center">
      <Inbox className="h-8 w-8 text-charcoal-400 mx-auto" />
      <div className="mt-3 font-display text-lg font-bold text-charcoal-950">{m.title}</div>
      <div className="text-sm text-charcoal-600 mt-1 max-w-sm mx-auto">{m.sub}</div>
    </div>
  );
}

/* ---------- Wren AI compare modal ---------- */
function WrenCompareModal({ items, onClose }: { items: SavedAlert[]; onClose: () => void }) {
  const cheapest = [...items].sort((a, b) => a.price - b.price)[0];
  const bestProtected = items.find((i) => i.tags.includes("rent-stabilized")) ?? items[0];
  const avgPrice = Math.round(items.reduce((s, i) => s + i.price, 0) / items.length);

  return (
    <div className="fixed inset-0 z-50 bg-charcoal-950/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-fade-in">
      <div className="bg-paper rounded-card w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-paper border-b border-border px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-pill bg-sage-200 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-sage-800" />
            </div>
            <div>
              <div className="font-display text-lg font-bold text-charcoal-950">Wren's comparison</div>
              <div className="text-[11px] text-charcoal-500">Comparing {items.length} listings</div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-9 w-9 rounded-pill border border-charcoal-200 inline-flex items-center justify-center text-charcoal-700 hover:border-charcoal-950"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Wren summary */}
          <div className="rounded-card bg-sage-100/60 border border-sage-200 p-4">
            <div className="text-[11px] font-mono uppercase tracking-wider text-sage-800 mb-2">
              Wren's take
            </div>
            <p className="text-sm text-charcoal-800 leading-relaxed">
              You're looking at <strong>{items.length}</strong> places averaging{" "}
              <strong>${avgPrice.toLocaleString()}/mo</strong>. The best price is{" "}
              <strong>{cheapest.title}</strong> in {cheapest.neighborhood} at{" "}
              <strong>${cheapest.price.toLocaleString()}</strong>.{" "}
              {bestProtected.tags.includes("rent-stabilized")
                ? `${bestProtected.title} is rent-stabilized — strongest long-term protection.`
                : "None of these are rent-stabilized, so renewal increases will follow market rate."}
            </p>
          </div>

          {/* Per-listing grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {items.map((a) => (
              <div key={a.id} className="rounded-card border border-border p-3 bg-surface-elevated">
                <div
                  className="h-20 w-full rounded-md mb-2"
                  style={{ background: `hsl(${a.imageHue} 40% 80%)` }}
                />
                <div className="text-sm font-semibold text-charcoal-950 truncate">{a.title}</div>
                <div className="text-xs text-charcoal-600">{a.neighborhood}</div>
                <div className="text-sm font-bold text-charcoal-950 mt-1">
                  ${a.price.toLocaleString()}/mo
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {a.tags.slice(0, 3).map((t) => (
                    <span key={t} className="text-[10px] px-1.5 py-0.5 rounded-pill bg-sage-100 text-sage-800">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Suggested questions */}
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-charcoal-500 mb-2">
              Ask Wren
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                "Which has the best commute to Midtown?",
                "Any DOB violations on these buildings?",
                "What's the typical rent trajectory in these neighborhoods?",
              ].map((q) => (
                <button
                  key={q}
                  type="button"
                  className="text-xs h-9 px-3 rounded-pill border border-charcoal-200 text-charcoal-700 hover:border-charcoal-950 text-left"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
