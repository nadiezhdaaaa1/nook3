import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  IconGift,
  IconHeart,
  IconHomeSearch,
  IconMenu2,
  IconMessageChatbot,
  IconUser,
} from "@tabler/icons-react";

import { Logo } from "@/components/brand/Logo";
import { NavHoverItem } from "@/components/app/NavHoverItem";
import { PlanBadge, type PlanKey } from "@/components/app/PlanBadge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const ICON_PROPS = {
  size: 20,
  stroke: 1.5,
  color: "#4A4A46",
} as const;

const LABEL_CLASS = "text-[14px] font-semibold leading-5 text-[#241C12]";
const TEXT_BUTTON_CLASS = "gap-2 rounded-[8px] pl-2.5 pr-3 py-2";
const ICON_BUTTON_CLASS = "rounded-[8px] p-2";

const NAV_ITEMS = [
  { to: "/home", label: "Searches", Icon: IconHomeSearch },
  { to: "/saved", label: "Saved", Icon: IconHeart },
  { to: "/wren", label: "Wren AI chat", Icon: IconMessageChatbot },
  { to: "/referrals", label: "Referrals", Icon: IconGift },
  { to: "/account", label: "Account", Icon: IconUser },
] as const;

export function AppHeader({ plan }: { plan?: PlanKey }) {
  const storePlan = useAppStore((s) => s.user?.plan);
  const [open, setOpen] = useState(false);
  const resolvedPlan: PlanKey =
    plan ?? (storePlan === "premium" || storePlan === "max" ? storePlan : "free");
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header
      className="sticky top-0 z-40 w-full border-b border-black/[0.08] backdrop-blur font-['Google_Sans_Flex',sans-serif]"
      style={{ backgroundColor: "#FAF8F3" }}
    >
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
        <div className="flex min-w-0 items-center gap-2 sm:gap-5">
          <Link to="/home" aria-label="Nook home" className="flex shrink-0 items-center">
            <Logo className="h-[28px] w-[81.22px]" />
          </Link>
          <span className="hidden h-5 w-px bg-black/[0.12] sm:block" aria-hidden="true" />
          <PlanBadge plan={resolvedPlan} />
        </div>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          <NavHoverItem to="/home" className={TEXT_BUTTON_CLASS}>
            <IconHomeSearch {...ICON_PROPS} aria-hidden />
            <span className={LABEL_CLASS}>Searches</span>
          </NavHoverItem>
          <NavHoverItem to="/saved" className={TEXT_BUTTON_CLASS}>
            <IconHeart {...ICON_PROPS} aria-hidden />
            <span className={LABEL_CLASS}>Saved</span>
          </NavHoverItem>
          <Tooltip>
            <TooltipTrigger asChild>
              <NavHoverItem to="/wren" className={ICON_BUTTON_CLASS} aria-label="Wren AI chat">
                <IconMessageChatbot {...ICON_PROPS} aria-hidden />
              </NavHoverItem>
            </TooltipTrigger>
            <TooltipContent side="bottom">Wren AI chat</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <NavHoverItem to="/referrals" className={ICON_BUTTON_CLASS} aria-label="Referrals">
                <IconGift {...ICON_PROPS} aria-hidden />
              </NavHoverItem>
            </TooltipTrigger>
            <TooltipContent side="bottom">Referrals</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <NavHoverItem
                to="/account"
                aria-label="Account"
                className={ICON_BUTTON_CLASS}
              >
                <IconUser {...ICON_PROPS} aria-hidden />
              </NavHoverItem>
            </TooltipTrigger>
            <TooltipContent side="bottom">Account</TooltipContent>
          </Tooltip>
        </nav>

        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger
            aria-label="Open menu"
            className="flex shrink-0 items-center justify-center rounded-[8px] p-2 outline-none transition-colors hover:bg-[#EBE2CF] focus-visible:ring-2 focus-visible:ring-black/20 md:hidden"
          >
            <IconMenu2 size={24} stroke={1.5} color="#241C12" aria-hidden />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-[220px] rounded-[12px] border-black/[0.08] bg-[#FAF8F3] p-2 shadow-lg font-['Google_Sans_Flex',sans-serif]"
          >
            <nav aria-label="Mobile" className="flex flex-col gap-1">
              {NAV_ITEMS.map(({ to, label, Icon }) => {
                const isActive = pathname === to;
                return (
                  <DropdownMenuItem
                    key={to}
                    asChild
                    className={cn(
                      "flex cursor-pointer items-center gap-2 rounded-[8px] px-3 py-2.5 transition-colors hover:bg-[#EBE2CF] focus:bg-[#EBE2CF] focus:text-[#241C12] data-[active]:bg-[#241C12]",
                      isActive && "bg-[#241C12]"
                    )}
                  >
                    <Link to={to} onClick={() => setOpen(false)}>
                      <Icon
                        size={20}
                        stroke={1.5}
                        className={cn("shrink-0", isActive ? "text-white" : "text-[#4A4A46]")}
                        aria-hidden
                      />
                      <span className={cn(LABEL_CLASS, isActive && "text-white")}>{label}</span>
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </nav>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

