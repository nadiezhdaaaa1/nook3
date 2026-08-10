import { Link, useLocation } from "@tanstack/react-router";
import aiAsset from "@/assets/AI.png.asset.json";

export function WrenFab() {
  const { pathname } = useLocation();
  if (pathname.startsWith("/preferences/wren")) return null;

  return (
    <Link
      to="/preferences/wren"
      aria-label="Open Wren AI chat"
      className="fixed bottom-6 right-6 z-50 inline-flex items-center justify-center h-14 w-14 rounded-full bg-white border border-black/20 shadow-lg shadow-charcoal-950/20 hover:bg-paper-elevated hover:scale-105 active:scale-95 transition-all"
    >
      <img
        src={aiAsset.url}
        alt=""
        width={24}
        height={24}
        className="h-6 w-6 object-contain pointer-events-none"
      />
    </Link>
  );
}

