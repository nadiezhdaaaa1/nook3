import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { emailSchema, passwordSchema } from "@/lib/validation/schemas";
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
      throw redirect({ to: search.redirect ?? "/preferences" });
    }
  },
  head: () => ({
    meta: [
      { title: "Sign in — Nook" },
      { name: "description", content: "Sign in to manage your apartment alerts." },
      { property: "og:url", content: "https://thenook.rent/login" }
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
    const emailRes = emailSchema.safeParse(email);
    const pwRes = passwordSchema.safeParse(password);
    const nextErrors: typeof errors = {};
    if (!emailRes.success) nextErrors.email = emailRes.error.issues[0]?.message;
    if (!pwRes.success) nextErrors.password = pwRes.error.issues[0]?.message;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: emailRes.data!,
      password: pwRes.data!,
    });
    setSubmitting(false);
    if (error) {
      setErrors({ form: error.message });
      toast.error("Sign in failed", { description: error.message });
      return;
    }
    toast.success("Welcome back");
    navigate({ to: redirectTo ?? "/preferences", replace: true });
  }

  async function onGoogle() {
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
          <h1 className="sgn-title">Welcome back</h1>
          <p className="sgn-sub">Sign in to manage your alerts.</p>
        </div>

        <button type="button" onClick={onGoogle} disabled={submitting} className="sgn-google">
          <img src={googleIcon.url} alt="" width={24} height={24} aria-hidden="true" />
          <span>Continue with Google</span>
        </button>


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
              <input
                id="sgn-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!errors.email}
                placeholder="you@email.com"
                className="sgn-input"
              />
              {errors.email && <p className="sgn-err">{errors.email}</p>}
            </div>
            <div className="sgn-field">
              <label className="sgn-label" htmlFor="sgn-password">
                Password
              </label>
              <input
                id="sgn-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!!errors.password}
                placeholder="Your password"
                className="sgn-input"
              />
              {errors.password && <p className="sgn-err">{errors.password}</p>}
            </div>
          </div>

          {errors.form && <p className="sgn-err">{errors.form}</p>}

          <button type="submit" disabled={submitting} className="sgn-submit">
            {submitting ? "Signing in…" : "Sign in"}
          </button>

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
        .sgn-google {
          width: 100%;
          height: 56px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: transparent;
          border: 1px solid rgba(0,0,0,0.2);
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          color: #241c12;
          cursor: pointer;
          transition: background-color .15s ease;
        }
        .sgn-google:hover { background: rgba(0,0,0,0.03); }
        .sgn-google:disabled { opacity: .6; cursor: default; }
        .sgn-divider { padding: 20px 0; display: flex; align-items: center; gap: 12px; }
        .sgn-rule { flex: 1; height: 1px; background: #d8d5cd; }
        .sgn-or { font-size: 12px; color: #6e6459; }
        .sgn-form { display: flex; flex-direction: column; gap: 24px; }
        .sgn-fields { display: flex; flex-direction: column; gap: 16px; }
        .sgn-label { display: block; font-size: 14px; line-height: 20px; font-weight: 500; color: #4a4a46; margin-bottom: 8px; }
        .sgn-input {
          width: 100%;
          height: 54px;
          padding: 0 12px;
          border-radius: 12px;
          border: 1px solid rgba(0,0,0,0.2);
          background: #ffffff;
          font-size: 14px;
          color: #241c12;
          outline: none;
        }
        .sgn-input::placeholder { color: rgba(36,28,18,0.5); }
        .sgn-input:focus-visible { border-color: #241c12; box-shadow: 0 0 0 2px #241c12; }
        .sgn-err { margin: 8px 0 0; font-size: 13px; color: #c93822; }
        .sgn-submit {
          width: 100%;
          padding: 16px 24px;
          border-radius: 12px;
          border: none;
          background: #d66c38;
          color: #ffffff;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color .15s ease;
        }
        .sgn-submit:hover { background: #c25e2d; }
        .sgn-submit:disabled { opacity: .6; cursor: default; }
        .sgn-forgot { text-align: right; }
        .sgn-forgot a { font-size: 14px; line-height: 20px; color: #241c12; text-decoration: underline; }
        .sgn-foot { margin: 24px 0 0; font-size: 14px; line-height: 20px; color: #5a5a55; }
        .sgn-foot a { color: #241c12; text-decoration: underline; }
        .sgn-page :focus-visible { outline: 2px solid #241c12; outline-offset: 2px; }
      `}</style>
    </div>
  );
}
