import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { emailSchema } from "@/lib/validation/schemas";
import { OriginButton } from "@/components/ui/origin-button";
import { Input } from "@/components/ui/input";
import logoSvg from "@/assets/Nook_Green.svg.asset.json";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset password — Nook" },
      { name: "description", content: "Reset your Nook account password." },
      { name: "robots", content: "noindex,nofollow" },
      { property: "og:url", content: "https://thenook.rent/forgot-password" },
    ],
    links: [{ rel: "canonical", href: "https://thenook.rent/forgot-password" }],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const res = emailSchema.safeParse(email);
    if (!res.success) {
      setError(res.error.issues[0]?.message);
      return;
    }
    setError(undefined);
    setSubmitting(true);
    const { error: err } = await supabase.auth.resetPasswordForEmail(res.data, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setSubmitting(false);
    if (err) {
      setError(err.message);
      toast.error("Could not send reset email", { description: err.message });
      return;
    }
    setSent(true);
  }

  return (
    <div className="sgn-page">
      <div className="sgn-col">
        <Link to="/" className="sgn-logo" aria-label="Nook home">
          <img src={logoSvg.url} alt="Nook" width={81} height={28} />
        </Link>

        <div className="sgn-head">
          <h1 className="sgn-title">Reset your password</h1>
          <p className="sgn-sub">Enter the email tied to your account and we'll send you a reset link.</p>
        </div>

        {sent ? (
          <div className="p-5 rounded-[12px] border bg-white" style={{ borderColor: "rgba(0,0,0,0.2)" }}>
            <p className="text-sm text-[#5a5a55]">
              If an account exists for <span className="font-semibold text-[#241c12]">{email}</span>, you'll
              receive a password reset link shortly. It expires in 1 hour.
            </p>
            <p className="mt-4 text-sm">
              <Link to="/login" className="font-medium text-[#241c12] underline">
                Back to sign in
              </Link>
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="sgn-form" noValidate>
            <div className="sgn-fields">
              <div className="sgn-field">
                <label className="sgn-label" htmlFor="fp-email">
                  Email
                </label>
                <Input
                  id="fp-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={!!error}
                  placeholder="you@email.com"
                  size="big"
                />
                {error && <p className="sgn-err">{error}</p>}
              </div>
            </div>

            <OriginButton type="submit" variant="main" size="big" disabled={submitting} className="w-full">
              {submitting ? "Sending…" : "Send reset link"}
            </OriginButton>

            <p className="sgn-foot">
              Remembered it?{" "}
              <Link to="/login">Back to sign in</Link>
            </p>
          </form>
        )}
      </div>

      <style>{`
        .sgn-page {
          min-height: 100vh;
          background: #faf6ee;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 24px;
          font-family: "Google Sans Flex", system-ui, sans-serif;
          font-variation-settings: "GRAD" 0, "ROND" 0, "wdth" 100;
        }
        .sgn-col { width: 100%; max-width: 448px; padding-bottom: 48px; }
        .sgn-logo { display: inline-flex; }
        .sgn-logo img { display: block; width: 81px; height: 28px; }
        .sgn-head { padding: 32px 0; display: flex; flex-direction: column; gap: 4px; }
        .sgn-title {
          font-family: Fraunces, Georgia, serif;
          font-variation-settings: "SOFT" 0, "WONK" 1;
          font-weight: 700;
          font-size: 30px;
          line-height: 36px;
          letter-spacing: -0.45px;
          color: #241c12;
          margin: 0;
        }
        .sgn-sub { margin: 0; font-size: 14px; line-height: 20px; color: #5a5a55; }
        .sgn-form { display: flex; flex-direction: column; gap: 24px; }
        .sgn-fields { display: flex; flex-direction: column; gap: 16px; }
        .sgn-label { display: block; font-size: 14px; line-height: 20px; font-weight: 500; color: #4a4a46; margin-bottom: 8px; }
        .sgn-err { margin: 8px 0 0; font-size: 13px; color: #c93822; }
        .sgn-foot { margin: 0; font-size: 14px; line-height: 20px; color: #5a5a55; }
        .sgn-foot a { color: #241c12; text-decoration: underline; }
      `}</style>
    </div>
  );
}
