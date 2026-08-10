import { createFileRoute, redirect } from "@tanstack/react-router";

// 301 redirect: /app → authenticated home screen
export const Route = createFileRoute("/app")({
  beforeLoad: () => {
    throw redirect({ to: "/home", statusCode: 301 });
  },
  component: () => null,
});
