import { createFileRoute, redirect } from "@tanstack/react-router";

// Legacy URL: /preferences → new home screen.
export const Route = createFileRoute("/preferences/")({
  beforeLoad: () => {
    throw redirect({ to: "/home", statusCode: 301 });
  },
  component: () => null,
});
