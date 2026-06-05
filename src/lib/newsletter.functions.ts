import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";

const inputSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  source: z.string().trim().max(120).optional(),
});

export const subscribeNewsletter = createServerFn({ method: "POST" })
  .inputValidator((raw: unknown) => inputSchema.parse(raw))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { createHash } = await import("crypto");

    const userAgent = (getRequestHeader("user-agent") ?? "").slice(0, 500);
    const ipRaw =
      getRequestHeader("cf-connecting-ip") ??
      getRequestHeader("x-forwarded-for")?.split(",")[0]?.trim() ??
      getRequestHeader("x-real-ip") ??
      "";
    const ipHash = ipRaw
      ? createHash("sha256").update(ipRaw).digest("hex").slice(0, 32)
      : null;

    const emailNormalized = data.email;

    // Check existing
    const { data: existing } = await supabaseAdmin
      .from("newsletter_subscribers")
      .select("id, status")
      .eq("email_normalized", emailNormalized)
      .maybeSingle();

    if (existing) {
      if (existing.status === "unsubscribed") {
        await supabaseAdmin
          .from("newsletter_subscribers")
          .update({
            status: "pending",
            unsubscribed_at: null,
            source: data.source ?? null,
            user_agent: userAgent || null,
            ip_hash: ipHash,
          })
          .eq("id", existing.id);
      }
      // Idempotent success either way (avoid email enumeration)
      return { ok: true as const };
    }

    const { error } = await supabaseAdmin.from("newsletter_subscribers").insert({
      email: data.email,
      email_normalized: emailNormalized,
      source: data.source ?? null,
      status: "pending",
      user_agent: userAgent || null,
      ip_hash: ipHash,
    });

    if (error) {
      // Unique race → treat as success (idempotent)
      if (error.code === "23505") return { ok: true as const };
      throw new Error("Subscribe failed");
    }

    return { ok: true as const };
  });
