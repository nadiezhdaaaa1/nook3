import { AppPage } from "@/components/app/AppPage";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check, Sparkles, Zap, Bell, Search as SearchIcon, Clock, Download, Trash2,
  Mail, Eye, EyeOff, ChevronRight, LogOut, Lock,
  ArrowLeft, CreditCard, Receipt, Plus,
} from "lucide-react";

import cardAsset from "@/assets/Card.png.asset.json";
import lockAsset from "@/assets/Lock.png.asset.json";
import globeAsset from "@/assets/Globe.png.asset.json";
import doorAsset from "@/assets/Door-2.png.asset.json";
import googleIcon from "@/assets/Google_Favicon_2025.svg.asset.json";
import mailAsset from "@/assets/Mail.png.asset.json";
import savedSearchesArt from "@/assets/Saved-searches.png.asset.json";
import alertsArt from "@/assets/Alerts-received.png.asset.json";
import lastDaysArt from "@/assets/Last-days.png.asset.json";


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
import { useUpdateProfileMutation, useScheduleAccountDeletionMutation, useCancelAccountDeletionMutation, useSetSubscriptionCanceledMutation, profileQueryOptions } from "@/lib/queries/profile";
import { useQuery } from "@tanstack/react-query";
import { OriginButton } from "@/components/ui/origin-button";
import { Input } from "@/components/ui/input";
import { WARM_BG, COOL_BG, DARK_SHADOW } from "@/components/landing/PricingThreeTiers";

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
    id: "intro",
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
    id: "pro",
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
    id: "pro",
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

  const plan: Plan = user?.plan ?? "intro";
  const trialActive = user?.trialActive ?? false;
  const trialEndsAt = user?.trialEndsAt;
  const activeCycle: BillingCycle = user?.billingCycle ?? "monthly";

  // Profile editable fields (sourced from onboarding store + user)
  const [timezone, setTimezone] = useState(user?.timezone || "America/New_York");

  const prefs = usePreferencesStore();

  // Current card matching plan + billing cycle (legacy "max" behaves like Pro monthly)
  const currentPlan =
    PLANS.find((p) => p.id === plan && (plan === "intro" || p.cycle === activeCycle)) ??
    (plan === "intro" ? PLANS[0] : PLANS[1]);

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
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          <StatCard
            icon={SearchIcon}
            label="Saved searches"
            value={`${stats.used} / ${stats.maxLabel}`}
            illustration={savedSearchesArt.url}
          />
          <StatCard
            icon={Bell}
            label="Alerts received"
            value={String(stats.totalAlerts)}
            illustration={alertsArt.url}
            nudgeY={4}
          />
          <StatCard
            icon={Clock}
            label="Last 7 days"
            value={String(stats.alerts7d)}
            illustration={lastDaysArt.url}
            nudgeY={5}
            className="sm:col-span-2 lg:col-span-1"
          />

        </div>

      </section>

      {/* Profile */}
      <section>
        <h2 className="font-display text-xl font-semibold text-charcoal-950 mb-4">Profile</h2>
        <div className="rounded-card bg-paper-warm border border-border divide-y divide-border">
          <SignInMethodRows />
          <ProfileTimezoneRow timezone={timezone} onChange={setTimezone} />
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
              <div className={cn("text-sm font-semibold", user?.deletionScheduledAt ? "text-danger" : "text-danger")}>
                {user?.deletionScheduledAt ? "Account scheduled for deletion" : "Delete account"}
              </div>
              <div className="text-xs text-charcoal-600 mt-0.5">
                {user?.deletionScheduledAt ? (
                  <>
                    Your account will be permanently deleted on{" "}
                    <span className="font-semibold text-charcoal-800">
                      {new Date(user.deletionScheduledAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </span>
                    . Nothing is removed until that date — you can keep your account any time before then.
                  </>
                ) : (
                  <>
                    Removes your <span className="font-semibold text-charcoal-800">entire account</span>,
                    including all searches, alerts, and profile data.
                  </>
                )}
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
  icon: Icon, label, value, illustration, nudgeY, loading, className,
}: {
  icon: typeof Sparkles;
  label: string;
  value: string;
  illustration: string;
  nudgeY?: number;
  loading?: boolean;
  className?: string;
}) {
  return (
    <section
      aria-label={label}
      className={cn(
        "relative flex h-[120px] flex-col overflow-hidden rounded-2xl border bg-white p-5 sm:p-6",
        className,
      )}
      style={{ borderColor: "rgba(0,0,0,0.2)" }}
    >
      <div className="relative z-10 flex items-start gap-2">
        <Icon
          className="mt-[1px] h-[14px] w-[14px] shrink-0"
          strokeWidth={1.5}
          style={{ color: "#6E6459" }}
        />
        <span
          className="text-[12px] font-medium uppercase leading-4"
          style={{ letterSpacing: "0.165em", color: "#6E6459" }}
        >
          {label}
        </span>
      </div>
      <div className="flex-1" />
      {loading ? (
        <div className="relative z-10 h-8 w-24 animate-pulse rounded-md bg-charcoal-950/8 sm:h-9" />
      ) : (
        <div
          aria-live="polite"
          className="relative z-10 font-display font-bold tabular-nums text-[24px] leading-8 sm:text-[28px] sm:leading-9"
          style={{
            letterSpacing: "-0.36px",
            color: "#241C12",
            fontVariationSettings: '"SOFT" 0, "WONK" 1',
          }}
        >
          {value}
        </div>
      )}
      <img
        src={illustration}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 h-[76px] w-[64px] select-none object-contain object-bottom-right"
        style={nudgeY ? { transform: `translateY(${nudgeY}px)` } : undefined}
      />
    </section>
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
        <img src={doorAsset.url} alt="" className="h-10 w-10 object-contain shrink-0" />
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
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-charcoal-800">
        {label}
      </label>
      <div className="relative">
        <Input
          id={id}
          type={show ? "text" : "password"}
          autoFocus={autoFocus}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          size="big"
          className={cn(
            "pr-11",
            error && "border-danger/60 focus-visible:border-danger",
          )}
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 h-7 w-7 inline-flex items-center justify-center rounded-md text-charcoal-500 hover:text-charcoal-950 hover:bg-paper"
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
  const [openCount, setOpenCount] = useState(0);
  const scheduledAt = useAppStore((s) => s.user?.deletionScheduledAt);
  const cancel = useCancelAccountDeletionMutation();

  // Once deletion is scheduled, the dialog must never be able to come back
  // (e.g. after pressing "Keep my account" in the same session).
  useEffect(() => {
    if (scheduledAt) setOpen(false);
  }, [scheduledAt]);

  return (
    <>
      {scheduledAt ? (
        <OriginButton
          variant="dark"
          size="medium"
          onClick={() => cancel.mutate()}
          disabled={cancel.isPending}
        >
          {cancel.isPending ? "Restoring…" : "Keep my account"}
        </OriginButton>
      ) : (
        <OriginButton
          variant="tertiary"
          size="medium"
          onClick={() => {
            setOpenCount((n) => n + 1);
            setOpen(true);
          }}
        >
          <Trash2 className="h-3.5 w-3.5" /> Delete account
        </OriginButton>
      )}
      <DeleteAccountDialog
        key={openCount}
        open={open && !scheduledAt}
        onOpenChange={setOpen}
      />
    </>
  );
}

type DeleteStep = "reason" | "feedback";
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
  const [reasonNote, setReasonNote] = useState("");
  const [stayFeedback, setStayFeedback] = useState("");
  const [cancelSubscription, setCancelSubscription] = useState(true);

  // Local state is reset by remounting (parent passes a fresh key per open),
  // so closing just needs to close.
  const closeAll = () => onOpenChange(false);

  const scheduleDeletion = useScheduleAccountDeletionMutation();

  const handleDelete = () => {
    scheduleDeletion.mutate(
      {
        reason: reason ? (reason === "other" ? reasonNote || "other" : reason) : undefined,
        feedback: stayFeedback || undefined,
        cancelSubscription,
      },
      {
        onSuccess: (user) => {
          closeAll();
          toast.success("Account scheduled for deletion", {
            description: user.subscriptionCanceledAt
              ? "Auto-renewal is off and nothing is deleted for 30 days — you can reverse this from any screen."
              : "Nothing is deleted for 30 days — you can reverse this from any screen.",
            duration: 6000,
          });
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) closeAll(); else onOpenChange(v); }}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {step === "feedback" && (
              <button
                type="button"
                onClick={() => setStep("reason")}
                className="h-7 w-7 inline-flex items-center justify-center rounded-md hover:bg-paper text-charcoal-600"
                aria-label="Back"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}
            <DialogTitle>Delete account</DialogTitle>
          </div>
          {step === "reason" && (
            <DialogDescription>
              Sorry to see you go — what's driving this?{" "}
              <span className="text-charcoal-500">(optional)</span>
            </DialogDescription>
          )}
        </DialogHeader>

        {step === "reason" && (
          <div className="space-y-2">
            {DELETE_REASONS.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setReason(reason === r.id ? null : r.id)}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-[12px] border text-sm font-medium transition-colors",
                  reason === r.id
                    ? "border-[#2B2521] bg-[#2B2521] text-white"
                    : "border-border bg-paper-warm hover:border-charcoal-400 text-charcoal-800",
                )}
              >
                {r.label}
              </button>
            ))}
            {reason === "other" && (
              <Input
                placeholder="What happened? (optional)"
                value={reasonNote}
                onChange={(e) => setReasonNote(e.target.value.slice(0, 1000))}
                className="h-11 rounded-[12px] border-border bg-white text-sm text-charcoal-950 placeholder:text-charcoal-400 focus-visible:border-charcoal-950 focus-visible:ring-0"
                autoFocus
              />
            )}
            <DialogFooter className="justify-between gap-2 pt-4">
              <span className="text-[10px] font-mono uppercase tracking-wider text-charcoal-500 self-center">
                Step 1 of 2
              </span>
              <div className="flex items-center gap-2">
                <OriginButton
                  variant="tertiary"
                  size="medium"
                  onClick={() => setStep("feedback")}
                >
                  Skip
                </OriginButton>
                <OriginButton
                  variant="danger"
                  size="medium"
                  onClick={() => setStep("feedback")}
                >
                  Continue
                </OriginButton>
              </div>
            </DialogFooter>
          </div>
        )}

        {step === "feedback" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="stay-feedback" className="text-sm font-medium text-charcoal-950">
                Is there anything that we can do to make you stay?
              </label>
              <p className="text-xs text-charcoal-500">
                This is optional — your answer helps us improve Nook.
              </p>
              <textarea
                id="stay-feedback"
                value={stayFeedback}
                onChange={(e) => setStayFeedback(e.target.value.slice(0, 1000))}
                placeholder="Tell us what would have changed your mind..."
                className="w-full min-h-[96px] px-4 py-3 rounded-[12px] border border-border bg-white text-sm text-charcoal-950 placeholder:text-charcoal-400 focus:border-charcoal-950 focus:outline-none resize-none"
                autoFocus
              />
            </div>

            <label
              className="flex items-center cursor-pointer"
              style={{
                background: "#EAE0CD",
                border: "1px solid #B5AB98",
                borderRadius: 16,
                padding: "16px 20px",
                gap: 16,
              }}
            >
              <input
                id="cancel-subscription"
                type="checkbox"
                checked={cancelSubscription}
                onChange={(e) => setCancelSubscription(e.target.checked)}
                className="ob-check ob-check--muted"
              />
              <div>
                <div style={{ fontWeight: 500, fontSize: 16, lineHeight: "24px", color: "#2b2521" }}>
                  Also cancel my subscription
                </div>
                <div style={{ fontSize: 14, lineHeight: "24px", color: "#4a4a46" }}>
                  Stops billing at the end of your current period.
                </div>
              </div>
            </label>

            <div className="rounded-[12px] border border-danger/30 bg-danger p-4">
              <p className="text-sm text-white leading-relaxed">
                Your account will be deactivated now and permanently deleted after a 30-day grace period. During that window you can restore it by signing back in. After that, your data is gone for good.
              </p>
            </div>

            <DialogFooter className="justify-between gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-charcoal-500 self-center">
                Step 2 of 2
              </span>
              <div className="flex items-center gap-2">
                <OriginButton
                  variant="tertiary"
                  size="medium"
                  onClick={closeAll}
                >
                  Cancel
                </OriginButton>
                <OriginButton
                  variant="danger"
                  size="medium"
                  onClick={handleDelete}
                  disabled={scheduleDeletion.isPending}
                >
                  {scheduleDeletion.isPending ? "Scheduling…" : "Delete account"}
                </OriginButton>
              </div>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* =========================================================================
   Cancel-subscription retention flow
   ========================================================================= */

type CancelReason = "expensive" | "found" | "matches" | "break" | "other";

function CancelSubscriptionDialog({
  open, onOpenChange, periodEnd, onConfirm,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  periodEnd: string;
  onConfirm: (reason: CancelReason, note: string) => void;
}) {
  const [reason, setReason] = useState<CancelReason | null>(null);
  const [otherReason, setOtherReason] = useState("");

  const close = () => {
    onOpenChange(false);
    setTimeout(() => { setReason(null); setOtherReason(""); }, 200);
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
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>We’re sorry to see you go</DialogTitle>
          <DialogDescription>
            Before you cancel, tell us what changed. Your feedback helps us make Nook better for the next apartment hunt.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          {reasons.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setReason(r.id)}
              className={cn(
                "w-full text-left px-4 py-3 rounded-[12px] border text-sm font-medium transition-colors",
                reason === r.id
                  ? "border-[#2B2521] bg-[#2B2521] text-white"
                  : "border-border bg-paper-warm hover:border-charcoal-400 text-charcoal-800",
              )}
            >
              {r.label}
            </button>
          ))}
          {reason === "other" && (
            <Input
              placeholder="What happened? (optional)"
              value={otherReason}
              onChange={(e) => setOtherReason(e.target.value)}
              className="h-11 rounded-[12px] border-border bg-paper-warm text-sm text-charcoal-950 placeholder:text-charcoal-400 focus-visible:border-charcoal-950 focus-visible:ring-0"
              autoFocus
            />
          )}
          <p className="pt-2 text-xs text-charcoal-600 leading-relaxed">
            You’ll keep Pro until <span className="font-semibold text-charcoal-950">{periodEnd}</span>.
            Auto-renewal stops and nothing is deleted — you can renew anytime.
          </p>
          <DialogFooter className="justify-end gap-2 pt-4">
            <OriginButton
              variant="main"
              size="medium"
              onClick={close}
            >
              Keep subscription
            </OriginButton>
            <OriginButton
              variant="secondary"
              size="medium"
              disabled={!reason}
              onClick={() => {
                if (!reason) return;
                onConfirm(reason, otherReason.trim());
                close();
              }}
            >
              Cancel subscription
            </OriginButton>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function RenewSubscriptionDialog({
  open, onOpenChange, periodEnd, onConfirm,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  periodEnd: string;
  onConfirm: () => void;
}) {
  const close = () => onOpenChange(false);

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) close(); else onOpenChange(v); }}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Glad to see you back</DialogTitle>
          <DialogDescription>
            You’re about to keep your Pro subscription active. Your access will continue and auto-renew on{" "}
            <span className="font-semibold text-charcoal-950">{periodEnd}</span>. You can cancel anytime in Account → Subscription.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-start gap-3 rounded-[12px] bg-paper-warm border border-border p-4 text-sm text-charcoal-700">
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-sage-600" />
          <span>
            All your saved searches, filters, and Wren chats stay exactly as you left them — nothing is lost.
          </span>
        </div>
        <DialogFooter className="justify-end gap-[12px] pt-2">
          <OriginButton
            variant="tertiary"
            size="medium"
            onClick={close}
          >
            Cancel
          </OriginButton>
          <OriginButton
            variant="main"
            size="medium"
            onClick={() => {
              onConfirm();
              close();
            }}
          >
            Renew
          </OriginButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


function PlanCard({
  plan, currentPlan, activeCycle, trialEndsAt, periodEnd, onCancelRequest, canceled, onRenew,
}: {
  plan: PlanDef;
  currentPlan: Plan;
  activeCycle: BillingCycle;
  trialEndsAt?: string;
  periodEnd: string;
  onCancelRequest: () => void;
  canceled?: boolean;
  onRenew?: () => void;
}) {

  const isCurrent = plan.id === currentPlan && (plan.id === "intro" || plan.cycle === activeCycle);
  const priceLabel = plan.id === "intro" ? "$0" : `$${plan.monthly}`;
  const suffix = plan.id === "intro" ? "for 3 days" : "/month";
  const updatePlanMut = useUpdatePlanMutation();
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const dur = reduce ? 0 : 0.25;

  // Rank: Intro (0) < Pro monthly (1) < Pro annual (2)
  const rankOf = (p: Plan, c: BillingCycle) =>
    p === "intro" ? 0 : 1 + (c === "annual" ? 1 : 0);
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

  const isCanceledCurrent = Boolean(isCurrent && canceled && plan.id !== "intro");

  const billLine = isCurrent
    ? plan.id === "intro"
      ? `${trialDaysLeft} day${trialDaysLeft === 1 ? "" : "s"} left`
      : isCanceledCurrent
        ? `Cancels on ${periodEnd}`
        : `next charge ${periodEnd}`
    : plan.id === "intro"
      ? "then $14.99/month"
      : plan.cycle === "annual"
        ? "billed $95.88/year"
        : currentRank === 2
          ? "billed monthly"
          : "billed today";

  const disclaimer = isCurrent
    ? plan.id === "intro"
      ? `First charge $14.99 on ${firstChargeDate}.`
      : isCanceledCurrent
        ? `Your subscription will be canceled on ${periodEnd}. You keep Pro until then — renew anytime to stay on.`
        : plan.cycle === "annual"
          ? `Auto-renews at $95.88/year until cancelled. ${CANCEL_TAIL}`
          : `You keep Pro until then. Nothing is deleted.`
    : plan.id === "intro"
      ? `Card required. After 3 days $14.99/month until cancelled. ${CANCEL_TAIL}`
      : plan.cycle === "annual"
        ? `$95.88 charged on ${periodEnd}, then yearly until cancelled. ${CANCEL_TAIL}`
        : `Auto-renews at $14.99/month until cancelled. ${CANCEL_TAIL}`;

  const ctaLabel = isCurrent
    ? plan.id === "intro"
      ? ""
      : isCanceledCurrent
        ? "Renew subscription"
        : `Cancel on ${periodEnd}`
    : isUpgrade

      ? plan.cycle === "annual"
        ? "Switch to annual"
        : "Unlock all matches now"
      : "Switch to monthly";


  const dark = plan.id !== "intro";
  const text = dark ? "#f8f3e1" : "#241c12";
  const checkColor = dark ? "#c2dd93" : "#6a820a";
  const lockColor = "#db5919";
  const badge = plan.cycle === "annual" ? { text: "Save 47%", bg: "#6a820a" } : null;
  const stateBadge = isCurrent ? (plan.id === "intro" ? "Current" : "Your plan") : null;

  const cardStyle: React.CSSProperties = dark
    ? {
        backgroundColor: plan.cycle === "annual" ? "#2d2340" : "#2c2415",
        backgroundImage: plan.cycle === "annual" ? COOL_BG : WARM_BG,
        boxShadow: DARK_SHADOW,
        color: text,
      }
    : {
        background: "#ffffff",
        border: "1px solid rgba(0,0,0,0.20)",
        color: text,
      };

  const ctaVariant = isCanceledCurrent ? (plan.cycle === "annual" ? "max" : "premium") : isCurrent && plan.id !== "intro" ? "cancel" : plan.id === "intro" ? "tertiary" : plan.cycle === "annual" ? "max" : "premium";

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
                background: "#DF4400",
                color: "#FFFFFF",
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

      {isCurrent && plan.id === "intro" ? (
        <div className="w-full h-[56px]" />
      ) : isCurrent && plan.id !== "intro" ? (
        <OriginButton
          className="w-full"
          variant={ctaVariant}
          style={{ borderRadius: 12 }}
          disabled={updatePlanMut.isPending}
          onClick={() => (isCanceledCurrent ? onRenew?.() : onCancelRequest())}
        >
          {ctaLabel}
        </OriginButton>
      ) : (
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <OriginButton
              className="w-full"
              variant={ctaVariant}
              style={{ borderRadius: 12 }}
              disabled={updatePlanMut.isPending}
            >
              {ctaLabel}
            </OriginButton>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {isUpgrade ? "Upgrade" : "Switch"} to {plan.label}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {isUpgrade ? (
                  <div className="space-y-4 text-left">
                    <p>
                      You’re upgrading to{" "}
                      <span className="font-semibold text-charcoal-950">{plan.label}</span>{" "}
                      ({priceLabel}{suffix}).
                    </p>
                    <ul className="flex flex-col gap-2">
                      {plan.features
                        .filter((f) => f.icon === "check")
                        .map((f) => (
                          <li key={f.text} className="flex items-start gap-2 text-sm text-charcoal-700">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-sage-600" />
                            <span className={f.bold ? "font-semibold text-charcoal-950" : ""}>{f.text}</span>
                          </li>
                        ))}
                    </ul>
                    <p className="text-xs text-charcoal-500">
                      {plan.cycle === "annual"
                        ? "Auto-renews at $95.88/year until cancelled. No payment will be charged — this is a demo flow."
                        : "Auto-renews at $14.99/month until cancelled. No payment will be charged — this is a demo flow."}
                    </p>
                  </div>
                ) : (
                  <>
                    Your plan will change to{" "}
                    <span className="font-semibold text-charcoal-950">{plan.label}</span>{" "}
                    ({priceLabel}{suffix}) at the end of your current billing period.
                  </>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-3">
              <OriginButton
                variant="tertiary"
                size="big"
                className="w-full sm:w-auto"
                disabled={updatePlanMut.isPending}
                onClick={() => setOpen(false)}
              >
                Cancel
              </OriginButton>
              <OriginButton
                variant="main"
                size="big"
                className="w-full sm:flex-1"
                disabled={updatePlanMut.isPending}
                onClick={() => {
                  updatePlanMut.mutate(
                    { plan: plan.id, billingCycle: plan.cycle },
                    { onSuccess: () => setOpen(false) },
                  );
                }}
              >
                {updatePlanMut.isPending ? "Updating…" : isUpgrade ? "Upgrade" : "Confirm"}
              </OriginButton>
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

function ProfileTimezoneRow({ timezone, onChange }: { timezone: string; onChange: (tz: string) => void }) {
  const [open, setOpen] = useState(false);
  const display = timezone.replace(/_/g, " ");

  return (
    <>
      <div className="px-5 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <span className="h-10 w-10 shrink-0 flex items-center justify-center">
            <img
              src={globeAsset.url}
              alt=""
              className="h-10 w-10 object-contain shrink-0"
              aria-hidden="true"
            />
          </span>
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
            <OriginButton
              type="button"
              variant="main"
              size="big"
              className="w-full sm:w-auto"
              onClick={() => {
                onChange(draft);
                onOpenChange(false);
              }}
            >
              Save timezone
            </OriginButton>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* --------------------------- Sign-in methods -------------------------- */
type SignInMethodsState = {
  loading: boolean;
  error: boolean;
  hasGoogle: boolean;
  hasEmailPassword: boolean;
  email: string;
  googleEmail: string;
  googleIdentity: any | null;
  refresh: () => void;
};

function useSignInMethods(): SignInMethodsState {
  const user = useAppStore((s) => s.user);
  const [identities, setIdentities] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    (async () => {
      // Refresh the session first so freshly linked/unlinked identities are reflected.
      await supabase.auth.refreshSession().catch(() => null);
      const { data, error: err } = await supabase.auth.getUserIdentities();
      if (cancelled) return;
      if (err || !data) {
        setError(true);
        setIdentities([]);
      } else {
        setError(false);
        setIdentities(data.identities ?? []);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [tick]);


  const list = identities ?? [];
  const googleIdentity = list.find((i) => i.provider === "google") ?? null;
  const emailIdentity = list.find((i) => i.provider === "email") ?? null;

  return {
    loading,
    error,
    hasGoogle: !!googleIdentity,
    hasEmailPassword: !!emailIdentity || !!user?.hasPassword,
    email: user?.email ?? "",
    googleEmail: googleIdentity?.identity_data?.email ?? user?.email ?? "",
    googleIdentity,
    refresh: () => setTick((t) => t + 1),
  };
}

function SignInMethodRows() {
  const methods = useSignInMethods();
  const [enableOpen, setEnableOpen] = useState(false);
  const [disconnectOpen, setDisconnectOpen] = useState(false);
  const [connecting, setConnecting] = useState(false);

  // If Google came back linked under a different email than the account email,
  // unlink it again — only the account's own email may be connected.
  useEffect(() => {
    if (methods.loading || !methods.hasGoogle || !methods.googleIdentity) return;
    const linked = (methods.googleIdentity.identity_data?.email ?? "").toLowerCase();
    const own = (methods.email ?? "").toLowerCase();
    if (!linked || !own || linked === own) return;
    (async () => {
      await supabase.auth.unlinkIdentity(methods.googleIdentity);
      toast.error("That Google account doesn't match your email", {
        description: `Connect the Google account for ${methods.email}.`,
      });
      methods.refresh();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [methods.loading, methods.hasGoogle, methods.googleIdentity, methods.email]);

  async function handleConnectGoogle() {
    setConnecting(true);
    const { error } = await supabase.auth.linkIdentity({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/account`,
        queryParams: { login_hint: methods.email, prompt: "select_account" },
      },
    });
    setConnecting(false);
    if (error) {
      toast.error("Couldn't connect Google", { description: error.message });
    }
  }


  if (methods.loading) {
    return (
      <div className="px-5 py-4 text-xs text-charcoal-600">Loading sign-in methods…</div>
    );
  }

  if (methods.error) {
    return (
      <div className="px-5 py-4 flex items-center justify-between gap-4">
        <div className="text-xs text-charcoal-600">
          We couldn&apos;t load your sign-in methods right now.
        </div>
        <OriginButton variant="tertiary" size="medium" onClick={methods.refresh}>
          Retry
        </OriginButton>
      </div>
    );
  }

  return (
    <>
      <div className="px-5 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <span className="h-10 w-10 shrink-0 flex items-center justify-center">
            <img
              src={mailAsset.url}
              alt=""
              className="h-[38px] w-[38px] object-contain shrink-0"
              aria-hidden="true"
            />
          </span>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-charcoal-950">Login / Email</div>
            <div className="text-xs text-charcoal-600 mt-0.5 truncate">
              {methods.hasEmailPassword ? methods.email : "Disabled"}
            </div>
          </div>
        </div>
        {!methods.hasEmailPassword && (
          <OriginButton variant="tertiary" size="medium" onClick={() => setEnableOpen(true)}>
            Enable
          </OriginButton>
        )}
      </div>

      {methods.hasEmailPassword && <ProfilePasswordRow />}

      <div className="px-5 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <span className="h-10 w-10 shrink-0 flex items-center justify-center">
            <img
              src={googleIcon.url}
              alt=""
              className="h-8 w-8 object-contain shrink-0"
              aria-hidden="true"
            />
          </span>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-charcoal-950">Google Account</div>
            <div className="text-xs text-charcoal-600 mt-0.5 truncate">
              {methods.hasGoogle ? `Connected ${methods.googleEmail}` : "Disconnected"}
            </div>
          </div>
        </div>
        {methods.hasGoogle ? (
          <OriginButton variant="tertiary" size="medium" onClick={() => setDisconnectOpen(true)}>
            Disconnect
          </OriginButton>
        ) : (
          <OriginButton
            variant="tertiary"
            size="medium"
            disabled={connecting}
            onClick={handleConnectGoogle}
          >
            {connecting ? "Connecting…" : "Connect"}
          </OriginButton>
        )}
      </div>


      <EnableEmailPasswordDialog
        open={enableOpen}
        onOpenChange={setEnableOpen}
        email={methods.email}
        onDone={methods.refresh}
      />

      <DisconnectGoogleDialog
        open={disconnectOpen}
        onOpenChange={setDisconnectOpen}
        hasEmailPassword={methods.hasEmailPassword}
        identity={methods.googleIdentity}
        onEnable={() => {
          setDisconnectOpen(false);
          setEnableOpen(true);
        }}
        onDone={methods.refresh}
      />
    </>
  );
}

function EnableEmailPasswordDialog({
  open, onOpenChange, email, onDone,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  email: string;
  onDone: () => void;
}) {
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showNext, setShowNext] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const setLocalProfile = useAppStore((s) => s.updateProfile);
  const saveProfile = useUpdateProfileMutation();
  const strength = passwordStrength(next);
  const canSubmit = next.length >= 8 && next === confirm && !loading;

  useEffect(() => {
    if (open) {
      setNext("");
      setConfirm("");
      setError(null);
    }
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (next.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (next !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password: next });
    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }
    setLocalProfile({ hasPassword: true });
    try {
      await saveProfile.mutateAsync({ hasPassword: true });
    } catch (err) {
      // The password was set in auth but we couldn't persist the flag — keep
      // the dialog open and tell the user instead of pretending it worked.
      setError(
        err instanceof Error
          ? `Password set, but we couldn't save your sign-in settings: ${err.message}`
          : "Password set, but we couldn't save your sign-in settings. Please try again.",
      );
      setLoading(false);
      return;
    }
    setLoading(false);
    toast.success("Email & password sign-in enabled", {
      description: `You can now sign in with ${email}.`,
    });
    onOpenChange(false);
    onDone();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-semibold text-charcoal-950">
            Enable email &amp; password sign-in
          </DialogTitle>
          <DialogDescription className="text-sm text-charcoal-600">
            Set a password so you can also sign in without Google. Your email stays the same.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <label className="block text-sm font-medium text-charcoal-800 mb-2" htmlFor="enable-email">
              Email
            </label>
            <Input id="enable-email" value={email} readOnly disabled size="big" />
            <p className="text-xs text-charcoal-600 mt-2">
              This is your account email and can&apos;t be changed.
            </p>
          </div>
          <PasswordField
            id="enable-password"
            label="New password"
            value={next}
            onChange={setNext}
            show={showNext}
            onToggle={() => setShowNext((s) => !s)}
            error={next.length > 0 && next.length < 8 ? "At least 8 characters" : undefined}
            autoComplete="new-password"
            autoFocus
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
            id="enable-password-confirm"
            label="Confirm password"
            value={confirm}
            onChange={setConfirm}
            show={showConfirm}
            onToggle={() => setShowConfirm((s) => !s)}
            error={confirm.length > 0 && confirm !== next ? "Passwords do not match" : undefined}
            autoComplete="new-password"
          />
          {error && <p className="text-sm text-danger">{error}</p>}
          <DialogFooter className="pt-2 gap-2">
            <OriginButton
              type="button"
              variant="tertiary"
              size="medium"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </OriginButton>
            <OriginButton type="submit" variant="main" size="medium" disabled={!canSubmit}>
              {loading ? "Saving…" : "Enable"}
            </OriginButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DisconnectGoogleDialog({
  open, onOpenChange, hasEmailPassword, identity, onEnable, onDone,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  hasEmailPassword: boolean;
  identity: any | null;
  onEnable: () => void;
  onDone: () => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleDisconnect() {
    if (!identity) return;
    setLoading(true);
    const { error } = await supabase.auth.unlinkIdentity(identity);
    setLoading(false);
    if (error) {
      toast.error("Couldn't disconnect Google", { description: error.message });
      return;
    }
    toast.success("Google account disconnected");
    onOpenChange(false);
    onDone();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-semibold text-charcoal-950">
            Disconnect Google
          </DialogTitle>
          <DialogDescription className="text-sm text-charcoal-600">
            {hasEmailPassword
              ? "You'll keep access with your email and password. You can reconnect Google later by signing in with it."
              : "Google is currently the only way into your account. Switch to email & password sign-in first, then you can disconnect Google."}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-2 gap-2">
          <OriginButton
            type="button"
            variant="tertiary"
            size="medium"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </OriginButton>
          {hasEmailPassword ? (
            <OriginButton
              type="button"
              variant="secondary"
              size="medium"
              disabled={loading}
              onClick={handleDisconnect}
            >
              {loading ? "Disconnecting…" : "Disconnect"}
            </OriginButton>
          ) : (
            <OriginButton type="button" variant="main" size="medium" onClick={onEnable}>
              Enable Email/Password
            </OriginButton>
          )}
        </DialogFooter>
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
          <span className="h-10 w-10 shrink-0 flex items-center justify-center">
            <img
              src={lockAsset.url}
              alt=""
              className="h-10 w-10 object-contain shrink-0"
              aria-hidden="true"
            />
          </span>
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
  const setLocalProfile = useAppStore((s) => s.updateProfile);
  const saveProfile = useUpdateProfileMutation();

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
        // Keep the persisted flag in sync so the Login / Email row stays enabled.
        setLocalProfile({ hasPassword: true });
        if (!user.hasPassword) {
          try {
            await saveProfile.mutateAsync({ hasPassword: true });
          } catch {
            /* non-blocking: password already changed successfully */
          }
        }
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
            <OriginButton
              type="submit"
              variant="main"
              size="big"
              className="w-full sm:w-auto"
              disabled={!canSubmit}
              loading={loading}
            >
              {loading ? "Updating…" : "Update password"}
            </OriginButton>
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
  const [renewOpen, setRenewOpen] = useState(false);

  // Cancellation is account state, not a browser flag: it must survive reload,
  // sign-out and other devices, and it's also set by the delete-account flow.
  const profileQ = useQuery(profileQueryOptions());
  const setCanceledMutation = useSetSubscriptionCanceledMutation();
  const updateStoreProfile = useAppStore((s) => s.updateProfile);
  const canceled = Boolean(profileQ.data?.subscriptionCanceledAt);

  const periodEnd = useMemo(() => {
    const raw = profileQ.data?.subscriptionPeriodEnd;
    const d = raw ? new Date(raw) : new Date(Date.now() + 18 * 24 * 60 * 60 * 1000);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  }, [profileQ.data?.subscriptionPeriodEnd]);

  const setCanceledState = (v: boolean) => {
    setCanceledMutation.mutate(v, {
      onSuccess: (user) =>
        updateStoreProfile({
          subscriptionCanceledAt: user.subscriptionCanceledAt,
          subscriptionPeriodEnd: user.subscriptionPeriodEnd,
        } as any),
    });
    if (typeof window !== "undefined") window.localStorage.removeItem("nook:subCanceled");
  };

  // One-time migration of the old browser-only flag.
  const migratedRef = useRef(false);
  useEffect(() => {
    if (migratedRef.current) return;
    if (typeof window === "undefined" || !profileQ.data) return;
    const legacy = window.localStorage.getItem("nook:subCanceled") === "1";
    if (!legacy) return;
    migratedRef.current = true;
    window.localStorage.removeItem("nook:subCanceled");
    if (!profileQ.data.subscriptionCanceledAt && plan !== "intro") {
      setCanceledMutation.mutate(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileQ.data, plan]);

  // Determine which two cards to show so the user only sees actionable options.
  const visiblePlanKeys = useMemo(() => {
    if (plan === "intro") return ["intro", "pro_monthly"];
    if (activeCycle === "annual") return ["pro_annual", "pro_monthly"];
    return ["pro_monthly", "pro_annual"];
  }, [plan, activeCycle]);

  const visiblePlans = PLANS.filter((p) => visiblePlanKeys.includes(p.key));

  return (
    <>
      <RenewSubscriptionDialog
        open={renewOpen}
        onOpenChange={setRenewOpen}
        periodEnd={periodEnd}
        onConfirm={() => {
          setCanceledState(false);
          toast.success("Subscription renewed — auto-renewal is back on");
        }}
      />
      <CancelSubscriptionDialog
        open={cancelOpen}
        onOpenChange={setCancelOpen}
        periodEnd={periodEnd}
        onConfirm={() => {
          setCanceledState(true);
          toast.success(`Subscription canceled — active until ${periodEnd}`);
        }}
      />
      <section id="plan-options">
        <div className="mb-5">
          <h2 className="font-display text-xl font-semibold text-charcoal-950">
            {plan === "intro" ? "Upgrade your plan" : "Plan options"}
          </h2>
          <p className="text-sm text-charcoal-600 mt-1">
            Every match we find, plus up to 3 searches.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-7">
          {visiblePlans.map((p) => (
            <PlanCard
              key={p.key}
              plan={p}
              currentPlan={plan}
              activeCycle={activeCycle}
              trialEndsAt={trialEndsAt}
              periodEnd={periodEnd}
              onCancelRequest={() => setCancelOpen(true)}
              canceled={canceled}
              onRenew={() => setRenewOpen(true)}
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
  const hasCard = plan !== "intro";
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
    if (plan === "intro") return [];
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


