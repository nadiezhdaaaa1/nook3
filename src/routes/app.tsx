import { createFileRoute, redirect } from "@tanstack/react-router";

// 301 redirect: /app → authenticated alerts dashboard
export const Route = createFileRoute("/app")({
  beforeLoad: () => {
    throw redirect({ to: "/preferences/alerts", statusCode: 301 });
  },
});
