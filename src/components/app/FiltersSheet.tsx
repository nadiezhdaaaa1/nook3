import { useMemo } from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { Pencil, X } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { OriginButton } from "@/components/ui/origin-button";
import { ObChip } from "@/components/onboarding/ObChip";
import { findAmenity } from "@/data/amenities";
import { getCity } from "@/data/cities";
import { cn } from "@/lib/utils";
import type { Search } from "@/lib/store";
import {
  BATH_OPTIONS,
  activeFilterCount,
  bathLabel,
  bedLabel,
  type FilterScope,
  type MatchFilters,
} from "@/lib/app/filters";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scope: FilterScope;
  filters: MatchFilters;
  onChange: (next: MatchFilters) => void;
  onReset: () => void;
  onEditSearch: () => void;
  resultCount: number;
  search?: Search;
}

const LABEL: React.CSSProperties = {
  fontWeight: 600,
  fontSize: 12,
  lineHeight: "16px",
  letterSpacing: "1.4px",
  textTransform: "uppercase",
  color: "#6e6459",
};

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-black/[0.08] pt-5">
      <h3 style={LABEL}>{title}</h3>
      {hint && <p className="mt-1 text-xs text-charcoal-500">{hint}</p>}
      <div className="mt-3">{children}</div>
    </section>
  );
}

function toggle(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
}

function cityLabel(cityId: string) {
  return getCity(cityId as never)?.shortName ?? cityId;
}

function statusLabel(s: Search) {
  return s.status === "active" ? "Live" : s.status === "paused" ? "Paused" : "Archived";
}

function summary(s: Search) {
  const bits: string[] = [];
  if (s.budget) {
    bits.push(`$${Math.round(s.budget[0] / 100) / 10}k–$${Math.round(s.budget[1] / 100) / 10}k`);
  }
  if (s.bedrooms.length) bits.push(s.bedrooms.join("/"));
  bits.push(
    s.neighborhoods.length
      ? `${s.neighborhoods.length} area${s.neighborhoods.length === 1 ? "" : "s"}`
      : "Anywhere",
  );
  if (s.totalAlertsReceived > 0) bits.push(`${s.totalAlertsReceived} alerts`);
  return bits.join(" · ");
}

function StatusDot({ status }: { status: Search["status"] }) {
  return (
    <span
      aria-hidden
      className={cn(
        "h-2 w-2 rounded-full shrink-0",
        status === "active" ? "bg-sage-700" : status === "paused" ? "bg-peach-700" : "bg-charcoal-300",
      )}
    />
  );
}

/**
 * Filters for the active search. Every control is clamped to what the saved
 * search already allows — filters narrow, never widen.
 */
export function FiltersSheet({
  open,
  onOpenChange,
  scope,
  filters,
  onChange,
  onReset,
  onEditSearch,
  resultCount,
  search,
}: Props) {
  const count = useMemo(() => activeFilterCount(filters, scope), [filters, scope]);
  const baths = BATH_OPTIONS.filter((b) => scope.bathrooms.includes(b.id));

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 bg-white p-0 sm:max-w-[440px] max-md:inset-x-0 max-md:bottom-0 max-md:top-auto max-md:h-[88dvh] max-md:rounded-t-[20px]"
      >
        <SheetHeader className="space-y-0 border-b border-black/[0.08] p-6 pb-4 text-left">
          <div className="flex items-start justify-between gap-3">
            <div>
              <SheetTitle
                className="font-display"
                style={{ fontWeight: 700, fontSize: 22, letterSpacing: "-0.5px", color: "#241c12" }}
              >
                Filters
              </SheetTitle>
            </div>
          </div>

          {search ? (
            <button
              type="button"
              onClick={onEditSearch}
              className="mt-4 flex w-full items-center gap-3 rounded-[8px] border border-black/[0.08] bg-charcoal-950/[0.02] px-3 py-2.5 text-left transition-colors hover:bg-charcoal-950/[0.04]"
            >
              <StatusDot status={search.status} />
              <div className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5">
                  <span className="truncate text-sm font-semibold text-charcoal-950">
                    {search.name}
                  </span>
                  <span className="rounded-pill border border-black/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-charcoal-600">
                    {statusLabel(search)}
                  </span>
                </span>
                <span className="mt-0.5 block truncate text-[11px] text-charcoal-500">
                  {cityLabel(search.cityId)} · {summary(search)}
                </span>
              </div>
              <OriginButton
                type="button"
                variant="tertiary"
                size="medium"
                aria-label={`Edit ${search.name}`}
                className="h-8 w-8 shrink-0 rounded-[8px] p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditSearch();
                }}
              >
                <Pencil className="h-3.5 w-3.5" />
              </OriginButton>
            </button>
          ) : (
            <OriginButton
              type="button"
              variant="tertiary"
              size="medium"
              className="mt-4 inline-flex h-10 items-center gap-2 px-3 text-sm font-semibold"
              onClick={onEditSearch}
            >
              <Pencil className="h-3.5 w-3.5" aria-hidden />
              Edit this search
            </OriginButton>
          )}

          <SheetDescription className="mt-3 text-xs text-charcoal-600">
            Narrow within {search?.name ?? "this search"}. To widen it, edit the search.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-5 overflow-y-auto p-6">
          {!scope.hasScope && (
            <div className="rounded-[12px] bg-[#EBF0D5] p-4 text-sm text-charcoal-700">
              This search has no budget or neighborhoods yet. Add them from “Edit this search” and
              you'll be able to filter inside them here.
            </div>
          )}

          {scope.budget && filters.budget && (
            <section>
              <h3 style={LABEL}>Monthly rent</h3>
              <div
                className="mt-2 font-display tabular-nums"
                style={{ fontWeight: 700, fontSize: 28, letterSpacing: "-0.4px", color: "#241c12" }}
              >
                ${filters.budget[0].toLocaleString()}{" "}
                <span style={{ color: "#6e6459" }}>–</span> ${filters.budget[1].toLocaleString()}
              </div>
              <SliderPrimitive.Root
                min={scope.budget[0]}
                max={scope.budget[1]}
                step={scope.budgetStep}
                value={filters.budget}
                minStepsBetweenThumbs={1}
                onValueChange={(v) =>
                  onChange({ ...filters, budget: [v[0], v[1]] as [number, number] })
                }
                className="relative mt-4 flex w-full touch-none select-none items-center"
                style={{ height: 24 }}
              >
                <SliderPrimitive.Track
                  className="relative w-full grow overflow-hidden"
                  style={{ height: 6, borderRadius: 999, background: "#d8d5cd" }}
                >
                  <SliderPrimitive.Range
                    className="absolute h-full"
                    style={{ background: "#d66c38" }}
                  />
                </SliderPrimitive.Track>
                <SliderPrimitive.Thumb aria-label="Minimum rent" className="ob-thumb" />
                <SliderPrimitive.Thumb aria-label="Maximum rent" className="ob-thumb" />
              </SliderPrimitive.Root>
              <p className="mt-2 text-xs text-charcoal-500">
                Search range: ${scope.budget[0].toLocaleString()} – $
                {scope.budget[1].toLocaleString()}
              </p>
            </section>
          )}

          {scope.bedrooms.length > 0 && (
            <Section title="Bedrooms" hint="Nothing selected means all of them.">
              <div className="flex flex-wrap gap-2">
                {scope.bedrooms.map((id) => (
                  <ObChip
                    key={id}
                    size="small"
                    selected={filters.bedrooms.includes(id)}
                    onClick={() => onChange({ ...filters, bedrooms: toggle(filters.bedrooms, id) })}
                  >
                    {bedLabel(id)}
                  </ObChip>
                ))}
              </div>
            </Section>
          )}

          {baths.length > 1 && (
            <Section title="Minimum bathrooms" hint={`Search minimum: ${bathLabel(scope.bathroomsMin)}`}>
              <div className="flex flex-wrap gap-2">
                {baths.map((b) => (
                  <ObChip
                    key={b.id}
                    size="small"
                    selected={filters.bathrooms === b.id}
                    onClick={() =>
                      onChange({ ...filters, bathrooms: filters.bathrooms === b.id ? null : b.id })
                    }
                  >
                    {b.label}
                  </ObChip>
                ))}
              </div>
            </Section>
          )}

          {scope.neighborhoods.length > 0 && (
            <Section title="Neighborhoods" hint="Nothing selected means every neighborhood in the search.">
              <div className="flex flex-wrap gap-2">
                {scope.neighborhoods.map((n) => (
                  <ObChip
                    key={n}
                    size="small"
                    selected={filters.neighborhoods.includes(n)}
                    onClick={() =>
                      onChange({ ...filters, neighborhoods: toggle(filters.neighborhoods, n) })
                    }
                  >
                    {n}
                  </ObChip>
                ))}
              </div>
            </Section>
          )}

          {(scope.optionalAmenities.length > 0 || scope.requiredAmenities.length > 0) && (
            <Section title="Amenities">
              <div className="flex flex-wrap gap-2">
                {scope.requiredAmenities.map((id) => (
                  <ObChip key={id} size="small" selected disabled title="Required by your search">
                    {findAmenity(id)?.label ?? id}
                  </ObChip>
                ))}
                {scope.optionalAmenities.map((id) => (
                  <ObChip
                    key={id}
                    size="small"
                    selected={filters.amenities.includes(id)}
                    onClick={() =>
                      onChange({ ...filters, amenities: toggle(filters.amenities, id) })
                    }
                  >
                    {findAmenity(id)?.label ?? id}
                  </ObChip>
                ))}
              </div>
              {scope.requiredAmenities.length > 0 && (
                <p className="mt-2 text-xs text-charcoal-500">
                  Locked chips are required by your search.
                </p>
              )}
            </Section>
          )}

          {(scope.optionalTransit.length > 0 || scope.requiredTransit.length > 0) && (
            <Section title="Transit">
              <div className="flex flex-wrap gap-2">
                {scope.requiredTransit.map((id) => (
                  <ObChip key={id} size="small" selected disabled title="Required by your search">
                    {scope.transitLabels[id] ?? id}
                  </ObChip>
                ))}
                {scope.optionalTransit.map((id) => (
                  <ObChip
                    key={id}
                    size="small"
                    selected={filters.transit.includes(id)}
                    onClick={() => onChange({ ...filters, transit: toggle(filters.transit, id) })}
                  >
                    {scope.transitLabels[id] ?? id}
                  </ObChip>
                ))}
              </div>
            </Section>
          )}

          {scope.canNarrowBrokerFee && (
            <Section title="Broker fee">
              <ObChip
                size="small"
                selected={filters.noFeeOnly}
                onClick={() => onChange({ ...filters, noFeeOnly: !filters.noFeeOnly })}
              >
                No-fee listings only
              </ObChip>
            </Section>
          )}
        </div>

        <div className="flex items-center gap-3 border-t border-black/[0.08] bg-white p-6">
          <OriginButton
            type="button"
            variant="tertiary"
            size="medium"
            className="shrink-0"
            onClick={onReset}
            disabled={count === 0}
          >
            <X className="mr-1.5 h-4 w-4" aria-hidden />
            Reset
          </OriginButton>
          <OriginButton
            type="button"
            variant="main"
            size="medium"
            className="min-w-0 flex-1"
            onClick={() => onOpenChange(false)}
          >
            Show {resultCount} match{resultCount === 1 ? "" : "es"}
          </OriginButton>
        </div>
      </SheetContent>
    </Sheet>
  );
}
