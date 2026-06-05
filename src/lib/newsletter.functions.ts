import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";

const inputSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  source: z.string().trim().max(120).optional(),
  // Honeypot — must be empty for humans.
  website: z.string().max(0).optional().or(z.literal("")),
});

type SubscribeResult =
  | { ok: true; state: "new" | "already_subscribed" | "reactivated" }
  | { ok: false; error: "invalid" | "throttled" | "rejected" };

const MAX_PER_IP_PER_WINDOW = 3;
const WINDOW_MINUTES = 10;

export const subscribeNewsletter = createServerFn({ method: "POST" })
  .inputValidator((raw: unknown) => {
    const parsed = inputSchema.safeParse(raw);
    if (!parsed.success) {
      // Throw typed error the handler can map. Validator failure surfaces as
      // a generic error on client; we return a structured shape from handler
      // instead — so coerce invalid emails to a sentinel.
      return { __invalid: true as const };
    }
    return parsed.data;
  })
  .handler(async ({ data }): Promise<SubscribeResult> => {
    if ("__invalid" in data) return { ok: false, error: "invalid" };

    // Honeypot filled → silently reject (look like success to bot).
    if (data.website && data.website.length > 0) {
      return { ok: true, state: "new" };
    }

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

    // Ad-hoc rate limit (per IP, sliding window).
    // NOTE: project has no standard rate-limit primitive; this is a pragmatic
    // DB-backed throttle. Cheap because ip_hash is indexed via created_at scan
    // bounded by window.
    if (ipHash) {
      const windowStart = new Date(Date.now() - WINDOW_MINUTES * 60_000).toISOString();
      const { count } = await supabaseAdmin
        .from("newsletter_subscribers")
        .select("id", { count: "exact", head: true })
        .eq("ip_hash", ipHash)
        .gte("created_at", windowStart);
      if ((count ?? 0) >= MAX_PER_IP_PER_WINDOW) {
        return { ok: false, error: "throttled" };
      }
    }

    const emailNormalized = data.email;

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
        return { ok: true, state: "reactivated" };
      }
      return { ok: true, state: "already_subscribed" };
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
      if (error.code === "23505") return { ok: true, state: "already_subscribed" };
      return { ok: false, error: "rejected" };
    }

    return { ok: true, state: "new" };
  });
