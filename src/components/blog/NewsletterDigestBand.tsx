import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { subscribeNewsletter } from "@/lib/newsletter.functions";

const CSS = `
.dgb { position:relative; overflow:hidden; padding:104px 0; background:#2c2415; }
.dgb::before {
  content:""; position:absolute; inset:0; pointer-events:none;
  background:
    radial-gradient(60% 70% at 12% 0%, rgba(255,205,0,0.14) 0%, rgba(255,205,0,0) 60%),
    radial-gradient(58% 68% at 88% 12%, rgba(203,74,10,0.26) 0%, rgba(203,74,10,0) 62%),
    radial-gradient(62% 72% at 82% 100%, rgba(122,143,55,0.30) 0%, rgba(122,143,55,0) 64%),
    radial-gradient(58% 66% at 4% 92%, rgba(120,165,200,0.12) 0%, rgba(120,165,200,0) 64%);
}
.dgb-inner {
  position:relative; max-width:1200px; margin:0 auto; padding:0 40px;
  display:flex; align-items:center; justify-content:space-between; gap:40px;
}
.dgb-left { flex:1 1 auto; display:flex; flex-direction:column; gap:16px; min-width:0; }
.dgb-h2 {
  font-family:Fraunces,Georgia,serif; font-variation-settings:"SOFT" 0,"WONK" 1;
  font-weight:600; font-size:48px; line-height:54px; letter-spacing:-1.2px; color:#fff; margin:0;
}
.dgb-sub {
  font-family:"Google Sans Flex",system-ui,sans-serif;
  font-variation-settings:"GRAD" 0,"ROND" 0,"wdth" 100;
  font-weight:400; font-size:18px; line-height:1.6; color:#f8f3e1; margin:0;
}
.dgb-form { flex:0 0 auto; display:flex; align-items:center; gap:12px; }
.dgb-input {
  width:264px; height:54px; padding:0 16px; border-radius:12px;
  background:#fff; border:1px solid rgba(0,0,0,0.2);
  font-family:"Google Sans Flex",system-ui,sans-serif;
  font-variation-settings:"GRAD" 0,"ROND" 0,"wdth" 100;
  font-weight:400; font-size:16px; color:#241c12;
}
.dgb-input::placeholder { color:rgba(36,28,18,0.6); }
.dgb-input:focus-visible { outline:2px solid #f8f3e1; outline-offset:2px; }
.dgb-btn {
  flex:0 0 auto; display:inline-flex; align-items:center; justify-content:center;
  background:#D04305; color:#fff; border-radius:12px; padding:16px 24px;
  font-family:"Google Sans Flex",system-ui,sans-serif;
  font-variation-settings:"GRAD" 0,"ROND" 0,"wdth" 100;
  font-weight:500; font-size:16px; line-height:1;
  transition:background-color .2s ease-out;
}
.dgb-btn:hover { background:#9E2F11; }
.dgb-btn:focus-visible { outline:2px solid #f8f3e1; outline-offset:2px; }
.dgb-btn:disabled { opacity:.7; }
.dgb-msg {
  font-family:"Google Sans Flex",system-ui,sans-serif;
  font-variation-settings:"GRAD" 0,"ROND" 0,"wdth" 100;
  font-size:14px; line-height:22px; color:#f8f3e1; max-width:320px;
}
@media (max-width:1100px) {
  .dgb-inner { flex-direction:column; align-items:flex-start; gap:28px; }
  .dgb-h2 { font-size:clamp(34px,5vw,44px); line-height:1.14; }
}
@media (max-width:680px) {
  .dgb { padding:72px 0; }
  .dgb-inner { padding:0 20px; }
  .dgb-h2 { font-size:clamp(30px,7vw,36px); }
  .dgb-form { flex-direction:column; align-items:stretch; width:100%; }
  .dgb-input { width:100%; }
  .dgb-btn { width:100%; }
}
`;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type UiState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

export function NewsletterDigestBand({ source }: { source?: string }) {
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
      setState({
        kind: "success",
        message:
          res.state === "already_subscribed"
            ? "You're already on the list — next digest is on its way."
            : "Almost there — check your inbox for the confirmation link.",
      });
    } catch {
      setState({ kind: "error", message: "Something went off — try again." });
    }
  }

  return (
    <section className="dgb" aria-labelledby="digest-heading">
      <style>{CSS}</style>
      <div className="dgb-inner">
        <div className="dgb-left">
          <h2 id="digest-heading" className="dgb-h2">
            Get a monthly digest
          </h2>
          <p className="dgb-sub">Best of the Nook blog plus product updates. No spam.</p>
        </div>

        {state.kind === "success" ? (
          <p className="dgb-msg" role="status" aria-live="polite">
            {state.message}
          </p>
        ) : (
          <form className="dgb-form" onSubmit={onSubmit} noValidate>
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                left: "-10000px",
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
              aria-label="Email address"
              placeholder="you@email.com"
              className="dgb-input"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (state.kind === "error") setState({ kind: "idle" });
              }}
              disabled={state.kind === "loading"}
            />
            <button type="submit" className="dgb-btn" disabled={state.kind === "loading"}>
              {state.kind === "loading" ? "Subscribing…" : "Subscribe"}
            </button>
            {state.kind === "error" && (
              <p className="dgb-msg" role="alert" aria-live="polite">
                {state.message}
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
