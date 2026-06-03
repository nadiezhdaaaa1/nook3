import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Bell, DollarSign, Home as HomeIcon, MapPin, Inbox, Gift, UserCircle,
  LogOut, Sparkles, Lock, Pause, Play, Trash2, Menu,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Logo, LogoMark } from "@/components/brand/Logo";
import { useOnboardingStore } from "@/lib/onboarding/store";
import { cn } from "@/lib/utils";
import { SearchSwitcher } from "@/components/preferences/SearchSwitcher";
import { PausedSearchBanner } from "@/components/preferences/PausedSearchBanner";
import { useAppStore, useActiveSearch, SEARCH_LIMITS } from "@/lib/store";
import { useDeleteSearchMutation } from "@/lib/queries/searches";
import { supabase } from "@/integrations/supabase/client";
import { useDbSync } from "@/lib/queries/useDbSync";
import { HydrationSkeleton } from "@/components/system/HydrationSkeleton";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export const Route = createFileRoute("/_authenticated/preferences")({
  head: () => ({
    meta: [
      { title: "Manage preferences — Nook" },
      { name: "description", content: "Customize your apartment alerts and notification settings." },
    ],
  }),
  component: PreferencesShell,
});

type NavItem = {
  to?: "/preferences" | "/preferences/alerts" | "/preferences/budget" | "/preferences/apartment" | "/preferences/location" | "/preferences/referrals" | "/preferences/account" | "/preferences/wren";
  label: string;
  icon: typeof Bell;
  exact?: boolean;
  locked?: boolean;
  lockedReason?: string;
};

function useNavGroups(): { label: string; items: NavItem[] }[] {
  const plan = useAppStore((s) => s.user?.plan ?? "free");
  const wrenLocked = plan !== "premium" && plan !== "max";
  return [
    {
      label: "Search settings",
      items: [
        { to: "/preferences", label: "Notifications", icon: Bell, exact: true },
        { to: "/preferences/budget", label: "Budget & Criteria", icon: DollarSign },
        { to: "/preferences/apartment", label: "Apartment Details", icon: HomeIcon },
        { to: "/preferences/location", label: "Location", icon: MapPin },
      ],
    },
    {
      label: "Activity",
      items: [
        { to: "/preferences/alerts", label: "Saved Alerts", icon: Inbox },
        wrenLocked
          ? { label: "Wren AI Chat", icon: Sparkles, locked: true, lockedReason: "Premium" }
          : { to: "/preferences/wren", label: "Wren AI Chat", icon: Sparkles },
      ],
    },
    {
      label: "Account",
      items: [
        { to: "/preferences/referrals", label: "Referrals", icon: Gift },
        { to: "/preferences/account", label: "Account", icon: UserCircle },
      ],
    },
  ];
}

const SECTION_LABELS: Record<string, string> = {
  "/preferences": "Notification settings",
  "/preferences/alerts": "Saved listings",
  "/preferences/budget": "Search criteria",
  "/preferences/apartment": "Apartment details",
  "/preferences/location": "Location",
  "/preferences/referrals": "Invite friends",
  "/preferences/account": "Account & billing",
};

function PreferencesShell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { isHydrating } = useDbSync();
  const sectionLabel = useMemo(() => {
    const exact = SECTION_LABELS[pathname];
    if (exact) return exact;
    const key = Object.keys(SECTION_LABELS).find((k) => k !== "/preferences" && pathname.startsWith(k));
    return key ? SECTION_LABELS[key] : "Preferences";
  }, [pathname]);

  return (
    <div className="min-h-dvh bg-paper">
      <TopBar />

      <div className="max-w-6xl mx-auto px-6 lg:px-12 pt-8 lg:pt-10 pb-24">
        <PageHeader sectionLabel={sectionLabel} />

        <div className="grid lg:grid-cols-[240px_1fr] gap-8 lg:gap-12 mt-12">
          <aside className="hidden lg:block lg:sticky lg:top-24 lg:self-start">
            <SidebarNav pathname={pathname} />
          </aside>

          <main>
            <MobileNavBar pathname={pathname} sectionLabel={sectionLabel} />
            <PausedSearchBanner />
            {isHydrating ? <HydrationSkeleton /> : <Outlet />}
          </main>
        </div>
      </div>
    </div>
  );
}

/* ---------- Mobile drawer ---------- */

function MobileNavBar({ pathname, sectionLabel }: { pathname: string; sectionLabel: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="lg:hidden mb-6 -mt-4">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button
            type="button"
            className="w-full inline-flex items-center justify-between gap-3 h-12 px-4 rounded-card border border-charcoal-200 bg-paper-warm text-left hover:border-charcoal-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-charcoal-950/30 transition-colors"
            aria-label="Open navigation menu"
          >
            <span className="inline-flex items-center gap-2.5">
              <Menu className="h-4 w-4 text-sage-700" aria-hidden />
              <span className="text-sm font-semibold text-charcoal-900">{sectionLabel}</span>
            </span>
            <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-charcoal-500">
              Menu
            </span>
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[320px] p-0 bg-paper">
          <SheetHeader className="px-6 pt-6 pb-2 text-left">
            <SheetTitle className="font-display text-lg font-semibold text-charcoal-950">
              Preferences
            </SheetTitle>
          </SheetHeader>
          <div className="px-4 pb-8 pt-2" onClick={() => setOpen(false)}>
            <SidebarNav pathname={pathname} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

/* ---------- Top bar ---------- */

function TopBar() {
  const active = useActiveSearch();
  const plan = useAppStore((s) => s.user?.plan ?? "free");
  const searches = useAppStore((s) => s.searches);
  const quota = useMemo(() => {
    const max = SEARCH_LIMITS[plan];
    const used = searches.filter((x) => x.status !== "archived").length;
    return {
      used,
      max,
      maxLabel: max === Number.POSITIVE_INFINITY ? "∞" : String(max),
      atLimit: max !== Number.POSITIVE_INFINITY && used >= max,
    };
  }, [plan, searches]);

  return (
    <header className="sticky top-0 z-30 border-b border-charcoal-950/8 bg-paper/95 backdrop-blur">
      <div className="max-w-6xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between gap-4">
        {/* LEFT */}
        <div className="flex items-center gap-4 min-w-0">
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <LogoMark size={28} />
            <Logo className="text-lg hidden sm:block" />
          </Link>
          <span aria-hidden className="h-6 w-px bg-charcoal-950/10 hidden lg:block" />
          <div className="min-w-0">
            <SearchSwitcher />
          </div>
          {active && (
            <span
              className={cn(
                "hidden md:inline-flex items-center gap-1.5 text-[11px] font-medium tabular-nums",
                active.status === "active" ? "text-sage-700" : "text-peach-700",
              )}
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  active.status === "active" ? "bg-sage-700" : "bg-peach-700",
                )}
              />
              {active.status === "paused" ? "Paused" : "Active"}
            </span>
          )}
        </div>

        {/* CENTER */}
        <div className="hidden lg:flex items-center gap-2">
          <span className="text-xs text-charcoal-600 tabular-nums">
            <span className="font-semibold text-charcoal-950">{quota.used}</span>
            <span className="text-charcoal-400"> of </span>
            <span className="font-semibold text-charcoal-950">{quota.maxLabel}</span>
            <span className="text-charcoal-500"> search{quota.used === 1 ? "" : "es"}</span>
          </span>
          {plan === "free" && quota.atLimit && (
            <Link
              to="/preferences/account"
              className="h-7 px-3 inline-flex items-center rounded-pill bg-charcoal-950 text-paper text-[11px] font-semibold hover:bg-charcoal-800"
            >
              Upgrade
            </Link>
          )}
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/"
            className="hidden md:inline-flex items-center h-9 px-3 rounded-pill text-xs font-semibold text-charcoal-700 hover:bg-charcoal-950/5"
          >
            ← Home
          </Link>
          <AvatarMenu />
        </div>
      </div>
    </header>
  );
}

function AvatarMenu() {
  const navigate = useNavigate();
  const email = useOnboardingStore((s) => s.email);
  const initial = (email || "?").trim().charAt(0).toUpperCase() || "?";
  const [busy, setBusy] = useState(false);

  const handleSignOut = async () => {
    setBusy(true);
    const { error } = await supabase.auth.signOut();
    setBusy(false);
    if (error) {
      toast.error("Sign out failed", { description: error.message });
      return;
    }
    toast.success("Signed out");
    navigate({ to: "/login", replace: true });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Account menu"
          className="h-9 w-9 rounded-pill bg-sage-200 text-sage-900 inline-flex items-center justify-center text-sm font-bold border border-sage-300 hover:border-sage-500 transition-colors"
        >
          {initial}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {email && (
          <>
            <DropdownMenuLabel className="font-normal text-xs text-charcoal-600 truncate">
              {email}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem onSelect={() => navigate({ to: "/preferences/account" })}>
          <UserCircle className="h-4 w-4 mr-2" /> Account
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => window.open("mailto:hello@thenook.rent", "_self")}>
          <Bell className="h-4 w-4 mr-2" /> Help
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={busy}
          onSelect={(e) => { e.preventDefault(); void handleSignOut(); }}
          className="text-danger focus:text-danger"
        >
          <LogOut className="h-4 w-4 mr-2" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ---------- Page header ---------- */

function PageHeader({ sectionLabel }: { sectionLabel: string }) {
  const active = useActiveSearch();
  const pauseSearch = useAppStore((s) => s.pauseSearch);
  const resumeSearch = useAppStore((s) => s.resumeSearch);

  if (!active) {
    return (
      <div>
        <h1 className="font-display text-4xl lg:text-5xl font-bold text-charcoal-950 leading-[1.05] tracking-[-0.02em]">
          Preferences
        </h1>
        <p className="mt-3 text-charcoal-600">No active search yet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
      <div className="min-w-0">
        <h1 className="font-display text-[36px] lg:text-[44px] font-bold text-charcoal-950 leading-[1.05] tracking-[-0.02em] truncate">
          {active.name}
        </h1>
        <div className="mt-2 font-display text-xl lg:text-2xl italic font-medium text-sage-800">
          {sectionLabel}
        </div>
        <p className="mt-2 text-xs text-charcoal-500">
          Changes apply to this search only.
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={() => {
            if (active.status === "paused") {
              resumeSearch(active.id);
              toast.success("Search resumed");
            } else {
              pauseSearch(active.id);
              toast.success("Search paused");
            }
          }}
          className="inline-flex items-center gap-1.5 h-10 px-4 rounded-pill border border-charcoal-200 text-sm font-semibold text-charcoal-700 hover:border-charcoal-950 transition-colors"
        >
          {active.status === "paused" ? (
            <><Play className="h-4 w-4" /> Resume search</>
          ) : (
            <><Pause className="h-4 w-4" /> Pause search</>
          )}
        </button>
        <DeleteSearchButton />
      </div>
    </div>
  );
}

function DeleteSearchButton() {
  const navigate = useNavigate();
  const active = useActiveSearch();
  const deleteSearch = useAppStore((s) => s.deleteSearch);
  const deleteMut = useDeleteSearchMutation();
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  if (!active) return null;
  const matches = confirmText.trim() === active.name;
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(active.id);

  return (
    <AlertDialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setConfirmText(""); }}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 h-10 px-4 rounded-pill border border-transparent text-sm font-semibold text-danger hover:bg-danger/10 transition-colors"
      >
        <Trash2 className="h-4 w-4" /> Delete search
      </button>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete "{active.name}"?</AlertDialogTitle>
          <AlertDialogDescription>
            This permanently removes the search and all its history. This cannot be undone.
            Type <span className="font-semibold text-charcoal-950">{active.name}</span> to confirm.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <input
          autoFocus
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder={active.name}
          className="w-full h-11 px-3 rounded-md border border-charcoal-200 bg-paper text-sm focus:outline-none focus:border-charcoal-950"
        />
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={!matches}
            onClick={() => {
              if (isUuid) deleteMut.mutate(active.id);
              deleteSearch(active.id);
              toast.success("Search deleted");
              navigate({ to: "/" });
            }}
            className="bg-danger text-paper hover:bg-danger/90"
          >
            Delete search
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/* ---------- Sidebar ---------- */

function SidebarNav({ pathname }: { pathname: string }) {
  return (
    <nav aria-label="Preferences sections" className="flex flex-col gap-1">
      {NAV_GROUPS.map((group) => (
        <div key={group.label} className="first:mt-0 mt-6">
          <div className="mb-2 px-3 text-[11px] font-mono uppercase tracking-[0.12em] text-sage-700">
            {group.label}
          </div>
          <div className="flex flex-col gap-1">
            {group.items.map((item) => (
              <NavLinkItem key={item.label} item={item} pathname={pathname} />
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}

function NavLinkItem({
  item,
  pathname,
}: {
  item: NavItem;
  pathname: string;
}) {
  const Icon = item.icon;
  const active =
    item.to !== undefined &&
    (item.exact ? pathname === item.to : pathname.startsWith(item.to));

  const classes = cn(
    "inline-flex items-center gap-3 text-sm font-medium transition-colors whitespace-nowrap h-11 px-3 rounded-lg w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-charcoal-950/30",
    active
      ? "bg-charcoal-950 text-paper"
      : item.locked
        ? "text-charcoal-400 cursor-not-allowed"
        : "text-charcoal-700 hover:bg-paper-warm",
  );

  if (item.locked || !item.to) {
    return (
      <button
        type="button"
        disabled
        aria-disabled
        title={item.lockedReason ?? "Upgrade required"}
        className={classes}
      >
        <Icon className={cn("h-[18px] w-[18px]", active ? "text-paper" : "text-sage-700")} aria-hidden />
        <span className="flex-1 text-left">{item.label}</span>
        <Lock className="h-3.5 w-3.5 text-charcoal-400" aria-label="Locked" />
      </button>
    );
  }

  return (
    <Link to={item.to} className={classes} aria-current={active ? "page" : undefined}>
      <Icon className={cn("h-[18px] w-[18px]", active ? "text-paper" : "text-sage-700")} aria-hidden />
      <span className="flex-1 text-left">{item.label}</span>
    </Link>
  );
}
