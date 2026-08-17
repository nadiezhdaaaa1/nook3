import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ListFilter } from "lucide-react";


import { OriginButton } from "@/components/ui/origin-button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { EmptyState } from "@/components/app/EmptyState";
import { useDashboardStateOverride } from "@/lib/dev/dashboardState";


import { SampleListingsMap, type SampleListingsMapRef } from "@/components/onboarding/SampleListingsMap";
import { PreviewListingCard } from "@/components/onboarding/PreviewListingCard";
import { SearchSelector } from "@/components/app/SearchSelector";
import { useActiveSearch, useAppStore } from "@/lib/store";
import { getCity, type CityId } from "@/data/cities";
import { CITY_MAP } from "@/data/cities/mapData";
import { type SampleListing } from "@/data/sampleListings";
import { useCityListings } from "@/lib/queries/listings";
import { useAlertsQuery, useUpdateAlertStatusMutation } from "@/lib/queries/alerts";
import type { AlertListing, AlertRow } from "@/lib/alerts.functions";
import {
  useReportListingMutation,
  useSaveListingSnapshotMutation,
  useDismissListingSnapshotMutation,
} from "@/lib/queries/listingReports";
import { ListingActions } from "@/components/app/ListingActions";
import { FiltersSheet } from "@/components/app/FiltersSheet";
import {
  activeFilterCount,
  applyFilters,
  defaultFilters,
  deriveFilterScope,
  type MatchFilters,
} from "@/lib/app/filters";
import type { ReportReason } from "@/lib/listingReports.functions";



export const Route = createFileRoute("/_authenticated/home")({
  head: () => ({
    meta: [
      { title: "Your matches — Nook" },
      { name: "description", content: "Listings matching your saved apartment search, on a live map." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: HomeScreen,
});

const H1: React.CSSProperties = {
  fontWeight: 700,
  fontSize: 28,
  lineHeight: "38.4px",
  letterSpacing: "-0.96px",
  color: "#241c12",
};

/** Stable identity for a listing across catalog rows and saved snapshots. */
function listingKey(address: string, rent: number): string {
  return `${address}|${rent}`;
}

/** Map a saved alert row onto the shared listing-card shape.
 *  Coordinates: stored snapshot coords → matching catalog listing → neighborhood centroid.
 *  This keeps a saved pin exactly where it was and stops it from vanishing when
 *  the neighborhood name is missing from the city map data.
 */
function alertToListing(
  a: AlertRow,
  cityId: CityId,
  catalogByKey?: Map<string, SampleListing>,
): SampleListing {
  const l = a.listing;
  const catalog = catalogByKey?.get(listingKey(l.title, l.price));
  const stored: [number, number] | undefined =
    typeof l.lat === "number" && typeof l.lng === "number" ? [l.lat, l.lng] : undefined;
  const coords = stored ?? catalog?.coords ?? CITY_MAP[cityId]?.neighborhoods[l.neighborhood];
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
      catalog?.image ??
      `https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80&auto=format&fit=crop`,
    coords,
  };
}


/** Build a compact page-number/ellipsis list for pagination.
 *  Pattern: first, last, current, and one neighbor on each side; ellipsis fills gaps.
 */
function getPaginationItems(page: number, totalPages: number): (number | "ellipsis")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (page <= 4) {
    return [1, 2, 3, 4, 5, "ellipsis", totalPages];
  }

  if (page >= totalPages - 3) {
    return [
      1,
      "ellipsis",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [1, "ellipsis", page - 1, page, page + 1, "ellipsis", totalPages];
}



function HomeScreen() {
  const search = useActiveSearch();
  const noSearches = useAppStore((s) => s.searches.length === 0);

  const navigate = useNavigate();
  const cityId = (search?.cityId ?? "nyc") as CityId;
  const cityConfig = getCity(cityId);
  const alertsQ = useAlertsQuery();

  const PAGE_SIZE = 20;
  const [page, setPage] = useState(1);
  const listSectionRef = useRef<HTMLElement>(null);

  const handleSetPage = (next: number) => {
    setPage(next);
    listSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scope = useMemo(() => deriveFilterScope(search), [search]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<MatchFilters>(() => defaultFilters(scope));
  const filterCount = useMemo(() => activeFilterCount(filters, scope), [filters, scope]);
  const filtersActive = filterCount > 0;

  useEffect(() => {
    setPage(1);
    setFilters(defaultFilters(deriveFilterScope(search)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search?.id]);

  const [activeId, setActiveId] = useState<string | null>(null);
  /** Listing key of a card that was open when it got saved — selection follows to the new id. */
  const pendingSelectKeyRef = useRef<string | null>(null);

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [hiddenIds, setHiddenIds] = useState<string[]>([]);
  const [mapFullscreen, setMapFullscreen] = useState(false);
  const mapRef = useRef<SampleListingsMapRef | null>(null);

  useEffect(() => {
    if (!mapFullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMapFullscreen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mapFullscreen]);

  useEffect(() => {
    if (!search) setActiveId(null);
  }, [search]);



  const updateStatus = useUpdateAlertStatusMutation();
  const saveSnapshot = useSaveListingSnapshotMutation();
  const dismissSnapshot = useDismissListingSnapshotMutation();
  const reportMutation = useReportListingMutation();

  const alertById = useMemo(() => {
    const map = new Map<string, AlertRow>();
    for (const a of alertsQ.data ?? []) map.set(a.id, a);
    return map;
  }, [alertsQ.data]);

  const cityListings = useCityListings(cityId);

  /** Catalog lookup so saved snapshots can inherit real coords and imagery. */
  const catalogByKey = useMemo(() => {
    const map = new Map<string, SampleListing>();
    for (const l of cityListings) map.set(listingKey(l.address, l.rent), l);
    return map;
  }, [cityListings]);

  const allAlertListings = useMemo(() => {
    const rows = (alertsQ.data ?? []).filter(
      (a) => a.status !== "dismissed" && (!search || !a.searchId || a.searchId === search.id),
    );
    return rows.map((a) => alertToListing(a, cityId, catalogByKey));
  }, [alertsQ.data, cityId, search?.id, catalogByKey]);



  /** Only the user's own digest matches ever render here — never sample listings. */
  const listings = useMemo(
    () => [...allAlertListings].sort((a, b) => a.rent - b.rent),
    [allAlertListings],
  );


  /** Dev-panel override wins before any listings data is considered. */
  const stateOverride = useDashboardStateOverride();
  const forcedEmpty = stateOverride !== "normal";

  const filteredListings = useMemo(
    () => applyFilters(listings.filter((l) => !hiddenIds.includes(l.id)), filters, scope),
    [listings, hiddenIds, filters, scope],
  );

  const visibleListings = useMemo(
    () => (forcedEmpty ? [] : filteredListings),
    [forcedEmpty, filteredListings],
  );

  const pagedVisibleListings = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return visibleListings.slice(start, start + PAGE_SIZE);
  }, [page, visibleListings]);

  const totalMatches = visibleListings.length;
  const totalPages = Math.max(1, Math.ceil(totalMatches / PAGE_SIZE));

  /** Which empty state the active search is in.
   *  no digest rows at all → "no_digest"; rows exist but every one is dismissed
   *  → "all_dismissed"; a digest ran and left nothing → "no_matches". */
  const dashboardState = useMemo(() => {
    if (stateOverride !== "normal") return stateOverride;
    const rows = (alertsQ.data ?? []).filter(
      (a) => !search || !a.searchId || a.searchId === search.id,
    );
    if (rows.length === 0) return "no_digest" as const;
    if (rows.every((a) => a.status === "dismissed")) return "all_dismissed" as const;
    return "no_matches" as const;
  }, [stateOverride, alertsQ.data, search?.id]);


  useEffect(() => {
    setPage(1);
  }, [filterCount]);

  // A just-saved card comes back under a new id; move the open selection onto it.
  useEffect(() => {
    const key = pendingSelectKeyRef.current;
    if (!key) return;
    const next = allAlertListings.find((l) => listingKey(l.address, l.rent) === key);
    if (!next) return;
    pendingSelectKeyRef.current = null;
    mapRef.current?.skipNextFit();
    setActiveId(next.id);
  }, [allAlertListings]);




  /** Snapshot shape used when a market/sample listing has no alert row yet.
   *  Coordinates travel with the snapshot so the saved pin keeps its exact spot. */
  const toSnapshot = (l: SampleListing): AlertListing => ({
    title: l.address,
    neighborhood: l.neighborhood,
    beds: l.beds,
    baths: l.baths,
    price: l.rent,
    receivedAt: new Date().toISOString(),
    source: "nook",
    tags: l.tag ? [l.tag] : [],
    imageHue: 30,
    imageUrl: l.image,
    ...(l.coords ? { lat: l.coords[0], lng: l.coords[1] } : {}),
  });


  const savedIds = useMemo(
    () =>
      new Set(
        (alertsQ.data ?? [])
          .filter((a) => a.status === "saved")
          .map((a) => a.id),
      ),
    [alertsQ.data],
  );

  const persistedSearchId = (() => {
    if (!search) return null;
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(search.id)
      ? search.id
      : null;
  })();

  const handleToggleSave = (l: SampleListing) => {
    // Saving swaps the catalog row for a saved row with a new id; keep the viewport put.
    mapRef.current?.skipNextFit();
    const alert = alertById.get(l.id);
    if (alert) {
      updateStatus.mutate({ id: alert.id, status: alert.status === "saved" ? "new" : "saved" });
      return;
    }
    if (!persistedSearchId) {
      toast.error("Create a search first", {
        description: "Saved listings are attached to one of your saved searches.",
      });
      return;
    }
    // Remember which card was open so the selection can follow the new id.
    if (activeId === l.id) pendingSelectKeyRef.current = listingKey(l.address, l.rent);
    saveSnapshot.mutate({ searchId: persistedSearchId, listing: toSnapshot(l) });
  };


  const handleDislike = (l: SampleListing, reason?: string) => {
    mapRef.current?.skipNextFit();
    const alert = alertById.get(l.id);
    setHiddenIds((cur) => (cur.includes(l.id) ? cur : [...cur, l.id]));
    if (alert) {
      updateStatus.mutate({ id: alert.id, status: "dismissed", dismissReason: reason ?? null });
    } else if (persistedSearchId) {
      dismissSnapshot.mutate({
        searchId: persistedSearchId,
        listing: toSnapshot(l),
        dismissReason: reason ?? null,
      });
    } else {
      toast.error("Create a search first", {
        description: "Disliked listings are attached to one of your saved searches.",
      });
      return;
    }
    if (activeId === l.id) setActiveId(null);
    toast("Hidden from your matches", { description: "We'll show fewer listings like this." });
  };

  const handleReport = (l: SampleListing, reason: ReportReason, details: string) => {
    mapRef.current?.skipNextFit();
    const alert = alertById.get(l.id);
    setHiddenIds((cur) => (cur.includes(l.id) ? cur : [...cur, l.id]));
    if (alert) {
      updateStatus.mutate({ id: alert.id, status: "dismissed", dismissReason: `Reported: ${reason}` });
    } else if (persistedSearchId) {
      dismissSnapshot.mutate({
        searchId: persistedSearchId,
        listing: toSnapshot(l),
        dismissReason: `Reported: ${reason}`,
      });
    }
    if (activeId === l.id) setActiveId(null);
    reportMutation.mutate({
      listingRef: l.id,
      reason,
      details,
      searchId: persistedSearchId,
      alertId: alert?.id ?? null,
      listing: {
        title: l.address,
        neighborhood: l.neighborhood,
        price: l.rent,
        beds: l.beds,
        baths: l.baths,
      },
    });
    toast("Listing removed from your matches", { description: "Thanks for letting us know." });
  };


  const pins = useMemo(
    () =>
      search
        ? visibleListings
            .filter((l) => l.coords)
            .map((l) => ({ id: l.id, coords: l.coords!, rent: l.rent }))
        : [],
    [search, visibleListings],
  );

  const activeListing = search ? (visibleListings.find((l) => l.id === activeId) ?? null) : null;

  const popupCard = activeListing ? (
    <PreviewListingCard
      listing={activeListing}
      popup
      selected
      onClose={() => setActiveId(null)}
      actions={
        <ListingActions
          saved={savedIds.has(activeListing.id)}
          saving={
            (saveSnapshot.isPending &&
              saveSnapshot.variables?.listing.title === activeListing.address) ||
            (updateStatus.isPending && updateStatus.variables?.id === activeListing.id)
          }
          selected
          compactSave
          onToggleSave={() => handleToggleSave(activeListing)}
          onDislike={(reason) => handleDislike(activeListing, reason)}
          onReport={(reason, details) => handleReport(activeListing, reason, details)}
        />
      }
    />
  ) : null;

  const filtersButton = (
    <Tooltip>
      <TooltipTrigger asChild>
        <OriginButton
          type="button"
          variant="tertiary"
          size="medium"
          aria-haspopup="dialog"
          disabled={!search}
          onClick={() => setFiltersOpen(true)}
          className="inline-flex h-[46px] shrink-0 items-center gap-2 px-3 text-sm font-semibold"
        >
          {search && filterCount > 0 ? (
            <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-charcoal-950 text-[11px] font-semibold text-paper">
              {filterCount}
            </span>
          ) : (
            <ListFilter className="h-4 w-4 shrink-0" aria-hidden />
          )}
          Filters
        </OriginButton>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        {search ? "Filter matches" : "Create a search to use filters"}
      </TooltipContent>
    </Tooltip>
  );

  return (
    <div
      className="flex min-h-[calc(100dvh-64px)] flex-col md:flex-row"
      style={{ background: "#faf6ee" }}
    >
      {/* Map panel */}
      <aside
        aria-label="Map of your matches"
        className={
          mapFullscreen
            ? "fixed inset-x-0 bottom-0 top-[72px] z-30 h-auto w-full p-0 md:order-2 md:sticky md:top-[72px] md:h-[calc(100dvh-72px)] md:w-full md:p-6 md:z-auto"
            : "order-1 h-[420px] w-full shrink-0 p-6 md:order-2 md:h-[calc(100dvh-72px)] md:w-[45%] md:pl-0 md:sticky md:top-[72px]"
        }
      >
        {cityConfig && (
          <SampleListingsMap
            ref={mapRef}
            city={cityConfig}
            listings={pins}
            activeId={activeId}
            hoveredId={hoveredId}
            savedIds={savedIds}
            onSelect={(id) => setActiveId(id)}
            card={popupCard}
            isFullscreen={mapFullscreen}
            onToggleFullscreen={() => setMapFullscreen((v) => !v)}
            topLeftControls={
              mapFullscreen ? (
                <>
                  <div className="relative z-30 rounded-[12px] bg-[#fffdf7]/90 shadow-sm backdrop-blur-sm">
                    <SearchSelector />
                  </div>
                  <div className="relative z-10 rounded-[12px] bg-[#fffdf7]/90 shadow-sm backdrop-blur-sm">
                    {filtersButton}
                  </div>
                </>
              ) : null
            }

            className={
              mapFullscreen
                ? "relative h-full w-full overflow-hidden rounded-none border-0 bg-[#f5f2ea] md:rounded-[20px] md:border md:border-black/10"
                : "relative h-full w-full overflow-hidden rounded-[20px] border border-black/10 bg-[#f5f2ea]"
            }
          />
        )}
      </aside>

      {/* Listings column */}
      <section
        ref={listSectionRef}
        aria-label="Your matches"
        className={
          mapFullscreen
            ? "hidden"
            : "order-2 w-full px-6 pb-10 pt-6 md:order-1 md:w-[55%]"
        }
      >
        {!noSearches && (
          <div className="mx-auto flex max-w-[960px] flex-col">
          <header className="p-2">
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between md:gap-4">
              <SearchSelector />
              {filtersButton}
            </div>

            {(() => {
              const displayListings = pagedVisibleListings;
              const showEmptyState = displayListings.length === 0 && (forcedEmpty || !alertsQ.isLoading);
              if (showEmptyState) return null;
              return (
                <>
                  <h1 className="font-display" style={H1}>
                    {search
                      ? `${totalMatches} match${totalMatches === 1 ? "" : "es"} for ${search.name}`
                      : "Create your first search"}
                  </h1>

                  <p className="mt-2 text-sm text-charcoal-600">
                    {search
                      ? `Listings in ${cityConfig?.displayName ?? "your city"} matching this search, lowest rent first`
                      : "Set a city, budget and neighborhoods to start receiving alerts"}
                  </p>
                </>
              );
            })()}

          </header>

          {(() => {
            const displayListings = pagedVisibleListings;
            const isEmpty = displayListings.length === 0 && (forcedEmpty || !alertsQ.isLoading);
            if (!isEmpty) return null;

            const goEdit = () => {
              if (search) navigate({ to: "/search/$searchId/budget", params: { searchId: search.id } });
            };

            if (filtersActive && stateOverride === "normal" && dashboardState !== "no_digest") {
              return (
                <EmptyState
                  title="No matches with these filters"
                  body="Nothing here matches the filters you applied — try clearing a couple."
                  action={
                    <OriginButton
                      variant="tertiary"
                      size="medium"
                      onClick={() => setFilters(defaultFilters(scope))}
                    >
                      Clear filters
                    </OriginButton>
                  }
                />
              );
            }

            if (dashboardState === "all_dismissed") {
              return (
                <EmptyState
                  title="You've cleared this digest"
                  body="Every match from this period is in your disliked list. You can bring any of them back."
                  action={
                    <OriginButton
                      variant="main"
                      size="medium"
                      onClick={() => navigate({ to: "/saved", search: { tab: "disliked" } as never })}
                    >
                      View disliked listings
                    </OriginButton>
                  }
                />
              );
            }

            if (dashboardState === "no_matches") {
              return (
                <EmptyState
                  title="No new matches this period"
                  body="Nothing slipped through your filters. Broadening your budget or neighborhoods usually helps."
                  action={
                    <OriginButton variant="main" size="medium" onClick={goEdit}>
                      Edit search
                    </OriginButton>
                  }
                />
              );
            }

            return (
              <EmptyState
                title="Your first digest arrives within 24 hours"
                body={`We're watching ${cityConfig?.displayName ?? "your city"} for you right now`}
                action={
                  <button
                    type="button"
                    onClick={goEdit}
                    className="text-sm font-medium text-charcoal-600 underline underline-offset-4 transition-colors hover:text-charcoal-900"
                  >
                    Review your search
                  </button>
                }
              />
            );
          })()}

          {!forcedEmpty && pagedVisibleListings.length > 0 && !alertsQ.isLoading && (() => {
            const displayListings = pagedVisibleListings;
            return (

              <>
                <div className="mt-6 flex flex-col gap-2">
                  {displayListings.map((listing) => (
                    <PreviewListingCard
                      key={listing.id}
                      listing={listing}
                      selected={listing.id === activeId}
                      onSelect={() => setActiveId(listing.id)}
                      onHover={setHoveredId}
                      actions={
                        <ListingActions
                          saved={savedIds.has(listing.id)}
                          saving={
                            (saveSnapshot.isPending &&
                              saveSnapshot.variables?.listing.title === listing.address) ||
                            (updateStatus.isPending && updateStatus.variables?.id === listing.id)
                          }
                          selected={listing.id === activeId}
                          onToggleSave={() => handleToggleSave(listing)}
                          onDislike={(reason) => handleDislike(listing, reason)}
                          onReport={(reason, details) => handleReport(listing, reason, details)}
                        />
                      }
                    />
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="mt-6 flex items-center justify-center gap-2">
                    <OriginButton
                      type="button"
                      variant="tertiary"
                      size="medium"
                      className="h-[40px] w-[40px] px-0"
                      aria-label="Previous page"
                      onClick={() => handleSetPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                    >
                      <ChevronLeft size={18} strokeWidth={2} />
                    </OriginButton>
                    <div className="flex items-center gap-1">
                      {getPaginationItems(page, totalPages).map((item, idx) =>
                        item === "ellipsis" ? (
                          <span
                            key={`ellipsis-${idx}`}
                            className="inline-flex h-[40px] w-[40px] items-center justify-center text-[14px] font-medium tracking-[-0.02em] text-[#2B2521]"
                            aria-hidden="true"
                          >
                            …
                          </span>
                        ) : (
                          <OriginButton
                            key={item}
                            type="button"
                            variant={item === page ? "main" : "tertiary"}
                            size="medium"
                            className="h-[40px] w-[40px] px-0"
                            aria-label={`Page ${item}`}
                            aria-current={item === page ? "page" : undefined}
                            onClick={() => handleSetPage(item)}
                            disabled={false}
                          >
                            {item}
                          </OriginButton>
                        ),
                      )}
                    </div>
                    <OriginButton
                      type="button"
                      variant="tertiary"
                      size="medium"
                      className="h-[40px] w-[40px] px-0"
                      aria-label="Next page"
                      onClick={() => handleSetPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                    >
                      <ChevronRight size={18} strokeWidth={2} />
                    </OriginButton>
                  </div>
                )}
              </>
            );
          })()}

        </div>
        )}

      </section>

      <FiltersSheet
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        scope={scope}
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters(defaultFilters(scope))}
        onEditSearch={() => {
          setFiltersOpen(false);
          if (search) navigate({ to: "/search/$searchId/budget", params: { searchId: search.id } });
        }}
        resultCount={visibleListings.length}
        search={search ?? undefined}
      />
    </div>
  );

}
