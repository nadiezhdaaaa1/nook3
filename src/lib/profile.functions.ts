import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { GRACE_DAYS, defaultPeriodEnd } from "@/lib/profile.helpers";

export function dbRowToUser(row: any) {
  return {
    id: row.id as string,
    email: row.email ?? "",
    emailVerified: !!row.email_verified,
    phone: row.phone ?? "",
    phoneVerified: !!row.phone_verified,
    timezone: row.timezone ?? "America/New_York",
    plan: row.plan ?? "intro",
    billingCycle: row.billing_cycle ?? "monthly",
    trialActive: !!row.trial_active,
    trialStartedAt: row.trial_started_at ?? undefined,
    trialEndsAt: row.trial_ends_at ?? undefined,
    moveOut: row.move_out ?? undefined,
    referralCode: row.referral_code ?? "",
    isAffiliate: !!row.is_affiliate,
    completedAt: row.completed_at ?? null,
    hasPassword: !!row.has_password,
    deletionRequestedAt: row.deletion_requested_at ?? null,
    deletionScheduledAt: row.deletion_scheduled_at ?? null,
    deletionCancelSubscription: row.deletion_cancel_subscription ?? null,
    subscriptionCanceledAt: row.subscription_canceled_at ?? null,
    subscriptionPeriodEnd: row.subscription_period_end ?? null,
    subscriptionStatus: (row.subscription_status ?? "none") as
      | "none"
      | "trialing"
      | "active"
      | "past_due"
      | "canceled",
    pastDueSince: row.past_due_since ?? null,
    updatedAt: row.updated_at ?? undefined,
  };
}

/* -------------------------------------------------------------------------
   Access state — the single computation point for routing decisions.

   Three flags, all server-derived:
     credentials  — the account can sign in on its own: a password identity
                    OR a linked social identity. Never inferred from the
                    self-writable `has_password` column, and never assumes an
                    authenticated user has a password identity (a Stripe-first
                    signup arrives with neither password nor Google).
     subscription — `subscription_status`, with `past_due` expiring to
                    `canceled` server-side after 7 days (self-healing).
     onboarded    — `completed_at is not null`. Set once, never unset.
   ------------------------------------------------------------------------- */

export const PAST_DUE_GRACE_DAYS = 7;

export type SubscriptionStatus =
  | "none"
  | "trialing"
  | "active"
  | "past_due"
  | "canceled";

export interface AccessState {
  credentials: boolean;
  status: SubscriptionStatus;
  accessAllowed: boolean;
  onboarded: boolean;
  plan: "intro" | "pro";
  billingCycle: "monthly" | "annual";
  hasEverSubscribed: boolean;
  pastDueSince: string | null;
}


export const getAccessState = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AccessState> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    let { data: row } = await context.supabase
      .from("profiles")
      .select("plan, subscription_status, past_due_since, completed_at")
      .eq("id", context.userId)
      .maybeSingle();

    let status = ((row as any)?.subscription_status ?? "none") as SubscriptionStatus;
    const pastDueSince = (row as any)?.past_due_since as string | null | undefined;

    // Self-heal an expired past_due window. Computed server-side so a client
    // clock can never extend the grace period.
    if (status === "past_due") {
      const started = pastDueSince ? new Date(pastDueSince).getTime() : 0;
      const expired =
        !pastDueSince ||
        Date.now() - started > PAST_DUE_GRACE_DAYS * 24 * 60 * 60 * 1000;
      if (expired) {
        const { data: healed } = await supabaseAdmin.rpc("admin_expire_past_due", {
          _user_id: context.userId,
        } as never);
        const updated = Array.isArray(healed) ? healed[0] : healed;
        if (updated) {
          row = updated as never;
          status = ((updated as any).subscription_status ?? "canceled") as SubscriptionStatus;
        } else {
          status = "canceled";
        }
      }
    }

    // Credentials: read identities from Auth, not from the profile.
    let credentials = false;
    const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(context.userId);
    const identities = authUser?.user?.identities ?? [];
    credentials = identities.some((i) => i.provider !== "anonymous");

    return {
      credentials,
      status,
      accessAllowed: status === "active" || status === "trialing" || status === "past_due",
      onboarded: !!(row as any)?.completed_at,
      plan: (((row as any)?.plan ?? "intro") as "intro" | "pro"),
    };
  });

export const getProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("profiles")
      .select("*")
      .eq("id", context.userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (data) return dbRowToUser(data);

    // Self-heal: the account exists in auth but has no profile row yet
    // (e.g. the trigger didn't run, or the row was removed). Create it so the
    // app always has a durable place to persist profile state.
    const email = (context.claims as any)?.email ?? "";
    const { data: created, error: insertError } = await context.supabase
      .from("profiles")
      .insert({ id: context.userId, email } as never)
      .select("*")
      .single();
    if (insertError) {
      // A concurrent request may have created it — re-read once.
      const { data: reread } = await context.supabase
        .from("profiles")
        .select("*")
        .eq("id", context.userId)
        .maybeSingle();
      if (reread) return dbRowToUser(reread);
      throw new Error(insertError.message);
    }
    return dbRowToUser(created);
  });

// SECURITY: billing fields (plan, billing_cycle, trial_active, trial_started_at,
// trial_ends_at) MUST NOT be writable via this endpoint. Subscription state can
// only be changed by a privileged server path gated behind a verified payment
// webhook (e.g. Stripe). Allowing them here would let any authenticated user
// self-upgrade to a paid plan for free.
const profilePatchSchema = z.object({
  phone: z.string().trim().max(40).optional(),
  timezone: z.string().max(60).optional(),
  completedAt: z.string().nullable().optional(),
  hasPassword: z.boolean().optional(),

  moveOut: z
    .object({
      date: z.string(),
      name: z.string().min(1).max(120),
      address: z.string().min(1).max(240),
      unit: z.string().max(40),
      beds: z.number().int().min(0).max(20),
      baths: z.number().min(0).max(20),
      roommates: z.number().int().min(0).max(20),
      landlord: z
        .object({ name: z.string().max(120), contact: z.string().max(160) })
        .optional(),
      allowContact: z.boolean(),
    })
    .nullable()
    .optional(),
});

export const updateProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => profilePatchSchema.parse(input))
  .handler(async ({ data, context }) => {
    const patch: Record<string, unknown> = {};
    if (data.phone !== undefined) patch.phone = data.phone;
    if (data.timezone !== undefined) patch.timezone = data.timezone;
    if (data.completedAt !== undefined) patch.completed_at = data.completedAt;
    if (data.hasPassword !== undefined) patch.has_password = data.hasPassword;
    if (data.moveOut !== undefined) patch.move_out = data.moveOut;

    // Upsert so the write still lands when the profile row is missing.
    const { data: updated, error } = await context.supabase
      .from("profiles")
      .upsert({ id: context.userId, ...patch } as never, { onConflict: "id" })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return dbRowToUser(updated);
  });

/* -------------------------------------------------------------------------
   Account deletion — scheduled with a 30-day grace period.
   Nothing is deleted while `deletion_scheduled_at` is in the future; the row
   only carries the schedule so every screen can surface it and offer a
   one-click reversal.
   ------------------------------------------------------------------------- */

export const scheduleAccountDeletion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        reason: z.string().max(120).optional(),
        feedback: z.string().max(1000).optional(),
        cancelSubscription: z.boolean().optional(),
      })
      .parse(input ?? {}),
  )
  .handler(async ({ data, context }) => {
    const now = new Date();
    const scheduled = new Date(now.getTime() + GRACE_DAYS * 24 * 60 * 60 * 1000);

    // Read current billing state so the cancellation only applies to a paid
    // plan and an existing period end is preserved.
    const { data: current } = await context.supabase
      .from("profiles")
      .select("plan, subscription_canceled_at, subscription_period_end")
      .eq("id", context.userId)
      .maybeSingle();

    const cancelNow =
      data.cancelSubscription === true && (current as any)?.plan && (current as any).plan !== "intro";

    const patch: Record<string, unknown> = {
      deletion_requested_at: now.toISOString(),
      deletion_scheduled_at: scheduled.toISOString(),
      deletion_reason: data.reason ?? null,
      deletion_feedback: data.feedback ?? null,
      deletion_cancel_subscription: data.cancelSubscription ?? null,
    };

    if (cancelNow) {
      patch.subscription_canceled_at =
        (current as any)?.subscription_canceled_at ?? now.toISOString();
      patch.subscription_period_end =
        (current as any)?.subscription_period_end ?? defaultPeriodEnd(now).toISOString();
    }

    const { data: updated, error } = await context.supabase
      .from("profiles")
      .update(patch as never)
      .eq("id", context.userId)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return dbRowToUser(updated);
  });

/**
 * Turn auto-renewal off (or back on) for the current user. Access continues
 * until `subscription_period_end`.
 */
export const setSubscriptionCanceled = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ canceled: z.boolean() }).parse(input ?? {}))
  .handler(async ({ data, context }) => {
    const now = new Date();
    const { data: current } = await context.supabase
      .from("profiles")
      .select("subscription_canceled_at, subscription_period_end")
      .eq("id", context.userId)
      .maybeSingle();

    const patch = data.canceled
      ? {
          subscription_canceled_at:
            (current as any)?.subscription_canceled_at ?? now.toISOString(),
          subscription_period_end:
            (current as any)?.subscription_period_end ?? defaultPeriodEnd(now).toISOString(),
        }
      : { subscription_canceled_at: null };

    const { data: updated, error } = await context.supabase
      .from("profiles")
      .update(patch as never)
      .eq("id", context.userId)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return dbRowToUser(updated);
  });

export const cancelAccountDeletion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: updated, error } = await context.supabase
      .from("profiles")
      .update({
        deletion_requested_at: null,
        deletion_scheduled_at: null,
        deletion_reason: null,
        deletion_feedback: null,
        deletion_cancel_subscription: null,
      } as never)
      .eq("id", context.userId)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return dbRowToUser(updated);
  });
