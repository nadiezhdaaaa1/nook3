import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { dbRowToUser } from "@/lib/profile.functions";

// MOCK BILLING — no real payment verification.
// In production this MUST be gated behind a verified payment webhook
// (Stripe/Paddle). Per project security memory, only supabaseAdmin can
// write billing/plan fields on `profiles`, and the DB guard trigger only
// allows it through the service-role-only admin_set_plan() function.
const updatePlanSchema = z.object({
  plan: z.enum(["intro", "pro"]),
  billingCycle: z.enum(["monthly", "annual"]).optional(),
});

export const updatePlan = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => updatePlanSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import(
      "@/integrations/supabase/client.server"
    );

    const { data: rows, error } = await supabaseAdmin.rpc("admin_set_plan", {
      _user_id: context.userId,
      _plan: data.plan,
      _billing_cycle: data.billingCycle ?? null,
    } as never);
    if (error) throw new Error(error.message);
    const updated = Array.isArray(rows) ? rows[0] : rows;
    if (!updated) throw new Error("Profile not found");
    return dbRowToUser(updated);
  });
