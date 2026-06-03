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
                ? "No limit on your plan."
                : stats.used >= stats.max
                  ? "Limit reached — upgrade to add more."
                  : `${stats.max - stats.used} slot${stats.max - stats.used === 1 ? "" : "s"} left.`
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
                Permanently remove your account, searches, and alerts.
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


function DeleteAccountButton() {
  const [text, setText] = useState("");
  const reset = useAppStore((s) => s.reset);
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 h-10 px-4 rounded-pill border border-danger/40 text-sm font-semibold text-danger hover:bg-danger/10 transition-colors"
        >
          <Trash2 className="h-3.5 w-3.5" /> Delete
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete your account?</AlertDialogTitle>
          <AlertDialogDescription>
            This permanently removes your searches, alerts, and profile. Type{" "}
            <span className="font-mono font-semibold text-charcoal-950">DELETE</span> to confirm.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <input
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="DELETE"
          className="w-full h-11 px-4 rounded-md bg-surface-elevated border border-border focus:border-danger focus:outline-none text-sm font-mono"
        />
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setText("")}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={text !== "DELETE"}
            onClick={() => {
              reset();
              toast.success("Account deleted");
            }}
            className="bg-danger text-paper hover:bg-danger/90"
          >
            Delete account
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
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

  const ctaLabel = isCurrent
    ? "Current plan"
    : isUpgrade
      ? `Upgrade to ${plan.label}`
      : isDowngrade && plan.id === "free"
        ? "Cancel subscription"
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
                  ? "border border-danger/40 text-danger hover:bg-danger/10"
                  : "bg-charcoal-950 text-paper hover:bg-charcoal-800",
            )}
          >
            {ctaLabel}
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isDowngrade && plan.id === "free"
                ? "Cancel your subscription?"
                : `Switch to ${plan.label}?`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isDowngrade && plan.id === "free" ? (
                <>
                  Your subscription will stop auto-renewing. You keep paid features until the
                  end of your current billing period, then your account moves to the Free plan
                  (1 saved search, daily digest). No further charges will be made.
                </>
              ) : (
                <>
                  You're about to switch to <span className="font-semibold text-charcoal-950">{plan.label}</span>{" "}
                  ({priceLabel}). This will auto-renew at the same price until cancelled.{" "}
                  <span className="text-charcoal-500">No payment will be charged — this is a demo flow.</span>
                </>
              )}
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
              className={cn(
                isDowngrade && plan.id === "free"
                  ? "bg-danger text-paper hover:bg-danger/90"
                  : "bg-charcoal-950 text-paper hover:bg-charcoal-800",
              )}
            >
              {updatePlanMut.isPending
                ? "Updating…"
                : isDowngrade && plan.id === "free"
                  ? "Confirm cancellation"
                  : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
              <span className="text-charcoal-900 font-semibold">{plan === "free" ? "N/A" : "—"}</span>
            </div>
          </div>
        </div>
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

