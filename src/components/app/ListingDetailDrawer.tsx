import * as React from "react";
import { ArrowUpRight, Building2, Clock, MapPin } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Skeleton } from "@/components/ui/skeleton";
import { OriginButton } from "@/components/ui/origin-button";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  getListingAmenities,
  type PropertyType,
  type SampleListing,
} from "@/data/sampleListings";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* Helpers                                                                     */
/* -------------------------------------------------------------------------- */

const PROPERTY_TYPE_LABEL: Record<PropertyType, string> = {
  apartment: "Apartment",
  condo: "Condo",
  house: "House",
  townhouse: "Townhouse",
};

/** Number of whole calendar days between `listedAt` and `now` (0 = today). */
function daysSince(listedAt: string, now: Date): number | null {
  const then = new Date(listedAt);
  if (Number.isNaN(then.getTime())) return null;
  const startOfDay = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const a = startOfDay(now).getTime();
  const b = startOfDay(then).getTime();
  return Math.max(0, Math.round((a - b) / 86_400_000));
}

/**
 * Human-readable "how long ago was this listed" string, computed in the
 * browser's timezone. Returns `null` when `listedAt` is absent or unparseable.
 *
 * Pass `now` only in tests; defaults to the current time.
 */
export function formatListingAge(
  listedAt?: string,
  now: Date = new Date(),
): string | null {
  if (!listedAt) return null;
  const days = daysSince(listedAt, now);
  if (days === null) return null;
  if (days === 0) return "Listed today";
  if (days === 1) return "Listed 1 day ago";
  return `Listed ${days} days ago`;
}

const KNOWN_PROVIDERS: Record<string, string> = {
  rentcast: "RentCast",
  streeteasy: "StreetEasy",
  "apartments.com": "Apartments.com",
  apartments: "Apartments",
  rentcastapi: "RentCast",
};

/** Nice display form for a raw provider slug. */
function prettyProvider(provider?: string): string | null {
  if (!provider) return null;
  const lower = provider.toLowerCase();
  if (KNOWN_PROVIDERS[lower]) return KNOWN_PROVIDERS[lower];
  // Fallback: capitalize the first letter of each space-separated token.
  return provider
    .split(/\s+/)
    .map((tok) => (tok.length ? tok[0].toUpperCase() + tok.slice(1) : tok))
    .join(" ");
}

function bedLabel(beds: number): string {
  return beds === 0 ? "Studio" : `${beds} bed`;
}

function bathsLabel(baths: number | null | undefined): string {
  if (baths === null || baths === undefined) return "— bath";
  return `${baths} bath`;
}

function sqftLabel(sqft: number | null | undefined): string {
  if (sqft === null || sqft === undefined) return "Size not specified";
  return `${sqft.toLocaleString()} sq ft`;
}

const SPEC_STYLE: React.CSSProperties = {
  fontSize: 14,
  lineHeight: "20px",
  color: "#6e6459",
};

/* -------------------------------------------------------------------------- */
/* Inner content (shared between desktop sheet + mobile drawer)               */
/* -------------------------------------------------------------------------- */

interface InnerProps {
  listing: SampleListing | null;
  loading?: boolean;
  actions?: React.ReactNode;
  onClose: () => void;
}

function ListingDetailInner({ listing, loading, actions, onClose }: InnerProps) {
  const amenities = React.useMemo(
    () => (listing ? getListingAmenities(listing) : []),
    [listing],
  );

  // Listing age is computed after mount so the browser timezone is used —
  // never the server's — mirroring the DigestMeta pattern in saved.tsx.
  const [age, setAge] = React.useState<string | null>(null);
  React.useEffect(() => {
    if (!listing?.listedAt) {
      setAge(null);
      return;
    }
    setAge(formatListingAge(listing.listedAt));
  }, [listing?.listedAt]);

  if (loading) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-56" />
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 px-8 text-center">
        <div
          className="font-display"
          style={{ fontWeight: 700, fontSize: 22, color: "#241c12" }}
        >
          This listing is no longer available
        </div>
        <p style={{ fontSize: 14, lineHeight: "20px", color: "#6e6459" }}>
          It may have been rented or removed by the source.
        </p>
        <OriginButton variant="tertiary" size="medium" onClick={onClose}>
          Close
        </OriginButton>
      </div>
    );
  }

  // SampleListing keeps the street as the `address` display string (which
  // already includes the unit), with the optional `city`/`state`/`zip` parts
  // added in Phase 1. Build a two-line address when those parts exist;
  // otherwise fall back to the single address string + neighborhood.
  const addressParts =
    listing.city || listing.state || listing.zip
      ? {
          line1: listing.address,
          line2: [listing.city, listing.state, listing.zip]
            .filter(Boolean)
            .join(", "),
        }
      : null;

  const providerName = prettyProvider(listing.provider);

  return (
    <div className="flex h-full flex-col">
      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">
        {/* Body text */}
        <div className="px-5 py-5">
          {/* 2. Price + tag */}
          <div className="flex flex-wrap items-end justify-between gap-2">
            <span
              className="font-display tabular-nums"
              style={{ fontWeight: 600, fontSize: 24, lineHeight: "28px", color: "#241c12" }}
            >
              ${listing.rent.toLocaleString()}
              <span style={{ fontSize: 18, color: "#6e6459" }}>/mo</span>
            </span>

            {listing.tag && (
              <span
                className="inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-semibold leading-[16px]"
                style={{
                  background: "#EBF0D5",
                  color: "#5a6e50",
                }}
              >
                {listing.tag}
              </span>
            )}
          </div>

          {/* 3. Spec row */}
          {(() => {
            const bits: string[] = [];
            if (listing.propertyType) {
              bits.push(PROPERTY_TYPE_LABEL[listing.propertyType] ?? null);
            }
            bits.push(bedLabel(listing.beds));
            bits.push(bathsLabel(listing.baths));
            bits.push(sqftLabel(listing.sqft));
            const filtered = bits.filter(Boolean) as string[];
            return (
              <div className="mt-2 flex flex-wrap items-center" style={SPEC_STYLE}>
                {filtered.map((b, i) => (
                  <React.Fragment key={b}>
                    {i > 0 && <span style={{ margin: "0 6px" }}>·</span>}
                    <span>{b}</span>
                  </React.Fragment>
                ))}
              </div>
            );
          })()}

          {/* 4. Address block */}
          <div className="mt-4">
            {addressParts ? (
              <>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 15,
                    lineHeight: "22px",
                    color: "#241c12",
                  }}
                >
                  {addressParts.line1}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    lineHeight: "20px",
                    color: "#6e6459",
                  }}
                >
                  {addressParts.line2}
                </div>
              </>
            ) : (
              <div
                style={{
                  fontWeight: 600,
                  fontSize: 15,
                  lineHeight: "22px",
                  color: "#241c12",
                }}
              >
                {listing.address}
              </div>
            )}

            {listing.neighborhood && (
              <div
                className="mt-1.5 inline-flex items-center gap-1"
                style={{ fontSize: 13, color: "#6e6459" }}
              >
                <MapPin style={{ width: 14, height: 14 }} />
                {listing.neighborhood}
              </div>
            )}
          </div>

          {/* 5. Listing age */}
          {age && (
            <div
              className="mt-4 inline-flex items-center gap-1.5"
              style={{ fontSize: 13, color: "#6e6459" }}
            >
              <Clock style={{ width: 14, height: 14 }} />
              {age}
            </div>
          )}

          {/* 5b. Description */}
          {listing.description && (
            <div className="mt-5">
              <div
                style={{
                  fontWeight: 600,
                  fontSize: 15,
                  lineHeight: "22px",
                  color: "#241c12",
                }}
              >
                About this listing
              </div>
              <p
                className="mt-1.5 whitespace-pre-line"
                style={{ fontSize: 14, lineHeight: "20px", color: "#4a4238" }}
              >
                {listing.description}
              </p>
            </div>
          )}

          {/* 6. Amenities */}
          {amenities.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {amenities.map((a) => (
                <li
                  key={a}
                  className="rounded-full border border-black/10 bg-[#faf6ee] px-2.5 py-1 text-[12px] leading-[16px] text-[#4a4238]"
                >
                  {a}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* 7. Sticky footer */}
      <div
        className="flex flex-col gap-3 border-t border-black/[0.08] md:flex-row md:items-center"
        style={{ background: "#ffffff", padding: "16px 20px" }}
      >
        {listing.url ? (
          <OriginButton
            variant="main"
            size="medium"
            className="w-full md:w-auto md:flex-1"
            onClick={() =>
              window.open(listing.url, "_blank", "noopener,noreferrer")
            }
          >
            View original listing
            <ArrowUpRight className="h-4 w-4" />
          </OriginButton>
        ) : (
          <p
            className="w-full text-[13px] leading-[18px] md:flex-1"
            style={{ color: "#6e6459" }}
          >
            {providerName
              ? `Found via ${providerName} — this source doesn't provide a public listing page.`
              : "This source doesn't provide a public listing page."}
          </p>
        )}

        {actions && (
          <div className="flex items-center justify-end gap-1 md:shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Drawer wrapper                                                              */
/* -------------------------------------------------------------------------- */

interface Props {
  listing: SampleListing | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  actions?: React.ReactNode;
  loading?: boolean;
}

export function ListingDetailDrawer({
  listing,
  open,
  onOpenChange,
  actions,
  loading,
}: Props) {
  const isMobile = useIsMobile();
  const close = React.useCallback(() => onOpenChange(false), [onOpenChange]);

  // Visually-hidden accessible titles/descriptions (Sheet/Drawer require them).
  const titleId = "listing-detail-title";
  const descId = "listing-detail-desc";
  const titleText = listing ? listing.address : "Listing details";
  const descText = loading
    ? "Loading listing details"
    : listing
      ? "Apartment listing details"
      : "This listing is no longer available";

  if (!isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="right"
          className={cn(
            "flex w-full flex-col gap-0 bg-white p-0",
            "sm:max-w-[480px]",
          )}
        >
          <SheetTitle id={titleId} className="sr-only">
            {titleText}
          </SheetTitle>
          <SheetDescription id={descId} className="sr-only">
            {descText}
          </SheetDescription>
          <ListingDetailInner
            listing={listing}
            loading={loading}
            actions={actions}
            onClose={close}
          />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        className="mx-auto h-[92dvh] max-h-[92dvh] bg-white p-0"
        aria-describedby={descId}
      >
        <DrawerTitle id={titleId} className="sr-only">
          {titleText}
        </DrawerTitle>
        <DrawerDescription id={descId} className="sr-only">
          {descText}
        </DrawerDescription>
        <ListingDetailInner
          listing={listing}
          loading={loading}
          actions={actions}
          onClose={close}
        />
      </DrawerContent>
    </Drawer>
  );
}
