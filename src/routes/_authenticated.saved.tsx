import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { useMemo } from "react";
import {
  Heart,
  Inbox,
  Loader2,
  Pencil,
  Plus,
  Search as SearchIcon,
  ThumbsDown,
  RotateCcw,
} from "lucide-react";

import { AppPage } from "@/components/app/AppPage";
import { OriginButton } from "@/components/ui/origin-button";
import { PreviewListingCard } from "@/components/onboarding/PreviewListingCard";
import { ListingActions } from "@/components/app/ListingActions";
import { cn } from "@/lib/utils";
import { useAppStore, type Search } from "@/lib/store";
import { getCity, type CityId } from "@/data/cities";
import { CITY_MAP } from "@/data/cities/mapData";
import type { SampleListing } from "@/data/sampleListings";
import type { AlertRow } from "@/lib/alerts.functions";
import { useAlertsQuery, useUpdateAlertStatusMutation } from "@/lib/queries/alerts";
import { useReportListingMutation } from "@/lib/queries/listingReports";

const TABS = [
  { key: "saved", label: "Saved listings", icon: Heart },
  { key: "searches", label: "My searches", icon: SearchIcon },
  { key: "disliked", label: "Disliked listings", icon: ThumbsDown },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const searchSchema = z.object({
  tab: fallback(z.string(), "saved").default("saved"),
});

export const Route = createFileRoute("/_authenticated/saved")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Your library — Nook" },
      {
        name: "description",
        content: "Saved listings, your saved searches, and the listings you passed on.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: SavedPage,
});

/** Map a saved alert row onto the shared listing-card shape. */
function alertToListing(a: AlertRow, cityId: CityId | undefined): SampleListing {
  const l = a.listing;
  const coords = cityId ? CITY_MAP[cityId]?.neighborhoods[l.neighborhood] : undefined;
  return {
    id: a.id,
    address: l.title,
    rent: l.price,
    beds: l.beds,
    baths: l.baths,
    neighborhood: l.neighborhood,
    tag: l.tags?.[0],
    image:
      l.imageUrl ??
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80&auto=format&fit=crop",
    coords,
  };
}

function SavedPage() {
  const { tab } = Route.useSearch();
  const navigate = useNavigate();
  const activeTab: TabKey = TABS.some((t) => t.key === tab) ? (tab as TabKey) : "saved";

  const searches = useAppStore((s) => s.searches);
  const alertsQ = useAlertsQuery();
  const updateStatus = useUpdateAlertStatusMutation();
  const reportMutation = useReportListingMutation();

  const searchCity = useMemo(() => {
    const m = new Map<string, CityId>();
    searches.forEach((s) => m.set(s.id, s.cityId));
    return m;
  }, [searches]);

  const rows = alertsQ.data ?? [];

  const savedRows = useMemo(
    () => rows.filter((r) => r.status !== "dismissed"),
    [rows],
  );
  const dislikedRows = useMemo(
    () => rows.filter((r) => r.status === "dismissed"),
    [rows],
  );

  const counts: Record<TabKey, number> = {
    saved: savedRows.length,
    searches: searches.filter((s) => s.status !== "archived").length,
    disliked: dislikedRows.length,
  };

  const setTab = (key: TabKey) =>
    navigate({ to: "/saved", search: { tab: key } });

  return (
    <AppPage
      title="Your library"
      subtitle="Listings you kept, the searches behind them, and what you passed on."
    >
      <div className="space-y-6">
        {/* Tabs */}
        <div
          role="tablist"
          aria-label="Library sections"
          className="flex gap-2 overflow-x-auto -mx-6 px-6 lg:mx-0 lg:px-0 pb-1"
        >
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = activeTab === t.key;
            return (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(t.key)}
                className={cn(
                  "shrink-0 inline-flex items-center gap-2 h-10 px-4 rounded-[12px] text-[13px] font-semibold transition-colors",
                  active
                    ? "bg-[#241c12] text-white"
                    : "bg-white border border-black/10 text-charcoal-700 hover:border-black/20",
                )}
              >
                <Icon className={cn("h-4 w-4", active && t.key === "saved" && "fill-current")} />
                {t.label}
                <span
                  className={cn(
                    "text-[11px] font-mono",
                    active ? "text-white/70" : "text-charcoal-500",
                  )}
                >
                  {counts[t.key]}
                </span>
              </button>
            );
          })}
        </div>

        {alertsQ.isLoading && activeTab !== "searches" ? (
          <div className="flex items-center justify-center py-16 text-charcoal-500">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : activeTab === "saved" ? (
          savedRows.length === 0 ? (
            <EmptyState
              title="Nothing saved yet"
              sub="Tap the heart on a listing to keep it here for later."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {savedRows.map((r) => {
                const listing = alertToListing(r, searchCity.get(r.searchId ?? ""));
                return (
                  <PreviewListingCard
                    key={r.id}
                    listing={listing}
                    actions={
                      <ListingActions
                        saved={r.status === "saved"}
                        saving={updateStatus.isPending && updateStatus.variables?.id === r.id}
                        compactSave
                        onToggleSave={() =>
                          updateStatus.mutate({
                            id: r.id,
                            status: r.status === "saved" ? "new" : "saved",
                          })
                        }
                        onDislike={(reason) =>
                          updateStatus.mutate({
                            id: r.id,
                            status: "dismissed",
                            dismissReason: reason ?? null,
                          })
                        }
                        onReport={(reason, details) => {
                          updateStatus.mutate({
                            id: r.id,
                            status: "dismissed",
                            dismissReason: `Reported: ${reason}`,
                          });
                          reportMutation.mutate({
                            listingRef: r.id,
                            reason,
                            details,
                            searchId: r.searchId ?? null,
                            alertId: r.id,
                            listing: {
                              title: listing.address,
                              neighborhood: listing.neighborhood,
                              price: listing.rent,
                              beds: listing.beds,
                              baths: listing.baths,
                            },
                          });
                        }}
                      />
                    }
                  />
                );
              })}
            </div>
          )
        ) : activeTab === "searches" ? (
          <SearchesTab searches={searches} />
        ) : dislikedRows.length === 0 ? (
          <EmptyState
            title="Nothing disliked"
            sub="Listings you pass on land here, in case you change your mind."
          />
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {dislikedRows.map((r) => (
              <DislikedCard
                key={r.id}
                row={r}
                restoring={updateStatus.isPending && updateStatus.variables?.id === r.id}
                onRestore={() =>
                  updateStatus.mutate({ id: r.id, status: "new", dismissReason: null })
                }
              />
            ))}
          </ul>
        )}
      </div>
    </AppPage>
  );
}

/* ---------- My searches ---------- */

function summaryBits(s: Search): string[] {
  const bits: string[] = [];
  if (s.budget) bits.push(`$${s.budget[0].toLocaleString()}–$${s.budget[1].toLocaleString()}/mo`);
  bits.push(s.bedrooms.length ? s.bedrooms.join(", ") : "Any beds");
  bits.push(`${s.bathrooms} bath`);
  bits.push(
    s.moveIn.mode === "specific" && s.moveIn.date
      ? `Move-in ${new Date(s.moveIn.date).toLocaleDateString()}`
      : "Flexible move-in",
  );
  bits.push(
    s.neighborhoods.length
      ? `${s.neighborhoods.length} neighborhood${s.neighborhoods.length === 1 ? "" : "s"}`
      : "Anywhere in city",
  );
  if (s.rentProtection !== "all") bits.push("Rent-protected only");
  if (!s.includeBrokerFee) bits.push("No broker fee");
  const amen = Object.entries(s.amenities).filter(([, v]) => v === "required").length;
  if (amen > 0) bits.push(`${amen} must-have amenit${amen === 1 ? "y" : "ies"}`);
  if (s.transit.hasPreference) {
    const lines = Object.keys(s.transit.lines).length;
    if (lines > 0) bits.push(`${lines} transit line${lines === 1 ? "" : "s"}`);
  }
  if (s.commute.maxMinutes) bits.push(`≤${s.commute.maxMinutes} min commute`);
  bits.push(`${s.alertChannel} alerts · ${s.frequency}`);
  return bits;
}

function SearchesTab({ searches }: { searches: Search[] }) {
  const navigate = useNavigate();
  const live = searches.filter((s) => s.status !== "archived");
  const archived = searches.filter((s) => s.status === "archived");

  if (live.length === 0 && archived.length === 0) {
    return (
      <EmptyState
        title="No searches yet"
        sub="Create a search and we'll start matching listings for you."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <OriginButton
          variant="dark"
          size="medium"
          onClick={() => navigate({ to: "/onboarding" })}
        >
          <Plus className="h-4 w-4" /> New search
        </OriginButton>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2">
        {[...live, ...archived].map((s) => (
          <li
            key={s.id}
            className={cn(
              "rounded-[16px] border border-black/10 bg-white p-5",
              s.status === "archived" && "opacity-60",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className={cn(
                      "h-2 w-2 shrink-0 rounded-full",
                      s.status === "active"
                        ? "bg-sage-700"
                        : s.status === "paused"
                          ? "bg-peach-700"
                          : "bg-charcoal-300",
                    )}
                  />
                  <h3 className="truncate text-[17px] font-semibold text-[#241c12]">{s.name}</h3>
                </div>
                <p className="mt-1 text-[12px] text-charcoal-500">
                  {getCity(s.cityId)?.name ?? s.cityId} ·{" "}
                  {s.status === "active" ? "Live" : s.status === "paused" ? "Paused" : "Archived"} ·{" "}
                  {s.totalAlertsReceived} alerts
                </p>
              </div>
              <OriginButton
                variant="tertiary"
                size="medium"
                aria-label={`Edit ${s.name}`}
                className="h-9 w-9 shrink-0 rounded-[8px] p-0"
                onClick={() =>
                  navigate({ to: "/search/$searchId/budget", params: { searchId: s.id } })
                }
              >
                <Pencil className="h-4 w-4" />
              </OriginButton>
            </div>

            <div className="mt-3 flex flex-wrap gap-x-2 gap-y-1 text-[12px] leading-[18px] text-charcoal-600">
              {summaryBits(s).map((b, i) => (
                <span key={`${s.id}-${i}`} className="after:ml-2 after:content-['·'] last:after:content-['']">
                  {b}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- Disliked ---------- */

function DislikedCard({
  row,
  restoring,
  onRestore,
}: {
  row: AlertRow;
  restoring: boolean;
  onRestore: () => void;
}) {
  const l = row.listing;
  return (
    <li className="rounded-[16px] border border-black/10 bg-white p-5 opacity-60 transition-opacity hover:opacity-90">
      <h3 className="truncate text-[17px] font-semibold text-[#241c12] line-through">{l.title}</h3>
      <p className="mt-1 text-[13px] text-charcoal-500">
        {l.neighborhood} · {l.beds === 0 ? "Studio" : `${l.beds} bed`} · {l.baths} bath ·{" "}
        <span className="line-through">${l.price.toLocaleString()}/mo</span>
      </p>
      <div className="mt-3 flex items-center justify-between gap-3">
        <span className="inline-flex max-w-[70%] items-center gap-1.5 rounded-[8px] bg-black/[0.04] px-2.5 py-1 text-[12px] text-charcoal-600">
          <ThumbsDown className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{row.dismissReason ?? "No reason given"}</span>
        </span>
        <OriginButton variant="tertiary" size="medium" onClick={onRestore} disabled={restoring}>
          {restoring ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
          Restore
        </OriginButton>
      </div>
    </li>
  );
}

/* ---------- Empty ---------- */

function EmptyState({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="rounded-[16px] border border-dashed border-black/15 bg-white/50 p-10 text-center">
      <Inbox className="mx-auto h-8 w-8 text-charcoal-400" />
      <div className="mt-3 font-display text-lg font-bold text-charcoal-950">{title}</div>
      <div className="mx-auto mt-1 max-w-sm text-sm text-charcoal-600">{sub}</div>
    </div>
  );
}
