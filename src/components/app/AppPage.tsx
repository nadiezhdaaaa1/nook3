import type { ReactNode } from "react";

/**
 * Standard padded container for the account-level app screens
 * (saved listings, Wren, referrals, account). The home screen renders
 * full-bleed and does not use this.
 */
export function AppPage({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-8 lg:px-12 lg:pt-10">
      <header>
        <h1 className="font-display text-[36px] font-bold leading-[1.05] tracking-[-0.02em] text-charcoal-950 lg:text-[44px]">
          {title}
        </h1>
        {subtitle && <p className="mt-3 text-sm text-charcoal-600">{subtitle}</p>}
      </header>
      <div className="mt-10">{children}</div>
    </div>
  );
}
