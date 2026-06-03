import { createFileRoute, redirect } from "@tanstack/react-router";

// 301 redirect: /home → /
export const Route = createFileRoute("/home")({
  beforeLoad: () => {
    throw redirect({ to: "/", statusCode: 301 });
  },
  component: () => null,
});
