import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { subscribeNewsletter } from "@/lib/newsletter.functions";

interface NewsletterSignupProps {
  source?: string;
  variant?: "card" | "inline";
}

export function NewsletterSignup({ source, variant = "card" }: NewsletterSignupProps) {
  const subscribe = useServerFn(subscribeNewsletter);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "loading") return;
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Enter a valid email");
      return;
    }
    setState("loading");
    setError(null);
    try {
      await subscribe({ data: { email: trimmed, source } });
      setState("success");
    } catch {
      setState("error");
      setError("Something went wrong. Try again.");
    }
  }

  const containerClass =
    variant === "card"
      ? "rounded-card p-6 border"
      : "rounded-card p-6 sm:p-8 border";

  return (
    <div
      className={containerClass}
      style={{
        backgroundColor: "var(--color-sage-100, #ECF1E6)",
        borderColor: "var(--color-brand-sage)",
      }}
    >
      <div className="text-[10px] font-mono uppercase tracking-[0.18em] font-semibold text-[var(--color-brand-sage)]">
        Newsletter
      </div>
      <div className="mt-2 font-display text-xl font-medium text-[var(--color-brand-charcoal)]">
        Get a monthly digest
      </div>
      <p className="mt-2 text-sm text-[var(--color-charcoal-700)]">
        Best of the Nook blog plus product updates. No spam.
      </p>

      {state === "success" ? (
        <div
          className="mt-4 flex items-start gap-3 rounded-card border p-4 bg-white"
          style={{ borderColor: "var(--color-brand-sage)" }}
        >
          <div
            className="flex-none w-9 h-9 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "var(--color-sage-100, #ECF1E6)" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-[18px] h-[18px]"
              style={{ color: "var(--color-brand-sage)" }}
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div>
            <div className="font-display text-base font-semibold text-[var(--color-brand-charcoal)]">
              Almost there — check your inbox
            </div>
            <div className="text-[13.5px] text-[var(--color-charcoal-600)] mt-0.5">
              We sent a confirmation link to finish subscribing.
            </div>
          </div>
        </div>
      ) : (
        <form className="mt-4 space-y-2" onSubmit={onSubmit} noValidate>
          <input
            type="email"
            required
            autoComplete="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError(null);
            }}
            disabled={state === "loading"}
            className="w-full h-11 px-4 rounded-pill border bg-white text-sm text-[var(--color-brand-charcoal)] placeholder:text-[var(--color-charcoal-500)] focus:outline-none focus:border-[var(--color-brand-sage)] focus:ring-2 focus:ring-[var(--color-brand-sage)]/25 disabled:opacity-60"
            style={{ borderColor: "var(--color-brand-clay)" }}
          />
          <button
            type="submit"
            disabled={state === "loading"}
            className="w-full h-11 rounded-pill text-sm font-semibold text-white transition-colors disabled:opacity-70"
            style={{ backgroundColor: "#4A6440" }}
          >
            {state === "loading" ? "Subscribing…" : "Subscribe"}
          </button>
          {error && (
            <p className="text-[12px] text-[var(--color-brand-terracotta)] mt-1">{error}</p>
          )}
        </form>
      )}

      <p className="mt-3 text-[11px] text-[var(--color-charcoal-500)]">
        {state === "success"
          ? "Didn't get it? Check spam, or try again in a minute."
          : "Unsubscribe anytime."}
      </p>
    </div>
  );
}
