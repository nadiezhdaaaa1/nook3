import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Check,
  Gift,
  Home,
  Copy,
  Mail,
  
  Share2,
  ArrowRight,
} from "lucide-react";
import { useOnboardingStore, getReferralCode } from "@/lib/onboarding/store";
import { MoveOutModal } from "@/components/onboarding/MoveOutModal";
import { SEARCH_LIMITS, useAppStore, syncOnboardingToUser, syncOnboardingToActiveSearch } from "@/lib/store";
import { Plus, Lock } from "lucide-react";

export const Route = createFileRoute("/onboarding/success")({
  component: Success,
});

function Success() {
  const navigate = useNavigate();
  const { email, selectedPlan, trialActive, moveOut, set } =
    useOnboardingStore();
  const [moveOutOpen, setMoveOutOpen] = useState(false);
  const [referral, setReferral] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!useOnboardingStore.getState().completedAt) {
      set("completedAt", new Date().toISOString());
    }
    setReferral(getReferralCode());
    // Push account-level + active-search snapshots up to the new store.
    syncOnboardingToActiveSearch();
    syncOnboardingToUser();
  }, [set]);

  const origin =
    typeof window !== "undefined" ? window.location.origin : "https://thenook.rent";
  const shortLink = useMemo(
    () => (referral ? `thenook.rent/r/${referral}` : ""),
    [referral],
  );
  const fullLink = referral ? `https://thenook.rent/r/${referral}` : "";

  const copyRef = () => {
    if (!fullLink) return;
    navigator.clipboard?.writeText(fullLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const shareText = "I'm using Nook to track NYC rentals in real time — get an extra free week of Premium with my link:";
  
  const emailHref = `mailto:?subject=${encodeURIComponent("Try Nook with me")}&body=${encodeURIComponent(`${shareText}\n\n${fullLink}`)}`;
  const nativeShare = async () => {
    if (typeof navigator !== "undefined" && (navigator as any).share) {
      try {
        await (navigator as any).share({ title: "Nook", text: shareText, url: fullLink });
      } catch {}
    } else {
      copyRef();
    }
  };

  return (
    <div className="pb-24 lg:pb-0">
      {/* Above-fold confirmation + primary CTA */}
      <div className="text-center space-y-6 pt-2">
        <div className="mx-auto h-14 w-14 rounded-pill bg-sage-100 flex items-center justify-center animate-scale-in">
          <Check className="h-7 w-7 text-sage-700" />
        </div>
        <div>
          <h1 className="font-display text-3xl lg:text-5xl font-bold text-charcoal-950">
            You're all <span className="accent-italic">set</span>.
          </h1>
          <p className="mt-3 text-charcoal-600 max-w-md mx-auto text-sm lg:text-base">
            We're monitoring 100+ sources for you right now. First alerts usually arrive within 24 hours.
          </p>
        </div>

        {/* Alert summary — compact */}
        <div className="mx-auto max-w-md p-4 rounded-card bg-surface-elevated border border-border text-left text-sm space-y-1.5">
          <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-charcoal-500">
            Alerts going to
          </div>
          {email && (
            <div className="font-medium text-charcoal-950">📧 {email}</div>
          )}
          {selectedPlan && selectedPlan !== "free" && (
            <div className="text-xs text-sage-700 font-semibold pt-1">
              {trialActive ? "3-day free trial active · " : ""}
              {selectedPlan === "premium" ? "Premium" : "Max"} plan
            </div>
          )}
        </div>

        {/* Primary CTA — above fold on desktop */}
        <button
          type="button"
          onClick={() => navigate({ to: "/preferences" })}
          className="hidden lg:inline-flex items-center gap-2 h-12 px-8 rounded-pill bg-charcoal-950 text-paper text-sm font-semibold hover:bg-charcoal-800 transition-colors"
        >
          Go to my dashboard
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Secondary section */}
      <div className="mt-12 space-y-6 max-w-xl mx-auto">
        <AddAnotherSearchCTA />

        {/* Move-out */}
        <button
          type="button"
          onClick={() => setMoveOutOpen(true)}
          className="w-full inline-flex items-center justify-center gap-2 px-5 h-11 rounded-pill border border-dashed border-charcoal-300 text-sm font-semibold text-charcoal-700 hover:border-charcoal-950 hover:text-charcoal-950"
        >
          <Home className="h-4 w-4" />
          {moveOut ? "Edit move-out details" : "Are you moving out? Tell us about your place"}
        </button>

        {/* Referral — redesigned */}
        {referral && (
          <div className="rounded-card bg-gradient-to-br from-peach-100/70 via-paper to-sage-100/40 border border-peach-300/50 overflow-hidden lg:max-w-5xl lg:w-[64rem] lg:relative lg:left-1/2 lg:-translate-x-1/2">
            <div className="grid md:grid-cols-[1fr_auto] gap-4 p-6 items-center">
              <div>
                <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.18em] text-peach-900 mb-2">
                  <Gift className="h-3.5 w-3.5" /> Refer a friend · get a week free
                </div>
                <h2 className="font-display text-2xl font-bold text-charcoal-950 leading-tight">
                  You both get <span className="accent-italic">+1 free week</span> of Premium.
                </h2>
              </div>
              <ReferralIllustration />
            </div>

            {/* 3-step process */}
            <div className="grid sm:grid-cols-3 gap-2 px-6">
              {[
                { n: "1", t: "Share your link", d: "Text, email, or social." },
                { n: "2", t: "Friend signs up", d: "They get +7 days of Premium." },
                { n: "3", t: "You get rewarded", d: "+7 days added to your plan." },
              ].map((s) => (
                <div
                  key={s.n}
                  className="rounded-md bg-paper/70 border border-peach-300/40 p-3"
                >
                  <div className="text-[10px] font-mono text-peach-900">STEP {s.n}</div>
                  <div className="text-sm font-semibold text-charcoal-950 mt-1">{s.t}</div>
                  <div className="text-xs text-charcoal-600">{s.d}</div>
                </div>
              ))}
            </div>

            {/* Short link + copy */}
            <div className="px-6 mt-4 flex items-center gap-2">
              <div className="flex-1 h-11 px-3 rounded-md bg-paper border border-border flex items-center text-sm font-mono text-charcoal-800 truncate">
                {shortLink}
              </div>
              <button
                type="button"
                onClick={copyRef}
                className="h-11 px-4 rounded-pill bg-charcoal-950 text-paper text-xs font-semibold hover:bg-charcoal-800 inline-flex items-center gap-2"
              >
                <Copy className="h-3.5 w-3.5" />
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>

            {/* Share buttons */}
            <div className="px-6 py-4 mt-2 flex flex-wrap gap-2">
              <a
                href={emailHref}
                className="inline-flex items-center gap-2 h-10 px-4 rounded-pill bg-paper border border-border text-xs font-semibold text-charcoal-800 hover:border-charcoal-950"
              >
                <Mail className="h-3.5 w-3.5" /> Email
              </a>
              <button
                type="button"
                onClick={nativeShare}
                className="inline-flex items-center gap-2 h-10 px-4 rounded-pill bg-paper border border-border text-xs font-semibold text-charcoal-800 hover:border-charcoal-950"
              >
                <Share2 className="h-3.5 w-3.5" /> Share…
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile sticky bottom CTA */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-paper/95 backdrop-blur border-t border-border p-3">
        <button
          type="button"
          onClick={() => navigate({ to: "/preferences" })}
          className="w-full inline-flex items-center justify-center gap-2 h-12 rounded-pill bg-charcoal-950 text-paper text-sm font-semibold"
        >
          Go to my dashboard
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {moveOutOpen && <MoveOutModal onClose={() => setMoveOutOpen(false)} />}
    </div>
  );
}

function AddAnotherSearchCTA() {
  const navigate = useNavigate();
  const plan = useAppStore((s) => s.user?.plan ?? "free");
  const searches = useAppStore((s) => s.searches);
  const quota = useMemo(() => {
    const max = SEARCH_LIMITS[plan];
    const used = searches.filter((x) => x.status !== "archived").length;
    const maxLabel = max === Number.POSITIVE_INFINITY ? "Unlimited" : String(max);
    return {
      used,
      max,
      remaining: max === Number.POSITIVE_INFINITY ? Number.POSITIVE_INFINITY : Math.max(0, max - used),
      label: `${used} of ${maxLabel} used`,
    };
  }, [plan, searches]);
  const canAdd = quota.remaining > 0;
  const headline = canAdd
    ? "Looking in more than one area? Add another search."
    : plan === "free"
      ? "Want to track a second city? Upgrade to Premium."
      : "Need more searches? Go Max for unlimited.";

  return (
    <button
      type="button"
      onClick={() =>
        navigate({ to: canAdd ? "/preferences" : "/onboarding/pricing" })
      }
      className="w-full text-left rounded-card border border-charcoal-200 hover:border-charcoal-950 bg-paper p-4 flex items-center gap-4 transition-colors"
    >
      <div className="h-10 w-10 rounded-pill bg-sage-100 flex items-center justify-center shrink-0">
        {canAdd ? (
          <Plus className="h-4 w-4 text-sage-700" />
        ) : (
          <Lock className="h-4 w-4 text-peach-900" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-charcoal-950">{headline}</div>
        <div className="text-xs text-charcoal-600 mt-0.5">
          {quota.label}
          {canAdd ? " · add up to your plan limit from the dashboard." : " · upgrade to unlock more slots."}
        </div>
      </div>
      <ArrowRight className="h-4 w-4 text-charcoal-500 shrink-0" />
    </button>
  );
}


function ReferralIllustration() {
  return (
    <svg
      width="120"
      height="96"
      viewBox="0 0 120 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="hidden md:block"
      aria-hidden
    >
      <rect x="6" y="20" width="42" height="56" rx="8" fill="hsl(var(--peach-300) / 0.4)" stroke="hsl(var(--charcoal-950))" strokeWidth="1.5"/>
      <rect x="72" y="20" width="42" height="56" rx="8" fill="hsl(var(--sage-200) / 0.6)" stroke="hsl(var(--charcoal-950))" strokeWidth="1.5"/>
      <circle cx="27" cy="40" r="7" fill="hsl(var(--charcoal-950))"/>
      <circle cx="93" cy="40" r="7" fill="hsl(var(--charcoal-950))"/>
      <path d="M48 48 L72 48" stroke="hsl(var(--charcoal-950))" strokeWidth="1.5" strokeDasharray="3 3"/>
      <path d="M60 36 L60 60" stroke="hsl(var(--peach-900))" strokeWidth="2"/>
      <path d="M54 42 L60 36 L66 42" stroke="hsl(var(--peach-900))" strokeWidth="2" fill="none"/>
      <rect x="14" y="56" width="26" height="3" rx="1.5" fill="hsl(var(--charcoal-950) / 0.4)"/>
      <rect x="14" y="63" width="18" height="3" rx="1.5" fill="hsl(var(--charcoal-950) / 0.2)"/>
      <rect x="80" y="56" width="26" height="3" rx="1.5" fill="hsl(var(--charcoal-950) / 0.4)"/>
      <rect x="80" y="63" width="18" height="3" rx="1.5" fill="hsl(var(--charcoal-950) / 0.2)"/>
    </svg>
  );
}
