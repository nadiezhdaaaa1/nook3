import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Sparkles, Send, Square, Plus, Loader2, Mic, MicOff } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const searchSchema = z.object({
  c: z.string().uuid().optional(),
  scope: z.enum(["general", "search", "listing", "compare"]).optional(),
  listing: z.string().optional(),
  ids: z.string().optional(),
});

export const Route = createFileRoute("/_authenticated/preferences/wren")({
  validateSearch: (s) => searchSchema.parse(s),
  component: WrenChatPage,
});

type Msg = { role: "user" | "assistant"; content: string };

function WrenChatPage() {
  const plan = useAppStore((s) => s.user?.plan ?? "free");
  const search = Route.useSearch();
  const navigate = useNavigate();
  const locked = plan !== "premium" && plan !== "max";

  const [conversationId, setConversationId] = useState<string | null>(search.c ?? null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);

  const scope = useMemo(() => {
    if (search.scope === "listing" && search.listing) {
      return { type: "listing" as const, data: { listingId: search.listing } };
    }
    if (search.scope === "compare" && search.ids) {
      return { type: "compare" as const, data: { listingIds: search.ids.split(",") } };
    }
    return { type: "general" as const, data: {} };
  }, [search]);

  // Load existing conversation messages
  useEffect(() => {
    if (!conversationId) return;
    (async () => {
      const { data } = await supabase
        .from("wren_messages")
        .select("role, content")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });
      if (data) setMessages(data.filter((m) => m.role === "user" || m.role === "assistant") as Msg[]);
    })();
  }, [conversationId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, streaming]);

  const ensureConversation = async (): Promise<string | null> => {
    if (conversationId) return conversationId;
    const { data: session } = await supabase.auth.getSession();
    const userId = session.session?.user.id;
    if (!userId) return null;
    const title =
      scope.type === "listing" ? "About a listing"
      : scope.type === "compare" ? "Comparing listings"
      : "New chat";
    const { data, error } = await supabase
      .from("wren_conversations")
      .insert({ user_id: userId, title, scope_type: scope.type, scope_data: scope.data })
      .select("id")
      .single();
    if (error || !data) { toast.error(error?.message ?? "Failed to start chat"); return null; }
    setConversationId(data.id);
    navigate({ to: "/preferences/wren", search: { c: data.id }, replace: true });
    return data.id;
  };

  const send = async () => {
    const text = input.trim();
    if (!text || streaming || locked) return;
    const convId = await ensureConversation();
    if (!convId) return;

    setMessages((m) => [...m, { role: "user", content: text }, { role: "assistant", content: "" }]);
    setInput("");
    setStreaming(true);

    const { data: session } = await supabase.auth.getSession();
    const token = session.session?.access_token;
    if (!token) { setStreaming(false); toast.error("Not signed in"); return; }

    abortRef.current = new AbortController();
    try {
      const res = await fetch("/api/wren-chat", {
        method: "POST",
        signal: abortRef.current.signal,
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ conversationId: convId, userMessage: text, scope }),
      });
      if (!res.ok || !res.body) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error ?? `HTTP ${res.status}`);
      }
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let buf = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        let nl: number;
        while ((nl = buf.indexOf("\n\n")) !== -1) {
          const chunk = buf.slice(0, nl); buf = buf.slice(nl + 2);
          for (const line of chunk.split("\n")) {
            if (!line.startsWith("data: ")) continue;
            try {
              const evt = JSON.parse(line.slice(6));
              if (evt.type === "delta") {
                setMessages((prev) => {
                  const copy = [...prev];
                  copy[copy.length - 1] = { role: "assistant", content: copy[copy.length - 1].content + evt.text };
                  return copy;
                });
              } else if (evt.type === "error") {
                toast.error(evt.message);
              }
            } catch { /* partial */ }
          }
        }
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        toast.error((e as Error).message ?? "Chat failed");
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  };

  const startRecording = async () => {
    if (recording || transcribing) return;
    if (!navigator.mediaDevices?.getUserMedia) {
      toast.error("Microphone not supported in this browser");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mr.ondataavailable = (e) => { if (e.data.size) audioChunksRef.current.push(e.data); };
      mr.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(audioChunksRef.current, { type: mr.mimeType || "audio/webm" });
        if (blob.size < 500) { setTranscribing(false); return; }
        setTranscribing(true);
        try {
          const { data: session } = await supabase.auth.getSession();
          const token = session.session?.access_token;
          if (!token) throw new Error("Not signed in");
          const fd = new FormData();
          fd.append("audio", blob, "voice.webm");
          const res = await fetch("/api/wren-transcribe", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: fd,
          });
          if (!res.ok) {
            const j = await res.json().catch(() => ({}));
            throw new Error(j.error ?? `Transcription failed (${res.status})`);
          }
          const j = (await res.json()) as { text?: string };
          const text = (j.text ?? "").trim();
          if (text) setInput((prev) => (prev ? `${prev} ${text}` : text));
          else toast.message("Didn't catch that. Try again.");
        } catch (e) {
          toast.error((e as Error).message ?? "Transcription failed");
        } finally {
          setTranscribing(false);
        }
      };
      mr.start();
      recorderRef.current = mr;
      setRecording(true);
    } catch {
      toast.error("Microphone permission denied");
    }
  };

  const stopRecording = () => {
    if (!recording) return;
    recorderRef.current?.stop();
    recorderRef.current = null;
    setRecording(false);
  };

  if (locked) return <LockedState />;

  const scopeChip = scope.type !== "general" && (
    <div className="inline-flex items-center gap-2 h-7 px-3 rounded-pill bg-sage-100 text-sage-900 text-xs font-mono uppercase tracking-wider">
      {scope.type === "listing" ? `About: ${(scope.data as { listingId: string }).listingId.slice(0, 8)}…`
        : `Comparing: ${(scope.data as { listingIds: string[] }).listingIds.length} listings`}
    </div>
  );

  return (
    <div className="flex flex-col h-[calc(100dvh-220px)] min-h-[520px] -mx-2">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border">
        <div className="flex items-center gap-3">
          <span className="h-8 w-8 rounded-pill bg-sage-200 inline-flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-sage-900" />
          </span>
          <div>
            <div className="font-display text-lg font-semibold text-charcoal-950">Wren</div>
            <div className="text-[11px] text-charcoal-500">Your search assistant</div>
          </div>
          {scopeChip}
        </div>
        <button
          type="button"
          onClick={() => { setMessages([]); setConversationId(null); navigate({ to: "/preferences/wren", search: {}, replace: true }); }}
          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-pill border border-charcoal-200 text-xs font-semibold text-charcoal-700 hover:border-charcoal-950"
        >
          <Plus className="h-3.5 w-3.5" /> New chat
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-4 max-w-[760px] w-full mx-auto">
        {messages.length === 0 && <EmptyState onPick={(p) => setInput(p)} />}
        {messages.map((m, i) => (
          <Bubble key={i} role={m.role} content={m.content} streaming={streaming && i === messages.length - 1 && m.role === "assistant"} />
        ))}
      </div>

      {/* Composer */}
      <div className="border-t border-border px-4 py-3 max-w-[760px] w-full mx-auto">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void send(); }
            }}
            placeholder={scope.type === "listing" ? "Ask about this place…" : "Ask Wren anything about your search…"}
            rows={1}
            className="flex-1 resize-none rounded-card border border-charcoal-200 bg-surface-elevated px-4 py-3 text-sm text-charcoal-950 placeholder:text-charcoal-400 focus:outline-none focus:border-charcoal-950 min-h-[44px] max-h-40"
          />
          <button
            type="button"
            onClick={recording ? stopRecording : startRecording}
            disabled={streaming || transcribing}
            aria-label={recording ? "Stop recording" : "Record voice message"}
            title={recording ? "Stop recording" : "Speak to Wren"}
            className={cn(
              "shrink-0 h-11 w-11 rounded-pill border inline-flex items-center justify-center transition-colors disabled:opacity-40",
              recording
                ? "bg-sage-200 border-sage-500 text-sage-900 animate-pulse"
                : "bg-surface-elevated border-charcoal-200 text-charcoal-700 hover:border-charcoal-950",
            )}
          >
            {transcribing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : recording ? (
              <MicOff className="h-4 w-4" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </button>
          {streaming ? (
            <button
              type="button"
              onClick={() => abortRef.current?.abort()}
              className="shrink-0 h-11 px-4 rounded-pill bg-charcoal-950 text-paper inline-flex items-center gap-1.5 text-sm font-semibold"
            >
              <Square className="h-3.5 w-3.5 fill-current" /> Stop
            </button>
          ) : (
            <button
              type="button"
              onClick={() => void send()}
              disabled={!input.trim()}
              className="shrink-0 h-11 px-4 rounded-pill bg-charcoal-950 text-paper inline-flex items-center gap-1.5 text-sm font-semibold disabled:opacity-40"
            >
              <Send className="h-3.5 w-3.5" /> Send
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Bubble({ role, content, streaming }: { role: "user" | "assistant"; content: string; streaming: boolean }) {
  if (role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-card bg-paper-warm border border-border px-4 py-2.5 text-sm text-charcoal-950 whitespace-pre-wrap">
          {content}
        </div>
      </div>
    );
  }
  return (
    <div className="flex gap-3 items-start">
      <span className="h-7 w-7 shrink-0 rounded-pill bg-sage-200 inline-flex items-center justify-center mt-1">
        <Sparkles className="h-3.5 w-3.5 text-sage-900" />
      </span>
      <div className="max-w-[80%] rounded-card bg-surface-elevated border border-border px-4 py-2.5 text-sm text-charcoal-900 whitespace-pre-wrap">
        {content || (streaming && <Loader2 className="h-3.5 w-3.5 animate-spin text-charcoal-400" />)}
      </div>
    </div>
  );
}

function EmptyState({ onPick }: { onPick: (s: string) => void }) {
  const prompts = [
    "Draft a message for a listing",
    "Compare my saved places",
    "Is this rent fair?",
    "Find me something cheaper",
  ];
  return (
    <div className="text-center py-12">
      <span className="h-12 w-12 rounded-pill bg-sage-200 inline-flex items-center justify-center mb-4">
        <Sparkles className="h-5 w-5 text-sage-900" />
      </span>
      <h2 className="font-display text-2xl font-semibold text-charcoal-950">
        Hi — I'm <em className="italic text-sage-800">Wren</em>.
      </h2>
      <p className="mt-2 text-sm text-charcoal-600 max-w-md mx-auto">
        Ask me about any place, or let me do the legwork.
      </p>
      <div className="mt-6 flex flex-wrap gap-2 justify-center max-w-lg mx-auto">
        {prompts.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPick(p)}
            className="h-9 px-4 rounded-pill border border-charcoal-200 bg-surface-elevated text-sm text-charcoal-800 hover:border-sage-500 hover:text-sage-900 transition-colors"
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}

function LockedState() {
  return (
    <div className="rounded-card border border-border bg-surface-elevated p-10 text-center">
      <span className="h-12 w-12 rounded-pill bg-sage-100 inline-flex items-center justify-center mb-4">
        <Sparkles className="h-5 w-5 text-sage-800" />
      </span>
      <h2 className="font-display text-2xl font-semibold text-charcoal-950">
        Wren is part of <em className="italic text-sage-800">Premium</em>
      </h2>
      <p className="mt-2 text-sm text-charcoal-600 max-w-md mx-auto">
        Your in-app rental assistant. Drafts messages, compares listings, and explains fit-scores.
      </p>
      <ul className="mt-5 text-sm text-charcoal-700 space-y-1.5 inline-block text-left">
        <li>· Draft landlord messages from your profile</li>
        <li>· Compare 2–3 saved listings side-by-side</li>
        <li>· Fair-price reads on any listing</li>
      </ul>
      <div className="mt-6">
        <a href="/preferences/account" className="inline-flex items-center h-11 px-5 rounded-pill bg-charcoal-950 text-paper text-sm font-semibold hover:bg-charcoal-800">
          Upgrade to Premium
        </a>
      </div>
    </div>
  );
}
