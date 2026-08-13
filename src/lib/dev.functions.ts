import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { dbRowToUser } from "@/lib/profile.functions";

/**
 * DEV-ONLY account state writer.
 *
 * `plan`, `billing_cycle`, `subscription_status`, `past_due_since`,
 * `has_ever_subscribed` and `dev_no_credentials` are protected by the
 * `prevent_billing_field_self_update` trigger, so they can only be written by
 * the service role through a SECURITY DEFINER routine — here
 * `dev_set_account_state()`.
 *
 * This endpoint must never be reachable in production: it would let any
 * authenticated user grant themselves a paid plan. The guard below refuses to
 * run outside development.
 */
const devStateSchema = z.object({
  plan: z.enum(["intro", "pro"]).optional(),
  billingCycle: z.enum(["monthly", "annual"]).optional(),
  status: z
    .enum(["none", "trialing", "active", "past_due", "canceled"])
    .optional(),
  /** Days ago that `past_due` started. 0 = today, 7 = grace period expired. */
  pastDueDayOffset: z.number().int().min(0).max(7).optional(),
  clearPastDue: z.boolean().optional(),
  onboarded: z.boolean().optional(),
  hasEverSubscribed: z.boolean().optional(),
  /** Simulates an account with no password and no linked social identity. */
  noCredentials: z.boolean().optional(),
});

export type DevAccountStateInput = z.infer<typeof devStateSchema>;

function assertNotProduction() {
  const env = process.env["NODE_ENV"] ?? "development";
  if (env === "production") {
    throw new Error("devSetAccountState is disabled in production builds");
  }
}

export const devSetAccountState = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => devStateSchema.parse(input ?? {}))
  .handler(async ({ data, context }) => {
    assertNotProduction();

    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );

    const pastDueSince =
      data.pastDueDayOffset === undefined
        ? null
        : new Date(
            Date.now() - data.pastDueDayOffset * 24 * 60 * 60 * 1000,
          ).toISOString();

    const { data: rows, error } = await supabaseAdmin.rpc(
      "dev_set_account_state",
      {
        _user_id: context.userId,
        _plan: data.plan ?? null,
        _billing_cycle: data.billingCycle ?? null,
        _status: data.status ?? null,
        _past_due_since: pastDueSince,
        _clear_past_due: data.clearPastDue ?? false,
        _onboarded: data.onboarded ?? null,
        _has_ever_subscribed: data.hasEverSubscribed ?? null,
        _no_credentials: data.noCredentials ?? null,
      } as never,
    );
    if (error) throw new Error(error.message);
    const updated = Array.isArray(rows) ? rows[0] : rows;
    if (!updated) throw new Error("Profile not found");
    return dbRowToUser(updated);
  });
