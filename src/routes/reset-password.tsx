import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { passwordSchema } from "@/lib/validation/schemas";
import { Logo, LogoMark } from "@/components/brand/Logo";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Set a new password — Nook" },
      { name: "description", content: "Choose a new password for your Nook account." },
      { name: "robots", content: "noindex,nofollow" },
      { property: "og:url", content: "https://thenook.rent/reset-password" },
    ],
    links: [{ rel: "canonical", href: "https://thenook.rent/reset-password" }],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{ password?: string; confirm?: string; form?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Supabase auto-exchanges the recovery code from the URL hash on load.
    // We just wait for a session to confirm it worked.
    let cancelled = false;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (cancelled) return;
      if (data.session) {
        setReady(true);
      } else {
        // Listen briefly in case Supabase is still processing the URL hash.
        const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
          if (session && (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN")) {
            setReady(true);
            sub.subscription.unsubscribe();
          }
        });
        setTimeout(() => {
          if (!cancelled) {
            setReady((r) => {
              if (!r) setInvalid(true);
              return r;
            });
            sub.subscription.unsubscribe();
          }
        }, 1500);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const pwRes = passwordSchema.safeParse(password);
    const nextErrors: typeof errors = {};
    if (!pwRes.success) nextErrors.password = pwRes.error.issues[0]?.message;
    if (password !== confirm) nextErrors.confirm = "Passwords don't match.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password: pwRes.data! });
    setSubmitting(false);
    if (error) {
      setErrors({ form: error.message });
      toast.error("Could not update password", { description: error.message });
      return;
    }
    toast.success("Password updated");
    navigate({ to: "/preferences", replace: true });
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
          <h1 className="font-display text-3xl font-bold text-charcoal-950">Set a new password</h1>

          {invalid ? (
            <div className="mt-6 p-4 rounded-md border border-charcoal-200 bg-charcoal-950/5">
              <p className="text-sm text-charcoal-700">
                This reset link is invalid or has expired. Request a new one below.
              </p>
              <p className="mt-3 text-sm">
                <Link
                  to="/forgot-password"
                  className="font-semibold text-charcoal-950 underline"
                >
                  Request new link
                </Link>
              </p>
            </div>
          ) : !ready ? (
            <p className="mt-6 text-sm text-charcoal-600">Verifying reset link…</p>
          ) : (
            <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
              <div>
                <label className="text-sm font-medium text-charcoal-700">New password</label>
                <input
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-invalid={!!errors.password}
                  placeholder="At least 8 characters"
                  className="mt-1 w-full h-11 px-3 rounded-md border border-charcoal-200 bg-paper text-sm focus:border-charcoal-950 outline-none"
                />
                {errors.password && <p className="mt-1 text-xs text-danger">{errors.password}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-charcoal-700">Confirm new password</label>
                <input
                  type="password"
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  aria-invalid={!!errors.confirm}
                  placeholder="Re-enter password"
                  className="mt-1 w-full h-11 px-3 rounded-md border border-charcoal-200 bg-paper text-sm focus:border-charcoal-950 outline-none"
                />
                {errors.confirm && <p className="mt-1 text-xs text-danger">{errors.confirm}</p>}
              </div>
              {errors.form && <p className="text-sm text-danger">{errors.form}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="w-full h-11 rounded-md bg-charcoal-950 text-paper text-sm font-semibold hover:bg-charcoal-800 disabled:opacity-60"
              >
                {submitting ? "Updating…" : "Update password"}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
