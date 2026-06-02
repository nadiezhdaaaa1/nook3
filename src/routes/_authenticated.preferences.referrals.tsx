import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Gift, Users, Calendar, Copy, Check, Mail, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { getReferralCode } from "@/lib/onboarding/store";

export const Route = createFileRoute("/_authenticated/preferences/referrals")({
  component: ReferralsPage,
});

function ReferralsPage() {
  const [copied, setCopied] = useState(false);
  const code = typeof window === "undefined" ? "RB000000" : getReferralCode();
  const url = `https://thenook.rent/r/${code}`;
  const blurb = `I'm using Nook to find my next apartment — they ping me the moment a real match shows up. Use my link and we both get 7 days of Premium free: ${url}`;

  const copy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    toast.success(`${label} copied`);
  };

  const stats = [
    { icon: Users, label: "Friends invited", value: "3" },
    { icon: Calendar, label: "Signed up", value: "1" },
    { icon: Gift, label: "Rewards earned", value: "1" },
  ];

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section>
        <h2 className="font-display text-2xl lg:text-3xl font-bold text-charcoal-950 leading-tight">
          Invite friends, both get <span className="accent-italic">free Premium</span>.
        </h2>
        <p className="mt-3 text-sm text-charcoal-600 max-w-xl">
          When a friend signs up through your link and starts a trial, you both get Premium for 7 days free.
        </p>
      </section>

      {/* Share section */}
      <section className="space-y-5">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-[0.16em] text-sage-700 mb-2">
            Your referral link
          </div>
          <div className="flex gap-2">
            <input
              readOnly
              value={url}
              onFocus={(e) => e.currentTarget.select()}
              className="flex-1 h-11 px-3 rounded-md bg-paper-warm border border-charcoal-950/12 text-sm font-mono text-charcoal-900"
            />
            <button
              type="button"
              onClick={() => copy(url, "Link")}
              className="h-11 px-4 inline-flex items-center gap-2 rounded-md bg-charcoal-950 text-paper text-sm font-semibold hover:bg-charcoal-800"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy link"}
            </button>
          </div>
        </div>

        <div>
          <div className="text-[11px] font-mono uppercase tracking-[0.16em] text-sage-700 mb-2">
            Or share directly
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href={`mailto:?subject=${encodeURIComponent("Found us an apartment hack")}&body=${encodeURIComponent(blurb)}`}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-pill border border-charcoal-200 text-sm font-semibold text-charcoal-800 hover:border-charcoal-950"
            >
              <Mail className="h-4 w-4" /> Email
            </a>
            <a
              href={`sms:?body=${encodeURIComponent(blurb)}`}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-pill border border-charcoal-200 text-sm font-semibold text-charcoal-800 hover:border-charcoal-950"
            >
              <MessageSquare className="h-4 w-4" /> SMS
            </a>
            <button
              type="button"
              onClick={() => copy(blurb, "Social blurb")}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-pill border border-charcoal-200 text-sm font-semibold text-charcoal-800 hover:border-charcoal-950"
            >
              <Copy className="h-4 w-4" /> Copy social blurb
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section>
        <div className="grid sm:grid-cols-3 gap-3">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="rounded-card bg-paper-warm border border-charcoal-950/8 p-5"
              >
                <Icon className="h-4 w-4 text-sage-700" />
                <div className="font-display text-2xl font-bold text-charcoal-950 mt-2 tabular-nums">
                  {s.value}
                </div>
                <div className="text-xs text-charcoal-600">{s.label}</div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
