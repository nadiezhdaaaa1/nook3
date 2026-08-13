/**
 * A `requireSupabaseAuth` server fn rejects with
 * "Unauthorized: No authorization header provided" (or an invalid-token
 * variant) whenever it is reached without a live session. That happens in
 * normal use — a query refetching in the instant after sign-out, or a token
 * that expired while the tab sat idle — so it must degrade to "signed out",
 * never bubble up as an unhandled error that blanks the screen.
 */
export function isUnauthorizedError(error: unknown): boolean {
  const msg =
    error instanceof Error ? error.message : typeof error === "string" ? error : "";
  return /unauthorized|jwt|invalid token|401/i.test(msg);
}
