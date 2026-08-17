import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { useMemo, useState, type ReactNode } from "react";
import {
  Heart,
  Inbox,
  Loader2,
  Lock,
  Pencil,
  Plus,
  Search as SearchIcon,
  ThumbsDown,
  RotateCcw,
  Trash2,
} from "lucide-react";

import { AppPage } from "@/components/app/AppPage";
import { OriginButton } from "@/components/ui/origin-button";
import { PreviewListingCard } from "@/components/onboarding/PreviewListingCard";
import { ListingActions } from "@/components/app/ListingActions";
import { cn } from "@/lib/utils";
import { useAppStore, useDisabledSearchIds, type Search, SEARCH_LIMITS } from "@/lib/store";
import { UpgradeModal } from "@/components/preferences/UpgradeModal";
import { getCity, type CityId } from "@/data/cities";
import { CITY_MAP } from "@/data/cities/mapData";
import type { SampleListing } from "@/data/sampleListings";
import type { AlertRow } from "@/lib/alerts.functions";
import { useAlertsQuery, useUpdateAlertStatusMutation } from "@/lib/queries/alerts";
import { useReportListingMutation } from "@/lib/queries/listingReports";
import { useDeleteSearchMutation } from "@/lib/queries/searches";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const TABS = [
  {
    key: "saved",
    label: "Saved listings",
    icon: Heart,
    title: "Saved listings",
    subtitle: "Listings you kept to revisit later.",
  },
  {
    key: "searches",
    label: "My searches",
    icon: SearchIcon,
    title: "My searches",
    subtitle: "Your searches across cities",
  },
  {
    key: "disliked",
    label: "Disliked listings",
    icon: ThumbsDown,
    title: "Disliked listings",
    subtitle: "Listings you passed on, in case you change your mind.",
  },
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
    () => rows.filter((r) => r.status === "saved"),
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

  const activeTabData = TABS.find((t) => t.key === activeTab)!;

  return (
    <AppPage
      title={activeTabData.title}
      subtitle={activeTabData.subtitle}
      tabs={
        <div
          role="tablist"
          aria-label="Library sections"
          className="flex flex-wrap gap-3"
        >
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = activeTab === t.key;
            return (
              <OriginButton
                key={t.key}
                role="tab"
                aria-selected={active}
                onClick={() => setTab(t.key)}
                variant={active ? "dark" : "tertiary"}
                size="medium"
                className="px-5"
              >
                <Icon
                  className={cn(
                    "h-5 w-5",
                    active && t.key === "saved" && "fill-current",
                  )}
                />
                <span>{t.label}</span>
                <span
                  className={cn(
                    "text-[13px] font-mono",
                    active ? "text-white/70" : "text-charcoal-500",
                  )}
                >
                  {counts[t.key]}
                </span>
              </OriginButton>
            );
          })}
        </div>
      }
    >
      <div className="space-y-6">

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
            <div className="grid gap-3 sm:grid-cols-2">
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
          <ul className="grid gap-3 sm:grid-cols-2">
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
  bits.push(`${s.frequency} alerts`);
  return bits;
}

function SearchesTab({ searches }: { searches: Search[] }) {
  const navigate = useNavigate();
  const plan = useAppStore((s) => s.user?.plan ?? "intro");
  const deleteSearch = useAppStore((s) => s.deleteSearch);
  const deleteMut = useDeleteSearchMutation();
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; search: Search | null }>({
    open: false,
    search: null,
  });
  const live = searches.filter((s) => s.status !== "archived");
  const archived = searches.filter((s) => s.status === "archived");
  const disabledIds = useDisabledSearchIds();
  const max = SEARCH_LIMITS[plan];
  const canCreate = live.length < max;
  const isUuid = (id: string) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  const dbAwareDelete = (id: string) => {
    if (isUuid(id)) deleteMut.mutate(id);
    deleteSearch(id);
  };
  const handleNew = () => {
    if (!canCreate) {
      setUpgradeOpen(true);
      return;
    }
    navigate({ to: "/search/new/$step", params: { step: "1" } });
  };
  const openDeleteDialog = (search: Search) => setDeleteDialog({ open: true, search });
  const closeDeleteDialog = () => setDeleteDialog({ open: false, search: null });
  const onConfirmDelete = () => {
    if (deleteDialog.search) {
      dbAwareDelete(deleteDialog.search.id);
    }
    closeDeleteDialog();
  };

  const planLimit = Number.isFinite(max) ? max : 3;
  const emptySlots = Array.from({ length: Math.max(0, 3 - live.length) }, (_, i) => live.length + i);

  if (searches.length === 0) {
    return (
      <EmptyState
        title="No saved searches yet"
        sub="A search is what powers your alerts and the listings on your home screen. Create one to start getting matches."
        action={
          <OriginButton variant="main" size="medium" onClick={handleNew} className="mt-5">
            Create a search
          </OriginButton>
        }
      />
    );
  }




  return (
    <div className="space-y-4">
      <ul className="grid gap-3 lg:grid-cols-3">
        {[...live, ...archived].map((s) => (

          <li
            key={s.id}
            className={cn(
              "rounded-[16px] border border-black/10 bg-white p-6",
              (s.status === "archived" || disabledIds.has(s.id)) && "opacity-60",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className={cn(
                      "h-2 w-2 shrink-0 rounded-full",
                      disabledIds.has(s.id)
                        ? "bg-charcoal-400"
                        : s.status === "active"
                          ? "bg-sage-700"
                          : s.status === "paused"
                            ? "border-2 border-peach-700"
                            : "bg-charcoal-300",
                    )}
                  />
                  <h3 className="truncate text-[19px] font-semibold text-[#241c12] font-['Google_Sans_Flex',sans-serif]">{s.name}</h3>
                </div>
                <p className="mt-1 text-[12px] text-charcoal-500">
                  {getCity(s.cityId)?.shortName ?? s.cityId} ·{" "}
                  {disabledIds.has(s.id)
                    ? "Disabled"
                    : s.status === "active"
                      ? "Live"
                      : s.status === "paused"
                        ? "Paused"
                        : "Archived"}{" "}
                  ·{" "}
                  {s.totalAlertsReceived} alerts
                </p>
              </div>
              <div className="flex items-center gap-1">
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
                <OriginButton
                  variant="tertiary"
                  size="medium"
                  aria-label={`Delete ${s.name}`}
                  className="h-9 w-9 shrink-0 rounded-[8px] p-0 text-danger hover:text-danger hover:bg-danger/10"
                  onClick={() => openDeleteDialog(s)}
                >
                  <Trash2 className="h-4 w-4" />
                </OriginButton>
              </div>
            </div>

            {disabledIds.has(s.id) && (
              <p className="mt-2 rounded-[8px] bg-black/[0.04] px-2.5 py-2 text-[12px] leading-[18px] text-charcoal-600">
                Over your plan limit — upgrade to run it again, or delete it.
              </p>
            )}

            <div className="mt-3 flex flex-wrap gap-x-2 gap-y-1 text-[14px] leading-[20px] text-charcoal-600">
              {summaryBits(s).map((b, i) => (
                <span key={`${s.id}-${i}`} className="after:ml-2 after:content-['·'] last:after:content-['']">
                  {b}
                </span>
              ))}
            </div>
          </li>
        ))}
        {emptySlots.map((i) => {
          const locked = i >= planLimit;
          return (
            <li key={`slot-${i}`}>
              <button
                type="button"
                onClick={() => (locked ? setUpgradeOpen(true) : handleNew())}
                className="flex h-full min-h-[160px] w-full flex-col items-center justify-center gap-2 rounded-[16px] border border-dashed border-black/25 bg-white/50 transition-colors hover:border-black/40 hover:bg-white"
              >
                {locked ? (
                  <Lock className="h-6 w-6 text-charcoal-500" />
                ) : (
                  <Plus className="h-6 w-6 text-[#241c12]" />
                )}
                <span className="text-[15px] font-semibold text-[#241c12]">
                  {locked ? "Add a search with Pro" : "New search"}
                </span>
                <span className="px-6 text-center text-[12px] text-charcoal-500">
                  {locked
                    ? "Pro includes up to 3 searches — own filters, own cities."
                    : "Another city, another budget, another set of filters."}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <DeleteSearchDialog
        open={deleteDialog.open}
        onOpenChange={(open) => {
          if (!open) closeDeleteDialog();
        }}
        search={deleteDialog.search}
        onConfirm={onConfirmDelete}
      />

      {upgradeOpen && <UpgradeModal onClose={() => setUpgradeOpen(false)} />}
    </div>
  );
}

/* ---------- Delete search dialog ---------- */

function DeleteSearchDialog({
  open,
  onOpenChange,
  search,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  search: Search | null;
  onConfirm: () => void;
}) {
  const [confirmText, setConfirmText] = useState("");

  const name = search?.name ?? "";
  const matches = confirmText.trim() === name;

  return (
    <AlertDialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) setConfirmText("");
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete "{name}"?</AlertDialogTitle>
          <AlertDialogDescription>
            This permanently removes the search and all its history. This cannot be undone.
            Type <span className="font-semibold text-charcoal-950">{name}</span> to confirm.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <input
          autoFocus
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder={name}
          className="h-11 w-full rounded-md border border-charcoal-200 bg-paper px-3 text-sm focus:border-charcoal-950 focus:outline-none"
        />
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={!matches}
            onClick={() => {
              onConfirm();
              setConfirmText("");
            }}
            className="bg-danger text-paper hover:bg-danger/90"
          >
            Delete search
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

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

function EmptyState({
  title,
  sub,
  action,
}: {
  title: string;
  sub: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-[16px] border border-dashed border-black/15 bg-white/50 p-10 text-center">
      <Inbox className="mx-auto h-8 w-8 text-charcoal-400" />
      <div className="mt-3 font-display text-lg font-bold text-charcoal-950">{title}</div>
      <div className="mx-auto mt-1 max-w-sm text-sm text-charcoal-600">{sub}</div>
      {action}
    </div>
  );
}
