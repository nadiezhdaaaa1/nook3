// Public route: logs referral link opens and returns a server-derived ip_hash
// so the client can persist it as part of the referral attribution (used by
// signup as raw_user_meta_data.referral_ip_hash → enforces per-IP cap in DB).
//
// CRITICAL: handler returns no PII. Only event ack + opaque ip_hash.

import { createFileRoute } from "@tanstack/react-router";
import { createHash } from "crypto";
import { z } from "zod";

const bodySchema = z.object({
  code: z.string().trim().toUpperCase().regex(/^RB[A-Z0-9]{6}$/),
});

export const Route = createFileRoute("/api/public/r/track")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let parsed;
        try {
          const body = await request.json();
          parsed = bodySchema.safeParse(body);
        } catch {
          return new Response(JSON.stringify({ ok: false }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }
        if (!parsed.success) {
          return new Response(JSON.stringify({ ok: false }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }
        const code = parsed.data.code;

        const userAgent = (request.headers.get("user-agent") ?? "").slice(0, 500);
        const ipRaw =
          request.headers.get("cf-connecting-ip") ??
          request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
          request.headers.get("x-real-ip") ??
          "";
        const ipHash = ipRaw
          ? createHash("sha256").update(ipRaw).digest("hex").slice(0, 32)
          : null;

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        // Resolve referrer id (best-effort; do NOT reveal whether the code is valid in the response)
        const { data: referrer } = await supabaseAdmin
          .from("profiles")
          .select("id")
          .eq("referral_code", code)
          .maybeSingle();

        // Best-effort insert; ignore errors
        await supabaseAdmin.from("referral_events").insert({
          event_type: "link_opened",
          code,
          referrer_user_id: referrer?.id ?? null,
          ip_hash: ipHash,
          user_agent: userAgent || null,
          metadata: {},
        });

        return new Response(
          JSON.stringify({ ok: true, ipHash }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      },
    },
  },
});
