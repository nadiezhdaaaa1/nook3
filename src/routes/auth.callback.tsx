import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth/callback")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Signing you in — Nook" },
      { name: "description", content: "Completing your Nook sign-in." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AuthCallback,
});

function safePath(value: string | null): string {
  if (!value) return "/home";
  if (!value.startsWith("/") || value.startsWith("//")) return "/home";
  return value;
}

function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    const target = safePath(
      typeof sessionStorage !== "undefined" ? sessionStorage.getItem("nook:postAuthPath") : null,
    );

    const expected = (() => {
      try {
        return sessionStorage.getItem("nook:expectedEmail");
      } catch {
        return null;
      }
    })();

    /** A locked-email flow must reject a different Google address by name. */
    const rejectMismatch = async (email: string | null | undefined) => {
      try {
        sessionStorage.removeItem("nook:expectedEmail");
      } catch {
        /* ignore */
      }
      await supabase.auth.signOut();
      toast.error("Wrong Google account", {
        description: `That Google account is ${email ?? "another address"}. Your subscription is on ${expected} — use that account, or pick a password instead.`,
      });
      navigate({ to: "/signup", search: { redirect: target, lockEmail: 1 }, replace: true });
    };

    const go = () => {
      if (cancelled) return;
      try {
        sessionStorage.removeItem("nook:postAuthPath");
      } catch {
        /* ignore */
      }
      navigate({ to: target, replace: true });
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) return;
      if (expected && session.user.email?.toLowerCase() !== expected.toLowerCase()) {
        void rejectMismatch(session.user.email);
        return;
      }
      go();
    });

    void (async () => {
      // Give the SDK a moment to persist the session from the OAuth response.
      for (let i = 0; i < 40 && !cancelled; i++) {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          if (expected && data.session.user.email?.toLowerCase() !== expected.toLowerCase()) {
            await rejectMismatch(data.session.user.email);
            return;
          }
          go();
          return;
        }
        await new Promise((r) => setTimeout(r, 250));
      }
      if (!cancelled) navigate({ to: "/login", replace: true });
    })();

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-paper px-6">
      <p className="text-sm text-muted-foreground" aria-live="polite">
        Signing you in…
      </p>
    </div>
  );
}
