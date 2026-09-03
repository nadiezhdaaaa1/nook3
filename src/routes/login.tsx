import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  signInWithEmailPassword,
  startGoogleOAuth,
  validateCredentials,
} from "@/lib/auth/authActions";
import { OriginButton } from "@/components/ui/origin-button";
import { Input } from "@/components/ui/input";
import logoSvg from "@/assets/Nook_Green.svg.asset.json";
import googleIcon from "@/assets/Google_Favicon_2025.svg.asset.json";

type Search = { redirect?: string };

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  beforeLoad: async ({ search }) => {
    if (typeof window === "undefined") return;
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      throw redirect({ to: search.redirect ?? "/home" });
    }
  },
  head: () => ({
    meta: [
      { title: "Sign in — Nook" },
      {
        name: "description",
        content:
          "Sign in to your Nook account to manage your real-time apartment alerts, update your search preferences, and view your latest matches.",
      },
      { property: "og:title", content: "Sign in — Nook" },
      {
        property: "og:description",
        content:
          "Sign in to your Nook account to manage your real-time apartment alerts, update your search preferences, and view your latest matches.",
      },
      { property: "og:url", content: "https://thenook.rent/login" },
    ],
    links: [{ rel: "canonical", href: "https://thenook.rent/login" }],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { redirect: redirectTo } = Route.useSearch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const {
      errors: credErrors,
      email: cleanEmail,
      password: cleanPassword,
    } = validateCredentials(email, password);
    setErrors(credErrors);
    if (Object.keys(credErrors).length) return;

    setSubmitting(true);
    const { error } = await signInWithEmailPassword(cleanEmail!, cleanPassword!);
    setSubmitting(false);
    if (error) {
      setErrors({ form: error });
      toast.error("Sign in failed", { description: error });
      return;
    }
    toast.success("Welcome back");
    navigate({ to: redirectTo ?? "/home", replace: true });
  }

  async function onGoogle() {
    setSubmitting(true);
    const out = await startGoogleOAuth({
      marketing: false,
      source: "signin_google",
      postAuthPath: redirectTo ?? "/home",
      isSignUp: false,
    });

    if (out.kind === "redirected") return;
    setSubmitting(false);
    if (out.kind === "error") {
      toast.error("Google sign in failed", { description: out.message });
      return;
    }
    navigate({ to: redirectTo ?? "/home", replace: true });
  }

  return (
    <div className="sgn-page">
      <div className="sgn-col">
        <Link to="/" className="sgn-logo" aria-label="Nook home">
          <img src={logoSvg.url} alt="Nook" width={81} height={28} />
        </Link>

        <div className="sgn-head">
          <h1 className="sgn-title">Welcome back</h1>
          <p className="sgn-sub">Sign in to manage your alerts.</p>
        </div>

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
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!!errors.password}
                placeholder="Your password"
                size="big"
              />
              {errors.password && <p className="sgn-err">{errors.password}</p>}
            </div>
          </div>

          {errors.form && <p className="sgn-err">{errors.form}</p>}

          <OriginButton
            type="submit"
            variant="main"
            size="big"
            disabled={submitting}
            className="w-full"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </OriginButton>

          <div className="sgn-forgot">
            <Link to="/forgot-password">Forgot your password?</Link>
          </div>
        </form>

        <p className="sgn-foot">
          No account?{" "}
          <Link to="/signup" search={redirectTo ? { redirect: redirectTo } : undefined}>
            Create one
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
        .sgn-divider { padding: 20px 0; display: flex; align-items: center; gap: 12px; }

        .sgn-rule { flex: 1; height: 1px; background: #d8d5cd; }
        .sgn-or { font-size: 12px; color: #6e6459; }
        .sgn-form { display: flex; flex-direction: column; gap: 24px; }
        .sgn-fields { display: flex; flex-direction: column; gap: 16px; }
        .sgn-label { display: block; font-size: 14px; line-height: 20px; font-weight: 500; color: #4a4a46; margin-bottom: 8px; }
        .sgn-err { margin: 8px 0 0; font-size: 13px; color: #c93822; }
        .sgn-forgot { text-align: right; }

        .sgn-forgot a { font-size: 14px; line-height: 20px; color: #241c12; text-decoration: underline; }
        .sgn-foot { margin: 24px 0 0; font-size: 14px; line-height: 20px; color: #5a5a55; }
        .sgn-foot a { color: #241c12; text-decoration: underline; }
      `}</style>
    </div>
  );
}
