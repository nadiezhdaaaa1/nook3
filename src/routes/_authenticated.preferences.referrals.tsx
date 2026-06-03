import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Gift, Copy, Check, Mail, MessageCircle, Share2, Star } from "lucide-react";
import { toast } from "sonner";
import { getReferralCode } from "@/lib/onboarding/store";
import { referralStatsQueryOptions } from "@/lib/queries/referrals";
import type { ReferralStats } from "@/lib/referrals.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/preferences/referrals")({
  component: ReferralsPage,
});

// 4-week milestone — each signup unlocks +1 week, 4 = 1 free month.
const REWARD_THRESHOLD = 4;

function ReferralsPage() {
  const [copied, setCopied] = useState(false);
  const { data } = useQuery(referralStatsQueryOptions());

  const fallbackCode = typeof window === "undefined" ? "RB000000" : getReferralCode();
  const code = data?.code || fallbackCode;
  const fullUrl = `https://thenook.rent/r/${code}`;
  const displayUrl = `nook.app/r/${code}`;
  const blurb = `I'm using Nook to find my next apartment — they ping me the moment a real match shows up. Use my link and we both get 7 days of Premium free: ${fullUrl}`;

  const stats: ReferralStats = data ?? {
    code,
    invited: 0,
    signedUp: 0,
    rewarded: 0,
    recent: [],
  };
  const earned = Math.min(stats.signedUp, REWARD_THRESHOLD);
  const remaining = Math.max(REWARD_THRESHOLD - earned, 0);

  const copyLink = () => {
    navigator.clipboard?.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
    toast.success("Link copied");
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ title: "Nook", text: blurb, url: fullUrl });
      } catch {
        /* user cancelled */
      }
    } else {
      navigator.clipboard?.writeText(blurb);
      toast.success("Message copied");
    }
  };

  return (
    <div className="max-w-[760px]">
      <div className="relative overflow-hidden rounded-[24px] bg-paper-elevated border border-charcoal-200/60 p-7 sm:p-10 shadow-[0_1px_2px_rgba(26,26,24,.03),0_8px_24px_rgba(26,26,24,.04)]">
        {/* Sage glow */}
        <div
          className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(122,143,110,.16), rgba(122,143,110,0) 70%)",
          }}
        />

        {/* Eyebrow */}
        <div className="relative flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.14em] text-sage-900 mb-3.5">
          <Gift className="h-[15px] w-[15px]" strokeWidth={1.75} />
          Refer a friend · Give a week, get a week
        </div>

        {/* Heading */}
        <h1 className="relative font-display text-[27px] sm:text-[34px] leading-[1.15] tracking-[-0.01em] font-semibold text-charcoal-950 mb-6 max-w-[90%]">
          You both get{" "}
          <em className="italic font-medium text-sage-500 not-italic-fallback">
            +1 free week
          </em>{" "}
          of Premium.
        </h1>

        {/* Reward tracker */}
        <RewardTracker earned={earned} threshold={REWARD_THRESHOLD} remaining={remaining} />

        {/* Stepper */}
        <Stepper />

        {/* Invite link */}
        <div className="relative">
          <div className="text-[11px] font-mono uppercase tracking-[0.1em] text-charcoal-500 mb-2">
            Your invite link
          </div>
          <div className="flex flex-col sm:flex-row gap-2.5 mb-3.5">
            <div className="flex-1 flex items-center min-h-14 px-4.5 rounded-[14px] bg-paper border border-charcoal-200/70 font-mono text-base text-charcoal-950 truncate">
              {displayUrl}
            </div>
            <button
              type="button"
              onClick={copyLink}
              className={cn(
                "inline-flex items-center justify-center gap-2 min-h-14 px-6 rounded-[14px] text-[15px] font-semibold transition-colors",
                copied
                  ? "bg-sage-700 text-paper"
                  : "bg-charcoal-950 text-paper hover:bg-charcoal-800",
              )}
            >
              {copied ? <Check className="h-[18px] w-[18px]" /> : <Copy className="h-[18px] w-[18px]" />}
              {copied ? "Copied" : "Copy link"}
            </button>
          </div>

          {/* Share chips */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Chip
              icon={Mail}
              label="Email"
              href={`mailto:?subject=${encodeURIComponent("Found us an apartment hack")}&body=${encodeURIComponent(blurb)}`}
            />
            <Chip icon={MessageCircle} label="Message" onClick={handleNativeShare} />
            <Chip icon={Share2} label="Share…" onClick={handleNativeShare} />
            <p className="sm:ml-auto w-full sm:w-auto text-[13px] text-charcoal-500">
              No credit card required ·{" "}
              <span className="font-semibold text-sage-900">They get +7 days too</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Reward tracker ---------- */

function RewardTracker({
  earned,
  threshold,
  remaining,
}: {
  earned: number;
  threshold: number;
  remaining: number;
}) {
  const friendsCopy =
    earned === 0
      ? "No invites yet — start with one"
      : `${earned} friend${earned === 1 ? "" : "s"} joined — you've earned +${earned} week${earned === 1 ? "" : "s"}`;
  const subCopy =
    remaining === 0
      ? "You've unlocked a full month of Premium 🎉"
      : earned === 0
        ? `Invite ${threshold} friends and your next month of Premium is on us.`
        : `Invite ${remaining} more and your next month of Premium is on us.`;

  return (
    <div className="flex items-center gap-4 sm:gap-5 mb-6 sm:mb-7 px-5 py-4 sm:py-[18px] rounded-2xl bg-sage-100/60 border border-sage-300/50">
      <div className="flex-none flex h-11 w-11 items-center justify-center rounded-xl bg-paper-elevated border border-sage-300/60">
        <Star className="h-[22px] w-[22px] text-sage-900" strokeWidth={1.75} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-charcoal-950 mb-0.5 truncate">
          {friendsCopy}
        </p>
        <p className="text-[13px] text-charcoal-500 leading-snug">
          {earned === 0 ? null : <strong className="text-sage-900 font-semibold">Invite {remaining > 0 ? `${remaining} more` : ""} </strong>}
          {earned === 0 ? subCopy : subCopy.replace(/^Invite \d+ more /, "")}
        </p>
      </div>
      <div className="hidden sm:flex items-center gap-1.5 flex-none">
        {Array.from({ length: threshold }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-2 w-[22px] rounded-md",
              i < earned ? "bg-sage-900" : "bg-sage-300/70",
            )}
          />
        ))}
        <span className="ml-1.5 font-mono text-[11px] text-charcoal-500 tabular-nums">
          {earned}/{threshold} wks
        </span>
      </div>
    </div>
  );
}

/* ---------- Stepper ---------- */

function Stepper() {
  const items = [
    { n: 1, title: "Share your link", body: "Text, email, or social." },
    { n: 2, title: "Friend signs up", body: "They get +7 days free." },
    { n: 3, title: "You both win", body: "+7 days land on your plan." },
  ];
  return (
    <ol className="mb-7 flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-0">
      {items.map((s, i) => (
        <li
          key={s.n}
          className="relative flex sm:block flex-1 gap-3 sm:gap-0 sm:text-center sm:px-1.5"
        >
          {/* connector line — desktop only, between nodes */}
          {i < items.length - 1 && (
            <span
              aria-hidden="true"
              className="hidden sm:block absolute top-[15px] left-1/2 w-full h-[1.5px] bg-sage-300/70 z-0"
            />
          )}
          <div className="relative z-10 flex-none flex items-center justify-center h-[30px] w-[30px] rounded-full bg-paper-elevated border-[1.5px] border-sage-500 text-sage-900 font-mono text-[12px] font-bold sm:mx-auto sm:mb-2.5">
            {s.n}
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-charcoal-950 mb-0.5">
              {s.title}
            </h4>
            <p className="text-[13px] text-charcoal-500 leading-snug">{s.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ---------- Chip ---------- */

function Chip({
  icon: Icon,
  label,
  onClick,
  href,
}: {
  icon: typeof Mail;
  label: string;
  onClick?: () => void;
  href?: string;
}) {
  const cls =
    "inline-flex items-center gap-2 rounded-full bg-paper-elevated border border-charcoal-200/70 px-[18px] py-2.5 text-sm font-semibold text-charcoal-800 hover:border-charcoal-400 transition-colors";
  if (href) {
    return (
      <a href={href} className={cls}>
        <Icon className="h-4 w-4" strokeWidth={1.75} /> {label}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cls}>
      <Icon className="h-4 w-4" strokeWidth={1.75} /> {label}
    </button>
  );
}
