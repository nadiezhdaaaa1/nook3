/**
 * Skeleton placeholder shown while preferences DB sync hydrates.
 */
export function HydrationSkeleton() {
  return (
    <div className="animate-pulse space-y-4" aria-hidden="true">
      <div className="h-10 w-1/3 rounded-md bg-charcoal-950/8" />
      <div className="h-24 rounded-card bg-charcoal-950/6" />
      <div className="h-24 rounded-card bg-charcoal-950/6" />
      <div className="h-24 rounded-card bg-charcoal-950/6" />
    </div>
  );
}
