import { useEffect, useState } from "react";

/**
 * Dev-only override for the dashboard's empty-state selection so each state
 * can be reviewed without manipulating digest data. Production ignores it
 * (the dev panel that sets it only renders in development builds).
 */
export type DashboardStateOverride = "normal" | "no_digest" | "no_matches" | "all_dismissed";

const KEY = "nook.dev.dashboardState";
const EVENT = "nook:dev-dashboard-state";

export function getDashboardStateOverride(): DashboardStateOverride {
  if (typeof window === "undefined") return "normal";
  const v = window.localStorage.getItem(KEY);
  return v === "no_digest" || v === "no_matches" || v === "all_dismissed" ? v : "normal";
}

export function setDashboardStateOverride(next: DashboardStateOverride): void {
  if (typeof window === "undefined") return;
  if (next === "normal") window.localStorage.removeItem(KEY);
  else window.localStorage.setItem(KEY, next);
  window.dispatchEvent(new Event(EVENT));
}

export function useDashboardStateOverride(): DashboardStateOverride {
  const [value, setValue] = useState<DashboardStateOverride>("normal");
  useEffect(() => {
    setValue(getDashboardStateOverride());
    const onChange = () => setValue(getDashboardStateOverride());
    window.addEventListener(EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);
  return value;
}
