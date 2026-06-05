import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { subscribeNewsletter } from "@/lib/newsletter.functions";

interface NewsletterSignupProps {
  source?: string;
  variant?: "card" | "inline";
}

type UiState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success"; message: string; sub: string }
  | { kind: "error"; message: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function NewsletterSignup({ source, variant = "card" }: NewsletterSignupProps) {
  const subscribe = useServerFn(subscribeNewsletter);
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [state, setState] = useState<UiState>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (state.kind === "loading") return;

    const trimmed = email.trim();
    if (!EMAIL_RE.test(trimmed)) {
      setState({ kind: "error", message: "That doesn't look like an email." });
      return;
    }

    setState({ kind: "loading" });
    try {
      const res = await subscribe({ data: { email: trimmed, source, website } });
      if (!res.ok) {
        const map: Record<string, string> = {
          invalid: "That doesn't look like an email.",
          throttled: "Too many tries — give it a minute.",
          rejected: "Something went off — try again.",
        };
        setState({ kind: "error", message: map[res.error] ?? "Something went off — try again." });
        return;
      }
      if (res.state === "already_subscribed") {
        setState({
          kind: "success",
          message: "You're already on the list 🙂",
          sub: "Nothing to do — next digest is on its way.",
        });
      } else {
        setState({
          kind: "success",
          message: "Almost there — check your inbox",
          sub: "We sent a confirmation link to finish subscribing.",
        });
      }
    } catch {
      setState({ kind: "error", message: "Something went off — try again." });
    }
  }

  const containerClass =
    variant === "card" ? "rounded-card p-6 border" : "rounded-card p-6 sm:p-8 border";

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

      {state.kind === "success" ? (
        <div
          className="mt-4 flex items-start gap-3 rounded-card border p-4 bg-white"
          style={{ borderColor: "var(--color-brand-sage)" }}
          role="status"
          aria-live="polite"
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
              {state.message}
            </div>
            <div className="text-[13.5px] text-[var(--color-charcoal-600)] mt-0.5">
              {state.sub}
            </div>
          </div>
        </div>
      ) : (
        <form className="mt-4 space-y-2" onSubmit={onSubmit} noValidate>
          {/* Honeypot — hidden from humans, visible to bots */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: "-10000px",
              top: "auto",
              width: "1px",
              height: "1px",
              overflow: "hidden",
            }}
          >
            <label>
              Website
              <input
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </label>
          </div>

          <input
            type="email"
            required
            autoComplete="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (state.kind === "error") setState({ kind: "idle" });
            }}
            disabled={state.kind === "loading"}
            className="newsletter-input w-full h-11 px-4 rounded-pill border bg-white text-sm text-[var(--color-brand-charcoal)] placeholder:text-[var(--color-charcoal-500)] focus:outline-none focus:border-[var(--color-brand-sage)] focus:ring-2 focus:ring-[var(--color-brand-sage)]/25 disabled:opacity-60"
            style={{ borderColor: "var(--color-brand-clay)" }}
          />
          <button
            type="submit"
            disabled={state.kind === "loading"}
            className="w-full h-11 rounded-pill text-sm font-semibold text-white transition-colors disabled:opacity-70"
            style={{ backgroundColor: "#4A6440" }}
            onMouseEnter={(e) => {
              if (state.kind !== "loading") e.currentTarget.style.backgroundColor = "#3D5435";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#4A6440";
            }}
          >
            {state.kind === "loading" ? (
              <span className="inline-flex items-center gap-2">
                <span
                  className="inline-block w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin"
                  aria-hidden="true"
                />
                Subscribing…
              </span>
            ) : (
              "Subscribe"
            )}
          </button>
          {state.kind === "error" && (
            <p
              className="text-[12px] mt-1 text-[var(--color-charcoal-700)]"
              role="alert"
              aria-live="polite"
            >
              {state.message}
            </p>
          )}
        </form>
      )}

      <p className="mt-3 text-[11px] text-[var(--color-charcoal-500)]">
        {state.kind === "success" && state.message.startsWith("Almost")
          ? "Didn't get it? Check spam, or try again in a minute."
          : "Unsubscribe anytime."}
      </p>
    </div>
  );
}
