import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Check, Sparkles, Zap, Crown, Bell, Search as SearchIcon, Clock, Download, Trash2,
  Mail, Globe, Lock, KeyRound, Eye, EyeOff, ShieldCheck, AlertTriangle, ChevronRight,
  PauseCircle, MessageCircle, Tag, Heart, ArrowLeft,
} from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
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

export const Route = createFileRoute("/_authenticated/preferences/account")({
  component: AccountPage,
});

type PlanDef = {
  id: Plan;
  label: string;
  tagline: string;
  monthly: number;
  annual: number;
  icon: typeof Sparkles;
  features: string[];
};

const PLANS: PlanDef[] = [
  {
    id: "free",
    label: "Free",
    tagline: "Get a feel for what's out there.",
    monthly: 0,
    annual: 0,
    icon: Sparkles,
    features: ["1 saved search", "Email alerts", "Daily digest"],
  },
  {
    id: "premium",
    label: "Premium",
    tagline: "When you're actively looking.",
    monthly: 14.99,
    annual: 119,
    icon: Zap,
    features: ["3 saved searches", "Real-time alerts", "Email alerts", "All filters", "Wren AI Chat"],
  },
  {
    id: "max",
    label: "Max",
    tagline: "For relocators and serious hunters.",
    monthly: 29,
    annual: 229,
    icon: Crown,
    features: ["Unlimited searches", "Priority alerts", "Concierge matches", "Early access"],
  },
];

const emailSchema = z.string().trim().email();
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
  const [cycle, setCycle] = useState<BillingCycle>(user?.billingCycle ?? "monthly");

  // Profile editable fields (sourced from onboarding store + user)
  const [email, setEmail] = useState(user?.email || onboarding.email);
  
  const [timezone, setTimezone] = useState(user?.timezone || "America/New_York");

  const prefs = usePreferencesStore();

  const currentPlan = PLANS.find((p) => p.id === plan) ?? PLANS[0];

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

  const emailValid = !email || emailSchema.safeParse(email).success;

  return (
    <div className="space-y-12 pb-24">
      {/* Usage stats */}
      <section>
        <h2 className="font-display text-xl font-semibold text-charcoal-950 mb-4">
          Usage this month
        </h2>
        <div className="grid sm:grid-cols-3 gap-3">
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
        <div className="space-y-4">
          <Field id="acct-email" label="Email" icon={Mail} error={!emailValid ? "Enter a valid email." : undefined}>
            <input
              id="acct-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={cn(
                "w-full h-11 px-4 rounded-md bg-surface-elevated border focus:outline-none text-sm font-medium",
                emailValid ? "border-border focus:border-charcoal-950" : "border-danger focus:border-danger",
              )}
            />
          </Field>


          <Field id="acct-tz" label="Timezone" icon={Globe}>
            <select
              id="acct-tz"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full h-11 px-4 rounded-md bg-surface-elevated border border-border focus:border-charcoal-950 focus:outline-none text-sm font-medium"
            >
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>{tz.replace(/_/g, " ")}</option>
              ))}
            </select>
          </Field>
        </div>
      </section>

      {/* Security */}
      <SecuritySection />

      {/* Subscription */}
      <SubscriptionSection plan={plan} cycle={cycle} setCycle={setCycle} trialActive={trialActive} currentPlan={currentPlan} />


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
            <button
              type="button"
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
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-pill border border-charcoal-950/15 text-sm font-semibold text-charcoal-950 hover:bg-paper transition-colors"
            >
              <Download className="h-3.5 w-3.5" /> Export
            </button>
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

      <StickySaveBar
        state={{ email, timezone, cycle, prefs: { marketingEmails: prefs.marketingEmails, productUpdates: prefs.productUpdates } }}
        onDiscard={(snap) => {
          setEmail(snap.email);
          setTimezone(snap.timezone);
          setCycle(snap.cycle);
          prefs.setPref("marketingEmails", snap.prefs.marketingEmails);
          prefs.setPref("productUpdates", snap.prefs.productUpdates);
        }}
      />

      <SyncProfile email={email} timezone={timezone} cycle={cycle} update={updateProfile} />
    </div>
  );
}

function SyncProfile({
  email, timezone, cycle, update,
}: {
  email: string; timezone: string; cycle: BillingCycle;
  update: (p: Partial<NonNullable<ReturnType<typeof useAppStore.getState>["user"]>>) => void;
}) {
  useEffect(() => {
    update({ email, timezone, billingCycle: cycle });
  }, [email, timezone, cycle, update]);
  return null;
}

function StatCard({
  icon: Icon, label, value, footer, progress,
}: {
  icon: typeof Sparkles; label: string; value: string; footer: string; progress?: number;
}) {
  return (
    <div className="rounded-card border border-border bg-paper-warm p-5">
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
      <label htmlFor={id} className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.18em] text-charcoal-500">
        <Icon className="h-3 w-3" /> {label}
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
          checked ? "bg-charcoal-950" : "bg-charcoal-300",
          disabled && "opacity-60 cursor-not-allowed",
        )}
        style={{ width: 44, height: 24 }}
      >
        <span
          className="absolute top-1/2 -translate-y-1/2 rounded-full bg-white shadow-sm transition-[left] duration-200"
          style={{ width: 20, height: 20, left: checked ? 22 : 2 }}
        />
      </button>

    </div>
  );
}


/* =========================================================================
   Security section + Change-password flow
   ========================================================================= */

function SecuritySection() {
  // Mock "last changed" — would come from auth metadata
  const lastChanged = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 3);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  }, []);
  const [open, setOpen] = useState(false);

  return (
    <section>
      <h2 className="font-display text-xl font-semibold text-charcoal-950 mb-4">Security</h2>
      <div className="rounded-card bg-paper-warm border border-border divide-y divide-border">
        <div className="px-5 py-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="text-sm font-semibold text-charcoal-950 flex items-center gap-2">
              <KeyRound className="h-3.5 w-3.5 text-sage-700" /> Password
            </div>
            <div className="text-xs text-charcoal-600 mt-0.5">Last changed {lastChanged}.</div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-pill border border-charcoal-950/15 text-sm font-semibold text-charcoal-950 hover:bg-paper transition-colors"
          >
            Change password
          </button>
        </div>

        <LockedRow
          icon={ShieldCheck}
          label="Two-factor authentication"
          desc="Add a second step at sign-in. Coming soon."
        />
        <LockedRow
          icon={Globe}
          label="Active sessions"
          desc="See where you're signed in and revoke devices. Coming soon."
        />
      </div>

      <ChangePasswordDialog open={open} onOpenChange={setOpen} />
    </section>
  );
}

function LockedRow({
  icon: Icon, label, desc,
}: { icon: typeof Mail; label: string; desc: string }) {
  return (
    <div className="px-5 py-4 flex items-center justify-between gap-4 opacity-70">
      <div className="min-w-0">
        <div className="text-sm font-semibold text-charcoal-950 flex items-center gap-2">
          <Icon className="h-3.5 w-3.5 text-charcoal-500" />
          {label}
          <span className="text-[10px] font-mono uppercase tracking-wider text-charcoal-500">
            Coming soon
          </span>
        </div>
        <div className="text-xs text-charcoal-600 mt-0.5">{desc}</div>
      </div>
      <Lock className="h-4 w-4 text-charcoal-400 shrink-0" />
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

function ChangePasswordDialog({
  open, onOpenChange,
}: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [cur, setCur] = useState("");
  const [next, setNext] = useState("");
  const [conf, setConf] = useState("");
  const [showCur, setShowCur] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [signOutOthers, setSignOutOthers] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const strength = passwordStrength(next);
  const minOk = next.length >= 10;
  const matches = conf.length > 0 && conf === next;
  const distinct = next.length === 0 || next !== cur;
  const canSubmit = cur.length > 0 && minOk && matches && distinct && !busy;

  const reset = () => {
    setCur(""); setNext(""); setConf(""); setError(null);
    setShowCur(false); setShowNext(false); setBusy(false);
  };

  const submit = async () => {
    setError(null);
    setBusy(true);
    // Mock: treat "wrongpass" as a wrong current password for demo
    await new Promise((r) => setTimeout(r, 450));
    if (cur === "wrongpass") {
      setBusy(false);
      setError("That password doesn't match.");
      return;
    }
    setBusy(false);
    onOpenChange(false);
    reset();
    toast.success("Password updated", {
      description: signOutOthers ? "Other sessions were signed out." : undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Change password</DialogTitle>
          <DialogDescription>
            Use at least 10 characters. Mix letters, numbers, and a symbol for best results.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <PasswordField
            id="cur-pw" label="Current password" value={cur} onChange={setCur}
            show={showCur} onToggle={() => setShowCur((s) => !s)} error={error ?? undefined}
            autoFocus autoComplete="current-password"
          />
          <PasswordField
            id="new-pw" label="New password" value={next} onChange={setNext}
            show={showNext} onToggle={() => setShowNext((s) => !s)}
            error={!distinct ? "New password must differ from current." : undefined}
            autoComplete="new-password"
          />
          {next.length > 0 && (
            <div>
              <div className="flex gap-1 mb-1">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-1 flex-1 rounded-full transition-colors",
                      i < strength.score ? "bg-sage-600" : "bg-charcoal-950/10",
                    )}
                  />
                ))}
              </div>
              <div className="flex items-center justify-between text-[11px] text-charcoal-600">
                <span>{strength.label}</span>
                <span className={cn(minOk ? "text-sage-700" : "text-charcoal-500")}>
                  {minOk ? "✓ 10+ characters" : `${next.length}/10 characters`}
                </span>
              </div>
            </div>
          )}
          <PasswordField
            id="conf-pw" label="Confirm new password" value={conf} onChange={setConf}
            show={showNext} onToggle={() => setShowNext((s) => !s)}
            error={conf.length > 0 && !matches ? "Passwords don't match." : undefined}
            autoComplete="new-password"
          />

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={signOutOthers}
              onChange={(e) => setSignOutOthers(e.target.checked)}
              className="h-4 w-4 rounded border-charcoal-400 text-charcoal-950 focus:ring-charcoal-950"
            />
            <span className="text-xs text-charcoal-700">Sign out everywhere else</span>
          </label>
        </div>

        <DialogFooter>
          <button
            type="button"
            onClick={() => { reset(); onOpenChange(false); }}
            className="h-10 px-4 rounded-pill border border-charcoal-950/15 text-sm font-semibold text-charcoal-950 hover:bg-paper"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!canSubmit}
            onClick={submit}
            className={cn(
              "h-10 px-5 rounded-pill text-sm font-semibold transition-colors",
              canSubmit
                ? "bg-sage-700 text-paper hover:bg-sage-800"
                : "bg-charcoal-950/10 text-charcoal-500 cursor-not-allowed",
            )}
          >
            {busy ? "Updating…" : "Update password"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

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

/* =========================================================================
   Delete-account flow (5 steps + 30-day grace)
   ========================================================================= */

function DeleteAccountButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 h-10 px-4 rounded-pill border border-danger/40 text-sm font-semibold text-danger hover:bg-danger/10 transition-colors"
      >
        <Trash2 className="h-3.5 w-3.5" /> Delete account
      </button>
      <DeleteAccountDialog open={open} onOpenChange={setOpen} />
    </>
  );
}

type DeleteStep = "alternatives" | "losses" | "reauth" | "confirm";

function DeleteAccountDialog({
  open, onOpenChange,
}: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [step, setStep] = useState<DeleteStep>("alternatives");
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState<string | null>(null);
  const [confirmText, setConfirmText] = useState("");
  const reset = useAppStore((s) => s.reset);
  const updatePlanMut = useUpdatePlanMutation();
  const prefs = usePreferencesStore();

  const closeAll = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep("alternatives");
      setPw(""); setPwError(null); setConfirmText("");
    }, 200);
  };

  const stepIndex = ["alternatives", "losses", "reauth", "confirm"].indexOf(step) + 1;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) closeAll(); else onOpenChange(v); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between gap-3">
            <DialogTitle className="flex items-center gap-2">
              {step !== "alternatives" && (
                <button
                  type="button"
                  onClick={() => {
                    if (step === "losses") setStep("alternatives");
                    if (step === "reauth") setStep("losses");
                    if (step === "confirm") setStep("reauth");
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
              Step {stepIndex} of 4
            </span>
          </div>
        </DialogHeader>

        {step === "alternatives" && (
          <div className="space-y-3">
            <p className="text-sm text-charcoal-700">
              Deleting is permanent. Would one of these do instead?
            </p>
            <AltRow
              icon={PauseCircle}
              label="Pause subscription"
              desc="Keep your searches; we won't bill you while paused."
              onClick={() => {
                toast.success("Subscription paused for 1 month");
                closeAll();
              }}
            />
            <AltRow
              icon={Tag}
              label="Downgrade to Free"
              desc="Keep 1 saved search. No charges."
              onClick={() => {
                updatePlanMut.mutate({ plan: "free", billingCycle: "monthly" });
                toast.success("Moved to Free plan");
                closeAll();
              }}
            />
            <AltRow
              icon={Bell}
              label="Turn off optional emails"
              desc="Stop product tips and partner offers. Keep your account."
              onClick={() => {
                prefs.setPref("productUpdates", false);
                prefs.setPref("marketingEmails", false);
                toast.success("Optional emails turned off");
                closeAll();
              }}
            />
            <DialogFooter className="!justify-between pt-2">
              <button
                type="button"
                onClick={closeAll}
                className="text-sm text-charcoal-600 hover:text-charcoal-950 underline-offset-4 hover:underline"
              >
                Keep my account
              </button>
              <button
                type="button"
                onClick={() => setStep("losses")}
                className="text-sm font-semibold text-danger underline-offset-4 hover:underline inline-flex items-center gap-1"
              >
                No — delete my account <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </DialogFooter>
          </div>
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
                  reset();
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


function BillingToggle({
  cycle, onChange,
}: { cycle: BillingCycle; onChange: (c: BillingCycle) => void }) {
  return (
    <div className="inline-flex items-center bg-paper-warm border border-charcoal-950/10 rounded-pill p-1">
      {(["monthly", "annual"] as const).map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => onChange(c)}
          className={cn(
            "h-8 px-4 rounded-pill text-xs font-semibold transition-colors capitalize",
            cycle === c ? "bg-charcoal-950 text-paper" : "text-charcoal-700",
          )}
        >
          {c}
          {c === "annual" && <span className="ml-1 text-sage-400">−2mo</span>}
        </button>
      ))}
    </div>
  );
}

function PlanCard({
  plan, currentPlan, cycle,
}: { plan: PlanDef; currentPlan: Plan; cycle: BillingCycle }) {
  const isCurrent = plan.id === currentPlan;
  const Icon = plan.icon;
  const price = plan.id === "free" ? 0 : cycle === "annual" ? plan.annual : plan.monthly;
  const priceLabel =
    plan.id === "free" ? "Free" : `$${price}${cycle === "annual" ? "/yr" : "/mo"}`;
  const updatePlanMut = useUpdatePlanMutation();
  const [open, setOpen] = useState(false);

  const planRank: Record<Plan, number> = { free: 0, premium: 1, max: 2 };
  const isUpgrade = planRank[plan.id] > planRank[currentPlan];
  const isDowngrade = planRank[plan.id] < planRank[currentPlan];

  const isCancelPath = isDowngrade && plan.id === "free";

  const ctaLabel = isCurrent
    ? "Current plan"
    : isUpgrade
      ? `Upgrade to ${plan.label}`
      : isCancelPath
        ? "Cancel above to switch"
        : `Switch to ${plan.label}`;

  return (
    <div
      className={cn(
        "rounded-card border p-6 flex flex-col gap-4 transition-colors",
        isCurrent ? "border-charcoal-950 bg-paper-warm" : "border-charcoal-950/12 bg-paper hover:border-charcoal-400",
      )}
    >
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-sage-700" />
        <div className="font-display text-lg font-bold text-charcoal-950">{plan.label}</div>
        {isCurrent && (
          <span className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 rounded-pill bg-sage-200 text-[9px] font-mono uppercase tracking-[0.16em] text-sage-900">
            <Check className="h-2.5 w-2.5" /> Your plan
          </span>
        )}
      </div>

      <div>
        <div className="font-display text-3xl font-bold text-charcoal-950 tabular-nums">
          {priceLabel}
        </div>
        <div className="text-xs text-charcoal-600 mt-1">{plan.tagline}</div>
      </div>

      <ul className="space-y-1.5 text-sm text-charcoal-700">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <Check className="h-3.5 w-3.5 text-sage-700 mt-0.5 shrink-0" />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      {isCancelPath ? (
        <div className="mt-auto h-10 inline-flex items-center justify-center rounded-pill bg-paper-warm text-charcoal-500 text-xs border border-charcoal-950/10">
          Use “Cancel subscription” above
        </div>
      ) : (
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <button
              type="button"
              disabled={isCurrent || updatePlanMut.isPending}
              className={cn(
                "mt-auto h-10 rounded-pill text-sm font-semibold transition-colors",
                isCurrent
                  ? "bg-paper-warm text-charcoal-500 cursor-default border border-charcoal-950/10"
                  : isDowngrade
                    ? "border border-charcoal-950/15 text-charcoal-950 hover:bg-paper"
                    : "bg-charcoal-950 text-paper hover:bg-charcoal-800",
              )}
            >
              {ctaLabel}
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Switch to {plan.label}?</AlertDialogTitle>
              <AlertDialogDescription>
                You're about to switch to <span className="font-semibold text-charcoal-950">{plan.label}</span>{" "}
                ({priceLabel}). This will auto-renew at the same price until cancelled.{" "}
                <span className="text-charcoal-500">No payment will be charged — this is a demo flow.</span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep my plan</AlertDialogCancel>
              <AlertDialogAction
                disabled={updatePlanMut.isPending}
                onClick={() => {
                  updatePlanMut.mutate(
                    { plan: plan.id, billingCycle: cycle },
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
    </div>
  );
}

function SubscriptionSection({
  plan, cycle, setCycle, trialActive, currentPlan,
}: {
  plan: Plan;
  cycle: BillingCycle;
  setCycle: (c: BillingCycle) => void;
  trialActive: boolean;
  currentPlan: PlanDef;
}) {
  const [cancelOpen, setCancelOpen] = useState(false);
  const periodEnd = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 18);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  }, []);
  return (
    <>
      <section>
        <h2 className="font-display text-xl font-semibold text-charcoal-950 mb-4">
          Subscription &amp; billing
        </h2>
        <div className="rounded-card bg-paper-warm border border-charcoal-950/12 p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="text-[11px] font-mono uppercase tracking-[0.16em] text-sage-700">
                Current plan
              </div>
              <div className="mt-1 font-display text-2xl font-bold text-charcoal-950">
                {currentPlan.label}
                {trialActive && plan !== "free" && (
                  <span className="ml-2 text-[10px] font-mono uppercase tracking-[0.14em] text-peach-700">
                    Trial active
                  </span>
                )}
              </div>
              <div className="text-sm text-charcoal-600 mt-1">
                {plan === "free"
                  ? "$0 / forever"
                  : cycle === "annual"
                    ? `$${currentPlan.annual}/year`
                    : `$${currentPlan.monthly}/mo`}
              </div>
            </div>
            <div className="text-xs text-charcoal-600">
              Next billing:{" "}
              <span className="text-charcoal-900 font-semibold">{plan === "free" ? "N/A" : periodEnd}</span>
            </div>
          </div>
          {plan !== "free" && (
            <div className="mt-5 pt-4 border-t border-charcoal-950/8 flex items-center justify-between gap-3 flex-wrap">
              <p className="text-xs text-charcoal-600 max-w-md">
                Cancel anytime. You'll keep paid features until the end of your billing period.
              </p>
              <button
                type="button"
                onClick={() => setCancelOpen(true)}
                className="text-sm font-semibold text-charcoal-800 hover:text-charcoal-950 underline-offset-4 hover:underline"
              >
                Cancel subscription
              </button>
            </div>
          )}
        </div>
        <CancelSubscriptionDialog
          open={cancelOpen}
          onOpenChange={setCancelOpen}
          periodEnd={periodEnd}
        />
      </section>

      <section>
        <div className="flex items-end justify-between gap-4 flex-wrap mb-5">
          <div>
            <h2 className="font-display text-xl font-semibold text-charcoal-950">
              {plan === "max" ? "Plan options" : "Upgrade your plan"}
            </h2>
            <p className="text-sm text-charcoal-600 mt-1">
              Get faster alerts, more searches, and Wren AI.
            </p>
          </div>
          <BillingToggle cycle={cycle} onChange={setCycle} />
        </div>

        <div className="grid md:grid-cols-3 gap-3">
          {PLANS.map((p) => (
            <PlanCard key={p.id} plan={p} currentPlan={plan} cycle={cycle} />
          ))}
        </div>
      </section>
    </>
  );
}

