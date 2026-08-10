import React from "react";
import { motion } from "framer-motion";
import { MapPin, TrendingDown, Sparkles, ChevronDown, X } from "lucide-react";
import type { SampleListing } from "@/data/sampleListings";

export function wrenTake(s: SampleListing) {
  const hash = Array.from(s.id).reduce((a, c) => a + c.charCodeAt(0), 0);
  const pick = <T,>(arr: T[]) => arr[hash % arr.length];
  const hasRS = !!s.tag && /stab|rs|control/i.test(s.tag);
  const deeplyUnder = (s.belowMedianPct ?? 0) >= 15;
  const under = (s.belowMedianPct ?? 0) >= 10;
  const bedLabel = s.beds === 0 ? "studio" : `${s.beds}BR`;

  if (deeplyUnder) {
    return pick([
      `${s.belowMedianPct}% under median for ${s.neighborhood} ${bedLabel}s — this gets ~40 inquiries by tonight. Apply today, not tomorrow.`,
      `Priced like 2022. Owner likely wants a fast close — go in pre-approved with one month + deposit ready.`,
      `Outlier on price for the block. Either it just hit or the broker mistyped — either way, first qualified app usually wins.`,
    ]);
  }
  if (hasRS) {
    return pick([
      `Rent-protected unit. Your rent here in 2030 is mostly already decided — worth touring even if the layout is mid.`,
      `${s.tag} status means renewal increases are capped by law. Long-term math beats a shinier non-stabilized listing.`,
      `Stabilized buildings rarely list publicly. If the tour goes well, don't sleep on it for a "maybe better" option.`,
    ]);
  }
  if (under) {
    return pick([
      `Roughly ${s.belowMedianPct}% below the ${s.neighborhood} median — fair, not insane. Tour by the weekend.`,
      `Reasonable for ${s.neighborhood}. Check the walk to transit on a weekday morning before signing.`,
      `Solid price. Ask the broker what's been renovated in the last 12 months and how long the last tenant stayed.`,
    ]);
  }
  if (s.rent >= 4000) {
    return pick([
      `At this price you should negotiate — 1 month free or broker fee covered is on the table for ${s.neighborhood} right now.`,
      `Premium rent for ${s.neighborhood}. Worth it only if you confirm the building isn't on the open-violations list.`,
      `Top of your budget. Tour two cheaper ones first so you know what you're paying the premium for.`,
    ]);
  }
  return pick([
    `Average price for ${s.neighborhood}. Decision will come down to light, noise, and the actual commute — not the photos.`,
    `Fair listing. The ${bedLabel}s in this pocket move in under a week, so book a tour in the next 48h.`,
    `Nothing flashy, but the fundamentals check out. Bring your application docs to the showing.`,
  ]);
}


function getCoverDiameter(width: number, height: number, x: number, y: number) {
  return Math.ceil(
    2 *
      Math.max(
        Math.hypot(x, y),
        Math.hypot(width - x, y),
        Math.hypot(x, height - y),
        Math.hypot(width - x, height - y),
      ),
  );
}

function WrenTakeHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full items-center justify-between gap-2 text-left p-3">
      {children}
    </div>
  );
}

interface Props {
  listing: SampleListing;
  selected?: boolean;
  /** popup = floating variant anchored to a map pin */
  popup?: boolean;
  onSelect?: () => void;
  onClose?: () => void;
  onHover?: (id: string | null) => void;
  openId?: string | null;
  setOpenId?: (id: string | null) => void;
}

export function PreviewListingCard({
  listing,
  selected = false,
  popup = false,
  onSelect,
  onClose,
  onHover,
  openId,
  setOpenId,
}: Props) {
  const open = openId === listing.id;
  const wrenBoxRef = React.useRef<HTMLDivElement>(null);
  const [wrenHovered, setWrenHovered] = React.useState(false);
  const [wrenOrigin, setWrenOrigin] = React.useState({ x: 0, y: 0 });
  const [wrenCoverSize, setWrenCoverSize] = React.useState(0);

  const updateWrenOrigin = React.useCallback((x: number, y: number) => {
    const node = wrenBoxRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    setWrenOrigin({ x, y });
    setWrenCoverSize(getCoverDiameter(rect.width, rect.height, x, y));
  }, []);

  React.useLayoutEffect(() => {
    const node = wrenBoxRef.current;
    if (!(node && wrenHovered)) return;
    const measure = () => {
      const rect = node.getBoundingClientRect();
      setWrenCoverSize(getCoverDiameter(rect.width, rect.height, wrenOrigin.x, wrenOrigin.y));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [wrenHovered, wrenOrigin.x, wrenOrigin.y]);

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

      <div className="relative" style={{ marginTop: 16 }}>
        <div
          ref={wrenBoxRef}
          role="button"
          tabIndex={0}
          aria-expanded={open}
          onClick={(e) => {
            e.stopPropagation();
            setOpenId?.(open ? null : listing.id);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              e.stopPropagation();
              setOpenId?.(open ? null : listing.id);
            }
          }}
          onPointerEnter={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            updateWrenOrigin(e.clientX - rect.left, e.clientY - rect.top);
            setWrenHovered(true);
          }}
          onPointerLeave={() => setWrenHovered(false)}
          className="relative cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          style={{
            background: "#2B2521",
            border: "1px solid transparent",
            borderRadius: 10,
            overflow: "hidden",
          }}
        >
          <motion.span
            animate={{ scale: wrenHovered && wrenCoverSize > 0 ? 1 : 0 }}
            initial={false}
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#000000]"
            style={{ left: wrenOrigin.x, top: wrenOrigin.y, width: wrenCoverSize, height: wrenCoverSize }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
          <WrenTakeHeader open={open}>
            <span className="relative z-10 flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-[#FA8B55]" />
              <span className="text-[11px] font-semibold uppercase tracking-[1.1px] text-white">
                Wren's take
              </span>
            </span>
            <ChevronDown
              className="relative z-10 transition-[transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none text-white"
              style={{
                width: 16,
                height: 16,
                transform: open ? "rotate(180deg)" : "none",
              }}
            />
          </WrenTakeHeader>
          {open && (
            <p className="relative z-10 px-3 pb-3 text-white" style={{ fontSize: 13, lineHeight: 1.5 }}>
              {wrenTake(listing)}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
