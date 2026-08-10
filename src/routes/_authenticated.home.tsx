import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { useMemo, useState } from "react";
import { Pencil, Plus, ShieldCheck } from "lucide-react";

import { SampleListingsMap } from "@/components/onboarding/SampleListingsMap";
import { PreviewListingCard } from "@/components/onboarding/PreviewListingCard";
import { SearchSelector } from "@/components/app/SearchSelector";
import { useActiveSearch } from "@/lib/store";
import { getCity, type CityId } from "@/data/cities";
import { CITY_MAP } from "@/data/cities/mapData";
import { SAMPLE_LISTINGS, type SampleListing } from "@/data/sampleListings";
import { useAlertsQuery, useUpdateAlertStatusMutation } from "@/lib/queries/alerts";
import type { AlertListing, AlertRow } from "@/lib/alerts.functions";
import {
  useReportListingMutation,
  useSaveListingSnapshotMutation,
} from "@/lib/queries/listingReports";
import { ListingActions } from "@/components/app/ListingActions";
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

function HomeScreen() {
  const search = useActiveSearch();
  const cityId = (search?.cityId ?? "nyc") as CityId;
  const cityConfig = getCity(cityId);
  const alertsQ = useAlertsQuery();

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

  const realListings = useMemo(() => {
    const rows = (alertsQ.data ?? []).filter(
      (a) => a.status !== "dismissed" && (!search || !a.searchId || a.searchId === search.id),
    );
    return rows.map((a) => alertToListing(a, cityId));
  }, [alertsQ.data, cityId, search?.id]);

  const isSample = realListings.length === 0;

  const listings = useMemo(() => {
    if (!isSample) return realListings;
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
  }, [isSample, realListings, cityId, search?.budget, search?.neighborhoods]);

  const visibleListings = useMemo(
    () => listings.filter((l) => !hiddenIds.includes(l.id)),
    [listings, hiddenIds],
  );

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
        aria-label="Your matches"
        className="order-2 w-full px-6 pb-10 pt-6 md:order-1 md:w-[55%]"
      >
        <div className="mx-auto flex max-w-[760px] flex-col">
          <header className="p-2">
            <div className="mb-4">
              <SearchSelector />
            </div>
            <h1 className="font-display" style={H1}>
              {search
                ? isSample
                  ? `No new matches yet for ${search.name}.`
                  : `${listings.length} match${listings.length === 1 ? "" : "es"} for ${search.name}.`
                : "Create your first search."}
            </h1>

            <p className="mt-2 text-sm text-charcoal-600">
              {search
                ? isSample
                  ? `Here's a sample of what ${cityConfig?.displayName ?? "your city"} listings look like. Real matches land here — and in your inbox — the moment they appear.`
                  : `Fresh listings in ${cityConfig?.displayName ?? "your city"}, newest first.`
                : "Set a city, budget and neighborhoods to start receiving alerts."}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {search && (
                <Link
                  to="/search/$searchId/budget"
                  params={{ searchId: search.id }}
                  className="inline-flex h-10 items-center gap-1.5 rounded-pill border border-black/10 bg-white px-4 text-sm font-semibold text-charcoal-900 hover:border-charcoal-950"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit this search
                </Link>
              )}
              <Link
                to="/saved"
                className="inline-flex h-10 items-center gap-1.5 rounded-pill border border-black/10 bg-white px-4 text-sm font-semibold text-charcoal-900 hover:border-charcoal-950"
              >
                <Plus className="h-3.5 w-3.5" /> Saved listings
              </Link>
            </div>
          </header>

          {visibleListings.length === 0 ? (
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
              <div className="mt-6 flex flex-col gap-3">
                {visibleListings.map((listing) => (
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
              {isSample && (
                <p className="mt-6 text-xs uppercase tracking-[0.16em] text-charcoal-500">
                  Sample listings · real alerts arrive as they hit the market
                </p>
              )}
            </>
          )}

          {cityConfig?.buildingDataSources && cityConfig.buildingDataSources.length > 0 && (
            <div className="mt-6 flex gap-3 rounded-[16px] border border-black/[0.08] bg-white p-4">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-sage-700" />
              <div className="space-y-1">
                <div className="text-[11px] uppercase tracking-[0.18em] text-charcoal-500">
                  How we vet {cityConfig.displayName} listings
                </div>
                <p className="text-sm text-charcoal-700">
                  Every match is cross-checked against {cityConfig.buildingDataSources.join(", ")} records
                  before it reaches your inbox.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
