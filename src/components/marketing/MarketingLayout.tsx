import { useEffect, type ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import { MarketingHeader } from "./MarketingHeader";
import { MarketingFooter } from "./MarketingFooter";
import { ScrollProgress } from "./anim/ScrollProgress";

export function MarketingLayout({ children }: { children: ReactNode }) {
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
        <MarketingHeader />
        <main className="flex-1 pt-16">{children}</main>
        <MarketingFooter />
      </div>
    </MotionConfig>
  );
}
