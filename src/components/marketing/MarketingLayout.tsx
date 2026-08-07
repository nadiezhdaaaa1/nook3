import { useEffect, type ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import { HeroScrollNav, HeroNavSpacer } from "@/components/landing/shared/HeroScrollNav";
import { MarketingFooter } from "./MarketingFooter";
import { ScrollProgress } from "./anim/ScrollProgress";

export function MarketingLayout({
  children,
  hideHeader = false,
  footer,
}: {
  children: ReactNode;
  hideHeader?: boolean;
  footer?: ReactNode;
}) {
  useEffect(() => {
    const html = document.documentElement;
    const had = html.classList.contains("dark");
    html.classList.remove("dark");
    return () => {
      if (had) html.classList.add("dark");
    };
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <ScrollProgress />
        {!hideHeader && (
          <>
            <HeroScrollNav />
            <HeroNavSpacer />
          </>
        )}
        <main className="flex-1">{children}</main>
        {footer}
        <MarketingFooter />
      </div>
    </MotionConfig>
  );
}

