import { supabase } from "@/integrations/supabase/client";

export const TERMS_VERSION = "2026-06-02";
export const PRIVACY_VERSION = "2026-06-02";

export type SignupConsents = {
  terms_accepted: boolean;
  terms_version: string;
  privacy_version: string;
  marketing_opt_in: boolean;
  accepted_at: string;
  source: string;
};

const PENDING_KEY = "nook.pending_consents";

export function buildConsents(opts: {
  marketing: boolean;
  source?: string;
}): SignupConsents {
  return {
    terms_accepted: true,
    terms_version: TERMS_VERSION,
    privacy_version: PRIVACY_VERSION,
    marketing_opt_in: opts.marketing,
    accepted_at: new Date().toISOString(),
    source: opts.source ?? "signup",
  };
}

export function stashPendingConsents(c: SignupConsents) {
  try {
    localStorage.setItem(PENDING_KEY, JSON.stringify(c));
  } catch {}
}

export function readPendingConsents(): SignupConsents | null {
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    return raw ? (JSON.parse(raw) as SignupConsents) : null;
  } catch {
    return null;
  }
}

export function clearPendingConsents() {
  try {
    localStorage.removeItem(PENDING_KEY);
  } catch {}
}

export async function persistConsentsForCurrentUser(c: SignupConsents) {
  const { data } = await supabase.auth.getUser();
  if (!data.user) return false;
  const { error } = await supabase
    .from("profiles")
    .update({ consents: c as unknown as never })
    .eq("id", data.user.id);
  return !error;
}

/** Call on auth state change — applies stashed consents after email confirmation / OAuth return. */
export async function flushPendingConsents() {
  const pending = readPendingConsents();
  if (!pending) return;
  const ok = await persistConsentsForCurrentUser(pending);
  if (ok) clearPendingConsents();
}
