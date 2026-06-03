import { createFileRoute, redirect } from "@tanstack/react-router";

// 301 redirect: /sign-up → /signup
export const Route = createFileRoute("/sign-up")({
  beforeLoad: () => {
    throw redirect({ to: "/signup", statusCode: 301 });
  },
  component: () => null,
});
