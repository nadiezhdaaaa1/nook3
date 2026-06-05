import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type ReferralLookup = {
  valid: boolean;
  expired: boolean;
  referrerName: string | null;
};

const inputSchema = z.object({
  code: z.string().min(8).max(8).regex(/^RB[A-Z0-9]{6}$/),
});

// Public lookup — called from the public /r/:code loader.
// Returns minimal info so we never leak emails or PII.
export const lookupReferral = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => {
    const parsed = inputSchema.safeParse(data);
    if (!parsed.success) return { code: "" };
    return parsed.data;
  })
  .handler(async ({ data }): Promise<ReferralLookup> => {
    if (!data.code) return { valid: false, expired: false, referrerName: null };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: profile, error } = await supabaseAdmin
      .from("profiles")
      .select("id, email, created_at")
      .eq("referral_code", data.code)
      .maybeSingle();

    if (error || !profile) {
      return { valid: false, expired: false, referrerName: null };
    }

    // Derive a friendly first-name from the local-part of the email.
    // Strip digits and split on common separators; never return the full address.
    const local = String(profile.email ?? "").split("@")[0] ?? "";
    const cleaned = local.replace(/[._\-+0-9]+/g, " ").trim().split(/\s+/)[0] ?? "";
    const referrerName = cleaned
      ? cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase()
      : null;

    return { valid: true, expired: false, referrerName };
  });
