import { useEffect, type ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import { MarketingHeader } from "./MarketingHeader";
import { MarketingFooter } from "./MarketingFooter";
import { ScrollProgress } from "./anim/ScrollProgress";

export function MarketingLayout({
  children,
  hideHeader = false,
}: {
  children: ReactNode;
  hideHeader?: boolean;
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
        {!hideHeader && <MarketingHeader />}
        <main className={hideHeader ? "flex-1" : "flex-1 pt-16"}>{children}</main>
        <MarketingFooter />
      </div>
    </MotionConfig>
  );
}

