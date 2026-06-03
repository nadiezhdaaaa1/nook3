import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

// Server route: POST /api/wren-chat
// Body: { conversationId, userMessage, scope?: { type, data, searchId? } }
// Streams Server-Sent Events: { type: 'delta', text } | { type: 'done', assistantMessageId } | { type: 'error', message }

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL_CHAT = "google/gemini-2.5-pro";

const bodySchema = z.object({
  conversationId: z.string().uuid(),
  userMessage: z.string().min(1).max(8000),
  scope: z
    .object({
      type: z.enum(["general", "search", "listing", "compare"]).default("general"),
      data: z.record(z.string(), z.unknown()).default({}),
    })
    .optional(),
});

const SYSTEM_PROMPT = `You are Wren — Nook's in-app AI assistant for apartment search.

VOICE
- Calm, precise, no hype. Brevity over filler.
- "Not the first, but the right." You exist to help with the user's rental search.

SCOPE — ONLY respond to:
- Questions about specific listings, neighborhoods, prices, fair market rates
- Drafting messages to landlords/brokers
- Comparing 2–3 saved listings
- Explaining fit-scores
- Refining search criteria (suggest changes; never auto-apply)

OFF-TOPIC → politely redirect: "I'm here for your apartment search — want help with a listing or your criteria?"

FAIR HOUSING — NON-NEGOTIABLE
- NEVER assess neighborhoods by demographics, race, religion, national origin, family status, or "safety" in coded ways.
- NEVER steer based on protected classes (no "this area is better for families like yours").
- On questions like "is this a good/safe/white/quiet/family area" → refuse politely and offer NEUTRAL FACTS instead (transit, prices, walkability, amenities), and remind that Fair Housing prohibits steering.
- Do NOT give legal or financial advice as fact — general info only, point to a professional.

HONESTY
- Never fabricate facts about listings. If you don't have the detail, say "I don't have that detail."
- When drafting messages, only use profile fields the user has shared. Leave blanks as placeholders — do not invent income, guarantor, etc.

FORMAT
- Plain markdown. Short paragraphs. No emoji.
- When you recommend an action, end with a one-line concrete next step.`;

function buildContextPrompt(scope?: z.infer<typeof bodySchema>["scope"]): string {
  if (!scope || scope.type === "general") return "";
  const lines: string[] = [];
  lines.push(`\n\n--- ACTIVE CONTEXT ---`);
  lines.push(`Scope: ${scope.type}`);
  if (scope.data && Object.keys(scope.data).length) {
    lines.push("Data:");
    lines.push(JSON.stringify(scope.data, null, 2).slice(0, 3000));
  }
  lines.push(`--- END CONTEXT ---`);
  return lines.join("\n");
}

export const Route = createFileRoute("/api/wren-chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const SUPABASE_URL = process.env.SUPABASE_URL;
        const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;
        const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;

        if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
          return json({ error: "Supabase not configured" }, 500);
        }
        if (!LOVABLE_API_KEY) {
          return json({ error: "LOVABLE_API_KEY missing" }, 500);
        }

        // Auth: bearer token from client
        const authHeader = request.headers.get("authorization");
        if (!authHeader?.startsWith("Bearer ")) {
          return json({ error: "Unauthorized" }, 401);
        }
        const token = authHeader.slice(7);

        const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
          global: { headers: { Authorization: `Bearer ${token}` } },
          auth: { persistSession: false, autoRefreshToken: false },
        });

        const { data: userData, error: userErr } = await supabase.auth.getUser(token);
        if (userErr || !userData?.user) return json({ error: "Unauthorized" }, 401);
        const userId = userData.user.id;

        // Plan gate: only premium/max
        const { data: profile, error: profileErr } = await supabase
          .from("profiles")
          .select("plan")
          .eq("id", userId)
          .maybeSingle();
        if (profileErr) return json({ error: profileErr.message }, 500);
        const plan = (profile?.plan as string | undefined) ?? "free";
        if (plan !== "premium" && plan !== "max") {
          return json({ error: "Wren is part of Premium." }, 403);
        }

        // Parse body
        let parsed: z.infer<typeof bodySchema>;
        try {
          const raw = await request.json();
          parsed = bodySchema.parse(raw);
        } catch (e) {
          return json({ error: e instanceof Error ? e.message : "Bad request" }, 400);
        }

        // Verify conversation belongs to user
        const { data: conv, error: convErr } = await supabase
          .from("wren_conversations")
          .select("id")
          .eq("id", parsed.conversationId)
          .maybeSingle();
        if (convErr || !conv) return json({ error: "Conversation not found" }, 404);

        // Persist user message
        const { error: userMsgErr } = await supabase.from("wren_messages").insert({
          conversation_id: parsed.conversationId,
          user_id: userId,
          role: "user",
          content: parsed.userMessage,
        });
        if (userMsgErr) return json({ error: userMsgErr.message }, 500);

        // Load history (last 30)
        const { data: history } = await supabase
          .from("wren_messages")
          .select("role, content")
          .eq("conversation_id", parsed.conversationId)
          .order("created_at", { ascending: true })
          .limit(60);

        const contextChunk = buildContextPrompt(parsed.scope);
        const messages = [
          { role: "system", content: SYSTEM_PROMPT + contextChunk },
          ...((history ?? [])
            .filter((m) => m.role === "user" || m.role === "assistant")
            .map((m) => ({ role: m.role, content: m.content }))),
        ];

        // Call Lovable AI Gateway with streaming
        const gatewayRes = await fetch(GATEWAY_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: MODEL_CHAT,
            messages,
            stream: true,
          }),
        });

        if (!gatewayRes.ok || !gatewayRes.body) {
          if (gatewayRes.status === 429)
            return json({ error: "Rate limit. Try again shortly." }, 429);
          if (gatewayRes.status === 402)
            return json({ error: "AI credits exhausted." }, 402);
          const txt = await gatewayRes.text().catch(() => "");
          console.error("Wren gateway error", gatewayRes.status, txt);
          return json({ error: "AI gateway error" }, 502);
        }

        // Stream back to client as SSE, accumulate, then persist assistant message
        const encoder = new TextEncoder();
        const decoder = new TextDecoder();
        let assistant = "";

        const stream = new ReadableStream({
          async start(controller) {
            const send = (obj: unknown) =>
              controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`));

            const reader = gatewayRes.body!.getReader();
            let buf = "";
            try {
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                buf += decoder.decode(value, { stream: true });
                let nl: number;
                while ((nl = buf.indexOf("\n")) !== -1) {
                  let line = buf.slice(0, nl);
                  buf = buf.slice(nl + 1);
                  if (line.endsWith("\r")) line = line.slice(0, -1);
                  if (!line.startsWith("data: ")) continue;
                  const payload = line.slice(6).trim();
                  if (payload === "[DONE]") continue;
                  try {
                    const parsed = JSON.parse(payload);
                    const delta = parsed.choices?.[0]?.delta?.content as string | undefined;
                    if (delta) {
                      assistant += delta;
                      send({ type: "delta", text: delta });
                    }
                  } catch {
                    buf = line + "\n" + buf;
                    break;
                  }
                }
              }

              // Persist assistant message
              const { data: inserted, error: insErr } = await supabase
                .from("wren_messages")
                .insert({
                  conversation_id: parsed.conversationId,
                  user_id: userId,
                  role: "assistant",
                  content: assistant,
                })
                .select("id")
                .single();

              // Auto-title conversation from first user message if still default
              await supabase
                .from("wren_conversations")
                .update({ updated_at: new Date().toISOString() })
                .eq("id", parsed.conversationId);

              if (insErr) {
                send({ type: "error", message: insErr.message });
              } else {
                send({ type: "done", assistantMessageId: inserted?.id ?? null });
              }
            } catch (e) {
              send({
                type: "error",
                message: e instanceof Error ? e.message : "Stream failed",
              });
            } finally {
              controller.close();
            }
          },
        });

        return new Response(stream, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache, no-transform",
            Connection: "keep-alive",
          },
        });
      },
    },
  },
});

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
