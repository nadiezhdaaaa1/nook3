/**
 * Derived "archived" state for saved listings.
 *
 * A saved listing is never deleted. When the underlying listing is no longer
 * active in the catalog, or when the snapshot itself is older than 90 days, we
 * mark it archived at read time — no schema flag, no pruning.
 */

export const ARCHIVE_AFTER_DAYS = 90;

const DAY_MS = 86_400_000;

function olderThanArchiveWindow(iso: string | null | undefined, now: number): boolean {
  if (!iso) return false;
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return false;
  return now - t > ARCHIVE_AFTER_DAYS * DAY_MS;
}

export type ArchiveInput = {
  /** When the source first listed the apartment (snapshot field). */
  listedAt?: string | null;
  /** When the saved row itself was created — fallback age signal. */
  savedAt?: string | null;
  /** Source URL used to look the listing up in the live catalog. */
  sourceUrl?: string | null;
  /**
   * Set of source URLs still `active` in the catalog. `undefined` while the
   * lookup hasn't resolved yet — then only the age rule applies.
   */
  activeUrls?: Set<string>;
};

/** True when a saved listing should be shown as archived. */
export function isListingArchived(
  { listedAt, savedAt, sourceUrl, activeUrls }: ArchiveInput,
  now: number = Date.now(),
): boolean {
  // 1. Live catalog says it is no longer active (only trusted once resolved).
  if (activeUrls && sourceUrl && !activeUrls.has(sourceUrl)) return true;

  // 2. Age rule — works for snapshots with no live listing to check against.
  if (olderThanArchiveWindow(listedAt, now)) return true;
  if (!listedAt && olderThanArchiveWindow(savedAt, now)) return true;

  return false;
}

export const ARCHIVED_BADGE_LABEL = "Archived · No longer listed";
