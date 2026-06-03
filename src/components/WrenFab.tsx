import { Link, useLocation } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export function WrenFab() {
  const { pathname } = useLocation();
  if (pathname.startsWith("/preferences/wren")) return null;

  return (
    <Link
      to="/preferences/wren"
      aria-label="Open Wren AI chat"
      className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 h-14 px-5 rounded-pill bg-charcoal-950 text-paper shadow-lg shadow-charcoal-950/20 hover:bg-charcoal-800 hover:scale-105 active:scale-95 transition-all group"
    >
      <Sparkles className="h-5 w-5 text-sage-300 group-hover:rotate-12 transition-transform" />
      <span className="font-display font-semibold text-sm hidden sm:inline">Ask Wren</span>
    </Link>
  );
}
