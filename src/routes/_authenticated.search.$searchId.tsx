import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Bell, DollarSign, Home as HomeIcon, MapPin, Pause, Pencil, Play, Trash2, ArrowLeft, Menu, Check, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAppStore, switchActiveSearch } from "@/lib/store";
import { useDeleteSearchMutation } from "@/lib/queries/searches";
import { PausedSearchBanner } from "@/components/preferences/PausedSearchBanner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { OriginButton } from "@/components/ui/origin-button";

export const Route = createFileRoute("/_authenticated/search/$searchId")({
  head: () => ({
    meta: [
      { title: "Edit search — Nook" },
      { name: "description", content: "Edit the criteria and notifications for this apartment search." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: SearchEditLayout,
});

const NAV = [
  { to: "/search/$searchId/notifications", label: "Notifications", icon: Bell },
  { to: "/search/$searchId/budget", label: "Budget & Criteria", icon: DollarSign },
  { to: "/search/$searchId/apartment", label: "Apartment Details", icon: HomeIcon },
  { to: "/search/$searchId/location", label: "Location", icon: MapPin },
] as const;

const SECTION_LABELS: Record<string, string> = {
  notifications: "Notification settings",
  budget: "Search criteria",
  apartment: "Apartment details",
  location: "Location",
};

function SearchEditLayout() {
  const { searchId } = Route.useParams();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const searches = useAppStore((s) => s.searches);
  const search = searches.find((s) => s.id === searchId) ?? null;

  // The legacy onboarding store is the live editing buffer — point it at the
  // search named in the URL.
  useEffect(() => {
    if (search) switchActiveSearch(search.id);
  }, [search?.id]);

  const section = pathname.split("/").pop() ?? "";
  const sectionLabel = SECTION_LABELS[section] ?? "Search settings";

  if (!search) {
    return (
      <div className="mx-auto max-w-[720px] px-6 py-24 text-center">
        <h1 className="font-display text-3xl font-bold text-charcoal-950">Search not found</h1>
        <p className="mt-3 text-sm text-charcoal-600">
          This search may have been deleted or belongs to another account.
        </p>
        <Link
          to="/home"
          className="mt-6 inline-flex h-11 items-center rounded-pill bg-charcoal-950 px-5 text-sm font-semibold text-paper hover:bg-charcoal-800"
        >
          Back to listings
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-8 lg:px-12 lg:pt-10">
      <Link
        to="/home"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-600 hover:text-charcoal-950"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to listings
      </Link>

      <PageHeader searchId={search.id} name={search.name} status={search.status} sectionLabel={sectionLabel} />

      <div className="mt-12 grid gap-8 lg:grid-cols-[240px_1fr] lg:gap-12">
        <aside className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
          <SidebarNav searchId={search.id} pathname={pathname} />
        </aside>

        <main>
          <MobileNav searchId={search.id} pathname={pathname} sectionLabel={sectionLabel} />
          <PausedSearchBanner />
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function PageHeader({
  searchId,
  name,
  status,
  sectionLabel,
}: {
  searchId: string;
  name: string;
  status: "active" | "paused" | "archived";
  sectionLabel: string;
}) {
  const pauseSearch = useAppStore((s) => s.pauseSearch);
  const resumeSearch = useAppStore((s) => s.resumeSearch);

  return (
    <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        <h1 className="break-words font-display text-[36px] font-bold leading-[1.1] tracking-[-0.02em] text-charcoal-950 lg:text-[44px]">
          {name}
        </h1>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <OriginButton
          variant="tertiary"
          size="medium"
          onClick={() => {
            if (status === "paused") {
              resumeSearch(searchId);
              toast.success("Search resumed");
            } else {
              pauseSearch(searchId);
              toast.success("Search paused");
            }
          }}
        >
          {status === "paused" ? (
            <><Play className="h-4 w-4" /> Resume search</>
          ) : (
            <><Pause className="h-4 w-4" /> Pause search</>
          )}
        </OriginButton>
        <DeleteSearchButton searchId={searchId} name={name} />
      </div>
    </div>
  );
}

function DeleteSearchButton({ searchId, name }: { searchId: string; name: string }) {
  const navigate = useNavigate();
  const deleteSearch = useAppStore((s) => s.deleteSearch);
  const deleteMut = useDeleteSearchMutation();
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const matches = confirmText.trim() === name;
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(searchId);

  return (
    <AlertDialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setConfirmText(""); }}>
      <OriginButton
        variant="tertiary"
        size="medium"
        onClick={() => setOpen(true)}
      >
        <Trash2 className="h-4 w-4" /> Delete search
      </OriginButton>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete "{name}"?</AlertDialogTitle>
          <AlertDialogDescription>
            This permanently removes the search and all its history. This cannot be undone.
            Type <span className="font-semibold text-charcoal-950">{name}</span> to confirm.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <input
          autoFocus
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder={name}
          className="h-11 w-full rounded-md border border-charcoal-200 bg-paper px-3 text-sm focus:border-charcoal-950 focus:outline-none"
        />
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={!matches}
            onClick={() => {
              if (isUuid) deleteMut.mutate(searchId);
              deleteSearch(searchId);
              toast.success("Search deleted");
              navigate({ to: "/home" });
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

function SidebarNav({ searchId, pathname }: { searchId: string; pathname: string }) {
  return (
    <nav aria-label="Search settings sections" className="flex flex-col gap-1">
      <div className="mb-2 px-3 text-[11px] font-mono uppercase tracking-[0.12em] text-sage-700">
        Search settings
      </div>
      {NAV.map((item) => {
        const Icon = item.icon;
        const href = item.to.replace("$searchId", searchId);
        const active = pathname === href;
        return (
          <Link
            key={item.label}
            to={item.to}
            params={{ searchId }}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex h-11 w-full items-center gap-3 whitespace-nowrap rounded-xl px-3 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-charcoal-950/30",
              active ? "bg-charcoal-950 text-paper hover:bg-charcoal-950" : "text-charcoal-700 hover:bg-[#EBE2CF]",
            )}
          >
            <Icon className={cn("h-[18px] w-[18px]", active ? "text-paper" : "text-sage-700")} aria-hidden />
            <span className="flex-1 text-left">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function MobileNav({
  searchId,
  pathname,
  sectionLabel,
}: {
  searchId: string;
  pathname: string;
  sectionLabel: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="-mt-4 mb-6 lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button
            type="button"
            className="inline-flex h-12 w-full items-center justify-between gap-3 rounded-card border border-charcoal-200 bg-paper-warm px-4 text-left transition-colors hover:border-charcoal-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-charcoal-950/30"
            aria-label="Open search settings menu"
          >
            <span className="inline-flex items-center gap-2.5">
              <Menu className="h-4 w-4 text-sage-700" aria-hidden />
              <span className="text-sm font-semibold text-charcoal-900">{sectionLabel}</span>
            </span>
            <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-charcoal-500">Menu</span>
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[320px] bg-paper p-0">
          <SheetHeader className="px-6 pb-2 pt-6 text-left">
            <SheetTitle className="font-display text-lg font-semibold text-charcoal-950">
              Search settings
            </SheetTitle>
          </SheetHeader>
          <div className="px-4 pb-8 pt-2" onClick={() => setOpen(false)}>
            <SidebarNav searchId={searchId} pathname={pathname} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
