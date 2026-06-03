import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { emailSchema, passwordSchema } from "@/lib/validation/schemas";
import { Logo, LogoMark } from "@/components/brand/Logo";

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
      { name: "description", content: "Sign in to manage your apartment alerts." },,
      { property: "og:url", content: "https://nook3.lovable.app/login" }
    ],
    links: [{ rel: "canonical", href: "https://nook3.lovable.app/login" }],
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
          <h1 className="font-display text-3xl font-bold text-charcoal-950">Welcome back</h1>
          <p className="mt-2 text-sm text-charcoal-600">Sign in to manage your alerts.</p>

          <button
            type="button"
            onClick={onGoogle}
            disabled={submitting}
            className="mt-6 w-full h-11 inline-flex items-center justify-center gap-2 rounded-md border border-charcoal-200 bg-paper text-sm font-semibold text-charcoal-950 hover:bg-charcoal-950/5 disabled:opacity-60"
          >
            Continue with Google
          </button>

          <div className="my-5 flex items-center gap-3 text-xs text-charcoal-500">
            <div className="flex-1 h-px bg-charcoal-200" /> or <div className="flex-1 h-px bg-charcoal-200" />
          </div>

          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <div>
              <label className="text-sm font-medium text-charcoal-700">Email</label>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!errors.email}
                placeholder="you@email.com"
                className="mt-1 w-full h-11 px-3 rounded-md border border-charcoal-200 bg-paper text-sm focus:border-charcoal-950 outline-none"
              />
              {errors.email && <p className="mt-1 text-xs text-danger">{errors.email}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-charcoal-700">Password</label>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!!errors.password}
                placeholder="Your password"
                className="mt-1 w-full h-11 px-3 rounded-md border border-charcoal-200 bg-paper text-sm focus:border-charcoal-950 outline-none"
              />
              {errors.password && <p className="mt-1 text-xs text-danger">{errors.password}</p>}
            </div>
            {errors.form && <p className="text-sm text-danger">{errors.form}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="w-full h-11 rounded-md bg-charcoal-950 text-paper text-sm font-semibold hover:bg-charcoal-800 disabled:opacity-60"
            >
              {submitting ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-sm text-charcoal-600">
            No account?{" "}
            <Link
              to="/signup"
              search={redirectTo ? { redirect: redirectTo } : undefined}
              className="font-semibold text-charcoal-950 underline"
            >
              Create one
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
