import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ListFilter } from "lucide-react";


import { OriginButton } from "@/components/ui/origin-button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import { SampleListingsMap } from "@/components/onboarding/SampleListingsMap";
import { PreviewListingCard } from "@/components/onboarding/PreviewListingCard";
import { SearchSelector } from "@/components/app/SearchSelector";
import { useActiveSearch } from "@/lib/store";
import { getCity, type CityId } from "@/data/cities";
import { CITY_MAP } from "@/data/cities/mapData";
import { SAMPLE_LISTINGS, type SampleListing } from "@/data/sampleListings";
import { useAlertsQuery, usePaginatedAlertsQuery, useUpdateAlertStatusMutation } from "@/lib/queries/alerts";
import type { AlertListing, AlertRow } from "@/lib/alerts.functions";
import {
  useReportListingMutation,
  useSaveListingSnapshotMutation,
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

/** Map a saved alert row onto the shared listing-card shape. */
function alertToListing(a: AlertRow, cityId: CityId): SampleListing {
  const l = a.listing;
  const coords = CITY_MAP[cityId]?.neighborhoods[l.neighborhood];
  return {
    id: a.id,
    address: l.title,
    rent: l.price,
    beds: l.beds,
    baths: l.baths,
    neighborhood: l.neighborhood,
    tag: l.tags?.[0],
    image: l.imageUrl ?? `https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80&auto=format&fit=crop`,
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
  const navigate = useNavigate();
  const cityId = (search?.cityId ?? "nyc") as CityId;
  const cityConfig = getCity(cityId);
  const alertsQ = useAlertsQuery();

  const PAGE_SIZE = 20;
  const [page, setPage] = useState(1);
  const listSectionRef = useRef<HTMLElement>(null);
  const paginatedQ = usePaginatedAlertsQuery(page, PAGE_SIZE);

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
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [hiddenIds, setHiddenIds] = useState<string[]>([]);


  const updateStatus = useUpdateAlertStatusMutation();
  const saveSnapshot = useSaveListingSnapshotMutation();
  const reportMutation = useReportListingMutation();

  const alertById = useMemo(() => {
    const map = new Map<string, AlertRow>();
    for (const a of alertsQ.data ?? []) map.set(a.id, a);
    return map;
  }, [alertsQ.data]);

  const allAlertListings = useMemo(() => {
    const rows = (alertsQ.data ?? []).filter(
      (a) => a.status !== "dismissed" && (!search || !a.searchId || a.searchId === search.id),
    );
    return rows.map((a) => alertToListing(a, cityId));
  }, [alertsQ.data, cityId, search?.id]);

  const pagedListings = useMemo(
    () =>
      (paginatedQ.data?.alerts ?? [])
        .filter((a) => a.status !== "dismissed" && (!search || !a.searchId || a.searchId === search.id))
        .map((a) => alertToListing(a, cityId)),
    [paginatedQ.data, cityId, search?.id],
  );

  const isSample = allAlertListings.length === 0;

  const listings = useMemo(() => {
    if (!isSample) return allAlertListings;
    let pool = SAMPLE_LISTINGS[cityId] ?? [];
    if (search?.budget) {
      const [lo, hi] = search.budget;
      pool = pool.filter((l) => l.rent >= lo * 0.85 && l.rent <= hi);
    }
    if (search?.neighborhoods.length) {
      const wanted = pool.filter((l) => search.neighborhoods.includes(l.neighborhood));
      if (wanted.length > 0) pool = wanted;
    }
    return [...pool].sort((a, b) => a.rent - b.rent);
  }, [isSample, allAlertListings, cityId, search?.budget, search?.neighborhoods]);

  const visibleListings = useMemo(
    () => applyFilters(listings.filter((l) => !hiddenIds.includes(l.id)), filters, scope),
    [listings, hiddenIds, filters, scope],
  );

  const pagedVisibleListings = useMemo(() => {
    if (filtersActive) {
      const start = (page - 1) * PAGE_SIZE;
      return visibleListings.slice(start, start + PAGE_SIZE);
    }
    return pagedListings.filter((l) => !hiddenIds.includes(l.id));
  }, [filtersActive, page, visibleListings, pagedListings, hiddenIds]);

  const totalMatches =
    isSample || filtersActive ? visibleListings.length : (paginatedQ.data?.total ?? 0);
  const totalPages = Math.max(1, Math.ceil(totalMatches / PAGE_SIZE));

  useEffect(() => {
    setPage(1);
  }, [filterCount]);


  /** Snapshot shape used when a market/sample listing has no alert row yet. */
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

  const handleToggleSave = (l: SampleListing) => {
    const alert = alertById.get(l.id);
    if (alert) {
      updateStatus.mutate({ id: alert.id, status: alert.status === "saved" ? "new" : "saved" });
      return;
    }
    if (!search) {
      toast.error("Create a search first", {
        description: "Saved listings are attached to one of your searches.",
      });
      return;
    }
    saveSnapshot.mutate({ searchId: search.id, listing: toSnapshot(l) });
  };

  const handleDislike = (l: SampleListing) => {
    const alert = alertById.get(l.id);
    setHiddenIds((cur) => (cur.includes(l.id) ? cur : [...cur, l.id]));
    if (alert) updateStatus.mutate({ id: alert.id, status: "dismissed" });
    if (activeId === l.id) setActiveId(null);
    toast("Hidden from your matches", { description: "We'll show fewer listings like this." });
  };

  const handleReport = (l: SampleListing, reason: ReportReason, details: string) => {
    const alert = alertById.get(l.id);
    reportMutation.mutate({
      listingRef: l.id,
      reason,
      details,
      searchId: search?.id ?? null,
      alertId: alert?.id ?? null,
      listing: {
        title: l.address,
        neighborhood: l.neighborhood,
        price: l.rent,
        beds: l.beds,
        baths: l.baths,
      },
    });
  };

  const pins = useMemo(
    () =>
      visibleListings
        .filter((l) => l.coords)
        .map((l) => ({ id: l.id, coords: l.coords!, rent: l.rent })),
    [visibleListings],
  );

  const activeListing = visibleListings.find((l) => l.id === activeId) ?? null;

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
          onDislike={() => handleDislike(activeListing)}
          onReport={(reason, details) => handleReport(activeListing, reason, details)}
        />
      }
    />
  ) : null;

  return (
    <div
      className="flex min-h-[calc(100dvh-64px)] flex-col md:flex-row"
      style={{ background: "#faf6ee" }}
    >
      {/* Map panel */}
      <aside
        aria-label="Map of your matches"
        className="order-1 h-[420px] w-full shrink-0 p-6 md:order-2 md:h-[calc(100dvh-72px)] md:w-[45%] md:pl-0 md:sticky md:top-[72px]"
      >
        {cityConfig && (
          <SampleListingsMap
            city={cityConfig}
            listings={pins}
            activeId={activeId}
            hoveredId={hoveredId}
            onSelect={(id) => setActiveId(id)}
            card={popupCard}
            className="relative h-full w-full overflow-hidden rounded-[20px] border border-black/10 bg-[#f5f2ea]"
          />
        )}
      </aside>

      {/* Listings column */}
      <section
        ref={listSectionRef}
        aria-label="Your matches"
        className="order-2 w-full px-6 pb-10 pt-6 md:order-1 md:w-[55%]"
      >
        <div className="mx-auto flex max-w-[960px] flex-col">
          <header className="p-2">
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between md:gap-4">
              <SearchSelector />
              <Tooltip>
                <TooltipTrigger asChild>
                  <OriginButton
                    type="button"
                    variant="tertiary"
                    size="medium"
                    aria-haspopup="dialog"
                    onClick={() => setFiltersOpen(true)}
                    className="inline-flex h-[46px] shrink-0 items-center gap-2 px-3 text-sm font-semibold"
                  >
                    {filterCount > 0 ? (
                      <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-charcoal-950 text-[11px] font-semibold text-paper">
                        {filterCount}
                      </span>
                    ) : (
                      <ListFilter className="h-4 w-4 shrink-0" aria-hidden />
                    )}
                    Filters
                  </OriginButton>
                </TooltipTrigger>
                <TooltipContent side="bottom">Filter matches</TooltipContent>
              </Tooltip>

            </div>
            <h1 className="font-display" style={H1}>
              {search
                ? isSample
                  ? `No new matches yet for ${search.name}.`
                  : `${totalMatches} match${totalMatches === 1 ? "" : "es"} for ${search.name}.`
                : "Create your first search."}
            </h1>

            <p className="mt-2 text-sm text-charcoal-600">
              {search
                ? isSample
                  ? `Here's a sample of what ${cityConfig?.displayName ?? "your city"} listings look like. Real matches land here — and in your inbox — the moment they appear.`
                  : `Fresh listings in ${cityConfig?.displayName ?? "your city"}, newest first.`
                : "Set a city, budget and neighborhoods to start receiving alerts."}
            </p>

          </header>

          {(() => {
            const displayListings = isSample ? visibleListings : pagedVisibleListings;
            const isEmpty = displayListings.length === 0 && !paginatedQ.isLoading;
            return isEmpty ? (
              <div className="mt-6 rounded-[16px] border border-black/[0.08] bg-white p-6 text-center">
                <p className="text-sm text-charcoal-700">
                  Nothing to show for {cityConfig?.displayName ?? "your city"} yet.
                </p>
                <p className="mt-2 text-xs text-charcoal-500">
                  Widen your budget or add neighborhoods and we'll start matching.
                </p>
              </div>
            ) : (
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
                          onDislike={() => handleDislike(listing)}
                          onReport={(reason, details) => handleReport(listing, reason, details)}
                        />
                      }
                    />
                  ))}
                </div>
                {!isSample && totalPages > 1 && (
                  <div className="mt-6 flex items-center justify-center gap-2">
                    <OriginButton
                      type="button"
                      variant="tertiary"
                      size="medium"
                      className="h-[40px] w-[40px] px-0"
                      aria-label="Previous page"
                      onClick={() => handleSetPage(Math.max(1, page - 1))}
                      disabled={page === 1 || paginatedQ.isLoading}
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
                            disabled={paginatedQ.isLoading}
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
                      disabled={page === totalPages || paginatedQ.isLoading}
                    >
                      <ChevronRight size={18} strokeWidth={2} />
                    </OriginButton>
                  </div>
                )}
                {isSample && (
                  <p className="mt-6 text-xs uppercase tracking-[0.16em] text-charcoal-500">
                    Sample listings · real alerts arrive as they hit the market
                  </p>
                )}
              </>
            );
          })()}

        </div>
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
