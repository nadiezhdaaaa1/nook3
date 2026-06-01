import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { Bell, DollarSign, Home, MapPin, BellOff, Copy, Heart, Inbox, Gift, UserCircle } from "lucide-react";
import { useState } from "react";
import { Logo, LogoMark } from "@/components/brand/Logo";
import { getReferralCode, useOnboardingStore } from "@/lib/onboarding/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/preferences")({
  head: () => ({
    meta: [
      { title: "Manage preferences — Nook" },
      { name: "description", content: "Customize your apartment alerts and notification settings." },
    ],
  }),
  component: PreferencesShell,
});

const TABS = [
  { to: "/preferences", label: "Notifications", icon: Bell, exact: true },
  { to: "/preferences/alerts", label: "Saved Alerts", icon: Inbox, exact: false },
  { to: "/preferences/budget", label: "Budget & Criteria", icon: DollarSign, exact: false },
  { to: "/preferences/apartment", label: "Apartment Details", icon: Home, exact: false },
  { to: "/preferences/location", label: "Location", icon: MapPin, exact: false },
  { to: "/preferences/referrals", label: "Referrals", icon: Gift, exact: false },
  { to: "/preferences/account", label: "Account", icon: UserCircle, exact: false },
] as const;

function PreferencesShell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-charcoal-950/8 bg-paper">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <LogoMark size={28} />
            <Logo className="text-lg" />
          </Link>
          <Link to="/" className="text-sm font-semibold text-charcoal-700 hover:text-charcoal-950">
            ← Back to home
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-10">
        <div className="flex items-start justify-between flex-wrap gap-4 mb-10">
          <div>
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-charcoal-950 leading-[1.05]">
              Manage <span className="accent-italic">Preferences</span>
            </h1>
            <p className="mt-3 text-charcoal-600">
              Customize your apartment alerts and notification settings.
            </p>
          </div>
          <UnsubscribeButton />
        </div>

        <div className="grid lg:grid-cols-[240px_1fr] gap-6 lg:gap-8">
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <nav className="flex lg:flex-col gap-1 overflow-x-auto -mx-6 px-6 lg:mx-0 lg:px-0 lg:overflow-visible">
              {TABS.map((t) => {
                const active = t.exact ? pathname === t.to : pathname.startsWith(t.to);
                const Icon = t.icon;
                return (
                  <Link
                    key={t.to}
                    to={t.to}
                    className={cn(
                      "shrink-0 lg:shrink inline-flex items-center gap-2 lg:gap-3 px-4 h-11 rounded-pill lg:rounded-md text-sm font-medium transition-colors whitespace-nowrap",
                      active
                        ? "bg-charcoal-950 text-paper"
                        : "text-charcoal-700 hover:bg-charcoal-950/5 border border-charcoal-200 lg:border-0",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {t.label}
                  </Link>
                );
              })}
            </nav>
          </aside>

          <main>
            <Outlet />
            <ReferralBlock />
          </main>
        </div>
      </div>
    </div>
  );
}

function UnsubscribeButton() {
  const navigate = useNavigate();
  const reset = useOnboardingStore((s) => s.reset);
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="h-11 px-5 inline-flex items-center gap-2 rounded-pill border border-charcoal-200 text-sm font-semibold text-charcoal-700 hover:border-charcoal-950"
      >
        <BellOff className="h-4 w-4" /> Unsubscribe
      </button>
    );
  }
  return (
    <div className="inline-flex items-center gap-2">
      <span className="text-xs text-charcoal-600">Stop all alerts?</span>
      <button
        type="button"
        onClick={() => {
          reset();
          navigate({ to: "/" });
        }}
        className="h-9 px-3 rounded-pill bg-danger text-paper text-xs font-semibold"
      >
        Yes, unsubscribe
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="h-9 px-3 rounded-pill border border-charcoal-200 text-xs font-semibold text-charcoal-700"
      >
        Cancel
      </button>
    </div>
  );
}

function ReferralBlock() {
  const [copied, setCopied] = useState(false);
  const code = typeof window === "undefined" ? "RB000000" : getReferralCode();
  const url = `https://thenook.rent?affiliate=${code}`;

  return (
    <div className="mt-12 p-6 rounded-card bg-peach-100 border border-peach-300">
      <div className="flex items-start gap-3 mb-4">
        <div className="h-10 w-10 rounded-pill bg-paper flex items-center justify-center shrink-0">
          <Heart className="h-4 w-4 text-peach-700" />
        </div>
        <div>
          <div className="font-display text-lg font-bold text-charcoal-950">Your referral link</div>
          <div className="text-sm text-charcoal-700 mt-0.5">
            Share with friends — you'll both get Premium for 7 days free.
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <input
          readOnly
          value={url}
          className="flex-1 h-11 px-3 rounded-md bg-paper border border-peach-300 text-sm font-mono"
        />
        <button
          type="button"
          onClick={() => {
            navigator.clipboard?.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
          className="h-11 px-4 inline-flex items-center gap-2 rounded-md bg-charcoal-950 text-paper text-sm font-semibold"
        >
          <Copy className="h-3.5 w-3.5" /> {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}
