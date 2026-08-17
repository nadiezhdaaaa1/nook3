/**
 * Digest scheduling helpers for search cards.
 *
 * Prototype rules:
 * - Sends anchor at 8:00 AM in the USER'S timezone (browser), never the city's.
 * - Daily-ish frequencies -> the next 8:00 AM after now.
 * - Weekly -> 7 days after the last digest at 8:00 AM, or the next 8:00 AM if
 *   nothing has been sent yet.
 */

export const DIGEST_HOUR = 8;

export type DigestFrequency = "minimal" | "balanced" | "maximum" | "weekly";

/** The user's timezone as reported by the browser (with a safe SSR fallback). */
export function userTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "America/New_York";
  } catch {
    return "America/New_York";
  }
}

/** Short timezone abbreviation for the user's zone, e.g. "EDT". */
export function userTimeZoneAbbr(at: Date = new Date(), timeZone = userTimeZone()): string {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      timeZoneName: "short",
ようない: undefined as never,
    } as Intl.DateTimeFormatOptions).formatToParts(at);
    return parts.find((p) => p.type === "timeZoneName")?.value ?? "";
  } catch {
    return "";
  }
}

/** Wall-clock fields of `date` rendered in `timeZone`. */
function zonedParts(date: Date, timeZone: string) {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const out: Record<string, number> = {};
  for (const p of fmt.formatToParts(date)) {
    if (p.type !== "literal") out[p.type] = Number(p.value);
  }
  return {
    year: out.year,
    month: out.month,
    day: out.day,
    hour: out.hour === 24 ? 0 : out.hour,
    minute: out.minute,
  };
}

/** UTC instant for a given wall-clock time in `timeZone`. */
function zonedTimeToUtc(
  y: number,
  m: number,
  d: number,
  hour: number,
  timeZone: string,
): Date {
  // Start from the naive UTC guess, then correct by the zone offset twice
  // (handles DST boundaries).
  let ts = Date.UTC(y, m - 1, d, hour, 0, 0);
  for (let i = 0; i < 2; i++) {
    const p = zonedParts(new Date(ts), timeZone);
    const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, 0);
    const diff = asUtc - Date.UTC(y, m - 1, d, hour, 0, 0);
    ts -= diff;
  }
  return new Date(ts);
}

/** The next 8:00 AM (user timezone) strictly after `from`. */
export function nextAnchor(from: Date, timeZone = userTimeZone()): Date {
  const p = zonedParts(from, timeZone);
  let candidate = zonedTimeToUtc(p.year, p.month, p.day, DIGEST_HOUR, timeZone);
  if (candidate.getTime() <= from.getTime()) {
    const nextDay = new Date(candidate.getTime() + 36 * 3600 * 1000);
    const q = zonedParts(nextDay, timeZone);
    candidate = zonedTimeToUtc(q.year, q.month, q.day, DIGEST_HOUR, timeZone);
  }
  return candidate;
}

/**
 * Next scheduled send for a search, or null when alerts are off.
 */
export function nextDigestAt(opts: {
  alertsEnabled: boolean;
  frequency: DigestFrequency;
  lastDigestAt?: string | null;
  now?: Date;
  timeZone?: string;
}): Date | null {
  const { alertsEnabled, frequency } = opts;
  if (!alertsEnabled) return null;
  const now = opts.now ?? new Date();
  const tz = opts.timeZone ?? userTimeZone();

  if (frequency === "weekly" && opts.lastDigestAt) {
    const last = new Date(opts.lastDigestAt);
    const target = new Date(last.getTime() + 7 * 24 * 3600 * 1000);
    const p = zonedParts(target, tz);
    const at = zonedTimeToUtc(p.year, p.month, p.day, DIGEST_HOUR, tz);
    return at.getTime() > now.getTime() ? at : nextAnchor(now, tz);
  }
  return nextAnchor(now, tz);
}

/** "Aug 18 at 8:00 AM (EDT)" in the user's timezone. */
export function formatDigestDateTime(date: Date, timeZone = userTimeZone()): string {
  const day = new Intl.DateTimeFormat("en-US", {
    timeZone,
    month: "short",
    day: "numeric",
  }).format(date);
  const time = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
  const abbr = userTimeZoneAbbr(date, timeZone);
  return abbr ? `${day} at ${time} (${abbr})` : `${day} at ${time}`;
}

/** "Aug 17" in the user's timezone. */
export function formatDigestDate(date: Date, timeZone = userTimeZone()): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    month: "short",
    day: "numeric",
  }).format(date);
}

/** Lines to render on a search card. */
export function digestLines(opts: {
  alertsEnabled: boolean;
  frequency: DigestFrequency;
  lastDigestAt?: string | null;
  lastDigestCount?: number | null;
  now?: Date;
  timeZone?: string;
}): { next: string | null; last: string | null; first: string | null } {
  const tz = opts.timeZone ?? userTimeZone();
  const hasSent = Boolean(opts.lastDigestAt);

  if (!hasSent) {
    return {
      next: null,
      last: null,
      first: opts.alertsEnabled ? "First digest within 24 hours" : null,
    };
  }

  const last = new Date(opts.lastDigestAt as string);
  const count = opts.lastDigestCount ?? 0;
  const lastLine = `Sent ${formatDigestDate(last, tz)} · ${count} place${count === 1 ? "" : "s"}`;
  const next = nextDigestAt({ ...opts, timeZone: tz });
  return {
    next: next ? `Next digest: ${formatDigestDateTime(next, tz)}` : null,
    last: lastLine,
    first: null,
  };
}
