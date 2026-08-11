import { useAppStore } from "./appStore";
import { getDisabledSearchIds } from "./lock";

/** Reactive set of disabled search ids for the signed-in user's plan. */
export function useDisabledSearchIds(): Set<string> {
  const searches = useAppStore((s) => s.searches);
  const plan = useAppStore((s) => s.user?.plan ?? "free");
  return getDisabledSearchIds(searches, plan);
}

export function useIsSearchDisabled(id: string | null | undefined): boolean {
  const disabled = useDisabledSearchIds();
  return !!id && disabled.has(id);
}
