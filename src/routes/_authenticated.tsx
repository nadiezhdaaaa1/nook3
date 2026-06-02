import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

/**
 * Pathless layout route that gates every child under `_authenticated`.
 *
 * Supabase persists the session in `localStorage`, so on the SERVER
 * `getUser()` always returns null and would bounce every direct navigation
 * (e.g. OAuth callback landing on /preferences) to /login. We skip the
 * check during SSR and rely on the client-side re-run after hydration —
 * that's when the session is actually available.
 */
export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ location }) => {
    if (typeof window === "undefined") return;
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }
    return { userId: data.user.id };
  },
  component: () => <Outlet />,
});
