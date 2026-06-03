import { createFileRoute, redirect } from "@tanstack/react-router";

// 301 redirect: /sign-in → /login
export const Route = createFileRoute("/sign-in")({
  beforeLoad: () => {
    throw redirect({ to: "/login", statusCode: 301 });
  },
});
