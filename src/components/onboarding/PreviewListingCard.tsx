import React from "react";
import { MapPin, TrendingDown, X } from "lucide-react";
import type { SampleListing } from "@/data/sampleListings";

interface Props {
  listing: SampleListing;
  selected?: boolean;
  /** popup = floating variant anchored to a map pin */
  popup?: boolean;
  onSelect?: () => void;
  onClose?: () => void;
  onHover?: (id: string | null) => void;
  /** Optional action row rendered at the bottom of the card. */
  actions?: React.ReactNode;
}

export function PreviewListingCard({
  listing,
  selected = false,
  popup = false,
  onSelect,
  onClose,
  onHover,
  actions,
}: Props) {
  return (
    <article
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.();
      }}
      onMouseEnter={() => onHover?.(listing.id)}
      onMouseLeave={() => onHover?.(null)}
      className={`text-left border flex flex-col transition-[border-color,box-shadow] duration-150 ${
        selected ? "border-[#6a820a]" : "border-black/20 hover:border-black/30"
      } ${popup ? "w-[320px] max-w-[calc(100vw-64px)]" : "w-full"} ${
        onSelect ? "cursor-pointer" : ""
      }`}
      style={{
        background: "#ffffff",
        borderRadius: 16,
        padding: 20,
        boxShadow: popup
          ? "0 16px 32px rgba(12,12,13,0.14), 0 4px 8px rgba(12,12,13,0.06)"
          : "none",
      }}
    >

      <div className="flex items-start justify-between gap-3">
        <h3
          className="min-w-0 flex-1 truncate"
          style={{
            fontWeight: 600,
            fontSize: 17,
            lineHeight: "24px",
            color: "#241c12",
            fontFamily: "var(--font-sans)",
          }}
        >
          {listing.address}
        </h3>
        {onClose && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label="Dismiss listing"
            className="shrink-0 -mt-1 -mr-1 inline-flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#241c12]"
          >
            <X style={{ width: 16, height: 16, color: "#6e6459" }} />
          </button>
        )}
      </div>

      <div
        className="flex items-center gap-1"
        style={{ marginTop: 8, fontSize: 12, lineHeight: "18px", color: "#6e6459" }}
      >
        <MapPin style={{ width: 12, height: 12 }} />
        {listing.neighborhood}
        <span style={{ margin: "0 4px" }}>·</span>
        {listing.beds === 0 ? "Studio" : `${listing.beds} bed`}
        <span style={{ margin: "0 4px" }}>·</span>
        {listing.baths} bath
      </div>

      <div className="flex flex-wrap items-baseline gap-3" style={{ marginTop: 8 }}>
        <span
          className="font-display tabular-nums"
          style={{ fontWeight: 600, fontSize: 24, lineHeight: "28px", color: "#241c12" }}
        >
          ${listing.rent.toLocaleString()}
          <span style={{ fontSize: 18, color: "#6e6459" }}>/mo</span>
        </span>
        {!!listing.belowMedianPct && (
          <span
            className="inline-flex items-center gap-1"
            style={{ fontSize: 12, color: "#5a6e50" }}
          >
            <TrendingDown style={{ width: 12, height: 12 }} />
            {listing.belowMedianPct}% below median
          </span>
        )}
      </div>

      {actions}
    </article>
  );
}
