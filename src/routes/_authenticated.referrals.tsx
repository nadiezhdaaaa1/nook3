import { AppPage } from "@/components/app/AppPage";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Gift, Copy, Check } from "lucide-react";
import { getReferralCode } from "@/lib/onboarding/store";
import { referralStatsQueryOptions } from "@/lib/queries/referrals";
import presentAsset from "@/assets/Present-2.png.asset.json";

export const Route = createFileRoute("/_authenticated/referrals")({
  component: () => (
    <AppPage title="Referrals" subtitle="Invite friends and earn free trial time.">
      <ReferralsPage />
    </AppPage>
  ),
});

const STEPS = [
  { title: "Share your link", body: "Text, email, or social." },
  { title: "Friend signs up", body: "They get +7 days free." },
  { title: "You both win", body: "+7 days land on your plan." },
];

function ReferralsPage() {
  const [copied, setCopied] = useState(false);
  const { data } = useQuery(referralStatsQueryOptions());

  const fallbackCode = typeof window === "undefined" ? "RB000000" : getReferralCode();
  const code = data?.code || fallbackCode;
  const fullUrl = `https://thenook.rent/r/${code}`;
  const displayUrl = `thenook.rent/r/${code}`;

  const copyLink = () => {
    navigator.clipboard?.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="w-full overflow-hidden rounded-[24px] bg-white p-6 sm:p-8 lg:p-10"
      style={{ border: "1px solid rgba(0,0,0,0.2)" }}
    >
      <div className="flex max-w-[720px] flex-col gap-10">
        {/* 1) Hero row */}
        <div className="flex items-center gap-3">
          <img
            src={presentAsset.url}
            alt=""
            aria-hidden="true"
            className="h-[72px] w-[72px] flex-none object-contain"
          />
          <div className="flex min-w-0 flex-col gap-2">
            <div
              className="flex items-center gap-2 text-[12px] font-medium uppercase leading-4"
              style={{ letterSpacing: "1.54px", color: "#3D4A36" }}
            >
              <Gift className="h-4 w-4 flex-none" strokeWidth={1.75} aria-hidden="true" />
              <span>Refer a friend · Give a week, get a week</span>
            </div>
            <h2
              className="font-display text-[24px] font-bold leading-[32px] sm:text-[28px] sm:leading-[36px] lg:text-[34px] lg:leading-[48px]"
              style={{ letterSpacing: "-0.34px", color: "#241C12" }}
            >
              You both get +1 free week of Premium
            </h2>
          </div>
        </div>

        {/* 2) Three-step row */}
        <ol className="relative flex flex-col gap-6 sm:flex-row sm:gap-0">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute hidden sm:block"
            style={{
              top: "15px",
              left: "21px",
              right: "calc(33.3333% - 45px)",
              height: "2px",
              background: "rgba(168,184,154,0.7)",
              zIndex: 0,
            }}
          />
          {STEPS.map((s, i) => (
            <li key={s.title} className="relative z-10 flex flex-1 flex-col gap-3 px-1.5">
              <div
                className="flex h-[30px] w-[30px] flex-none items-center justify-center rounded-full bg-white text-[12px] font-bold leading-[18px]"
                style={{ border: "1.5px solid #6A820A", color: "#3D4A36" }}
              >
                {i + 1}
              </div>
              <div className="flex flex-col gap-1">
                <h3
                  className="font-display text-[14px] font-semibold leading-5"
                  style={{ letterSpacing: "-0.21px", color: "#241C12" }}
                >
                  {s.title}
                </h3>
                <p className="text-[13px] leading-[17.875px]" style={{ color: "#6E6459" }}>
                  {s.body}
                </p>
              </div>
            </li>
          ))}
        </ol>

        {/* 3) Invite link block */}
        <div>
          <div
            className="mb-2 text-[12px] uppercase leading-4"
            style={{ letterSpacing: "1.1px", color: "#6E6459" }}
          >
            Your invite link
          </div>
          <div className="flex flex-col items-stretch gap-2.5 sm:h-16 sm:min-h-14 sm:flex-row">
            <input
              readOnly
              value={displayUrl}
              aria-label="Your invite link"
              onClick={(e) => e.currentTarget.select()}
              className="min-h-14 flex-1 rounded-[12px] bg-white px-[18px] text-[16px] leading-6 outline-none focus-visible:ring-2 focus-visible:ring-[#6A820A]/60"
              style={{ border: "1px solid rgba(216,213,205,0.7)", color: "#241C12" }}
            />
            <button
              type="button"
              onClick={copyLink}
              className="inline-flex min-h-14 items-center justify-center gap-2 rounded-[14px] px-6 text-[15px] font-semibold leading-[22.5px] text-white transition-colors hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D66C38]/60 focus-visible:ring-offset-2"
              style={{ backgroundColor: "#D66C38" }}
            >
              {copied ? (
                <Check className="h-[18px] w-[18px] flex-none" aria-hidden="true" />
              ) : (
                <Copy className="h-[18px] w-[18px] flex-none" aria-hidden="true" />
              )}
              <span className="grid">
                <span className="invisible col-start-1 row-start-1 whitespace-nowrap">
                  Copy link
                </span>
                <span className="col-start-1 row-start-1 whitespace-nowrap text-left">
                  {copied ? "Copied" : "Copy link"}
                </span>
              </span>
            </button>
          </div>
          <p aria-live="polite" className="sr-only">
            {copied ? "Invite link copied to clipboard" : ""}
          </p>
        </div>
      </div>
    </div>
  );
}
