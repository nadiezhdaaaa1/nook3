import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Gift, Users, Calendar, Copy, Check, Mail, MessageSquare,
  Share2, Sparkles, ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { getReferralCode } from "@/lib/onboarding/store";
import { referralStatsQueryOptions } from "@/lib/queries/referrals";
import type { ReferralStats } from "@/lib/referrals.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/preferences/referrals")({
  component: ReferralsPage,
});

const REWARD_THRESHOLD = 5;

function ReferralsPage() {
  const [copied, setCopied] = useState<"link" | "blurb" | null>(null);
  const { data, isLoading } = useQuery(referralStatsQueryOptions());

  const fallbackCode = typeof window === "undefined" ? "RB000000" : getReferralCode();
  const code = data?.code || fallbackCode;
  const url = `https://thenook.rent/r/${code}`;
  const blurb = `I'm using Nook to find my next apartment — they ping me the moment a real match shows up. Use my link and we both get 7 days of Premium free: ${url}`;

  const stats: ReferralStats = data ?? {
    code,
    invited: 0,
    signedUp: 0,
    rewarded: 0,
    recent: [],
  };
  const progress = Math.min(stats.signedUp / REWARD_THRESHOLD, 1);
  const remaining = Math.max(REWARD_THRESHOLD - stats.signedUp, 0);



  const copy = (text: string, what: "link" | "blurb", label: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(what);
    setTimeout(() => setCopied(null), 1500);
    toast.success(`${label} copied`);
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ title: "Nook", text: blurb, url });
      } catch {
        // user cancelled — no-op
      }
    } else {
      copy(blurb, "blurb", "Message");
    }
  };

  return (
    <div className="space-y-12">
      {/* ===== Hero ===== */}
      <section className="rounded-card bg-gradient-to-br from-sage-50 via-paper-warm to-paper border border-sage-200/60 p-6 lg:p-8 relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-sage-200/30 blur-3xl pointer-events-none" />
        <div className="relative">
          <div className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-pill bg-sage-100 text-sage-800 text-[11px] font-mono uppercase tracking-[0.14em]">
            <Sparkles className="h-3 w-3" /> Referral program
          </div>
          <h2 className="mt-4 font-display text-2xl lg:text-3xl font-bold text-charcoal-950 leading-tight max-w-2xl">
            Invite friends, both get{" "}
            <span className="accent-italic">free Premium</span>.
          </h2>
          <p className="mt-3 text-sm text-charcoal-700 max-w-xl leading-relaxed">
            When a friend signs up through your link and starts a trial, you both get 7 days of Premium — free. Hit {REWARD_THRESHOLD} signups and we unlock a full month.
          </p>
        </div>
      </section>

      {/* ===== Share ===== */}
      <section aria-labelledby="share-heading" className="space-y-6">
        <SectionHeading id="share-heading" eyebrow="01 — Share" title="Your link" />

        <div className="space-y-3">
          <label htmlFor="ref-link" className="sr-only">Referral link</label>
          <div className="flex gap-2">
            <input
              id="ref-link"
              readOnly
              value={url}
              onFocus={(e) => e.currentTarget.select()}
              className="flex-1 h-11 px-3 rounded-md bg-paper-warm border border-charcoal-950/12 text-sm font-mono text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-charcoal-950/20 focus:border-charcoal-950"
            />
            <button
              type="button"
              onClick={() => copy(url, "link", "Link")}
              className="h-11 px-4 inline-flex items-center gap-2 rounded-md bg-charcoal-950 text-paper text-sm font-semibold hover:bg-charcoal-800 focus:outline-none focus:ring-2 focus:ring-charcoal-950/40 focus:ring-offset-2 focus:ring-offset-paper transition-colors"
            >
              {copied === "link" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied === "link" ? "Copied" : "Copy"}
            </button>
          </div>
          <div className="text-[11px] font-mono uppercase tracking-[0.12em] text-charcoal-500">
            Code: <span className="text-charcoal-800">{code}</span>
          </div>
        </div>

        <div>
          <div className="text-xs text-charcoal-600 mb-2">Or share directly</div>
          <div className="flex flex-wrap gap-2">
            <ShareButton
              icon={Share2}
              label="Share"
              onClick={handleNativeShare}
              primary
            />
            <ShareButton
              icon={Mail}
              label="Email"
              href={`mailto:?subject=${encodeURIComponent("Found us an apartment hack")}&body=${encodeURIComponent(blurb)}`}
            />
            <ShareButton
              icon={MessageSquare}
              label="SMS"
              href={`sms:?body=${encodeURIComponent(blurb)}`}
            />
            <ShareButton
              icon={copied === "blurb" ? Check : Copy}
              label={copied === "blurb" ? "Copied message" : "Copy message"}
              onClick={() => copy(blurb, "blurb", "Message")}
            />
          </div>
        </div>
      </section>

      {/* ===== Progress + Stats ===== */}
      <section aria-labelledby="stats-heading" className="space-y-6">
        <SectionHeading id="stats-heading" eyebrow="02 — Progress" title="Your impact" />

        {/* Progress to next reward */}
        <div className="rounded-card bg-paper-warm border border-charcoal-950/8 p-5 lg:p-6">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <div className="text-xs text-charcoal-600">Signups toward next reward</div>
              <div className="font-display text-3xl font-bold text-charcoal-950 tabular-nums mt-1">
                {stats.signedUp} <span className="text-charcoal-400 text-xl font-medium">/ {REWARD_THRESHOLD}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-charcoal-600">Next reward</div>
              <div className="text-sm font-semibold text-sage-800 mt-1 inline-flex items-center gap-1.5">
                <Gift className="h-4 w-4" />
                {remaining === 0 ? "Unlocked!" : `${remaining} to go — 1 month free`}
              </div>
            </div>
          </div>
          <div className="mt-4 h-2 rounded-pill bg-charcoal-950/8 overflow-hidden" role="progressbar" aria-valuenow={stats.signedUp} aria-valuemin={0} aria-valuemax={REWARD_THRESHOLD}>
            <div
              className="h-full bg-gradient-to-r from-sage-500 to-sage-700 rounded-pill transition-all duration-500"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid sm:grid-cols-3 gap-3">
          <StatCard icon={Users} label="Friends invited" value={stats.invited} />
          <StatCard icon={Calendar} label="Signed up" value={stats.signedUp} accent />
          <StatCard icon={Gift} label="Rewards earned" value={stats.rewarded} />
        </div>
      </section>

      {/* ===== Recent referrals ===== */}
      <section aria-labelledby="recent-heading" className="space-y-4">
        <SectionHeading id="recent-heading" eyebrow="03 — Activity" title="Recent referrals" />
        <RecentList items={stats.recent} isLoading={isLoading} />
      </section>

      {/* ===== How it works ===== */}
      <section aria-labelledby="how-heading" className="space-y-4">
        <SectionHeading id="how-heading" eyebrow="04 — How it works" title="Three steps" />
        <ol className="grid sm:grid-cols-3 gap-3">
          {HOW_STEPS.map((step, i) => (
            <li
              key={step.title}
              className="rounded-card bg-paper-warm border border-charcoal-950/8 p-5"
            >
              <div className="text-[11px] font-mono uppercase tracking-[0.14em] text-sage-700">
                Step 0{i + 1}
              </div>
              <div className="mt-2 font-display text-base font-semibold text-charcoal-950">
                {step.title}
              </div>
              <div className="mt-1.5 text-sm text-charcoal-600 leading-relaxed">
                {step.body}
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ===== FAQ ===== */}
      <section aria-labelledby="faq-heading" className="space-y-3">
        <SectionHeading id="faq-heading" eyebrow="05 — FAQ" title="Common questions" />
        <div className="divide-y divide-charcoal-950/8 border border-charcoal-950/8 rounded-card overflow-hidden bg-paper">
          {FAQ.map((q) => (
            <FaqRow key={q.q} q={q.q} a={q.a} />
          ))}
        </div>
        <p className="text-xs text-charcoal-500 pt-2">
          One reward per signup. Self-referrals and disposable emails don't count. We may adjust rewards with notice.
        </p>
      </section>
    </div>
  );
}

/* ---------- Subcomponents ---------- */

function SectionHeading({ id, eyebrow, title }: { id: string; eyebrow: string; title: string }) {
  return (
    <div>
      <div className="text-[11px] font-mono uppercase tracking-[0.14em] text-sage-700">
        {eyebrow}
      </div>
      <h3 id={id} className="mt-1 font-display text-lg lg:text-xl font-semibold text-charcoal-950">
        {title}
      </h3>
    </div>
  );
}

function ShareButton({
  icon: Icon, label, href, onClick, primary,
}: {
  icon: typeof Mail;
  label: string;
  href?: string;
  onClick?: () => void;
  primary?: boolean;
}) {
  const className = cn(
    "inline-flex items-center gap-2 h-10 px-4 rounded-pill text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-paper",
    primary
      ? "bg-charcoal-950 text-paper hover:bg-charcoal-800 focus:ring-charcoal-950/40"
      : "border border-charcoal-200 text-charcoal-800 hover:border-charcoal-950 focus:ring-charcoal-950/20",
  );
  if (href) {
    return (
      <a href={href} className={className}>
        <Icon className="h-4 w-4" /> {label}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={className}>
      <Icon className="h-4 w-4" /> {label}
    </button>
  );
}

function StatCard({
  icon: Icon, label, value, accent,
}: {
  icon: typeof Users;
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className={cn(
      "rounded-card border p-5 transition-colors",
      accent
        ? "bg-sage-50 border-sage-200"
        : "bg-paper-warm border-charcoal-950/8",
    )}>
      <Icon className={cn("h-4 w-4", accent ? "text-sage-800" : "text-sage-700")} />
      <div className="font-display text-3xl font-bold text-charcoal-950 mt-2 tabular-nums leading-none">
        {value}
      </div>
      <div className="text-xs text-charcoal-600 mt-1.5">{label}</div>
    </div>
  );
}

function RecentList({
  items,
  isLoading,
}: {
  items: ReferralStats["recent"];
  isLoading: boolean;
}) {
  if (isLoading && items.length === 0) {
    return (
      <div className="rounded-card border border-charcoal-950/8 bg-paper-warm/50 p-6 space-y-3" aria-busy="true">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-8 rounded-md bg-charcoal-950/5 animate-pulse" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-card border border-dashed border-charcoal-950/15 p-8 text-center bg-paper-warm/50">
        <div className="text-sm text-charcoal-600">No referrals yet.</div>
        <div className="text-xs text-charcoal-500 mt-1">Share your link above to get started.</div>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-charcoal-950/8 border border-charcoal-950/8 rounded-card overflow-hidden bg-paper">
      {items.map((it) => {
        const date = new Date(it.createdAt).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        });
        return (
          <li key={it.id} className="flex items-center justify-between gap-4 px-4 py-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-8 w-8 rounded-pill bg-sage-100 text-sage-900 inline-flex items-center justify-center text-xs font-bold shrink-0">
                {it.email.charAt(0).toUpperCase()}
              </div>
              <div className="text-sm text-charcoal-800 font-mono truncate">{it.email}</div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <StatusPill status={it.status} />
              <span className="text-xs text-charcoal-500 tabular-nums hidden sm:inline">{date}</span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function StatusPill({ status }: { status: "invited" | "signed_up" | "rewarded" }) {
  const map = {
    invited: { label: "Invited", cls: "bg-charcoal-100 text-charcoal-700" },
    signed_up: { label: "Signed up", cls: "bg-peach-100 text-peach-800" },
    rewarded: { label: "Rewarded", cls: "bg-sage-100 text-sage-800" },
  } as const;
  const v = map[status];
  return (
    <span className={cn("inline-flex h-6 px-2.5 items-center rounded-pill text-[11px] font-semibold", v.cls)}>
      {v.label}
    </span>
  );
}

function FaqRow({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 px-4 py-3.5 text-left hover:bg-paper-warm/60 transition-colors focus:outline-none focus-visible:bg-paper-warm"
      >
        <span className="text-sm font-medium text-charcoal-900">{q}</span>
        <ChevronDown className={cn("h-4 w-4 text-charcoal-500 shrink-0 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="px-4 pb-4 -mt-1 text-sm text-charcoal-600 leading-relaxed">
          {a}
        </div>
      )}
    </div>
  );
}

/* ---------- Data ---------- */

const HOW_STEPS = [
  { title: "Share your link", body: "Copy and send it — email, SMS, anywhere. Each link is uniquely yours." },
  { title: "Friend signs up", body: "They create a Nook account through your link and start their trial." },
  { title: "Both get rewarded", body: "7 days of Premium free, instantly. Hit 5 signups for a full month." },
];

const FAQ = [
  { q: "When do I get my reward?", a: "Within minutes of your friend completing signup. We'll email you when it lands." },
  { q: "Is there a limit?", a: "Invite as many as you like. Every signup counts toward your next milestone." },
  { q: "What if I'm already on Premium?", a: "Your reward extends your current subscription by 7 days — never wasted." },
  { q: "Can I see who signed up?", a: "Yes — partial emails appear in Recent referrals above. We never share full addresses." },
];
