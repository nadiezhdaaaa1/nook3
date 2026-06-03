import { createFileRoute, redirect } from "@tanstack/react-router";

// 301 redirect: /posts/* → canonical /blog/*
export const Route = createFileRoute("/posts/$slug")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: "/blog/$slug", params: { slug: params.slug }, statusCode: 301 });
  },
});
