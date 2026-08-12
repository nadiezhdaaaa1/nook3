/** Grace period (days) before a scheduled account deletion becomes permanent. */
export const GRACE_DAYS = 30;

/** Fallback subscription period end while real billing dates aren't wired up yet. */
export function defaultPeriodEnd(from: Date) {
  return new Date(from.getTime() + 18 * 24 * 60 * 60 * 1000);
}
