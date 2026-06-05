import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bell, BadgeCheck, Sparkles, Wallet, Star, ArrowRight } from "lucide-react";
import { lookupReferral, type ReferralLookup } from "@/lib/referral/lookup.functions";
import { setReferralAttribution, normalizeReferralCode } from "@/lib/referral/attribution";
import { supabase } from "@/integrations/supabase/client";
import { Logo, LogoMark } from "@/components/brand/Logo";

export const Route = createFileRoute("/r/$code")({
  ssr: "data-only",
  loader: async ({ params }): Promise<ReferralLookup> => {
    const norm = normalizeReferralCode(params.code);
    if (!norm) return { valid: false, expired: false, referrerName: null };
    try {
      return await lookupReferral({ data: { code: norm } });
    } catch {
      return { valid: false, expired: false, referrerName: null };
    }
  },
  head: ({ params, loaderData }) => {
    const personalised = loaderData?.valid && loaderData.referrerName
      ? `${loaderData.referrerName} invited you to Nook`
      : "You're invited to Nook";
    return {
      meta: [
        { title: `${personalised} — +1 free week of Premium` },
        {
          name: "description",
          content: "Real-time apartment alerts for the US rental market. Claim your free week of Nook Premium.",
        },
        { name: "robots", content: "noindex, nofollow" },
        { property: "og:title", content: `${personalised} — Nook` },
        {
          property: "og:description",
          content: "Real-time apartment alerts. Claim your free week of Nook Premium.",
        },
        { property: "og:url", content: `https://thenook.rent/r/${params.code}` },
      ],
    };
  },
  component: ReferralLandingPage,
});

function ReferralLandingPage() {
  const { code } = Route.useParams();
  const data = Route.useLoaderData();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  const valid = !!data?.valid;
  const referrerName = data?.referrerName ?? null;

  // Persist attribution as soon as the page loads (cookie + storage).
  useEffect(() => {
    if (valid) setReferralAttribution(code);
  }, [valid, code]);

  // Detect logged-in user to prevent self-referral framing.
  useEffect(() => {
    let cancelled = false;
    supabase.auth.getUser().then(({ data: u }) => {
      if (!cancelled) setIsLoggedIn(!!u.user);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const goSignup = () => {
    if (valid) setReferralAttribution(code);
    navigate({ to: "/signup" });
  };

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-charcoal-950/8">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 h-16 flex items-center">
          <Link to="/" className="flex items-center gap-2.5">
            <LogoMark size={28} />
            <Logo className="text-lg" />
          </Link>
        </div>
      </header>

      <main className="px-6 py-10 sm:py-16">
        <div className="max-w-[660px] mx-auto">
          <div className="bg-paper-elevated border border-charcoal-200/60 rounded-[24px] p-8 sm:p-10 shadow-[0_1px_2px_rgba(26,26,24,.03),0_8px_24px_rgba(26,26,24,.04)]">
            {isLoggedIn ? (
              <LoggedInState />
            ) : valid ? (
              <ValidState referrerName={referrerName} onCta={goSignup} />
            ) : (
              <FallbackState onCta={goSignup} />
            )}
          </div>

          <p className="mt-6 text-center text-[12.5px] text-charcoal-500 leading-relaxed">
            <em className="font-display italic text-charcoal-700">Where home finds you.</em>
            <br />
            Nook is operated by Zentaro Systems Ltd · US rentals, NYC & LA
          </p>
        </div>
      </main>
    </div>
  );
}

/* ---------- States ---------- */

function ValidState({
  referrerName,
  onCta,
}: {
  referrerName: string | null;
  onCta: () => void;
}) {
  const friendLabel = referrerName ?? "A friend";
  const friendPossessive = referrerName ? `${referrerName} gets` : "Your friend gets";

  return (
    <>
      <div className="flex items-center gap-2 text-[12px] font-mono uppercase tracking-[0.08em] text-sage-900 mb-[18px]">
        <Sparkles className="h-[15px] w-[15px]" strokeWidth={1.75} />
        {friendLabel} invited you to Nook
      </div>

      <h1 className="font-display text-[32px] sm:text-[38px] leading-[1.1] font-semibold text-charcoal-950 mb-3.5">
        You've got{" "}
        <em className="not-italic font-semibold text-sage-500">+1 free week</em>{" "}
        of Premium.
      </h1>

      <p className="text-[16px] leading-[1.55] text-charcoal-700 mb-[26px]">
        Nook watches the US rental market 24/7 and emails you the moment a place matches —
        with verified rent-stabilization, no-fee filters, and Wren AI to help you decide.
      </p>

      <div className="flex items-center gap-4 bg-sage-100/60 border border-sage-300/50 rounded-2xl p-[18px_20px] mb-[26px]">
        <div className="flex-none h-11 w-11 rounded-full bg-paper-elevated border border-sage-300/60 flex items-center justify-center">
          <Star className="h-5 w-5 text-sage-900 fill-sage-900" strokeWidth={1.5} />
        </div>
        <div className="min-w-0">
          <b className="block font-display font-semibold text-[17px] text-charcoal-950">
            7 days of Premium, free
          </b>
          <span className="text-[14px] text-charcoal-500">
            No credit card required. {friendPossessive} a free week too.
          </span>
        </div>
      </div>

      <ValuePills />

      <button
        type="button"
        onClick={onCta}
        className="block w-full text-center bg-charcoal-950 text-paper text-[16px] font-semibold py-4 rounded-full hover:bg-charcoal-800 transition-colors"
      >
        Claim your free week <ArrowRight className="inline h-4 w-4 ml-1 -mt-0.5" strokeWidth={2} />
      </button>
      <p className="text-center text-[13px] text-charcoal-500 mt-3">
        Takes 30 seconds · No card needed · Cancel anytime
      </p>

      <div className="border-t border-charcoal-200/60 mt-7 pt-5 text-center text-[14px] text-charcoal-500 leading-[1.6]">
        Sign up and your 7 days of Premium start right away.
        <br />
        Once you're in, {referrerName ?? "your friend"} gets +7 days too.
      </div>
    </>
  );
}

function FallbackState({ onCta }: { onCta: () => void }) {
  return (
    <>
      <div className="flex items-center gap-2 text-[12px] font-mono uppercase tracking-[0.08em] text-sage-900 mb-[18px]">
        <Sparkles className="h-[15px] w-[15px]" strokeWidth={1.75} />
        Welcome to Nook
      </div>
      <h1 className="font-display text-[32px] sm:text-[38px] leading-[1.1] font-semibold text-charcoal-950 mb-3.5">
        Find your next place{" "}
        <em className="not-italic font-semibold text-sage-500">faster</em>.
      </h1>
      <p className="text-[16px] leading-[1.55] text-charcoal-700 mb-[26px]">
        Nook watches the US rental market 24/7 and emails you the moment a place matches —
        with verified rent-stabilization, no-fee filters, and Wren AI to help you decide.
      </p>

      <ValuePills />

      <button
        type="button"
        onClick={onCta}
        className="block w-full text-center bg-charcoal-950 text-paper text-[16px] font-semibold py-4 rounded-full hover:bg-charcoal-800 transition-colors"
      >
        Get started <ArrowRight className="inline h-4 w-4 ml-1 -mt-0.5" strokeWidth={2} />
      </button>
      <p className="text-center text-[13px] text-charcoal-500 mt-3">
        Takes 30 seconds · No credit card required
      </p>
    </>
  );
}

function LoggedInState() {
  return (
    <>
      <div className="flex items-center gap-2 text-[12px] font-mono uppercase tracking-[0.08em] text-sage-900 mb-[18px]">
        <BadgeCheck className="h-[15px] w-[15px]" strokeWidth={1.75} />
        You're already on Nook
      </div>
      <h1 className="font-display text-[32px] sm:text-[38px] leading-[1.1] font-semibold text-charcoal-950 mb-3.5">
        Glad to see you back{" "}
        <em className="not-italic font-semibold text-sage-500">🙂</em>
      </h1>
      <p className="text-[16px] leading-[1.55] text-charcoal-700 mb-[26px]">
        Referral credit only applies to new accounts. If you'd like to invite friends and earn free
        weeks of Premium, your own link lives on your Referrals page.
      </p>
      <Link
        to="/preferences/referrals"
        className="block w-full text-center bg-charcoal-950 text-paper text-[16px] font-semibold py-4 rounded-full hover:bg-charcoal-800 transition-colors"
      >
        Go to my referrals <ArrowRight className="inline h-4 w-4 ml-1 -mt-0.5" strokeWidth={2} />
      </Link>
    </>
  );
}

/* ---------- Pills ---------- */

function ValuePills() {
  const pills = [
    { icon: Bell, label: "Real-time alerts" },
    { icon: BadgeCheck, label: "Verified rent-stabilized" },
    { icon: Sparkles, label: "Wren AI" },
    { icon: Wallet, label: "No-broker-fee filter" },
  ];
  return (
    <div className="flex flex-wrap gap-2.5 mb-[30px]">
      {pills.map(({ icon: Icon, label }) => (
        <span
          key={label}
          className="inline-flex items-center gap-1.5 text-[14px] text-charcoal-700 bg-paper border border-charcoal-200/70 rounded-full px-[13px] py-2"
        >
          <Icon className="h-[14px] w-[14px] text-sage-900" strokeWidth={1.75} />
          {label}
        </span>
      ))}
    </div>
  );
}
