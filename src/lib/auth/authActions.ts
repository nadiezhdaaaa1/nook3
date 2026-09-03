/**
 * Shared auth actions used by BOTH the /signup page and the registration
 * modal. There is exactly one implementation of "create an account", "sign in"
 * and "start Google OAuth" in the app — the modal must never drift from the
 * page.
 */
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { emailSchema, passwordSchema } from "@/lib/validation/schemas";
import { buildConsents, persistConsentsForCurrentUser, stashPendingConsents } from "@/lib/consents";
import { getReferralAttribution, getReferralIpHash } from "@/lib/referral/attribution";

export interface CredentialErrors {
  email?: string;
  password?: string;
}

export function validateCredentials(
  email: string,
  password: string,
): { errors: CredentialErrors; email?: string; password?: string } {
  const emailRes = emailSchema.safeParse(email);
  const pwRes = passwordSchema.safeParse(password);
  const errors: CredentialErrors = {};
  if (!emailRes.success) errors.email = emailRes.error.issues[0]?.message;
  if (!pwRes.success) errors.password = pwRes.error.issues[0]?.message;
  return {
    errors,
    email: emailRes.success ? emailRes.data : undefined,
    password: pwRes.success ? pwRes.data : undefined,
  };
}

export type SignUpOutcome =
  | { kind: "session" }
  | { kind: "confirmation-sent" }
  | { kind: "error"; message: string };

/**
 * Email + password sign-up. With email confirmation on, `signUp` returns no
 * session: the caller must show a "check your email" state, and the consents
 * are stashed until the confirmed session appears.
 */
export async function signUpWithEmailPassword(opts: {
  email: string;
  password: string;
  marketing: boolean;
  source: string;
  emailRedirectTo?: string;
}): Promise<SignUpOutcome> {
  const referralCode = getReferralAttribution();
  const ipHash = getReferralIpHash();
  const metadata = referralCode
    ? { referral_code: referralCode, ...(ipHash ? { referral_ip_hash: ipHash } : {}) }
    : undefined;

  const { data, error } = await supabase.auth.signUp({
    email: opts.email,
    password: opts.password,
    options: {
      emailRedirectTo: opts.emailRedirectTo ?? `${window.location.origin}/home`,
      data: metadata,
    },
  });
  if (error) return { kind: "error", message: error.message };

  const consents = buildConsents({ marketing: opts.marketing, source: opts.source });
  if (data.session) {
    await persistConsentsForCurrentUser(consents);
    return { kind: "session" };
  }
  stashPendingConsents(consents);
  return { kind: "confirmation-sent" };
}

export async function signInWithEmailPassword(
  email: string,
  password: string,
): Promise<{ error?: string }> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return error ? { error: error.message } : {};
}

export async function sendPasswordResetEmail(email: string): Promise<{ error?: string }> {
  const parsed = emailSchema.safeParse(email);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Enter a valid email address." };
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  return error ? { error: error.message } : {};
}

/** Sets the password on the already-signed-in (locked email) account. */
export async function setPasswordForCurrentUser(
  password: string,
  opts: { marketing: boolean; source: string },
): Promise<{ error?: string }> {
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.message };
  await persistConsentsForCurrentUser(
    buildConsents({ marketing: opts.marketing, source: opts.source }),
  );
  return {};
}

export type GoogleOutcome =
  | { kind: "redirected" }
  | { kind: "session" }
  | { kind: "error"; message: string };

/**
 * Google OAuth. `postAuthPath` is where /auth/callback must land after the
 * full-page redirect variant — it is the only way a modal-started flow can
 * resume, since the modal itself is gone by then.
 */
export async function startGoogleOAuth(opts: {
  marketing: boolean;
  source: string;
  postAuthPath: string;
  expectedEmail?: string | null;
}): Promise<GoogleOutcome> {
  stashPendingConsents(buildConsents({ marketing: opts.marketing, source: opts.source }));
  try {
    sessionStorage.setItem("nook:postAuthPath", opts.postAuthPath);
    if (opts.expectedEmail) sessionStorage.setItem("nook:expectedEmail", opts.expectedEmail);
    else sessionStorage.removeItem("nook:expectedEmail");
  } catch {
    /* ignore */
  }

  const res = await lovable.auth.signInWithOAuth("google", {
    redirect_uri: window.location.origin + "/auth/callback",
    ...(opts.expectedEmail
      ? { extraParams: { login_hint: opts.expectedEmail, prompt: "select_account" } }
      : {}),
  });
  if (res?.error) return { kind: "error", message: res.error.message };
  if (res?.redirected) return { kind: "redirected" };
  return { kind: "session" };
}

export { getReferralAttribution };
