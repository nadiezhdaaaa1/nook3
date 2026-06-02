import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export function dbRowToUser(row: any) {
  return {
    id: row.id as string,
    email: row.email ?? "",
    emailVerified: !!row.email_verified,
    phone: row.phone ?? "",
    phoneVerified: !!row.phone_verified,
    timezone: row.timezone ?? "America/New_York",
    plan: row.plan ?? "free",
    billingCycle: row.billing_cycle ?? "monthly",
    trialActive: !!row.trial_active,
    trialStartedAt: row.trial_started_at ?? undefined,
    trialEndsAt: row.trial_ends_at ?? undefined,
    moveOut: row.move_out ?? undefined,
    referralCode: row.referral_code ?? "",
    isAffiliate: !!row.is_affiliate,
    completedAt: row.completed_at ?? null,
  };
}

export const getProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("profiles")
      .select("*")
      .eq("id", context.userId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return null;
    return dbRowToUser(data);
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
    if (data.moveOut !== undefined) patch.move_out = data.moveOut;

    const { data: updated, error } = await context.supabase
      .from("profiles")
      .update(patch as never)
      .eq("id", context.userId)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return dbRowToUser(updated);
  });
