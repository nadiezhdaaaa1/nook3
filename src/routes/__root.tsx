import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Toaster } from "@/components/ui/sonner";
import { OfflineBanner } from "@/components/system/OfflineBanner";
import { CookieBanner } from "@/components/legal/CookieBanner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Nook — Real-time apartment alerts" },
      {
        name: "description",
        content:
          "Nook watches the rental market 24/7 and pings you the moment a verified match appears. Built for renters tired of refreshing listings.",
      },
      { name: "author", content: "Nook" },
      { name: "robots", content: "index, follow" },
      { property: "og:site_name", content: "Nook" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Nook — Real-time apartment alerts" },
      {
        property: "og:description",
        content:
          "Verified rental matches the moment they hit the market. No spam, no stale listings.",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Nook — Real-time apartment alerts" },
      {
        name: "twitter:description",
        content:
          "Verified rental matches the moment they hit the market. No spam, no stale listings.",
      },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Nook",
          url: "https://nook3.lovable.app",
          description:
            "Real-time apartment alerts for renters. Verified listings, rent-regulated units flagged, no spam.",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Nook",
          url: "https://nook3.lovable.app",
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();

  useEffect(() => {
    // Hydrate persisted appStore + migrate legacy onboarding state (one-time).
    void (async () => {
      const { useAppStore } = await import("@/lib/store/appStore");
      const { ensureMigratedFromLegacy } = await import("@/lib/store/migrate");
      await useAppStore.persist.rehydrate();
      ensureMigratedFromLegacy();
    })();
  }, []);

  useEffect(() => {
    // Single source of truth for auth-driven cache invalidation.
    let isFirst = true;
    void import("@/integrations/supabase/client").then(({ supabase }) => {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((event) => {
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "USER_UPDATED") {
          void import("@/lib/consents").then(({ flushPendingConsents }) =>
            flushPendingConsents(),
          );
        }
        if (isFirst) {
          isFirst = false;
          return;
        }
        router.invalidate();
        queryClient.invalidateQueries();
      });
      (window as unknown as { __nookAuthSub?: { unsubscribe: () => void } }).__nookAuthSub =
        subscription;
    });
    return () => {
      const w = window as unknown as { __nookAuthSub?: { unsubscribe: () => void } };
      w.__nookAuthSub?.unsubscribe();
      w.__nookAuthSub = undefined;
    };
  }, [router, queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <OfflineBanner />
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      <Toaster />
      <CookieBanner />
    </QueryClientProvider>
  );
}
