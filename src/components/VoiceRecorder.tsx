import { useEffect, useRef, useState } from "react";
import { Check, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const MAX_DURATION_SEC = 120;
const BAR_COUNT = 28;

export type VoiceRecorderProps = {
  onTranscribed: (text: string) => void;
  onCancel: () => void;
  onError?: (message: string) => void;
  getAuthToken: () => Promise<string | null>;
};

type Phase = "recording" | "transcribing";

export function VoiceRecorder({ onTranscribed, onCancel, onError, getAuthToken }: VoiceRecorderProps) {
  const [phase, setPhase] = useState<Phase>("recording");
  const [seconds, setSeconds] = useState(0);
  const [bars, setBars] = useState<number[]>(() => Array(BAR_COUNT).fill(0.08));
  const [error, setError] = useState<string | null>(null);

  const cancelledRef = useRef(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startedAtRef = useRef<number>(0);
  const reducedMotionRef = useRef(false);

  // Init recording
  useEffect(() => {
    reducedMotionRef.current = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    let cleanupCalled = false;

    const cleanup = () => {
      if (cleanupCalled) return;
      cleanupCalled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (timerRef.current) window.clearInterval(timerRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      audioCtxRef.current?.close().catch(() => {});
    };

    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;

        const mimeCandidates = [
          "audio/webm;codecs=opus",
          "audio/webm",
          "audio/mp4",
          "audio/ogg;codecs=opus",
        ];
        const mime = mimeCandidates.find((m) => MediaRecorder.isTypeSupported?.(m)) ?? "";
        const mr = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
        recorderRef.current = mr;
        chunksRef.current = [];
        mr.ondataavailable = (e) => { if (e.data.size) chunksRef.current.push(e.data); };
        mr.onstop = () => { void handleStopped(mr.mimeType || mime || "audio/webm"); };
        mr.start();

        // Waveform analyser
        const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AC();
        audioCtxRef.current = ctx;
        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        analyserRef.current = analyser;

        const data = new Uint8Array(analyser.frequencyBinCount);
        const tick = () => {
          if (!analyserRef.current) return;
          analyserRef.current.getByteTimeDomainData(data);
          if (!reducedMotionRef.current) {
            // sample BAR_COUNT slices, compute amplitude
            const next: number[] = [];
            const step = Math.floor(data.length / BAR_COUNT);
            for (let i = 0; i < BAR_COUNT; i++) {
              let sum = 0;
              for (let j = 0; j < step; j++) {
                const v = (data[i * step + j] - 128) / 128;
                sum += Math.abs(v);
              }
              const avg = sum / step;
              next.push(Math.min(1, Math.max(0.08, avg * 2.8)));
            }
            setBars(next);
          }
          rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);

        startedAtRef.current = Date.now();
        timerRef.current = window.setInterval(() => {
          const elapsed = Math.floor((Date.now() - startedAtRef.current) / 1000);
          setSeconds(elapsed);
          if (elapsed >= MAX_DURATION_SEC) {
            stopAndTranscribe();
          }
        }, 250);
      } catch {
        cleanup();
        const msg = "Wren needs mic access to transcribe — enable it in your browser settings.";
        setError(msg);
        onError?.(msg);
      }
    };

    void start();
    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStopped = async (mimeType: string) => {
    if (cancelledRef.current) return;
    const blob = new Blob(chunksRef.current, { type: mimeType });
    chunksRef.current = [];
    if (blob.size < 800) {
      const msg = "Didn't catch that — try again?";
      setError(msg);
      onError?.(msg);
      return;
    }
    setPhase("transcribing");
    try {
      const token = await getAuthToken();
      if (!token) throw new Error("Not signed in");
      const fd = new FormData();
      const ext = mimeType.includes("mp4") ? "mp4" : mimeType.includes("ogg") ? "ogg" : "webm";
      fd.append("audio", blob, `voice.${ext}`);
      const res = await fetch("/api/wren-transcribe", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error((j as { error?: string }).error ?? `Couldn't transcribe that.`);
      }
      const j = (await res.json()) as { text?: string };
      const text = (j.text ?? "").trim();
      if (!text) {
        const msg = "Didn't catch that — try again?";
        setError(msg);
        onError?.(msg);
        return;
      }
      onTranscribed(text);
    } catch (e) {
      const msg = (e as Error).message ?? "Couldn't transcribe that.";
      setError(msg);
      onError?.(msg);
    }
  };

  const stopAndTranscribe = () => {
    if (phase !== "recording") return;
    if (timerRef.current) window.clearInterval(timerRef.current);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    try { recorderRef.current?.stop(); } catch { /* noop */ }
  };

  const cancel = () => {
    cancelledRef.current = true;
    if (timerRef.current) window.clearInterval(timerRef.current);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    try {
      if (recorderRef.current && recorderRef.current.state !== "inactive") recorderRef.current.stop();
    } catch { /* noop */ }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    audioCtxRef.current?.close().catch(() => {});
    onCancel();
  };

  // Keyboard: Esc cancels, Enter/Space stops
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); cancel(); }
      if ((e.key === "Enter" || e.key === " ") && phase === "recording") {
        e.preventDefault();
        stopAndTranscribe();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const mm = String(Math.floor(seconds / 60));
  const ss = String(seconds % 60).padStart(2, "0");

  if (error) {
    return (
      <div
        role="alert"
        aria-live="polite"
        className="flex items-center justify-between gap-3 w-full h-11 px-4 rounded-pill bg-surface-elevated border border-charcoal-200"
      >
        <span className="text-sm text-charcoal-700">{error}</span>
        <button
          type="button"
          onClick={onCancel}
          className="h-8 px-3 rounded-pill text-xs font-semibold text-charcoal-700 hover:text-charcoal-950"
        >
          Dismiss
        </button>
      </div>
    );
  }

  return (
    <div
      role="region"
      aria-live="polite"
      aria-label={phase === "recording" ? "Recording voice input" : "Transcribing"}
      className="flex items-center gap-3 w-full h-11 px-2 pr-2 rounded-pill bg-surface-elevated border border-sage-500"
    >
      <button
        type="button"
        onClick={cancel}
        aria-label="Cancel voice input"
        className="shrink-0 h-8 w-8 rounded-pill inline-flex items-center justify-center text-charcoal-600 hover:bg-charcoal-50 hover:text-charcoal-950"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex-1 flex items-center gap-3 min-w-0">
        {phase === "recording" ? (
          <>
            <div className="flex-1 flex items-center justify-center gap-[2px] h-7 min-w-0" aria-hidden="true">
              {bars.map((amp, i) => (
                <span
                  key={i}
                  className="w-[3px] rounded-full bg-sage-500"
                  style={{ height: `${Math.max(10, amp * 100)}%`, transition: reducedMotionRef.current ? undefined : "height 80ms linear" }}
                />
              ))}
            </div>
            <span className="font-mono text-xs text-charcoal-700 tabular-nums shrink-0">{mm}:{ss}</span>
          </>
        ) : (
          <div className="flex-1 flex items-center gap-2 text-charcoal-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Transcribing…</span>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={stopAndTranscribe}
        disabled={phase !== "recording"}
        aria-label="Stop voice input"
        className={cn(
          "shrink-0 h-8 w-8 rounded-pill inline-flex items-center justify-center text-paper transition-colors",
          phase === "recording" ? "bg-sage-700 hover:bg-sage-800" : "bg-charcoal-300 cursor-not-allowed"
        )}
      >
        <Check className="h-4 w-4" />
      </button>
    </div>
  );
}
