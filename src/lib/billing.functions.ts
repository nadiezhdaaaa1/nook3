import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { dbRowToUser } from "@/lib/profile.functions";

// MOCK BILLING — no real payment verification.
// In production this MUST be gated behind a verified payment webhook
// (Stripe/Paddle). Per project security memory, only supabaseAdmin can
// write billing/plan fields on `profiles`.
const updatePlanSchema = z.object({
  plan: z.enum(["free", "premium", "max"]),
  billingCycle: z.enum(["monthly", "annual"]).optional(),
});

export const updatePlan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => updatePlanSchema.parse(input))
  .handler(async ({ data, context }) => {
    const patch: Record<string, unknown> = { plan: data.plan };
    if (data.billingCycle) patch.billing_cycle = data.billingCycle;
    // Downgrading to free clears any trial state.
    if (data.plan === "free") {
      patch.trial_active = false;
      patch.trial_started_at = null;
      patch.trial_ends_at = null;
    }

    const { data: updated, error } = await supabaseAdmin
      .from("profiles")
      .update(patch as never)
      .eq("id", context.userId)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return dbRowToUser(updated);
  });
