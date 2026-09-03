import { useEffect, useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { OriginButton } from "@/components/ui/origin-button";
import { Input } from "@/components/ui/input";
import googleIcon from "@/assets/Google_Favicon_2025.svg.asset.json";
import {
  getReferralAttribution,
  sendPasswordResetEmail,
  signInWithEmailPassword,
  signUpWithEmailPassword,
  startGoogleOAuth,
  validateCredentials,
} from "@/lib/auth/authActions";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics";

export type RegistrationSource =
  | "landing_card"
  | "pricing_page"
  | "funnel_param"
  | "onboarding_pricing";

interface RegistrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Where /auth/callback must land after the Google full-page redirect. */
  postAuthPath: string;
  /** Called once a session exists; the OPENER decides where to go next. */
  onAuthed: () => void;
  source: RegistrationSource;
  plan?: string | null;
  cycle?: string;
}

/**
 * Account creation as a pop-up. Same functionality as the /signup page (which
 * stays reachable for direct navigation) plus an inline sign-in mode, so a
 * returning user never loses the plan they just picked.
 */
export function RegistrationModal({
  open,
  onOpenChange,
  postAuthPath,
  onAuthed,
  source,
  plan,
  cycle,
}: RegistrationModalProps) {
  const [mode, setMode] = useState<"signup" | "signin">("signup");
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
  const [resetSent, setResetSent] = useState(false);
  const [referralCode, setReferralCode] = useState<string | null>(null);

  /**
   * The commit marker is only meaningful while a full-page OAuth/email redirect
   * is in flight. Any other outcome must clear it, or a later unrelated pass
   * through /auth/callback in this tab would commit onboarding again.
   */
  const clearCommitMarker = () => {
    try {
      sessionStorage.removeItem("nook:postAuthCommitOnboarding");
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    if (!open) {
      clearCommitMarker();
      return;
    }
    setReferralCode(getReferralAttribution());
    setMode("signup");
    setSent(false);
    setResetSent(false);
    setErrors({});
    setSubmitting(false);
  }, [open]);

  const succeed = () => {
    clearCommitMarker();
    trackEvent(ANALYTICS_EVENTS.registrationModalAuthed, { source, plan, cycle, mode });
    onOpenChange(false);
    onAuthed();
  };


  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const {
      errors: credErrors,
      email: cleanEmail,
      password: cleanPassword,
    } = validateCredentials(email, password);
    const next: typeof errors = { ...credErrors };
    if (mode === "signup" && !acceptTerms) {
      next.terms = "Please accept the Terms and Privacy Policy to continue.";
    }
    setErrors(next);
    if (Object.keys(next).length) return;

    setSubmitting(true);
    if (mode === "signin") {
      const res = await signInWithEmailPassword(cleanEmail!, cleanPassword!);
      setSubmitting(false);
      if (res.error) {
        setErrors({ form: res.error });
        toast.error("Sign in failed", { description: res.error });
        return;
      }
      toast.success("Welcome back");
      succeed();
      return;
    }

    try {
      sessionStorage.setItem("nook:postAuthPath", postAuthPath);
      // Only the emailed confirmation link comes back through /auth/callback.
      if (source === "onboarding_pricing")
        sessionStorage.setItem("nook:postAuthCommitOnboarding", "1");
    } catch {
      /* ignore */
    }
    const out = await signUpWithEmailPassword({
      email: cleanEmail!,
      password: cleanPassword!,
      marketing,
      source: "signup_email_modal",
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    });
    setSubmitting(false);
    if (out.kind === "error") {
      clearCommitMarker();
      setErrors({ form: out.message });
      toast.error("Sign up failed", { description: out.message });
      return;
    }
    if (out.kind === "confirmation-sent") {
      setSent(true);
      toast.success("Check your email", { description: "We sent a confirmation link." });
      return;
    }
    toast.success("Account created");
    succeed();
  }

  async function onGoogle() {
    if (mode === "signup" && !acceptTerms) {
      setErrors({ terms: "Please accept the Terms and Privacy Policy to continue." });
      return;
    }
    if (source === "onboarding_pricing" && mode === "signup") {
      try {
        sessionStorage.setItem("nook:postAuthCommitOnboarding", "1");
      } catch {
        /* ignore */
      }
    }
    setSubmitting(true);
    const out = await startGoogleOAuth({
      marketing,
      source: mode === "signup" ? "signup_google_modal" : "signin_google_modal",
      postAuthPath,
      isSignUp: mode === "signup",
    });
    if (out.kind === "redirected") return; // the callback route resumes the flow
    setSubmitting(false);
    if (out.kind === "error") {
      clearCommitMarker();
      toast.error("Google sign in failed", { description: out.message });
      return;
    }
    // In-session (popup) success: the opener commits, so the marker must go.
    succeed();
  }


  async function handleForgotPassword() {
    const out = await sendPasswordResetEmail(email);
    if (out.error) {
      setErrors({ email: out.error });
      return;
    }
    setResetSent(true);
    toast.success("Check your email", { description: "We sent a password reset link." });
  }

  const isSignup = mode === "signup";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92dvh] max-w-[440px] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="font-display text-[24px] font-bold leading-[30px] text-charcoal-950">
            {sent ? "Check your email" : isSignup ? "Create your account" : "Welcome back"}
          </DialogTitle>
          <DialogDescription className="text-[14px] text-charcoal-600">
            {sent
              ? "Open the link we just sent to finish signing up."
              : isSignup
                ? "One step before checkout — we keep your plan and your search."
                : "Sign in to continue with the plan you picked."}
          </DialogDescription>
        </DialogHeader>

        {sent ? (
          <div className="rounded-[12px] border border-black/20 bg-paper p-4 text-[14px] text-charcoal-700">
            We sent a confirmation link to <strong>{email}</strong>.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {isSignup && referralCode && (
              <div className="inline-flex items-center gap-2 self-start rounded-full border border-[rgba(106,130,10,0.35)] bg-[rgba(106,130,10,0.08)] px-3 py-1.5 text-[13px] text-[#4d5f08]">
                <Sparkles className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                Invite applied · +7 days of Premium on us
              </div>
            )}

            <OriginButton
              type="button"
              variant="tertiary"
              size="big"
              className="w-full"
              disabled={submitting}
              onClick={onGoogle}
            >
              <img src={googleIcon.url} alt="" width={24} height={24} aria-hidden="true" />
              <span>Continue with Google</span>
            </OriginButton>

            <div className="flex items-center gap-3">
              <span className="h-px flex-1 bg-[#d8d5cd]" />
              <span className="text-[12px] text-[#6e6459]">or</span>
              <span className="h-px flex-1 bg-[#d8d5cd]" />
            </div>

            <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
              <div>
                <label
                  className="mb-2 block text-[14px] font-medium text-charcoal-700"
                  htmlFor="rm-email"
                >
                  Email
                </label>
                <Input
                  id="rm-email"
                  type="email"
                  autoComplete="email"
                  size="big"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={!!errors.email}
                />
                {errors.email && <p className="mt-2 text-[13px] text-[#c93822]">{errors.email}</p>}
              </div>

              <div>
                <label
                  className="mb-2 block text-[14px] font-medium text-charcoal-700"
                  htmlFor="rm-password"
                >
                  Password
                </label>
                <Input
                  id="rm-password"
                  type="password"
                  autoComplete={isSignup ? "new-password" : "current-password"}
                  size="big"
                  placeholder={isSignup ? "At least 8 characters" : "Your password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-invalid={!!errors.password}
                />
                {errors.password ? (
                  <p className="mt-2 text-[13px] text-[#c93822]">{errors.password}</p>
                ) : isSignup ? (
                  <p className="mt-2 text-[13px] text-[#6e6459]">At least 8 characters.</p>
                ) : null}
                {!isSignup && (
                  <p className="mt-2 text-[13px]">
                    {resetSent ? (
                      <span className="text-charcoal-600">Reset link sent — check your email.</span>
                    ) : (
                      <button
                        type="button"
                        className="cursor-pointer text-charcoal-950 underline"
                        onClick={() => void handleForgotPassword()}
                        disabled={submitting}
                      >
                        Forgot your password?
                      </button>
                    )}
                  </p>
                )}
              </div>

              {isSignup && (
                <div className="flex flex-col gap-3">
                  <label className="flex items-start gap-2.5 text-[14px] leading-5 text-charcoal-700">
                    <input
                      type="checkbox"
                      className="rm-check"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      aria-invalid={!!errors.terms}
                    />
                    <span>
                      I agree to the{" "}
                      <Link to="/terms" className="text-charcoal-950 underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link to="/privacy" className="text-charcoal-950 underline">
                        Privacy Policy
                      </Link>
                      .
                    </span>
                  </label>
                  {errors.terms && <p className="text-[13px] text-[#c93822]">{errors.terms}</p>}
                  <label className="flex items-start gap-2.5 text-[14px] leading-5 text-charcoal-700">
                    <input
                      type="checkbox"
                      className="rm-check"
                      checked={marketing}
                      onChange={(e) => setMarketing(e.target.checked)}
                    />
                    <span>
                      Send me product updates and apartment-hunting tips. You can unsubscribe
                      anytime.
                    </span>
                  </label>
                </div>
              )}

              {errors.form && <p className="text-[13px] text-[#c93822]">{errors.form}</p>}

              <OriginButton
                type="submit"
                variant="main"
                size="big"
                className="w-full"
                disabled={submitting}
              >
                {submitting
                  ? isSignup
                    ? "Creating account…"
                    : "Signing in…"
                  : isSignup
                    ? "Create account and continue"
                    : "Sign in and continue"}
              </OriginButton>
            </form>

            <p className="m-0 text-[14px] text-charcoal-600">
              {isSignup ? "Already have an account? " : "New to Nook? "}
              <button
                type="button"
                className="cursor-pointer text-charcoal-950 underline"
                onClick={() => {
                  setErrors({});
                  setResetSent(false);
                  setMode(isSignup ? "signin" : "signup");
                }}
              >
                {isSignup ? "Sign in" : "Create an account"}
              </button>
            </p>
          </div>
        )}

        <style>{`
          .rm-check {
            -webkit-appearance: none; appearance: none; margin-top: 2px;
            width: 16px; height: 16px; flex-shrink: 0;
            border: 1px solid rgba(0,0,0,0.2); border-radius: 4px;
            background: #fff; cursor: pointer; position: relative;
          }
          .rm-check:checked { background: #d66c38; border-color: #d66c38; }
          .rm-check:checked::after {
            content: ""; position: absolute; left: 5px; top: 2px;
            width: 4px; height: 8px; border: solid #fff; border-width: 0 2px 2px 0;
            transform: rotate(45deg);
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
}
