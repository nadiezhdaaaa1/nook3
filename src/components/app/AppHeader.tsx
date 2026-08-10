import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Bookmark, Gift, Lock, LogOut, Sparkles, UserCircle } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/brand/Logo";
import { SearchSelector } from "@/components/app/SearchSelector";
import { useAppStore } from "@/lib/store";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Action = {
  to: "/saved" | "/wren" | "/referrals" | "/account";
  label: string;
  icon: typeof Bookmark;
  locked?: boolean;
};

export function AppHeader() {
  const navigate = useNavigate();
  const plan = useAppStore((s) => s.user?.plan ?? "free");
  const wrenLocked = plan !== "premium" && plan !== "max";
  const [signingOut, setSigningOut] = useState(false);

  const actions: Action[] = [
    { to: "/saved", label: "Saved listings", icon: Bookmark },
    { to: "/wren", label: wrenLocked ? "Wren AI chat (Premium)" : "Wren AI chat", icon: Sparkles, locked: wrenLocked },
    { to: "/referrals", label: "Referrals", icon: Gift },
    { to: "/account", label: "Account", icon: UserCircle },
  ];

  const handleSignOut = async () => {
    setSigningOut(true);
    const { error } = await supabase.auth.signOut();
    setSigningOut(false);
    if (error) {
      toast.error("Sign out failed", { description: error.message });
      return;
    }
    toast.success("Signed out");
    navigate({ to: "/login", replace: true });
  };

  const iconClasses =
    "inline-flex h-10 w-10 items-center justify-center rounded-pill border border-black/10 bg-white text-charcoal-700 transition-colors hover:border-charcoal-950 hover:text-charcoal-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-charcoal-950/30";

  return (
    <header className="sticky top-0 z-40 border-b border-black/[0.08] bg-paper/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-10">
        <div className="flex min-w-0 items-center gap-3">
          <Link to="/home" className="flex shrink-0 items-center gap-2.5" aria-label="Nook home">
            <Logo className="hidden text-2xl sm:block" />
          </Link>
          <span aria-hidden className="h-6 w-px shrink-0 bg-black/10" />
          <SearchSelector />
        </div>

        <TooltipProvider delayDuration={150}>
          <nav aria-label="Account sections" className="flex shrink-0 items-center gap-1.5">
            {actions.map((a) => {
              const Icon = a.icon;
              return (
                <Tooltip key={a.to}>
                  <TooltipTrigger asChild>
                    <Link
                      to={a.to}
                      aria-label={a.label}
                      className={cn(iconClasses, "relative")}
                      activeProps={{ className: "border-charcoal-950 bg-charcoal-950 text-paper" }}
                    >
                      <Icon className="h-[18px] w-[18px]" aria-hidden />
                      {a.locked && (
                        <Lock
                          className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-paper text-charcoal-500"
                          aria-hidden
                        />
                      )}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>{a.label}</TooltipContent>
                </Tooltip>
              );
            })}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={signingOut}
                  aria-label="Sign out"
                  className={iconClasses}
                >
                  <LogOut className="h-[18px] w-[18px]" aria-hidden />
                </button>
              </TooltipTrigger>
              <TooltipContent>Sign out</TooltipContent>
            </Tooltip>
          </nav>
        </TooltipProvider>
      </div>
    </header>
  );
}
