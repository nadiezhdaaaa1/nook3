import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";

import logoSvg from "@/assets/Nook_Green.svg.asset.json";
import { OriginButton } from "@/components/ui/origin-button";
import { disableAllNotifications } from "@/lib/preferences/notifications";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/preferences")({
  validateSearch: z.object({ token: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Email preferences — Nook" },
      {
        name: "description",
        content: "Stop all Nook emails, or log in to switch to a weekly digest instead.",
      },
      { property: "og:title", content: "Email preferences — Nook" },
      {
        property: "og:description",
        content: "Stop all Nook emails, or log in to switch to a weekly digest instead.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: UnsubscribePage,
});

function UnsubscribePage() {
  const navigate = useNavigate();
  const [done, setDone] = useState(false);

  const unsubscribe = () => {
    // The page itself is the confirmation step — show the done state right away.
    setDone(true);
    void (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session) disableAllNotifications();
      } catch {
        // No session (prototype / signed-out link): nothing to apply locally.
      }
    })();
  };

  return (
    <main className="min-h-screen bg-paper px-6 py-16">
      <div className="mx-auto w-full max-w-[448px]">
        <Link to="/" className="inline-flex" aria-label="Nook home">
          <img src={logoSvg.url} alt="Nook" className="h-6 w-auto" />
        </Link>

        {done ? (
          <div className="mt-12">
            <h1 className="font-display text-[30px] font-bold leading-[1.1] tracking-[-0.02em] text-charcoal-950">
              Done - no more emails from us
            </h1>
            <p className="mt-4 text-[18px] leading-relaxed text-charcoal-600">
              We won't email you alerts or updates anymore. Your searches are still saved — turn
              alerts back on anytime in your account.
            </p>
            <p className="mt-6 text-sm text-charcoal-600">
              <Link to="/login" className="font-semibold text-charcoal-950 underline">
                Log in
              </Link>{" "}
              to manage notifications
            </p>
          </div>
        ) : (
          <div className="mt-12">
            <h1 className="font-display text-[30px] font-bold leading-[1.1] tracking-[-0.02em] text-charcoal-950">
              Stop all Nook emails
            </h1>
            <p className="mt-4 text-[18px] leading-relaxed text-charcoal-600">
              You'll stop receiving match alerts, updates, and offers. Account and billing emails
              still arrive when needed.
            </p>

            <OriginButton
              variant="main"
              size="big"
              className="mt-8 h-14 w-full rounded-[12px]"
              onClick={unsubscribe}
            >
              Unsubscribe from everything
            </OriginButton>
            <p className="mt-3 text-center text-sm text-charcoal-600">Takes effect immediately</p>

            <div className="my-8 flex items-center gap-4">
              <span className="h-px flex-1 bg-black/10" />
              <span className="text-[12px] text-charcoal-500">or</span>
              <span className="h-px flex-1 bg-black/10" />
            </div>

            <h2 className="font-display text-[20px] font-semibold leading-snug text-charcoal-950">
              Too many emails? A weekly digest might be enough — log in to switch.
            </h2>

            <OriginButton
              variant="tertiary"
              size="big"
              className="mt-6 h-14 w-full rounded-[12px]"
              onClick={() => navigate({ to: "/login" })}
            >
              Log in to manage notifications
            </OriginButton>
          </div>
        )}
      </div>
    </main>
  );
}
