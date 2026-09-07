import * as React from "react";
import {
  ArrowUpRight,
  Bath,
  BedDouble,
  Clock,
  House,
  MapPin,
  Ruler,
  X,
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Drawer,
  DrawerContent,
  DrawerClose,
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

function bedLabel(beds: number): string {
  return beds === 0 ? "Studio" : `${beds} Bed${beds === 1 ? "" : "s"}`;
}

function bathsLabel(baths: number | null | undefined): string {
  if (baths === null || baths === undefined) return "— Bath";
  return `${baths} Bath${baths === 1 ? "" : "s"}`;
}

function sqftLabel(sqft: number | null | undefined): string {
  if (sqft === null || sqft === undefined) return "Size not specified";
  return `${sqft.toLocaleString()} ft²`;
}

const SPEC_ITEMS = [
  { key: "beds", Icon: BedDouble },
  { key: "baths", Icon: Bath },
  { key: "sqft", Icon: Ruler },
] as const;

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
        <div className="flex-1 space-y-6 overflow-y-auto px-6 pb-8 pt-14">
          <div className="space-y-2">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
          </div>
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-6 w-4/5" />
          <div className="space-y-4">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-5 w-2/5" />
            <Skeleton className="h-5 w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 px-8 text-center">
        <div className="font-display text-[22px] font-bold text-foreground">
          This listing is no longer available
        </div>
        <p className="text-[14px] leading-5 text-muted-foreground">
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

  const addressLine2 = addressParts?.line2 || listing.neighborhood;
  const specs = [bedLabel(listing.beds), bathsLabel(listing.baths), sqftLabel(listing.sqft)];
  const propertyType = listing.propertyType
    ? PROPERTY_TYPE_LABEL[listing.propertyType]
    : null;

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-6 px-6 pb-8 pt-14">
          <header className="flex flex-col gap-1 overflow-hidden break-words">
            <h2 className="font-sans text-[26px] font-medium leading-[1.2] tracking-[-0.255px] text-foreground">
              {addressParts?.line1 ?? listing.address}
            </h2>
            {addressLine2 && (
              <p className="text-[16px] font-normal text-muted-foreground">
                {addressLine2}
              </p>
            )}
          </header>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-display whitespace-nowrap tabular-nums text-[32px] font-semibold leading-[1.2] tracking-[-0.36px] text-foreground">
              ${listing.rent.toLocaleString()}
              <span className="text-[24px] text-muted-foreground">/mo</span>
            </span>
            {listing.tag && (
              <span className="inline-flex items-center rounded-full bg-listing-badge px-3 py-1.5 font-['Inter',sans-serif] text-[13px] font-semibold text-listing-badge-foreground">
                {listing.tag}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {SPEC_ITEMS.map(({ key, Icon }, index) => (
              <React.Fragment key={key}>
                {index > 0 && (
                  <span aria-hidden className="h-1 w-1 shrink-0 rounded-full bg-listing-dot" />
                )}
                <div className="flex items-center gap-2 font-['Inter',sans-serif] text-[14px] font-medium text-foreground">
                  <Icon className="h-[18px] w-[18px] shrink-0 text-muted-foreground" />
                  <span>{specs[index]}</span>
                </div>
              </React.Fragment>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            {propertyType && (
              <div className="flex items-center gap-2 text-[14px] font-medium text-foreground">
                <House className="h-[18px] w-[18px] shrink-0 text-muted-foreground" />
                <span>{propertyType}</span>
              </div>
            )}
            {listing.neighborhood && (
              <div className="flex items-center gap-2 text-[14px] font-medium text-foreground">
                <MapPin className="h-[18px] w-[18px] shrink-0 text-muted-foreground" />
                <span>{listing.neighborhood}</span>
              </div>
            )}
            {age && (
              <div className="flex items-center gap-2 text-[14px] font-medium text-foreground">
                <Clock className="h-[18px] w-[18px] shrink-0 text-muted-foreground" />
                <span>{age}</span>
              </div>
            )}
          </div>

          {amenities.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {amenities.map((a) => (
                <li
                  key={a}
                  className="rounded-full border border-listing-border bg-paper px-3.5 py-2 text-[13px] font-medium text-foreground"
                >
                  {a}
                </li>
              ))}
            </ul>
          )}

          {listing.description && (
            <section className="flex flex-col gap-2.5">
              <h3 className="font-sans text-[16px] font-medium text-muted-foreground">
                About this listing
              </h3>
              <p className="whitespace-pre-line text-[16px] font-normal leading-[1.6] text-foreground">
                {listing.description}
              </p>
            </section>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 border-t border-listing-footer-border bg-surface-elevated px-3 py-5 sm:gap-4 sm:px-6">
        {listing.url ? (
          <OriginButton
            variant="main"
            size="medium"
            className="h-10 min-w-0 flex-1 rounded-[12px] px-3 text-[14px] font-medium tracking-[-0.32px] sm:px-4 [&>span]:gap-1"
            onClick={() =>
              window.open(listing.url, "_blank", "noopener,noreferrer")
            }
          >
            View original listing
            <ArrowUpRight className="h-4 w-4" />
          </OriginButton>
        ) : (
          <p className="min-w-0 flex-1 text-[13px] leading-[18px] text-muted-foreground">
            This source doesn't provide a public listing page
          </p>
        )}

        {actions && (
          <div className="shrink-0">
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
            "flex w-full flex-col gap-0 bg-surface-elevated p-0 [&>button]:right-4 [&>button]:top-4 [&>button]:z-10 [&>button]:rounded-full [&>button]:border-0 [&>button]:bg-transparent [&>button]:p-1.5 [&>button]:opacity-100 [&>button]:data-[state=open]:bg-transparent [&>button_svg]:h-5 [&>button_svg]:w-5",
            "sm:max-w-[482px]",
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
        className="mx-auto h-[92dvh] max-h-[92dvh] bg-surface-elevated p-0 [&>div:first-child]:hidden"
        aria-describedby={descId}
      >
        <DrawerClose asChild>
          <OriginButton
            variant="tertiary"
            size="medium"
            aria-label="Close listing details"
            className="absolute right-4 top-4 z-10 h-8 w-8 rounded-full border-0 bg-transparent p-1.5"
          >
            <X className="h-5 w-5" />
          </OriginButton>
        </DrawerClose>
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
