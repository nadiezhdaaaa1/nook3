import { useEffect, useRef, useState } from "react";
import { createFileRoute, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { OnboardingHeader } from "@/components/onboarding/OnboardingHeader";
import { StepFlowProvider } from "@/components/onboarding/stepFlow";
import { UpgradeModal } from "@/components/preferences/UpgradeModal";
import { useOnboardingStore, type OnboardingState } from "@/lib/onboarding/store";
import { useAppStore, hydrateActiveSearchIntoOnboarding } from "@/lib/store";
import { useCreateSearchMutation } from "@/lib/queries/searches";
import type { CityId } from "@/data/cities";

export const Route = createFileRoute("/_authenticated/search/new")({
  beforeLoad: ({ location }) => {
    if (location.pathname.replace(/\/$/, "") === "/search/new") {
      throw redirect({ to: "/search/new/$step", params: { step: "1" } });
    }
  },
  component: NewSearchLayout,
});

/** Filter fields the wizard edits — everything we snapshot & restore. */
const DRAFT_KEYS = [
  "city",
  "budget",
  "moveIn",
  "movingOut",
  "bedrooms",
  "bathrooms",
  "rentProtection",
  "includeBrokerFee",
  "neighborhoods",
  "amenities",
  "transit",
  "commute",
  "frequency",
  "lastStep",
] as const;

type Draft = Partial<OnboardingState>;

function snapshotDraft(): Draft {
  const s = useOnboardingStore.getState() as unknown as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const k of DRAFT_KEYS) out[k] = s[k];
  return out as Draft;
}

function NewSearchLayout() {
  const navigate = useNavigate();
  const createMut = useCreateSearchMutation();
  const createSearch = useAppStore((s) => s.createSearch);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const savedRef = useRef(false);

  // Snapshot the live search draft on entry and start the wizard blank, so
  // building a new search never clobbers the currently active one.
  const [prevDraft] = useState<Draft>(() => {
    const snap = snapshotDraft();
    useOnboardingStore.getState().patch({
      city: null,
      budget: null,
      moveIn: { mode: "flexible" },
      bedrooms: [],
      bathrooms: "1ba",
      rentProtection: "all",
      includeBrokerFee: true,
      neighborhoods: [],
      amenities: {},
      transit: { hasPreference: false, lines: {} },
      commute: { maxMinutes: null },
      lastStep: 1,
    });
    return snap;
  });

  useEffect(() => {
    return () => {
      if (savedRef.current) {
        // A new search was created and is now active — show it in the editor.
        hydrateActiveSearchIntoOnboarding();
      } else {
        useOnboardingStore.getState().patch(prevDraft);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const exit = () => navigate({ to: "/saved", search: { tab: "searches" } as never });

  const handleSave = async () => {
    const o = useOnboardingStore.getState();
    const cityId = (o.city ?? "nyc") as CityId;
    const seed = {
      cityId,
      budget: o.budget,
      moveIn: o.moveIn,
      bedrooms: o.bedrooms,
      bathrooms: o.bathrooms,
      rentProtection: o.rentProtection,
      includeBrokerFee: o.includeBrokerFee,
      neighborhoods: o.neighborhoods,
      amenities: o.amenities,
      transit: o.transit,
      commute: o.commute,
      alertChannel: "email" as const,
      frequency: o.frequency,
    };

    const local = createSearch(seed);
    if (!local.ok) {
      setUpgradeOpen(true);
      return;
    }
    savedRef.current = true;

    try {
      await createMut.mutateAsync({ ...seed, name: local.search.name });
    } catch {
      // useCreateSearchMutation already surfaced the error toast.
    }
    toast.success("Search saved");
    navigate({ to: "/saved", search: { tab: "searches" } as never });
  };

  return (
    <StepFlowProvider
      value={{
        basePath: "/search/new/$step",
        finalLabel: "Save the search",
        onFinish: handleSave,
        onExit: exit,
        allowSkip: false,
      }}
    >
      <div className="min-h-[calc(100dvh-64px)] flex flex-col" style={{ background: "#faf6ee" }}>
        <OnboardingHeader fixed />
        <main
          className="w-full mx-auto flex-1 px-5"
          style={{ maxWidth: 800, paddingTop: 160, paddingBottom: 40 }}
        >
          <Outlet />
        </main>
      </div>
      {upgradeOpen && <UpgradeModal onClose={() => setUpgradeOpen(false)} />}
    </StepFlowProvider>
  );
}
