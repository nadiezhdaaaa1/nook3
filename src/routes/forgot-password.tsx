import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { emailSchema } from "@/lib/validation/schemas";
import { Logo, LogoMark } from "@/components/brand/Logo";

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
    <div className="min-h-screen bg-paper flex flex-col">
      <header className="border-b border-charcoal-950/8">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 h-16 flex items-center">
          <Link to="/" className="flex items-center gap-2.5">
            <LogoMark size={28} />
            <Logo className="text-lg" />
          </Link>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <h1 className="font-display text-3xl font-bold text-charcoal-950">Reset your password</h1>
          <p className="mt-2 text-sm text-charcoal-600">
            Enter the email tied to your Nook account and we'll send you a reset link.
          </p>

          {sent ? (
            <div className="mt-6 p-4 rounded-md border border-charcoal-200 bg-charcoal-950/5">
              <p className="text-sm text-charcoal-700">
                If an account exists for <span className="font-semibold">{email}</span>, you'll
                receive a password reset link shortly. It expires in 1 hour.
              </p>
              <p className="mt-3 text-sm">
                <Link to="/login" className="font-semibold text-charcoal-950 underline">
                  Back to sign in
                </Link>
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
              <div>
                <label className="text-sm font-medium text-charcoal-700">Email</label>
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={!!error}
                  placeholder="you@email.com"
                  className="mt-1 w-full h-11 px-3 rounded-md border border-charcoal-200 bg-paper text-sm focus:border-charcoal-950 outline-none"
                />
                {error && <p className="mt-1 text-xs text-danger">{error}</p>}
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full h-11 rounded-md bg-charcoal-950 text-paper text-sm font-semibold hover:bg-charcoal-800 disabled:opacity-60"
              >
                {submitting ? "Sending…" : "Send reset link"}
              </button>
              <p className="text-sm text-charcoal-600">
                Remembered it?{" "}
                <Link to="/login" className="font-semibold text-charcoal-950 underline">
                  Back to sign in
                </Link>
              </p>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
