import { createFileRoute } from "@tanstack/react-router";

// POST /api/wren-transcribe
// Body: multipart/form-data with `audio` file
// Returns: { text: string }
//
// Uses Lovable AI Gateway (Gemini 2.5 Flash) for transcription — no extra API key needed.

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const MODEL = "google/gemini-2.5-flash";
const MAX_BYTES = 20 * 1024 * 1024; // 20MB

export const Route = createFileRoute("/api/wren-transcribe")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env.LOVABLE_API_KEY;
        if (!apiKey) {
          return Response.json({ error: "LOVABLE_API_KEY not configured" }, { status: 500 });
        }

        // Require signed-in user
        const authHeader = request.headers.get("authorization");
        if (!authHeader?.startsWith("Bearer ")) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        let form: FormData;
        try {
          form = await request.formData();
        } catch {
          return Response.json({ error: "Expected multipart/form-data" }, { status: 400 });
        }
        const file = form.get("audio");
        if (!(file instanceof File)) {
          return Response.json({ error: "Missing 'audio' file" }, { status: 400 });
        }
        if (file.size > MAX_BYTES) {
          return Response.json({ error: "Audio too large (max 20MB)" }, { status: 413 });
        }

        const buf = await file.arrayBuffer();
        const base64 = Buffer.from(buf).toString("base64");

        // Map MIME to format hint. Default to webm (MediaRecorder default).
        const mime = file.type || "audio/webm";
        // OpenAI-compatible "input_audio" requires format: wav | mp3. Gemini via the
        // gateway accepts a broader set through inline data — we pass through mime.

        const res = await fetch(GATEWAY_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: MODEL,
            messages: [
              {
                role: "system",
                content:
                  "You are a transcription engine. Return ONLY the verbatim transcript of the audio in the same language the speaker used. No commentary, no quotes, no labels.",
              },
              {
                role: "user",
                content: [
                  { type: "text", text: "Transcribe this audio." },
                  {
                    type: "input_audio",
                    input_audio: { data: base64, format: mime.includes("wav") ? "wav" : "mp3" },
                  },
                ],
              },
            ],
          }),
        });

        if (!res.ok) {
          const errText = await res.text().catch(() => "");
          return Response.json(
            { error: `Transcription failed (${res.status})`, detail: errText.slice(0, 500) },
            { status: 502 },
          );
        }
        const data = await res.json().catch(() => null);
        const text: string = data?.choices?.[0]?.message?.content?.trim?.() ?? "";
        return Response.json({ text });
      },
    },
  },
});
