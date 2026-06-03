import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const TOPIC_ROUTING = {
  general: { to: "hello@thenook.rent", prefix: "Contact" },
  support: { to: "support@thenook.rent", prefix: "Support" },
  press: { to: "hello@thenook.rent", prefix: "Press" },
  partnership: { to: "partners@thenook.rent", prefix: "Partnership" },
  investor: { to: "hello@thenook.rent", prefix: "Investor" },
  legal: { to: "legal@thenook.rent", prefix: "Legal" },
  other: { to: "hello@thenook.rent", prefix: "Contact" },
} as const;

const TopicEnum = z.enum([
  "general",
  "support",
  "press",
  "partnership",
  "investor",
  "legal",
  "other",
]);

const ContactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().toLowerCase().email().max(255),
  topic: TopicEnum,
  message: z.string().trim().min(10).max(5000),
  // Honeypot — must be empty. Bots auto-fill all visible fields.
  website: z.string().max(0).optional().default(""),
  // Time-to-fill check — set client-side as ms between mount and submit.
  timeToFillMs: z.number().int().nonnegative().optional(),
});

function jsonResponse(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export const Route = createFileRoute("/api/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let payload: unknown;
        try {
          payload = await request.json();
        } catch {
          return jsonResponse(400, { error: "Invalid JSON body" });
        }

        const parsed = ContactSchema.safeParse(payload);
        if (!parsed.success) {
          return jsonResponse(400, {
            error: "Validation failed",
            fields: parsed.error.flatten().fieldErrors,
          });
        }

        const data = parsed.data;

        // Honeypot: silently accept then drop. Bots get "success", don't retry.
        if (data.website && data.website.length > 0) {
          return jsonResponse(200, { success: true });
        }

        // Time-to-fill: forms submitted in <3s are almost always bots.
        if (typeof data.timeToFillMs === "number" && data.timeToFillMs < 3000) {
          return jsonResponse(200, { success: true });
        }

        const routing = TOPIC_ROUTING[data.topic];
        const userAgent = request.headers.get("user-agent") ?? null;
        const ipAddress =
          request.headers.get("cf-connecting-ip") ??
          request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
          null;

        // Persist for audit trail. Reads are blocked at the grant layer —
        // only service_role (this route) can write/read.
        const { error: insertError } = await supabaseAdmin
          .from("contact_submissions")
          .insert({
            name: data.name,
            email: data.email,
            topic: data.topic,
            message: data.message,
            routed_to: routing.to,
            user_agent: userAgent,
            ip_address: ipAddress,
            time_to_fill_ms: data.timeToFillMs ?? null,
            email_sent: false,
          } as never);

        if (insertError) {
          console.error("[contact] insert failed", insertError);
          return jsonResponse(500, {
            error:
              "Couldn't save your message. Try again, or email us at hello@thenook.rent.",
          });
        }

        // NOTE: Email delivery is wired in once a sender domain is configured
        // for the project. Submissions are still captured to `contact_submissions`
        // and visible to the team. The reply-by-email flow turns on automatically
        // when the email infrastructure is enabled.

        return jsonResponse(200, {
          success: true,
          routed_to: routing.to,
          subject_prefix: routing.prefix,
        });
      },
    },
  },
});
