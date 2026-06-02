import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

/**
 * Pathless layout route that gates every child under `_authenticated`.
 * Async `getUser()` re-validates the bearer token with the Auth server,
 * so server fns called below are guaranteed to have a hydrated session.
 *
 * Add admin/role layers as additional pathless layouts (e.g.
 * `_authenticated._admin.tsx`) and place protected children underneath.
 */
export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ location }) => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }
    return { userId: data.user.id };
  },
  component: () => <Outlet />,
});
