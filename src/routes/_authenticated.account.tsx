import { AppPage } from "@/components/app/AppPage";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Check, Sparkles, Zap, Bell, Search as SearchIcon, Clock, Download, Trash2,
  Mail, Eye, EyeOff, ChevronRight, LogOut, Lock,
  PauseCircle, MessageCircle, Tag, Heart, ArrowLeft, CreditCard, Receipt, Plus,
} from "lucide-react";
import cardAsset from "@/assets/Card.png.asset.json";
import lockAsset from "@/assets/Lock.png.asset.json";
import globeAsset from "@/assets/Globe.png.asset.json";
import doorAsset from "@/assets/Door-2.png.asset.json";

import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { motion, useReducedMotion } from "framer-motion";
import { useOnboardingStore } from "@/lib/onboarding/store";
import { useAppStore, type Plan, type BillingCycle } from "@/lib/store";
import { SEARCH_LIMITS } from "@/lib/store/types";
import { usePreferencesStore } from "@/lib/preferences/store";
import { StickySaveBar } from "@/components/preferences/StickySaveBar";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useUpdatePlanMutation } from "@/lib/queries/billing";
import { OriginButton } from "@/components/ui/origin-button";
import { Input } from "@/components/ui/input";
import { WARM_BG, DARK_SHADOW } from "@/components/landing/PricingThreeTiers";

export const Route = createFileRoute("/_authenticated/account")({
  component: () => (
    <AppPage title="Account" subtitle="Contact details, plan and billing.">
      <AccountPage />
    </AppPage>
  ),
});

type FeatureDef = {
  text: string;
  icon: "check" | "lock";
  bold?: boolean;
};

type PlanDef = {
  key: string;
  id: Plan;
  cycle: BillingCycle;
  label: string;
  tagline: string;
  monthly: number;
  annual: number;
  features: FeatureDef[];
};

const PLANS: PlanDef[] = [
  {
    key: "intro",
    id: "free",
    cycle: "monthly",
    label: "3 days free",
    tagline: "See how it works, on your real search.",
    monthly: 0,
    annual: 0,
    features: [
      { text: "Daily or weekly — you choose", icon: "check" },
      { text: "Alerts with no delay", icon: "check" },
      { text: "Only your 3 best matches per email", icon: "lock", bold: true },
      { text: "1 search — the one you set up at signup", icon: "lock", bold: true },
    ],
  },
  {
    key: "pro_monthly",
    id: "premium",
    cycle: "monthly",
    label: "Pro",
    tagline: "When you're actively looking.",
    monthly: 14.99,
    annual: 95.88,
    features: [
      { text: "Daily or weekly — you choose", icon: "check" },
      { text: "Alerts with no delay", icon: "check" },
      { text: "Every match we find", icon: "check", bold: true },
      { text: "Up to 3 searches — own filters, own cities", icon: "check", bold: true },
    ],
  },
  {
    key: "pro_annual",
    id: "premium",
    cycle: "annual",
    label: "Pro annual",
    tagline: "Same plan, paid once a year.",
    monthly: 7.99,
    annual: 95.88,
    features: [
      { text: "Daily or weekly — you choose", icon: "check" },
      { text: "Alerts with no delay", icon: "check" },
      { text: "Every match we find", icon: "check", bold: true },
      { text: "Up to 3 searches — own filters, own cities", icon: "check", bold: true },
    ],
  },
];

const TIMEZONES = [
  "America/New_York", "America/Chicago", "America/Denver", "America/Los_Angeles",
  "America/Phoenix", "America/Anchorage", "Pacific/Honolulu", "UTC",
];


function AccountPage() {
  const onboarding = useOnboardingStore();
  const user = useAppStore((s) => s.user);
  const searches = useAppStore((s) => s.searches);
  const updateProfile = useAppStore((s) => s.updateProfile);

  const plan: Plan = user?.plan ?? "free";
  const trialActive = user?.trialActive ?? false;
  const trialEndsAt = user?.trialEndsAt;
  const activeCycle: BillingCycle = user?.billingCycle ?? "monthly";

  // Profile editable fields (sourced from onboarding store + user)
  const [timezone, setTimezone] = useState(user?.timezone || "America/New_York");

  const prefs = usePreferencesStore();

  // Current card matching plan + billing cycle (legacy "max" behaves like Pro monthly)
  const currentPlan =
    PLANS.find((p) => p.id === plan && (plan === "free" || p.cycle === activeCycle)) ??
    (plan === "free" ? PLANS[0] : PLANS[1]);

  // Usage stats
  const stats = useMemo(() => {
    const max = SEARCH_LIMITS[plan];
    const used = searches.filter((s) => s.status !== "archived").length;
    const totalAlerts = searches.reduce((sum, s) => sum + (s.totalAlertsReceived ?? 0), 0);
    const alerts7d = searches.reduce((sum, s) => sum + (s.alertsLast7Days ?? 0), 0);
    return {
      used,
      max,
      maxLabel: max === Infinity ? "Unlimited" : String(max),
      pct: max === Infinity ? 100 : Math.min(100, Math.round((used / max) * 100)),
      totalAlerts,
      alerts7d,
    };
  }, [searches, plan]);

  return (
    <div className="space-y-12 pb-24">
      {/* Usage stats */}
      <section>
        <h2 className="font-display text-xl font-semibold text-charcoal-950 mb-4">
          Usage this month
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <StatCard
            icon={SearchIcon}
            label="Saved searches"
            value={`${stats.used} / ${stats.maxLabel}`}
            footer={
              stats.max === Infinity
                ? <>No limit on your plan.</>
                : stats.used >= stats.max
                  ? <>Limit reached — <a href="#plans" className="text-sage-700 font-semibold underline-offset-2 hover:underline">upgrade to add more</a>.</>
                  : <>{stats.max - stats.used} slot{stats.max - stats.used === 1 ? "" : "s"} left.</>
            }
            progress={stats.pct}
          />
          <StatCard
            icon={Bell}
            label="Alerts received"
            value={String(stats.totalAlerts)}
            footer="All-time across your searches."
          />
          <StatCard
            icon={Clock}
            label="Last 7 days"
            value={String(stats.alerts7d)}
            footer="Recent activity volume."
          />
        </div>
      </section>

      {/* Profile */}
      <section>
        <h2 className="font-display text-xl font-semibold text-charcoal-950 mb-4">Profile</h2>
        <div className="rounded-card bg-paper-warm border border-border divide-y divide-border">
          <ProfileTimezoneRow timezone={timezone} onChange={setTimezone} />
          <ProfilePasswordRow />
        </div>
      </section>



      {/* Subscription */}
      <SubscriptionSection
        plan={plan}
        trialActive={trialActive}
        trialEndsAt={trialEndsAt}
        currentPlan={currentPlan}
        activeCycle={activeCycle}
      />


      {/* Communications */}
      <section>
        <h2 className="font-display text-xl font-semibold text-charcoal-950 mb-2">
          Communications
        </h2>
        <p className="text-xs text-charcoal-600 mb-4">
          We always send essential service emails. You control the optional ones.
        </p>
        <div className="rounded-card bg-paper-warm border border-border divide-y divide-border">
          <ToggleRow
            label="Rental match alerts"
            alwaysOnNote="Always on"
            desc="The listings you signed up for. Core to the service."
            checked
            onChange={() => {}}
            disabled
          />
          <ToggleRow
            label="Billing & account notices"
            alwaysOnNote="Always on"
            desc="Receipts, renewals, password resets, security alerts, policy changes."
            checked
            onChange={() => {}}
            disabled
          />
          <ToggleRow
            label="Product updates & tips"
            desc="Occasional emails about new features and how to get more out of Nook."
            checked={prefs.productUpdates}
            onChange={(v) => prefs.setPref("productUpdates", v)}
          />
          <ToggleRow
            label="Partner offers & promotions"
            desc="Promotional content from partners and special offers. Unsubscribe anytime."
            checked={prefs.marketingEmails}
            onChange={(v) => prefs.setPref("marketingEmails", v)}
          />
        </div>
      </section>

      {/* Privacy */}
      <section>
        <h2 className="font-display text-xl font-semibold text-charcoal-950 mb-4">
          Privacy &amp; data
        </h2>
        <div className="rounded-card bg-paper-warm border border-border divide-y divide-border">
          <div className="px-5 py-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="text-sm font-semibold text-charcoal-950">Export your data</div>
              <div className="text-xs text-charcoal-600 mt-0.5">
                Download a JSON copy of your searches and alerts.
              </div>
            </div>
            <OriginButton
              variant="tertiary"
              size="medium"
              onClick={() => {
                const blob = new Blob(
                  [JSON.stringify({ user, searches }, null, 2)],
                  { type: "application/json" },
                );
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "nook-export.json";
                a.click();
                URL.revokeObjectURL(url);
                toast.success("Export downloaded");
              }}
            >
              <Download className="h-3.5 w-3.5" /> Export
            </OriginButton>
          </div>

          <div className="px-5 py-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="text-sm font-semibold text-danger">Delete account</div>
              <div className="text-xs text-charcoal-600 mt-0.5">
                Removes your <span className="font-semibold text-charcoal-800">entire account</span>,
                including all searches, alerts, and profile data. Different from “Delete search” on
                an individual search.
              </div>
            </div>
            <DeleteAccountButton />
          </div>
        </div>
      </section>

      {/* Session */}
      <section>
        <h2 className="font-display text-xl font-semibold text-charcoal-950 mb-4">Session</h2>
        <div className="rounded-card bg-paper-warm border border-border">
          <LogoutRow />
        </div>
      </section>

      <StickySaveBar
        state={{ timezone, prefs: { marketingEmails: prefs.marketingEmails, productUpdates: prefs.productUpdates } }}
        onDiscard={(snap) => {
          setTimezone(snap.timezone);
          prefs.setPref("marketingEmails", snap.prefs.marketingEmails);
          prefs.setPref("productUpdates", snap.prefs.productUpdates);
        }}
      />

      <SyncProfile timezone={timezone} update={updateProfile} />
    </div>
  );
}

function SyncProfile({
  timezone, update,
}: {
  timezone: string;
  update: (p: Partial<NonNullable<ReturnType<typeof useAppStore.getState>["user"]>>) => void;
}) {
  useEffect(() => {
    update({ timezone });
  }, [timezone, update]);
  return null;
}

function StatCard({
  icon: Icon, label, value, footer, progress,
}: {
  icon: typeof Sparkles; label: string; value: string; footer: React.ReactNode; progress?: number;
}) {
  return (
    <div className="rounded-card border border-border bg-white p-6">
      <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.18em] text-charcoal-500">
        <Icon className="h-3.5 w-3.5" /> {label}
      </div>
      <div className="mt-2 font-display text-2xl font-bold text-charcoal-950 tabular-nums">{value}</div>
      {typeof progress === "number" && (
        <div className="mt-3 h-1.5 w-full rounded-full bg-charcoal-950/8 overflow-hidden">
          <div
            className="h-full bg-charcoal-950 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      <div className="mt-2 text-xs text-charcoal-600">{footer}</div>
    </div>
  );
}

function Field({
  id, label, icon: Icon, error, children,
}: {
  id: string; label: string; icon: typeof Mail; error?: string; children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="inline-flex items-center gap-1.5 text-sm font-medium text-charcoal-700">
        {Icon && <Icon className="h-3.5 w-3.5" />} {label}
      </label>
      {children}
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}

function ToggleRow({
  label, desc, checked, onChange, disabled, alwaysOnNote,
}: {
  label: string; desc: string; checked: boolean; onChange: (v: boolean) => void;
  disabled?: boolean; alwaysOnNote?: string;
}) {
  return (
    <div className="px-5 py-4 flex items-start justify-between gap-4">
      <div className="min-w-0">
        <div className="text-sm font-semibold text-charcoal-950 flex items-center gap-2">
          {label}
          {alwaysOnNote && (
            <span className="text-[10px] font-mono uppercase tracking-wider text-charcoal-500">
              {alwaysOnNote}
            </span>
          )}
        </div>
        <div className="text-xs text-charcoal-600 mt-0.5">{desc}</div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          "relative shrink-0 mt-0.5 rounded-full transition-colors",
          checked ? "" : "bg-charcoal-300",
          disabled && "opacity-60 cursor-not-allowed",
        )}
        style={{ width: 44, height: 24, background: checked ? "#6A820A" : undefined }}

      >
        <span
          className="absolute top-1/2 -translate-y-1/2 rounded-full bg-white shadow-sm transition-[left] duration-200"
          style={{ width: 20, height: 20, left: checked ? 22 : 2 }}
        />
      </button>

    </div>
  );
}

function LogoutRow() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const resetApp = useAppStore((s) => s.reset);
  const [busy, setBusy] = useState(false);

  const handleLogout = async () => {
    setBusy(true);
    try {
      await queryClient.cancelQueries();
      queryClient.clear();
      await supabase.auth.signOut();
      resetApp();
      navigate({ to: "/login", replace: true });
    } catch (e) {
      toast.error("Could not log out. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="px-5 py-4 flex items-center justify-between gap-4">
      <div className="min-w-0 flex items-center gap-3">
        <img src={doorAsset.url} alt="" className="h-10 w-auto object-contain shrink-0" />
        <div>
          <div className="text-sm font-semibold text-charcoal-950">Log out</div>
          <div className="text-xs text-charcoal-600 mt-0.5">Sign out of your account on this device.</div>
        </div>
      </div>
      <OriginButton
        variant="tertiary"
        size="medium"
        onClick={handleLogout}
        disabled={busy}
        loading={busy}
      >
        Log out
      </OriginButton>
    </div>
  );
}





function passwordStrength(p: string): { score: 0|1|2|3|4; label: string } {
  let s = 0;
  if (p.length >= 10) s++;
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
  if (/\d/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  const label = ["Too short", "Weak", "Okay", "Strong", "Excellent"][s];
  return { score: s as 0|1|2|3|4, label };
}



/* =========================================================================
   Delete-account flow (5 steps + 30-day grace)
   ========================================================================= */

function PasswordField({
  id, label, value, onChange, show, onToggle, error, autoFocus, autoComplete,
}: {
  id: string; label: string; value: string; onChange: (v: string) => void;
  show: boolean; onToggle: () => void; error?: string;
  autoFocus?: boolean; autoComplete?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-[11px] font-mono uppercase tracking-[0.18em] text-charcoal-500">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          autoFocus={autoFocus}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            "w-full h-11 pl-4 pr-11 rounded-md bg-surface-elevated border focus:outline-none text-sm",
            error ? "border-danger/60 focus:border-danger" : "border-border focus:border-charcoal-950",
          )}
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 inline-flex items-center justify-center rounded-md text-charcoal-500 hover:text-charcoal-950 hover:bg-paper"
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}

function DeleteAccountButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <OriginButton
        variant="tertiary"
        size="medium"
        onClick={() => setOpen(true)}
      >
        <Trash2 className="h-3.5 w-3.5" /> Delete account
      </OriginButton>
      <DeleteAccountDialog open={open} onOpenChange={setOpen} />
    </>
  );
}

type DeleteStep = "reason" | "alternatives" | "losses" | "reauth" | "confirm";
type DeleteReason = "found" | "expensive" | "matches" | "privacy" | "unused" | "other";

const DELETE_REASONS: { id: DeleteReason; label: string }[] = [
  { id: "found", label: "I found a place / done renting" },
  { id: "expensive", label: "Too expensive" },
  { id: "matches", label: "Didn't find enough good matches" },
  { id: "privacy", label: "Privacy concerns" },
  { id: "unused", label: "Just not using it" },
  { id: "other", label: "Something else" },
];

function DeleteAccountDialog({
  open, onOpenChange,
}: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [step, setStep] = useState<DeleteStep>("reason");
  const [reason, setReason] = useState<DeleteReason | null>(null);
  const [feedback, setFeedback] = useState("");
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState<string | null>(null);
  const [confirmText, setConfirmText] = useState("");
  const resetApp = useAppStore((s) => s.reset);
  const plan = useAppStore((s) => s.user?.plan ?? "free");
  const isPaid = plan !== "free";
  const updatePlanMut = useUpdatePlanMutation();
  const prefs = usePreferencesStore();

  const closeAll = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep("reason");
      setReason(null); setFeedback("");
      setPw(""); setPwError(null); setConfirmText("");
    }, 200);
  };

  const goToOffer = () => {
    // Log feedback (analytics stub)
    if (reason || feedback) {
      // eslint-disable-next-line no-console
      console.log("[deletion_feedback]", { reason, feedback, plan });
    }
    setStep("alternatives");
  };

  const stepLabels: DeleteStep[] = ["reason", "alternatives", "losses", "reauth", "confirm"];
  const stepIndex = stepLabels.indexOf(step) + 1;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) closeAll(); else onOpenChange(v); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between gap-3">
            <DialogTitle className="flex items-center gap-2">
              {step !== "reason" && (
                <button
                  type="button"
                  onClick={() => {
                    const i = stepLabels.indexOf(step);
                    if (i > 0) setStep(stepLabels[i - 1]);
                  }}
                  className="h-7 w-7 inline-flex items-center justify-center rounded-md hover:bg-paper text-charcoal-600"
                  aria-label="Back"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
              )}
              Delete account
            </DialogTitle>
            <span className="text-[10px] font-mono uppercase tracking-wider text-charcoal-500">
              Step {stepIndex} of 5
            </span>
          </div>
        </DialogHeader>

        {step === "reason" && (
          <div className="space-y-3">
            <p className="text-sm text-charcoal-700">
              Sorry to see you go — what's driving this? <span className="text-charcoal-500">(optional)</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {DELETE_REASONS.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setReason(reason === r.id ? null : r.id)}
                  className={cn(
                    "px-3 py-2 rounded-pill text-xs font-medium border transition-colors",
                    reason === r.id
                      ? "border-charcoal-950 bg-charcoal-950 text-paper"
                      : "border-charcoal-950/15 bg-paper-warm text-charcoal-800 hover:border-charcoal-400",
                  )}
                >
                  {r.label}
                </button>
              ))}
            </div>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value.slice(0, 1000))}
              placeholder="Anything we could've done better?"
              rows={3}
              className="w-full px-4 py-3 rounded-md bg-surface-elevated border border-border focus:border-charcoal-950 focus:outline-none text-sm resize-none"
            />
            <DialogFooter className="!justify-between pt-2">
              <button
                type="button"
                onClick={() => { setReason(null); setFeedback(""); setStep("losses"); }}
                className="text-sm text-charcoal-600 hover:text-charcoal-950 underline-offset-4 hover:underline"
              >
                Skip
              </button>
              <button
                type="button"
                onClick={goToOffer}
                className="h-10 px-5 rounded-pill text-sm font-semibold bg-charcoal-950 text-paper hover:bg-charcoal-800"
              >
                Continue
              </button>
            </DialogFooter>
          </div>
        )}

        {step === "alternatives" && (
          <DeleteAlternatives
            reason={reason}
            isPaid={isPaid}
            onAccept={(msg) => { toast.success(msg); closeAll(); }}
            onDowngradeFree={() => {
              updatePlanMut.mutate({ plan: "free", billingCycle: "monthly" });
              toast.success("Moved to Free plan");
              closeAll();
            }}
            onTurnOffEmails={() => {
              prefs.setPref("productUpdates", false);
              prefs.setPref("marketingEmails", false);
              toast.success("Optional emails turned off");
              closeAll();
            }}
            onContinue={() => setStep("losses")}
            onKeep={closeAll}
          />
        )}

        {step === "losses" && (
          <div className="space-y-4">
            <p className="text-sm text-charcoal-700">
              When you delete, you'll lose:
            </p>
            <ul className="space-y-2 text-sm text-charcoal-800 rounded-card bg-paper-warm border border-border p-4">
              {[
                "All saved searches and filter settings",
                "Alert history and saved listings",
                "Your Wren AI chats",
                "Referral credits and bonuses",
                "Your profile and preferences",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 rounded-full bg-charcoal-500 shrink-0" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            {isPaid && (
              <div className="rounded-card border border-charcoal-950/12 bg-paper-warm p-3 text-xs text-charcoal-700 leading-relaxed">
                This also cancels your <span className="font-semibold text-charcoal-950">{plan}</span> subscription.
                No refund for the current period (see Refund Policy).
              </div>
            )}
            <p className="text-xs text-charcoal-600 leading-relaxed">
              Some records required by law (tax and transaction history) are retained per our Privacy Policy.
              After the 30-day grace period, deletion can't be undone.
            </p>
            <DialogFooter>
              <button
                type="button"
                onClick={closeAll}
                className="h-10 px-4 rounded-pill border border-charcoal-950/15 text-sm font-semibold text-charcoal-950 hover:bg-paper"
              >
                Keep my account
              </button>
              <button
                type="button"
                onClick={() => setStep("reauth")}
                className="h-10 px-5 rounded-pill text-sm font-semibold border border-danger/40 text-danger hover:bg-danger/10"
              >
                Continue
              </button>
            </DialogFooter>
          </div>
        )}

        {step === "reauth" && (
          <div className="space-y-4">
            <p className="text-sm text-charcoal-700">
              For your security, please re-enter your password.
            </p>
            <PasswordField
              id="del-pw"
              label="Current password"
              value={pw}
              onChange={(v) => { setPw(v); setPwError(null); }}
              show={false}
              onToggle={() => {}}
              error={pwError ?? undefined}
              autoFocus
              autoComplete="current-password"
            />
            <DialogFooter>
              <button
                type="button"
                onClick={closeAll}
                className="h-10 px-4 rounded-pill border border-charcoal-950/15 text-sm font-semibold text-charcoal-950 hover:bg-paper"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={pw.length === 0}
                onClick={() => {
                  if (pw === "wrongpass") {
                    setPwError("That password doesn't match.");
                    return;
                  }
                  setStep("confirm");
                }}
                className={cn(
                  "h-10 px-5 rounded-pill text-sm font-semibold transition-colors",
                  pw.length > 0
                    ? "border border-danger/40 text-danger hover:bg-danger/10"
                    : "bg-charcoal-950/10 text-charcoal-500 cursor-not-allowed",
                )}
              >
                Verify
              </button>
            </DialogFooter>
          </div>
        )}

        {step === "confirm" && (
          <div className="space-y-4">
            <p className="text-sm text-charcoal-700">
              Type <span className="font-mono font-semibold text-charcoal-950">DELETE</span> to confirm.
              Your account will be deactivated immediately and permanently removed after a 30-day grace period.
            </p>
            <input
              autoFocus
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
              className="w-full h-11 px-4 rounded-md bg-surface-elevated border border-border focus:border-danger focus:outline-none text-sm font-mono"
            />
            <DialogFooter>
              <button
                type="button"
                onClick={closeAll}
                className="h-10 px-4 rounded-pill border border-charcoal-950/15 text-sm font-semibold text-charcoal-950 hover:bg-paper"
              >
                Keep my account
              </button>
              <button
                type="button"
                disabled={confirmText !== "DELETE"}
                onClick={() => {
                  resetApp();
                  closeAll();
                  toast.success("Account scheduled for deletion", {
                    description: "You have 30 days to restore by signing back in.",
                    duration: 6000,
                  });
                }}
                className={cn(
                  "h-10 px-5 rounded-pill text-sm font-semibold transition-colors",
                  confirmText === "DELETE"
                    ? "bg-danger text-paper hover:bg-danger/90"
                    : "bg-charcoal-950/10 text-charcoal-500 cursor-not-allowed",
                )}
              >
                Delete my account
              </button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function DeleteAlternatives({
  reason, isPaid, onAccept, onDowngradeFree, onTurnOffEmails, onContinue, onKeep,
}: {
  reason: DeleteReason | null;
  isPaid: boolean;
  onAccept: (msg: string) => void;
  onDowngradeFree: () => void;
  onTurnOffEmails: () => void;
  onContinue: () => void;
  onKeep: () => void;
}) {
  // Privacy reason: no retention offer. Show data-control alternatives.
  if (reason === "privacy") {
    return (
      <div className="space-y-3">
        <p className="text-sm text-charcoal-700">
          Before you delete — you may also want to:
        </p>
        <AltRow
          icon={Download}
          label="Export your data first"
          desc="Download a JSON copy of your searches, alerts, and profile."
          onClick={() => {
            toast.success("Export downloaded");
          }}
        />
        <AltRow
          icon={Bell}
          label="Turn off all tracking & emails"
          desc="Stop all optional emails and analytics. Keep your account inactive."
          onClick={onTurnOffEmails}
        />
        <p className="text-xs text-charcoal-600">
          See our <a href="/privacy" className="text-sage-700 underline-offset-2 hover:underline">Privacy Policy</a> for what's retained.
        </p>
        <DialogFooter className="!justify-between pt-2">
          <button
            type="button"
            onClick={onKeep}
            className="text-sm text-charcoal-600 hover:text-charcoal-950 underline-offset-4 hover:underline"
          >
            Keep my account
          </button>
          <button
            type="button"
            onClick={onContinue}
            className="text-sm font-semibold text-danger underline-offset-4 hover:underline inline-flex items-center gap-1"
          >
            Continue to delete <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </DialogFooter>
      </div>
    );
  }

  type Alt =
    | { kind: "accept"; icon: typeof Mail; label: string; desc: string; toast: string }
    | { kind: "downgrade"; icon: typeof Mail; label: string; desc: string }
    | { kind: "emails-off"; icon: typeof Mail; label: string; desc: string };

  const alts: Alt[] = [];

  if (reason === "expensive") {
    if (isPaid) {
      alts.push({ kind: "accept", icon: Tag, label: "50% off for 3 months", desc: "Stay on your plan at half price.", toast: "50% off applied for 3 months" });
      alts.push({ kind: "accept", icon: PauseCircle, label: "Pause billing", desc: "Keep your data; no charges while paused.", toast: "Billing paused" });
      alts.push({ kind: "downgrade", icon: Sparkles, label: "Downgrade to Free", desc: "Keep 1 saved search. No charges." });
    } else {
      alts.push({ kind: "emails-off", icon: Bell, label: "Turn off all emails", desc: "Quiet the inbox. Keep your account dormant." });
    }
  } else if (reason === "found") {
    if (isPaid) {
      alts.push({ kind: "accept", icon: PauseCircle, label: "Pause — your data waits for next move", desc: "No charges while paused.", toast: "Subscription paused" });
    }
    alts.push({ kind: "accept", icon: Heart, label: "List your move-out · earn $50", desc: "Help someone else find your spot.", toast: "Move-out listing started" });
    alts.push({ kind: "accept", icon: Sparkles, label: "Refer a friend", desc: "Both get a free week of Premium.", toast: "Referral link copied" });
  } else if (reason === "matches") {
    alts.push({ kind: "accept", icon: MessageCircle, label: "Let Wren retune your search", desc: "Free session — refine filters with AI.", toast: "Open Wren to retune your search" });
    if (isPaid) {
      alts.push({ kind: "accept", icon: Tag, label: "1 month free to retry", desc: "Give it another shot on us.", toast: "1 month free added" });
    }
  } else if (reason === "unused" || reason === "other" || reason === null) {
    if (isPaid) {
      alts.push({ kind: "accept", icon: PauseCircle, label: "Pause billing", desc: "Keep your account and data. No charges.", toast: "Billing paused" });
    }
    alts.push({ kind: "emails-off", icon: Bell, label: "Keep account dormant", desc: "Turn off optional emails. We'll be here when you're ready." });
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-charcoal-700">
        Deleting is permanent. Would one of these work instead?
      </p>
      {alts.map((a) => (
        <AltRow
          key={a.label}
          icon={a.icon}
          label={a.label}
          desc={a.desc}
          onClick={() => {
            if (a.kind === "accept") onAccept(a.toast);
            else if (a.kind === "downgrade") onDowngradeFree();
            else onTurnOffEmails();
          }}
        />
      ))}
      <DialogFooter className="!justify-between pt-2">
        <button
          type="button"
          onClick={onKeep}
          className="text-sm text-charcoal-600 hover:text-charcoal-950 underline-offset-4 hover:underline"
        >
          Keep my account
        </button>
        <button
          type="button"
          onClick={onContinue}
          className="text-sm font-semibold text-danger underline-offset-4 hover:underline inline-flex items-center gap-1"
        >
          No — delete my account <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </DialogFooter>
    </div>
  );
}

function AltRow({
  icon: Icon, label, desc, onClick,
}: { icon: typeof Mail; label: string; desc: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left rounded-card border border-border bg-paper-warm hover:border-charcoal-400 transition-colors px-4 py-3 flex items-center gap-3 group"
    >
      <Icon className="h-4 w-4 text-sage-700 shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold text-charcoal-950">{label}</div>
        <div className="text-xs text-charcoal-600 mt-0.5">{desc}</div>
      </div>
      <ChevronRight className="h-4 w-4 text-charcoal-400 group-hover:text-charcoal-950 shrink-0" />
    </button>
  );
}

/* =========================================================================
   Cancel-subscription retention flow
   ========================================================================= */

type CancelReason = "expensive" | "found" | "matches" | "break" | "other";
type CancelStep = "reason" | "offer" | "confirm";

function CancelSubscriptionDialog({
  open, onOpenChange, periodEnd,
}: { open: boolean; onOpenChange: (v: boolean) => void; periodEnd: string }) {
  const [step, setStep] = useState<CancelStep>("reason");
  const [reason, setReason] = useState<CancelReason | null>(null);
  const updatePlanMut = useUpdatePlanMutation();

  const close = () => {
    onOpenChange(false);
    setTimeout(() => { setStep("reason"); setReason(null); }, 200);
  };

  const reasons: { id: CancelReason; label: string }[] = [
    { id: "expensive", label: "Too expensive" },
    { id: "found", label: "I found a place" },
    { id: "matches", label: "Not enough good matches" },
    { id: "break", label: "Just taking a break" },
    { id: "other", label: "Something else" },
  ];

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) close(); else onOpenChange(v); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Cancel subscription</DialogTitle>
          {step === "reason" && (
            <DialogDescription>
              Before you go — what's prompting this? It helps us improve.
            </DialogDescription>
          )}
        </DialogHeader>

        {step === "reason" && (
          <div className="space-y-2">
            {reasons.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setReason(r.id)}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-card border text-sm font-medium transition-colors",
                  reason === r.id
                    ? "border-charcoal-950 bg-paper-warm text-charcoal-950"
                    : "border-border bg-paper-warm hover:border-charcoal-400 text-charcoal-800",
                )}
              >
                {r.label}
              </button>
            ))}
            <DialogFooter className="!justify-between pt-3">
              <button
                type="button"
                onClick={() => { setReason("other"); setStep("confirm"); }}
                className="text-sm text-charcoal-600 hover:text-charcoal-950 underline-offset-4 hover:underline"
              >
                Cancel anyway
              </button>
              <button
                type="button"
                disabled={!reason}
                onClick={() => setStep("offer")}
                className={cn(
                  "h-10 px-5 rounded-pill text-sm font-semibold transition-colors",
                  reason
                    ? "bg-charcoal-950 text-paper hover:bg-charcoal-800"
                    : "bg-charcoal-950/10 text-charcoal-500 cursor-not-allowed",
                )}
              >
                Continue
              </button>
            </DialogFooter>
          </div>
        )}

        {step === "offer" && reason && (
          <CancelOffer
            reason={reason}
            onAccept={(msg) => { toast.success(msg); close(); }}
            onDecline={() => setStep("confirm")}
            onDowngradeFree={() => {
              updatePlanMut.mutate({ plan: "free", billingCycle: "monthly" });
              toast.success("Moved to Free plan — kept 1 search");
              close();
            }}
          />
        )}

        {step === "confirm" && (
          <div className="space-y-4">
            <p className="text-sm text-charcoal-700 leading-relaxed">
              You'll keep your paid features until <span className="font-semibold text-charcoal-950">{periodEnd}</span>,
              then move to Free. Your searches pause; data is kept per our Privacy Policy.
            </p>
            <DialogFooter>
              <button
                type="button"
                onClick={close}
                className="h-10 px-4 rounded-pill border border-charcoal-950/15 text-sm font-semibold text-charcoal-950 hover:bg-paper"
              >
                Keep my plan
              </button>
              <button
                type="button"
                onClick={() => {
                  updatePlanMut.mutate({ plan: "free", billingCycle: "monthly" });
                  close();
                  toast.success(`Subscription canceled — active until ${periodEnd}`);
                }}
                className="h-10 px-5 rounded-pill text-sm font-semibold border border-danger/40 text-danger hover:bg-danger/10"
              >
                Cancel subscription
              </button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function CancelOffer({
  reason, onAccept, onDecline, onDowngradeFree,
}: {
  reason: CancelReason;
  onAccept: (toastMsg: string) => void;
  onDecline: () => void;
  onDowngradeFree: () => void;
}) {
  type OfferAction =
    | { kind: "accept"; label: string; toast: string }
    | { kind: "downgrade-free"; label: string }
    | { kind: "decline"; label: string };

  const config: Record<CancelReason, {
    icon: typeof Mail;
    title: string;
    desc: string;
    actions: OfferAction[];
  }> = {
    expensive: {
      icon: Tag,
      title: "50% off for the next 2 months",
      desc: "Stay on Premium at half price — automatic, no code needed.",
      actions: [
        { kind: "accept", label: "Apply 50% off", toast: "50% off applied for 2 months" },
        { kind: "downgrade-free", label: "Switch to Free (keep 1 search)" },
        { kind: "decline", label: "No thanks, cancel" },
      ],
    },
    found: {
      icon: Heart,
      title: "Congrats! Pause instead of canceling",
      desc: "Your searches wait quietly for your next move — no charges while paused. You can also list your move-out and earn $50.",
      actions: [
        { kind: "accept", label: "Pause for 1 month", toast: "Paused for 1 month" },
        { kind: "accept", label: "List my move-out · earn $50", toast: "Move-out listing started" },
        { kind: "decline", label: "No thanks, cancel" },
      ],
    },
    matches: {
      icon: MessageCircle,
      title: "Let Wren retune your search",
      desc: "A free Wren session to refine filters — plus 1 month free to give it another shot.",
      actions: [
        { kind: "accept", label: "Retune with Wren + 1 month free", toast: "1 month free added — open Wren to retune" },
        { kind: "decline", label: "No thanks, cancel" },
      ],
    },
    break: {
      icon: PauseCircle,
      title: "Pause — no charges while you're away",
      desc: "Pick how long. We'll resume right where you left off.",
      actions: [
        { kind: "accept", label: "Pause 1 month", toast: "Paused for 1 month" },
        { kind: "accept", label: "Pause 2 months", toast: "Paused for 2 months" },
        { kind: "accept", label: "Pause 3 months", toast: "Paused for 3 months" },
        { kind: "decline", label: "No thanks, cancel" },
      ],
    },
    other: {
      icon: MessageCircle,
      title: "Talk to us — or pause instead",
      desc: "Tell us what's off and we'll try to help. Or pause and decide later.",
      actions: [
        { kind: "accept", label: "Pause 1 month", toast: "Paused for 1 month" },
        { kind: "accept", label: "Contact support", toast: "Support thread opened" },
        { kind: "decline", label: "No thanks, cancel" },
      ],
    },
  };

  const c = config[reason];
  const Icon = c.icon;

  return (
    <div className="space-y-4">
      <div className="rounded-card border border-sage-300/60 bg-sage-100/40 p-4">
        <div className="flex items-start gap-3">
          <Icon className="h-5 w-5 text-sage-700 shrink-0 mt-0.5" />
          <div>
            <div className="font-display text-base font-semibold text-charcoal-950">{c.title}</div>
            <p className="text-xs text-charcoal-700 mt-1 leading-relaxed">{c.desc}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {c.actions.map((a, i) => {
          const primary = i === 0;
          const handle = () => {
            if (a.kind === "accept") onAccept(a.toast);
            else if (a.kind === "downgrade-free") onDowngradeFree();
            else onDecline();
          };
          return (
            <button
              key={a.label}
              type="button"
              onClick={handle}
              className={cn(
                "h-11 px-4 rounded-pill text-sm font-semibold transition-colors",
                primary
                  ? "bg-sage-700 text-paper hover:bg-sage-800"
                  : a.kind === "decline"
                    ? "border border-charcoal-950/15 text-charcoal-800 hover:bg-paper"
                    : "border border-charcoal-950/15 text-charcoal-950 hover:bg-paper",
              )}
            >
              {a.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}


function PlanCard({
  plan, currentPlan, activeCycle, trialEndsAt, periodEnd, onCancelRequest,
}: {
  plan: PlanDef;
  currentPlan: Plan;
  activeCycle: BillingCycle;
  trialEndsAt?: string;
  periodEnd: string;
  onCancelRequest: () => void;
}) {
  const isCurrent = plan.id === currentPlan && (plan.id === "free" || plan.cycle === activeCycle);
  const priceLabel = plan.id === "free" ? "$0" : `$${plan.monthly}`;
  const suffix = plan.id === "free" ? "for 3 days" : "/month";
  const updatePlanMut = useUpdatePlanMutation();
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const dur = reduce ? 0 : 0.25;

  // Rank: Intro (0) < Pro monthly (1) < Pro annual (2)
  const rankOf = (p: Plan, c: BillingCycle) =>
    p === "free" ? 0 : 1 + (c === "annual" ? 1 : 0);
  const targetRank = rankOf(plan.id, plan.cycle);
  const currentRank = rankOf(currentPlan, activeCycle);
  const isUpgrade = targetRank > currentRank;
  const isDowngrade = targetRank < currentRank;

  const trialDaysLeft = useMemo(() => {
    if (!trialEndsAt) return 3;
    const end = new Date(trialEndsAt);
    const now = new Date();
    const ms = end.getTime() - now.getTime();
    return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
  }, [trialEndsAt]);

  const firstChargeDate = useMemo(() => {
    if (trialEndsAt) {
      const d = new Date(trialEndsAt);
      return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
    }
    return periodEnd;
  }, [trialEndsAt, periodEnd]);

  const CANCEL_TAIL = "Cancel anytime in Account → Subscription in two steps.";

  const billLine = isCurrent
    ? plan.id === "free"
      ? `${trialDaysLeft} day${trialDaysLeft === 1 ? "" : "s"} left`
      : `next charge ${periodEnd}`
    : plan.id === "free"
      ? "then $14.99/month"
      : plan.cycle === "annual"
        ? "billed $95.88/year"
        : currentRank === 2
          ? "billed monthly"
          : "billed today";

  const disclaimer = isCurrent
    ? plan.id === "free"
      ? `First charge $14.99 on ${firstChargeDate}.`
      : plan.cycle === "annual"
        ? `Auto-renews at $95.88/year until cancelled. ${CANCEL_TAIL}`
        : `You keep Pro until then. Nothing is deleted.`
    : plan.id === "free"
      ? `Card required. After 3 days $14.99/month until cancelled. ${CANCEL_TAIL}`
      : plan.cycle === "annual"
        ? `$95.88 charged on ${periodEnd}, then yearly until cancelled. ${CANCEL_TAIL}`
        : `Auto-renews at $14.99/month until cancelled. ${CANCEL_TAIL}`;

  const ctaLabel = isCurrent
    ? plan.id === "free"
      ? ""
      : `Cancel on ${periodEnd}`
    : isUpgrade
      ? plan.cycle === "annual"
        ? "Switch to annual"
        : "Unlock all matches now"
      : "Switch to monthly";

  const handleClick = () => {
    if (isCurrent && plan.id !== "free") {
      onCancelRequest();
    } else {
      setOpen(true);
    }
  };

  const dark = plan.id !== "free";
  const text = dark ? "#f8f3e1" : "#241c12";
  const checkColor = dark ? "#c2dd93" : "#6a820a";
  const lockColor = "#db5919";
  const badge = plan.cycle === "annual" ? { text: "Save 47%", bg: "#6a820a" } : null;
  const stateBadge = isCurrent ? (plan.id === "free" ? "Current" : "Your plan") : null;

  const cardStyle: React.CSSProperties = dark
    ? {
        backgroundColor: "#2c2415",
        backgroundImage: WARM_BG,
        boxShadow: DARK_SHADOW,
        color: text,
      }
    : {
        background: "#ffffff",
        border: "1px solid rgba(0,0,0,0.20)",
        color: text,
      };

  const ctaVariant = plan.id === "free" ? "tertiary" : "premium";

  return (
    <div
      className={cn(
        "relative p-8 rounded-[24px] flex flex-col gap-4",
        isCurrent && !dark && "bg-paper-warm",
      )}
      style={cardStyle}
    >
      {/* promo badge slot */}
      <div
        className="absolute -top-4 left-0 right-8 flex justify-end pointer-events-none"
        aria-hidden={!badge}
      >
        {badge && (
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={dur === 0 ? { duration: 0 } : { type: "spring", stiffness: 520, damping: 12, mass: 0.6 }}
            className="inline-block rounded-full px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[1.32px] text-white"
            style={{ background: badge.bg, fontFamily: "'Google Sans Flex', sans-serif" }}
          >
            {badge.text}
          </motion.span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div
          className="text-[13px] font-bold uppercase tracking-[1.82px]"
          style={{ fontFamily: "'Google Sans Flex', sans-serif" }}
        >
          {plan.label}
          {stateBadge && (
            <span
              className="ml-2 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.04em]"
              style={{
                fontFamily: "'Google Sans Flex', sans-serif",
                background: dark ? "#5c6d18" : "#EFEBDE",
                color: dark ? "#E7EFCB" : "#5f5a4c",
              }}
            >
              {stateBadge}
            </span>
          )}
        </div>
      </div>

      <div
        className="text-sm opacity-80"
        style={{ fontFamily: "'Google Sans Flex', sans-serif" }}
      >
        {plan.tagline}
      </div>

      <div className="flex items-baseline gap-2 pb-2">
        <motion.span
          key={priceLabel}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: dur, ease: "easeOut" }}
          className="font-display text-[46px] leading-[46px] font-semibold"
        >
          {priceLabel}
        </motion.span>
        <span
          className="text-sm font-medium opacity-70"
          style={{ fontFamily: "'Google Sans Flex', sans-serif" }}
        >
          {suffix}
        </span>
      </div>

      <div
        className="text-[13px] font-semibold"
        style={{ fontFamily: "'Google Sans Flex', sans-serif", color: dark ? "#D6DEB8" : "#cb4a0a" }}
      >
        {billLine}
      </div>

      {isCurrent && plan.id === "free" ? (
        <div className="w-full h-[56px]" />
      ) : (
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <OriginButton
              className="w-full"
              variant={ctaVariant}
              style={{ borderRadius: 12 }}
              disabled={updatePlanMut.isPending}
              onClick={handleClick}
            >
              {ctaLabel}
            </OriginButton>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{ctaLabel}?</AlertDialogTitle>
              <AlertDialogDescription>
                {isDowngrade ? (
                  <>
                    Your plan will change to{" "}
                    <span className="font-semibold text-charcoal-950">{plan.label}</span>{" "}
                    ({priceLabel}{suffix}) at the end of your current billing period.
                  </>
                ) : (
                  <>
                    You're about to switch to{" "}
                    <span className="font-semibold text-charcoal-950">{plan.label}</span>{" "}
                    ({priceLabel}{suffix}).{" "}
                    {plan.cycle === "annual"
                      ? "This will auto-renew at $95.88/year until cancelled."
                      : "This will auto-renew at $14.99/month until cancelled."}
                  </>
                )}{" "}
                <span className="text-charcoal-500">No payment will be charged — this is a demo flow.</span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep my plan</AlertDialogCancel>
              <AlertDialogAction
                disabled={updatePlanMut.isPending}
                onClick={() => {
                  updatePlanMut.mutate(
                    { plan: plan.id, billingCycle: plan.cycle },
                    { onSuccess: () => setOpen(false) },
                  );
                }}
                className="bg-charcoal-950 text-paper hover:bg-charcoal-800"
              >
                {updatePlanMut.isPending ? "Updating…" : "Confirm"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      <div
        className="text-xs leading-5"
        style={{ fontFamily: "'Google Sans Flex', sans-serif", opacity: 0.72 }}
      >
        {disclaimer}
      </div>

      <ul className="flex flex-col gap-3 pt-2">
        {plan.features.map((f) => (
          <li
            key={f.text}
            className="flex items-start gap-2.5 text-sm"
            style={{ fontFamily: "'Google Sans Flex', sans-serif", opacity: 1 }}
          >
            {f.icon === "check" ? (
              <Check size={16} strokeWidth={2} style={{ flexShrink: 0, marginTop: 3, color: checkColor }} />
            ) : (
              <Lock size={16} strokeWidth={2} style={{ flexShrink: 0, marginTop: 3, color: lockColor }} />
            )}
            <span style={f.bold ? { fontWeight: 600, color: f.icon === "lock" ? lockColor : text } : undefined}>
              {f.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CurrentPlanCard({
  plan,
  currentPlan,
  trialActive,
  periodEnd,
  onCancelRequest,
}: {
  plan: Plan;
  currentPlan: PlanDef;
  trialActive: boolean;
  periodEnd: string;
  onCancelRequest: () => void;
}) {
  const isPaid = plan !== "free";
  const dark = isPaid;

  const cardStyle: React.CSSProperties = dark
    ? {
        backgroundColor: "#2c2415",
        backgroundImage: WARM_BG,
        boxShadow:
          "0px 2px 1px rgba(36,28,18,0.08), 0px 24px 14px rgba(36,28,18,0.28)",
        color: "#f8f3e1",
        borderRadius: 24,
      }
    : {
        background: "#ffffff",
        border: "1px solid rgba(0,0,0,0.20)",
        color: "#241c12",
        borderRadius: 24,
      };

  const ink = dark ? "#f8f3e1" : "#241c12";
  const muted = dark ? "rgba(248,243,225,0.72)" : "#5a5a55";
  const subtle = dark ? "rgba(248,243,225,0.70)" : "#5a5a55";

  const price = isPaid
    ? (currentPlan.cycle === "annual" ? `$${currentPlan.annual}` : `$${currentPlan.monthly}`)
    : "$0";
  const suffix = isPaid
    ? (currentPlan.cycle === "annual" ? "/year" : "/month")
    : "for 3 days";

  return (
    <div className="p-8" style={cardStyle}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div
            className="text-[11px] font-semibold uppercase tracking-[0.16em]"
            style={{ color: muted }}
          >
            Current plan
          </div>
          <div className="mt-2 flex flex-wrap items-baseline gap-2">
            <span
              className="font-display"
              style={{ fontWeight: 700, fontSize: 26, color: ink }}
            >
              {currentPlan.label}
            </span>
            <span
              className="text-[16px] font-semibold"
              style={{ color: ink }}
            >
              {price}
            </span>
            <span className="text-[14px]" style={{ color: subtle }}>
              {suffix}
            </span>
          </div>
          {isPaid && (
            <div className="mt-1 text-[14px]" style={{ color: muted }}>
              {trialActive ? "3-day free trial, then " : ""}
              billed {currentPlan.cycle === "annual" ? "annually" : "monthly"} · cancel anytime
              {periodEnd ? ` · next billing ${periodEnd}` : ""}
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancelRequest}
            className="text-sm font-semibold underline-offset-4 hover:underline"
            style={{ color: ink, opacity: 0.85 }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function ProfileTimezoneRow({ timezone, onChange }: { timezone: string; onChange: (tz: string) => void }) {
  const [open, setOpen] = useState(false);
  const display = timezone.replace(/_/g, " ");

  return (
    <>
      <div className="px-5 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={globeAsset.url}
            alt=""
            className="h-10 w-auto object-contain shrink-0"
            aria-hidden="true"
          />
          <div className="min-w-0">
            <div className="text-sm font-semibold text-charcoal-950">Timezone</div>
            <div className="text-xs text-charcoal-600 mt-0.5">{display}</div>
          </div>
        </div>
        <OriginButton
          variant="tertiary"
          size="medium"
          onClick={() => setOpen(true)}
        >
          Change
        </OriginButton>
      </div>

      <TimezoneDialog open={open} onOpenChange={setOpen} value={timezone} onChange={onChange} />

    </>
  );
}

function TimezoneDialog({
  open, onOpenChange, value, onChange,
}: {
  open: boolean; onOpenChange: (v: boolean) => void; value: string; onChange: (tz: string) => void;
}) {
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    if (open) setDraft(value);
  }, [open, value]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-semibold text-charcoal-950">Change timezone</DialogTitle>
          <DialogDescription className="text-sm text-charcoal-600">
            Choose your preferred timezone for alerts and reports.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="relative">
            <select
              id="dialog-tz"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="flex w-full rounded-[12px] border border-black/20 bg-white px-4 text-[14px] font-['Google_Sans_Flex',sans-serif] font-medium text-[#241c12] transition-colors hover:border-black/[0.32] focus:border-[#DF4400] focus:outline-none focus-visible:border-[#DF4400] focus-visible:outline-none focus-visible:ring-0 h-[56px] appearance-none"
            >
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>{tz.replace(/_/g, " ")}</option>
              ))}
            </select>
            <ChevronRight className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-charcoal-500" />
          </div>
          <DialogFooter className="pt-2">
            <button
              type="button"
              onClick={() => {
                onChange(draft);
                onOpenChange(false);
              }}
              className="inline-flex items-center justify-center h-11 px-5 rounded-[16px] text-sm font-semibold bg-[#241C12] text-white hover:bg-[#241C12]/90 transition-colors"
            >
              Save timezone
            </button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* --------------------------- Security: password change -------------------------- */
function ProfilePasswordRow() {
  const [open, setOpen] = useState(false);
  const user = useAppStore((s) => s.user);

  const lastChangedDate = useMemo(() => {
    if (!user?.updatedAt) return null;
    const d = new Date(user.updatedAt);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, [user?.updatedAt]);

  return (
    <>
      <div className="px-5 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={lockAsset.url}
            alt=""
            className="h-10 w-auto object-contain shrink-0"
            aria-hidden="true"
          />
          <div className="min-w-0">
            <div className="text-sm font-semibold text-charcoal-950">Password</div>
            <div className="text-xs text-charcoal-600 mt-0.5">
              {lastChangedDate ? `Last changed at ${lastChangedDate}` : "Change your account password"}
            </div>
          </div>
        </div>
        <OriginButton
          variant="tertiary"
          size="medium"
          onClick={() => setOpen(true)}
        >
          Change password
        </OriginButton>
      </div>

      <ChangePasswordDialog open={open} onOpenChange={setOpen} />

    </>
  );
}


function ChangePasswordDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const user = useAppStore((s) => s.user);

  const strength = passwordStrength(next);
  const canSubmit = current.length > 0 && next.length >= 8 && next === confirm && !loading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (next !== confirm) {
      setError("New passwords do not match.");
      return;
    }
    if (next.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (!user?.email) {
      setError("Unable to verify your session. Please sign in again.");
      return;
    }
    setLoading(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: current,
      });
      if (signInError) {
        setError("Current password is incorrect.");
        setLoading(false);
        return;
      }
      const { error: updateError } = await supabase.auth.updateUser({ password: next });
      if (updateError) {
        setError(updateError.message);
      } else {
        toast.success("Password updated successfully.");
        setCurrent("");
        setNext("");
        setConfirm("");
        onOpenChange(false);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-semibold text-charcoal-950">Change password</DialogTitle>
          <DialogDescription className="text-sm text-charcoal-600">
            Enter your current password and a new one below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <PasswordField
            id="current-password"
            label="Current password"
            value={current}
            onChange={setCurrent}
            show={showCurrent}
            onToggle={() => setShowCurrent((s) => !s)}
            autoComplete="current-password"
            autoFocus
          />
          <PasswordField
            id="new-password"
            label="New password"
            value={next}
            onChange={setNext}
            show={showNext}
            onToggle={() => setShowNext((s) => !s)}
            error={next.length > 0 && next.length < 8 ? "At least 8 characters" : undefined}
            autoComplete="new-password"
          />
          {next.length > 0 && (
            <div className="flex items-center gap-2 text-xs">
              <div className="flex-1 h-1.5 rounded-full bg-charcoal-200 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${(strength.score / 4) * 100}%`, background: strength.score < 2 ? "#E16D5E" : strength.score < 3 ? "#D66C38" : "#6A820A" }}
                />
              </div>
              <span className="text-charcoal-600">{strength.label}</span>
            </div>
          )}
          <PasswordField
            id="confirm-password"
            label="Confirm new password"
            value={confirm}
            onChange={setConfirm}
            show={showConfirm}
            onToggle={() => setShowConfirm((s) => !s)}
            error={confirm.length > 0 && confirm !== next ? "Passwords do not match" : undefined}
            autoComplete="new-password"
          />
          {error && (
            <p className="text-sm text-danger">{error}</p>
          )}
          <DialogFooter className="pt-2">
            <button
              type="submit"
              disabled={!canSubmit}
              className={cn(
                "inline-flex items-center justify-center h-11 px-5 rounded-[16px] text-sm font-semibold transition-colors",
                canSubmit
                  ? "bg-[#241C12] text-white hover:bg-[#241C12]/90"
                  : "bg-charcoal-950/10 text-charcoal-500 cursor-not-allowed",
              )}
            >
              {loading ? "Updating…" : "Update password"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function SubscriptionSection({
  plan, trialActive, trialEndsAt, currentPlan, activeCycle,
}: {
  plan: Plan;
  trialActive: boolean;
  trialEndsAt?: string;
  currentPlan: PlanDef;
  activeCycle: BillingCycle;
}) {
  const [cancelOpen, setCancelOpen] = useState(false);
  const periodEnd = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 18);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  }, []);

  // Determine which two cards to show so the user only sees actionable options.
  const visiblePlanKeys = useMemo(() => {
    if (plan === "free") return ["intro", "pro_monthly"];
    if (activeCycle === "annual") return ["pro_annual", "pro_monthly"];
    return ["pro_monthly", "pro_annual"];
  }, [plan, activeCycle]);

  const visiblePlans = PLANS.filter((p) => visiblePlanKeys.includes(p.key));

  return (
    <>
      <section>
        <h2 className="font-display text-xl font-semibold text-charcoal-950 mb-4">
          Subscription &amp; billing
        </h2>
        <CurrentPlanCard
          plan={plan}
          currentPlan={currentPlan}
          trialActive={trialActive}
          periodEnd={periodEnd}
          onCancelRequest={() => setCancelOpen(true)}
        />
        <CancelSubscriptionDialog
          open={cancelOpen}
          onOpenChange={setCancelOpen}
          periodEnd={periodEnd}
        />
      </section>

      <section id="plan-options">
        <div className="mb-5">
          <h2 className="font-display text-xl font-semibold text-charcoal-950">
            {plan === "free" ? "Upgrade your plan" : "Plan options"}
          </h2>
          <p className="text-sm text-charcoal-600 mt-1">
            Every match we find, plus up to 3 searches.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          {visiblePlans.map((p) => (
            <PlanCard
              key={p.key}
              plan={p}
              currentPlan={plan}
              activeCycle={activeCycle}
              trialEndsAt={trialEndsAt}
              periodEnd={periodEnd}
              onCancelRequest={() => setCancelOpen(true)}
            />
          ))}
        </div>
      </section>

      <PaymentMethodSection plan={plan} />

      <PaymentHistorySection plan={plan} cycle={activeCycle} currentPlan={currentPlan} />
    </>
  );
}

/* ------------------------- Payment method (Stripe) ------------------------- */

function PaymentMethodSection({ plan }: { plan: Plan }) {
  const hasCard = plan !== "free";
  return (
    <section>
      <h2 className="font-display text-xl font-semibold text-charcoal-950 mb-4">
        Payment method
      </h2>
      <div className="rounded-card bg-paper-warm border border-border">
        <div className="px-5 py-4 flex items-center justify-between gap-4">
          {hasCard ? (
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={cardAsset.url}
                alt="Payment card"
                className="h-10 w-auto object-contain"
              />
              <div className="min-w-0">
                <div className="text-sm font-semibold text-charcoal-950">
                  Visa •••• 4242
                </div>
                <div className="text-xs text-charcoal-600 mt-0.5">
                  Expires 04 / 2029 · Default
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={cardAsset.url}
                alt="Payment card"
                className="h-10 w-auto object-contain"
              />

              <div className="min-w-0">
                <div className="text-sm font-semibold text-charcoal-950">No card on file</div>
                <div className="text-xs text-charcoal-600 mt-0.5">
                  Add a card when you start a paid plan or trial.
                </div>
              </div>
            </div>
          )}
          <OriginButton
            variant="tertiary"
            size="medium"
            onClick={() =>
              toast.info("Stripe billing portal", {
                description: "Card management opens once Stripe checkout is live.",
              })
            }
          >
            <CreditCard className="h-3.5 w-3.5" />
            {hasCard ? "Update card" : "Add card"}
          </OriginButton>
        </div>
      </div>
    </section>
  );
}

/* --------------------------- Payment history ------------------------------ */

function PaymentHistorySection({
  plan, cycle, currentPlan,
}: {
  plan: Plan;
  cycle: BillingCycle;
  currentPlan: PlanDef;
}) {
  const invoices = useMemo(() => {
    if (plan === "free") return [];
    const amount =
      cycle === "annual"
        ? currentPlan.annual
        : currentPlan.monthly;
    const count = cycle === "annual" ? 2 : 4;
    const stepMonths = cycle === "annual" ? 12 : 1;
    return Array.from({ length: count }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - i * stepMonths);
      return {
        id: `in_${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}`,
        date: d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }),
        label: `${currentPlan.label} · ${cycle === "annual" ? "Annual" : "Monthly"}`,
        amount,
      };
    });
  }, [plan, cycle, currentPlan]);

  return (
    <section>
      <h2 className="font-display text-xl font-semibold text-charcoal-950 mb-2">
        Payment history
      </h2>
      <p className="text-xs text-charcoal-600 mb-4">
        Receipts for every charge. Invoices are also emailed to you.
      </p>

      {invoices.length === 0 ? (
        <div className="rounded-card bg-paper-warm border border-border px-5 py-8 text-center">
          <Receipt className="mx-auto h-5 w-5 text-charcoal-400" />
          <div className="mt-2 text-sm font-semibold text-charcoal-950">No payments yet</div>
          <div className="mt-1 text-xs text-charcoal-600">
            You&rsquo;re on the Free plan — receipts appear here after your first charge.
          </div>
        </div>
      ) : (
        <div className="rounded-card bg-paper-warm border border-border divide-y divide-border">
          {invoices.map((inv) => (
            <div key={inv.id} className="px-5 py-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="text-sm font-semibold text-charcoal-950">{inv.label}</div>
                <div className="text-xs text-charcoal-600 mt-0.5">
                  {inv.date} · Paid · Visa •••• 4242
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-sm font-semibold text-charcoal-950">
                  ${inv.amount}
                </span>
                <OriginButton
                  variant="tertiary"
                  size="medium"
                  onClick={() =>
                    toast.info("Receipt", {
                      description: "PDF receipts become available once Stripe billing is live.",
                    })
                  }
                  aria-label={`Download receipt for ${inv.date}`}
                >
                  <Download className="h-3.5 w-3.5" /> Receipt
                </OriginButton>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}


