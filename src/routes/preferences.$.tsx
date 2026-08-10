import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAppStore } from "@/lib/store";

/**
 * Legacy `/preferences/*` URLs.
 *
 * Account-level sections redirect straight away. Search-scoped sections need
 * the active search id, which only exists client-side, so those render a tiny
 * component that navigates once the store has hydrated.
 */
const STATIC_MAP: Record<string, "/saved" | "/wren" | "/referrals" | "/account"> = {
  alerts: "/saved",
  wren: "/wren",
  referrals: "/referrals",
  account: "/account",
};

const SEARCH_SECTIONS = new Set(["budget", "apartment", "location", "notifications"]);

export const Route = createFileRoute("/preferences/$")({
  beforeLoad: ({ params }) => {
    const section = (params._splat ?? "").split("/")[0] ?? "";
    const target = STATIC_MAP[section];
    if (target) throw redirect({ to: target, statusCode: 301 });
    if (!SEARCH_SECTIONS.has(section)) throw redirect({ to: "/home", statusCode: 301 });
  },
  component: LegacySearchRedirect,
});

function LegacySearchRedirect() {
  const { _splat } = Route.useParams();
  const navigate = useNavigate();
  const activeSearchId = useAppStore((s) => s.activeSearchId);
  const hydrated = useAppStore((s) => s.hydrated);

  useEffect(() => {
    if (!hydrated) return;
    const section = (_splat ?? "").split("/")[0] ?? "budget";
    if (!activeSearchId) {
      navigate({ to: "/home", replace: true });
      return;
    }
    const to =
      section === "notifications"
        ? "/search/$searchId/notifications"
        : section === "apartment"
          ? "/search/$searchId/apartment"
          : section === "location"
            ? "/search/$searchId/location"
            : "/search/$searchId/budget";
    navigate({ to, params: { searchId: activeSearchId }, replace: true });
  }, [hydrated, activeSearchId, _splat, navigate]);

  return null;
}
