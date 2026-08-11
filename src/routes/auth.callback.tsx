import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
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
      if (session) go();
    });

    void (async () => {
      // Give the SDK a moment to persist the session from the OAuth response.
      for (let i = 0; i < 40 && !cancelled; i++) {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
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
