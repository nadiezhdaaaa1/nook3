import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { emailSchema, passwordSchema } from "@/lib/validation/schemas";
import { OriginButton } from "@/components/ui/origin-button";
import { Input } from "@/components/ui/input";
import logoSvg from "@/assets/Nook_Green.svg.asset.json";
import googleIcon from "@/assets/Google_Favicon_2025.svg.asset.json";
import {
  buildConsents,
  persistConsentsForCurrentUser,
  stashPendingConsents,
} from "@/lib/consents";
import { getReferralAttribution, getReferralIpHash } from "@/lib/referral/attribution";

type Search = { redirect?: string };

export const Route = createFileRoute("/signup")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  beforeLoad: async ({ search }) => {
    if (typeof window === "undefined") return;
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      throw redirect({ to: search.redirect ?? "/preferences" });
    }
  },
  head: () => ({
    meta: [
      { title: "Create account — Nook" },
      { name: "description", content: "Create your Nook account to save apartment alerts." },
      { property: "og:url", content: "https://thenook.rent/signup" }
    ],
    links: [{ rel: "canonical", href: "https://thenook.rent/signup" }],
  }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const { redirect: redirectTo } = Route.useSearch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    terms?: string;
    form?: string;
  }>({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [referralCode, setReferralCode] = useState<string | null>(null);

  useEffect(() => {
    setReferralCode(getReferralAttribution());
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const emailRes = emailSchema.safeParse(email);
    const pwRes = passwordSchema.safeParse(password);
    const nextErrors: typeof errors = {};
    if (!emailRes.success) nextErrors.email = emailRes.error.issues[0]?.message;
    if (!pwRes.success) nextErrors.password = pwRes.error.issues[0]?.message;
    if (!acceptTerms) nextErrors.terms = "Please accept the Terms and Privacy Policy to continue.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    const ipHash = getReferralIpHash();
    const metadata = referralCode
      ? { referral_code: referralCode, ...(ipHash ? { referral_ip_hash: ipHash } : {}) }
      : undefined;
    const { data, error } = await supabase.auth.signUp({
      email: emailRes.data!,
      password: pwRes.data!,
      options: {
        emailRedirectTo: `${window.location.origin}/preferences`,
        data: metadata,
      },
    });
    setSubmitting(false);
    if (error) {
      setErrors({ form: error.message });
      toast.error("Sign up failed", { description: error.message });
      return;
    }
    const consents = buildConsents({ marketing, source: "signup_email" });
    if (data.session) {
      await persistConsentsForCurrentUser(consents);
      toast.success("Account created");
      navigate({ to: redirectTo ?? "/preferences", replace: true });
    } else {
      stashPendingConsents(consents);
      setSent(true);
      toast.success("Check your email", { description: "We sent a confirmation link." });
    }
  }

  async function onGoogle() {
    if (!acceptTerms) {
      setErrors({ terms: "Please accept the Terms and Privacy Policy to continue." });
      return;
    }
    stashPendingConsents(buildConsents({ marketing, source: "signup_google" }));
    setSubmitting(true);
    const res = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + (redirectTo ?? "/preferences"),
    });
    setSubmitting(false);
    if (res?.error) toast.error("Google sign in failed", { description: res.error.message });
  }

  return (
    <div className="sgn-page">
      <div className="sgn-col">
        <Link to="/" className="sgn-logo" aria-label="Nook home">
          <img src={logoSvg.url} alt="Nook" width={81} height={28} />
        </Link>

        <div className="sgn-head">
          <h1 className="sgn-title">Create your account</h1>
          <p className="sgn-sub">Save searches and get alerts.</p>
        </div>

        {referralCode && !sent && (
          <div className="sgn-referral">
            <Sparkles className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
            Invite applied · +7 days of Premium on us
          </div>
        )}

        {sent ? (
          <div className="sgn-sent">
            <p>
              We sent a confirmation link to <strong>{email}</strong>. Open it to finish signing up.
            </p>
          </div>
        ) : (
          <>
            <OriginButton
              type="button"
              variant="tertiary"
              size="big"
              onClick={onGoogle}
              disabled={submitting}
              className="w-full"
            >
              <img src={googleIcon.url} alt="" width={24} height={24} aria-hidden="true" />
              <span>Continue with Google</span>
            </OriginButton>

            <div className="sgn-divider">
              <span className="sgn-rule" />
              <span className="sgn-or">or</span>
              <span className="sgn-rule" />
            </div>

            <form onSubmit={onSubmit} className="sgn-form" noValidate>
              <div className="sgn-fields">
                <div className="sgn-field">
                  <label className="sgn-label" htmlFor="sgn-email">
                    Email
                  </label>
                  <Input
                    id="sgn-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={!!errors.email}
                    placeholder="you@email.com"
                    size="big"
                  />
                  {errors.email && <p className="sgn-err">{errors.email}</p>}
                </div>
                <div className="sgn-field">
                  <label className="sgn-label" htmlFor="sgn-password">
                    Password
                  </label>
                  <Input
                    id="sgn-password"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-invalid={!!errors.password}
                    placeholder="At least 8 characters"
                    size="big"
                  />
                  {errors.password ? (
                    <p className="sgn-err">{errors.password}</p>
                  ) : (
                    <p className="sgn-hint">At least 8 characters.</p>
                  )}
                </div>
              </div>

              <div className="sgn-checks">
                <label className="sgn-check">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    aria-invalid={!!errors.terms}
                  />
                  <span>
                    I agree to the <Link to="/terms">Terms of Service</Link> and{" "}
                    <Link to="/privacy">Privacy Policy</Link>.
                  </span>
                </label>
                {errors.terms && <p className="sgn-err">{errors.terms}</p>}
                <label className="sgn-check">
                  <input
                    type="checkbox"
                    checked={marketing}
                    onChange={(e) => setMarketing(e.target.checked)}
                  />
                  <span>
                    Send me product updates and apartment-hunting tips. You can unsubscribe anytime.
                  </span>
                </label>
              </div>

              {errors.form && <p className="sgn-err">{errors.form}</p>}

              <OriginButton
                type="submit"
                variant="main"
                size="big"
                disabled={submitting}
                className="w-full"
              >
                {submitting ? "Creating account…" : "Create account"}
              </OriginButton>
            </form>
          </>
        )}

        <p className="sgn-foot">
          Already have an account?{" "}
          <Link to="/login" search={redirectTo ? { redirect: redirectTo } : undefined}>
            Sign in
          </Link>
        </p>
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
        .sgn-referral {
          display: inline-flex; align-items: center; gap: 8px;
          margin-bottom: 20px; padding: 6px 12px; border-radius: 999px;
          border: 1px solid rgba(106,130,10,0.35); background: rgba(106,130,10,0.08);
          font-size: 13px; color: #4d5f08;
        }
        .sgn-sent {
          margin-top: 8px; padding: 16px; border-radius: 12px;
          border: 1px solid rgba(0,0,0,0.20); background: #fff;
        }
        .sgn-sent p { margin: 0; font-size: 14px; line-height: 20px; color: #4a4a46; }
        .sgn-divider { padding: 20px 0; display: flex; align-items: center; gap: 12px; }
        .sgn-rule { flex: 1; height: 1px; background: #d8d5cd; }
        .sgn-or { font-size: 12px; color: #6e6459; }
        .sgn-form { display: flex; flex-direction: column; gap: 24px; }
        .sgn-fields { display: flex; flex-direction: column; gap: 16px; }
        .sgn-label { display: block; font-size: 14px; line-height: 20px; font-weight: 500; color: #4a4a46; margin-bottom: 8px; }
        .sgn-err { margin: 8px 0 0; font-size: 13px; color: #c93822; }
        .sgn-hint { margin: 8px 0 0; font-size: 13px; color: #6e6459; }
        .sgn-checks { display: flex; flex-direction: column; gap: 12px; }
        .sgn-check { display: flex; align-items: flex-start; gap: 10px; font-size: 14px; line-height: 20px; color: #4a4a46; }
        .sgn-check input {
          -webkit-appearance: none;
          appearance: none;
          margin-top: 2px;
          width: 16px;
          height: 16px;
          flex-shrink: 0;
          border: 1px solid rgba(0, 0, 0, 0.2);
          border-radius: 4px;
          background: #fff;
          cursor: pointer;
          position: relative;
        }
        .sgn-check input:checked {
          background: #D04305;
          border-color: #D04305;
        }
        .sgn-check input:checked::after {
          content: "";
          position: absolute;
          left: 5px;
          top: 2px;
          width: 4px;
          height: 8px;
          border: solid #fff;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }
        .sgn-check a { color: #241c12; text-decoration: underline; }
        .sgn-foot { margin: 24px 0 0; font-size: 14px; line-height: 20px; color: #5a5a55; }
        .sgn-foot a { color: #241c12; text-decoration: underline; }
      `}</style>
    </div>
  );
}
