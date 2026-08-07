import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { OriginButton } from "@/components/ui/origin-button";
import { subscribeNewsletter } from "@/lib/newsletter.functions";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type UiState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success"; message: string; sub: string }
  | { kind: "error"; message: string };

/** Dark gradient newsletter card used on the blog index sidebar. */
export function NewsletterCardDark({ source }: { source?: string }) {
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

  return (
    <div className="bnl-card">
      <div className="bnl-eyebrow">Newsletter</div>
      <div>
        <div className="bnl-title">Get a monthly digest</div>
        <p className="bnl-sub">Best of the Nook blog plus product updates. No spam.</p>
      </div>

      {state.kind === "success" ? (
        <div className="bnl-success" role="status" aria-live="polite">
          <div className="bnl-success-title">{state.message}</div>
          <div className="bnl-success-sub">{state.sub}</div>
        </div>
      ) : (
        <form onSubmit={onSubmit} noValidate className="bnl-form">
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: "-10000px",
              width: 1,
              height: 1,
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
            aria-label="Email address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (state.kind === "error") setState({ kind: "idle" });
            }}
            disabled={state.kind === "loading"}
            className="bnl-input"
          />
          <button type="submit" disabled={state.kind === "loading"} className="bnl-btn">
            {state.kind === "loading" ? "Subscribing…" : "Subscribe"}
          </button>
          {state.kind === "error" && (
            <p className="bnl-err" role="alert" aria-live="polite">
              {state.message}
            </p>
          )}
        </form>
      )}

      <p className="bnl-foot">
        {state.kind === "success" && state.message.startsWith("Almost")
          ? "Didn't get it? Check spam, or try again in a minute."
          : "Unsubscribe anytime."}
      </p>

      <style>{`
        .bnl-card {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding: 32px;
          border-radius: 24px;
          background-color: #2c2415;
          background-image:
            radial-gradient(120% 90% at 0% 0%, rgba(255,205,0,0.14) 0%, rgba(255,205,0,0) 60%),
            radial-gradient(120% 90% at 100% 0%, rgba(203,74,10,0.26) 0%, rgba(203,74,10,0) 62%),
            radial-gradient(120% 95% at 100% 100%, rgba(122,143,55,0.30) 0%, rgba(122,143,55,0) 62%),
            radial-gradient(120% 90% at 0% 100%, rgba(120,165,200,0.12) 0%, rgba(120,165,200,0) 60%);
          box-shadow: 0 2px 2px rgba(36,28,18,0.08), 0 24px 28px rgba(36,28,18,0.28);
        }
        .bnl-eyebrow {
          font-family: "Google Sans Flex", system-ui, sans-serif;
          font-variation-settings: "GRAD" 0,"ROND" 0,"wdth" 100;
          font-weight: 700; font-size: 13px; letter-spacing: 1.82px;
          text-transform: uppercase; color: #ffffff;
        }
        .bnl-title {
          font-family: Fraunces, Georgia, serif;
          font-variation-settings: "SOFT" 0,"WONK" 1;
          font-weight: 600; font-size: 24px; line-height: 28px;
          letter-spacing: -0.3px; color: #ffffff;
        }
        .bnl-sub {
          margin-top: 8px;
          font-family: "Google Sans Flex", system-ui, sans-serif;
          font-variation-settings: "GRAD" 0,"ROND" 0,"wdth" 100;
          font-weight: 400; font-size: 14px; line-height: 24px; color: #f8f3e1;
        }
        .bnl-form { display: flex; flex-direction: column; gap: 12px; }
        .bnl-input {
          height: 54px; width: 100%; padding: 0 16px;
          border-radius: 12px; border: 1px solid rgba(0,0,0,0.2);
          background: #ffffff;
          font-family: "Google Sans Flex", system-ui, sans-serif;
          font-variation-settings: "GRAD" 0,"ROND" 0,"wdth" 100;
          font-size: 16px; color: #241c12;
        }
        .bnl-input::placeholder { color: rgba(36,28,18,0.6); }
        .bnl-input:disabled { opacity: 0.6; }
        .bnl-input:focus-visible { outline: 2px solid #f8f3e1; outline-offset: 2px; }
        .bnl-btn {
          width: 100%; padding: 16px 24px; border: none; border-radius: 12px;
          background: #d66c38; color: #ffffff; cursor: pointer;
          font-family: "Google Sans Flex", system-ui, sans-serif;
          font-variation-settings: "GRAD" 0,"ROND" 0,"wdth" 100;
          font-weight: 500; font-size: 16px; line-height: 1;
          transition: background-color 0.2s ease;
        }
        .bnl-btn:hover { background: #c05f2e; }
        .bnl-btn:disabled { opacity: 0.7; cursor: default; }
        .bnl-btn:focus-visible { outline: 2px solid #f8f3e1; outline-offset: 2px; }
        .bnl-err {
          font-family: "Google Sans Flex", system-ui, sans-serif;
          font-size: 12px; line-height: 20px; color: #f8f3e1;
        }
        .bnl-success {
          border-radius: 12px; border: 1px solid rgba(248,243,225,0.25);
          background: rgba(248,243,225,0.08); padding: 16px;
        }
        .bnl-success-title {
          font-family: Fraunces, Georgia, serif;
          font-variation-settings: "SOFT" 0,"WONK" 1;
          font-weight: 600; font-size: 16px; color: #ffffff;
        }
        .bnl-success-sub {
          margin-top: 4px;
          font-family: "Google Sans Flex", system-ui, sans-serif;
          font-size: 13px; line-height: 20px; color: #f8f3e1;
        }
        .bnl-foot {
          font-family: "Google Sans Flex", system-ui, sans-serif;
          font-variation-settings: "GRAD" 0,"ROND" 0,"wdth" 100;
          font-weight: 400; font-size: 12px; line-height: 20px;
          color: #f8f3e1; text-align: center;
        }
      `}</style>
    </div>
  );
}
