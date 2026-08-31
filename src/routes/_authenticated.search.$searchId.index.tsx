import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/search/$searchId/")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/search/$searchId/notifications",
      params: { searchId: params.searchId },
      replace: true,
    });
  },
  component: () => null,
});
