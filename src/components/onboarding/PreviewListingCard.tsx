import React, { useState } from "react";
import { ChevronDown, MapPin, TrendingDown, X } from "lucide-react";
import { getListingAmenities, type SampleListing } from "@/data/sampleListings";

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
  const [showMore, setShowMore] = useState(false);
  const amenities = getListingAmenities(listing);

  return (
    <article
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.();
      }}
      onMouseEnter={() => onHover?.(listing.id)}
      onMouseLeave={() => onHover?.(null)}
      className={`text-left border flex flex-col transition-[border-color,box-shadow] duration-150 group ${
        selected ? "border-[#6a820a]" : "border-black/10 hover:border-black/20"
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
          className="min-w-0 flex-1"
          style={{
            fontWeight: 600,
            fontSize: 17,
            lineHeight: "24px",
            fontFamily: "var(--font-sans)",
          }}
        >
          <span className="inline-flex w-full min-w-0 items-center text-[#241c12]">
            <span className="truncate">{listing.address}</span>
          </span>
        </h3>

        {onClose && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label="Dismiss listing"
            className="-mt-1 -mr-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#241c12]"
          >
            <X style={{ width: 16, height: 16, color: "#6e6459" }} />
          </button>
        )}
      </div>

      <div
        className="flex flex-wrap items-center gap-1"
        style={{ marginTop: 8, fontSize: 14, lineHeight: "20px", color: "#6e6459" }}
      >
        <MapPin style={{ width: 14, height: 14 }} />
        {listing.neighborhood}
        <span style={{ margin: "0 4px" }}>·</span>
        {listing.beds === 0 ? "Studio" : `${listing.beds} bed`}
        <span style={{ margin: "0 4px" }}>·</span>
        {listing.baths} bath
        {listing.belowMedianPct !== undefined && (
          <>
            <span style={{ margin: "0 4px" }}>·</span>
            <span
              className="inline-flex items-center gap-1"
              style={{ color: "#5a6e50" }}
            >
              <TrendingDown style={{ width: 14, height: 14 }} />
              {Math.abs(listing.belowMedianPct)}% {listing.belowMedianPct >= 0 ? "below" : "above"} median
            </span>
          </>
        )}
        {amenities.length > 0 && (
          <>
            <span style={{ margin: "0 4px" }}>·</span>
            <button
              type="button"
              aria-expanded={showMore}
              onClick={(e) => {
                e.stopPropagation();
                setShowMore((v) => !v);
              }}
              className="inline-flex items-center gap-1 rounded-[6px] px-1 text-[14px] leading-[20px] text-[#241c12] underline decoration-black/20 underline-offset-2 transition-colors hover:decoration-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#241c12]"
            >
              {showMore ? "Less" : "More"}
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${showMore ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </button>
          </>
        )}
      </div>

      {showMore && amenities.length > 0 && (
        <ul className="mt-2 flex flex-wrap gap-1.5">
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

      <div className="mt-3 flex items-end justify-between gap-3">
        <span
          className="font-display tabular-nums"
          style={{ fontWeight: 600, fontSize: 24, lineHeight: "28px", color: "#241c12" }}
        >
          ${listing.rent.toLocaleString()}
          <span style={{ fontSize: 18, color: "#6e6459" }}>/mo</span>
        </span>

        {actions}
      </div>
    </article>
  );
}
