import { Check, X, Minus } from "lucide-react";
import { Eyebrow } from "@/components/marketing/Eyebrow";

type Cell = "yes" | "no" | "partial" | string;

interface Row {
  feature: string;
  detail?: string;
  nook: Cell;
  streetEasy: Cell;
  zillow: Cell;
  apartmentsCom: Cell;
}

const rows: Row[] = [
  {
    feature: "Real-time alerts",
    detail: "Median 47s from posting to your inbox",
    nook: "yes",
    streetEasy: "partial",
    zillow: "no",
    apartmentsCom: "no",
  },
  {
    feature: "Rent-stabilized flag",
    detail: "Verified against HCR records",
    nook: "yes",
    streetEasy: "no",
    zillow: "no",
    apartmentsCom: "no",
  },
  {
    feature: "DOB / HPD violations shown",
    nook: "yes",
    streetEasy: "no",
    zillow: "no",
    apartmentsCom: "no",
  },
  {
    feature: "Private landlord sources",
    detail: "Listings that never hit big portals",
    nook: "yes",
    streetEasy: "no",
    zillow: "no",
    apartmentsCom: "no",
  },
  {
    feature: "Big-portal coverage",
    detail: "StreetEasy + Zillow + Apartments.com aggregated",
    nook: "yes",
    streetEasy: "partial",
    zillow: "partial",
    apartmentsCom: "partial",
  },
  {
    feature: "No broker-fee filter",
    nook: "yes",
    streetEasy: "yes",
    zillow: "no",
    apartmentsCom: "partial",
  },
  {
    feature: "Cost to renter",
    nook: "Free · $14.99",
    streetEasy: "Free",
    zillow: "Free",
    apartmentsCom: "Free",
  },
  {
    feature: "Sells your data to landlords",
    nook: "no",
    streetEasy: "yes",
    zillow: "yes",
    apartmentsCom: "yes",
  },
];

const cols = [
  { key: "nook" as const, label: "Nook", highlight: true },
  { key: "streetEasy" as const, label: "StreetEasy", highlight: false },
  { key: "zillow" as const, label: "Zillow", highlight: false },
  { key: "apartmentsCom" as const, label: "Apartments.com", highlight: false },
];

function CellMark({ value, highlight }: { value: Cell; highlight: boolean }) {
  if (value === "yes") {
    return (
      <div className="flex justify-center">
        <div
          className={`h-7 w-7 rounded-pill flex items-center justify-center ${
            highlight
              ? "bg-sage-500 text-paper"
              : "bg-sage-100 text-sage-700"
          }`}
        >
          <Check className="h-4 w-4" strokeWidth={3} />
        </div>
      </div>
    );
  }
  if (value === "no") {
    return (
      <div className="flex justify-center">
        <div className="h-7 w-7 rounded-pill flex items-center justify-center bg-charcoal-100 text-charcoal-400">
          <X className="h-4 w-4" strokeWidth={2.5} />
        </div>
      </div>
    );
  }
  if (value === "partial") {
    return (
      <div className="flex justify-center">
        <div className="h-7 w-7 rounded-pill flex items-center justify-center bg-peach-100 text-peach-700">
          <Minus className="h-4 w-4" strokeWidth={3} />
        </div>
      </div>
    );
  }
  return (
    <div
      className={`text-center text-xs font-mono uppercase tracking-[0.12em] font-semibold ${
        highlight ? "text-charcoal-950" : "text-charcoal-600"
      }`}
    >
      {value}
    </div>
  );
}

export function ComparisonTable() {
  return (
    <section
      id="compare"
      className="bg-surface-elevated py-24 lg:py-32 border-y border-charcoal-200/60"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="max-w-3xl mb-12 lg:mb-16">
          <Eyebrow tone="lavender">How we compare</Eyebrow>
          <h2 className="font-display font-bold text-4xl lg:text-6xl tracking-[-0.02em] text-charcoal-950 leading-[1.05]">
            What the big sites{" "}
            <span className="accent-italic">don't do.</span>
          </h2>
          <p className="mt-6 text-lg text-charcoal-700 leading-relaxed max-w-2xl">
            Most listing sites are ad platforms for landlords. Nook is the
            only tool built for the person actually trying to find a place
            to live.
          </p>
        </div>

        {/* Desktop / tablet table */}
        <div className="hidden md:block rounded-card border border-charcoal-200/60 overflow-hidden bg-paper-warm">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-charcoal-200/60">
                <th className="text-left p-5 lg:p-6 text-[11px] font-mono uppercase tracking-[0.16em] text-charcoal-600 font-semibold">
                  Feature
                </th>
                {cols.map((c) => (
                  <th
                    key={c.key}
                    className={`p-5 lg:p-6 text-center text-sm font-display font-bold tracking-[-0.01em] ${
                      c.highlight
                        ? "bg-charcoal-950 text-paper"
                        : "text-charcoal-700"
                    }`}
                  >
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr
                  key={r.feature}
                  className={
                    i % 2 === 0 ? "bg-paper-warm" : "bg-surface-elevated/60"
                  }
                >
                  <td className="p-5 lg:p-6 align-top">
                    <div className="text-sm font-semibold text-charcoal-950">
                      {r.feature}
                    </div>
                    {r.detail && (
                      <div className="text-xs text-charcoal-600 mt-1 leading-relaxed">
                        {r.detail}
                      </div>
                    )}
                  </td>
                  {cols.map((c) => (
                    <td
                      key={c.key}
                      className={`p-5 lg:p-6 align-middle ${
                        c.highlight ? "bg-charcoal-950/[0.03]" : ""
                      }`}
                    >
                      <CellMark value={r[c.key]} highlight={c.highlight} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile stacked */}
        <div className="md:hidden space-y-4">
          {rows.map((r) => (
            <div
              key={r.feature}
              className="rounded-card border border-charcoal-200/60 bg-paper-warm p-5"
            >
              <div className="text-sm font-semibold text-charcoal-950">
                {r.feature}
              </div>
              {r.detail && (
                <div className="text-xs text-charcoal-600 mt-1 leading-relaxed">
                  {r.detail}
                </div>
              )}
              <div className="mt-4 grid grid-cols-4 gap-2">
                {cols.map((c) => (
                  <div key={c.key} className="text-center">
                    <div
                      className={`text-[10px] font-mono uppercase tracking-[0.14em] mb-2 font-semibold ${
                        c.highlight ? "text-charcoal-950" : "text-charcoal-500"
                      }`}
                    >
                      {c.label.split(" ")[0]}
                    </div>
                    <CellMark value={r[c.key]} highlight={c.highlight} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-xs text-charcoal-500 max-w-3xl leading-relaxed">
          Comparisons based on publicly listed features as of June 2026.
          "Partial" means feature exists but with significant limitations
          (e.g., delayed alerts, missing sources, or paywalled).
        </div>
      </div>
    </section>
  );
}
