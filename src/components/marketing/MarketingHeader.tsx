import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Logo, LogoMark } from "@/components/brand/Logo";

import { cn } from "@/lib/utils";

export function MarketingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300 ease-soft",
        scrolled
          ? "bg-[#fbf4e6]/90 backdrop-blur-md border-b border-[#1a1a1a]/8"
          : "bg-transparent border-b border-transparent",
      )}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-18 flex items-center justify-between gap-6 py-3">
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <LogoMark size={32} />
          <Logo className="text-xl" />
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          <a href="#how" className="text-sm font-medium text-charcoal-700 hover:text-charcoal-950 transition-colors">How it works</a>
          <a href="#what" className="text-sm font-medium text-charcoal-700 hover:text-charcoal-950 transition-colors">What you get</a>
          <a href="#pricing" className="text-sm font-medium text-charcoal-700 hover:text-charcoal-950 transition-colors">Pricing</a>
          <a href="#faq" className="text-sm font-medium text-charcoal-700 hover:text-charcoal-950 transition-colors">FAQ</a>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="hidden md:inline-flex h-10 items-center px-3 text-sm font-semibold text-charcoal-800 hover:text-charcoal-950 transition-colors"
          >
            Sign in
          </Link>
          <Link
            to="/onboarding"
            className="inline-flex h-11 items-center px-5 rounded-pill text-sm font-semibold bg-peach-700 text-paper hover:bg-peach-900 transition-colors"
          >
            Get free alerts
          </Link>

          <button
            onClick={() => setOpen(true)}
            className="md:hidden h-10 w-10 inline-flex items-center justify-center rounded-pill hover:bg-charcoal-950/5"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden fixed inset-0 z-[60] bg-[#fbf4e6] flex flex-col">
          <div className="h-18 px-6 flex items-center justify-between border-b border-charcoal-950/8 py-3">
            <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-2.5">
              <LogoMark size={32} />
              <Logo className="text-xl" />
            </Link>
            <button
              onClick={() => setOpen(false)}
              className="h-10 w-10 inline-flex items-center justify-center rounded-pill hover:bg-charcoal-950/5"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-6 flex flex-col gap-2">
            <a href="#how" onClick={() => setOpen(false)} className="h-12 inline-flex items-center px-2 text-base font-medium">How it works</a>
            <a href="#what" onClick={() => setOpen(false)} className="h-12 inline-flex items-center px-2 text-base font-medium">What you get</a>
            <a href="#pricing" onClick={() => setOpen(false)} className="h-12 inline-flex items-center px-2 text-base font-medium">Pricing</a>
            <a href="#faq" onClick={() => setOpen(false)} className="h-12 inline-flex items-center px-2 text-base font-medium">FAQ</a>
            
            <Link to="/login" onClick={() => setOpen(false)} className="mt-4 h-12 inline-flex items-center justify-center px-5 rounded-pill border-2 border-charcoal-950 text-sm font-semibold">
              Sign in
            </Link>
            <Link to="/signup" onClick={() => setOpen(false)} className="h-12 inline-flex items-center justify-center px-5 rounded-pill bg-charcoal-950 text-paper text-sm font-semibold">
              Get alerts
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
