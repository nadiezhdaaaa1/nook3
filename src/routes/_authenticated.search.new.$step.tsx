import { useEffect, useRef, useState } from "react";
import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Step1Where } from "@/components/onboarding/Step1Where";
import { Step2Place } from "@/components/onboarding/Step2Place";
import { Step3Location } from "@/components/onboarding/Step3Location";
import { Step4Preferences } from "@/components/onboarding/Step4Preferences";
import { StepFlowProvider } from "@/components/onboarding/stepFlow";
import { UpgradeModal } from "@/components/preferences/UpgradeModal";
import { useOnboardingStore, type OnboardingState } from "@/lib/onboarding/store";
import { useAppStore, hydrateActiveSearchIntoOnboarding } from "@/lib/store";
import { useCreateSearchMutation } from "@/lib/queries/searches";
import type { CityId } from "@/data/cities";

export const Route = createFileRoute("/_authenticated/search/new/$step")({
  component: NewSearchStep,
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

function NewSearchStep() {
  const { step } = Route.useParams();
  const n = Number(step);
  const navigate = useNavigate();
  const createMut = useCreateSearchMutation();
  const createSearch = useAppStore((s) => s.createSearch);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const savedRef = useRef(false);

  // Snapshot the user's live search draft on entry and start the wizard blank,
  // so building a new search never clobbers the active one.
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

  if (!Number.isFinite(n) || n < 1 || n > 4) {
    return <Navigate to="/search/new/$step" params={{ step: "1" }} />;
  }

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
      {n === 1 && <Step1Where />}
      {n === 2 && <Step2Place />}
      {n === 3 && <Step3Location />}
      {n === 4 && <Step4Preferences />}
      {upgradeOpen && <UpgradeModal onClose={() => setUpgradeOpen(false)} />}
    </StepFlowProvider>
  );
}
