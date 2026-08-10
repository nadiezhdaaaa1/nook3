import { useState } from "react";
import { Link } from "@tanstack/react-router";
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useAppStore } from "@/lib/store";

const ICON_PROPS = {
  size: 20,
  stroke: 1.5,
  color: "#4A4A46",
} as const;

const LABEL_CLASS = "text-[14px] font-semibold leading-5 text-[#241C12]";
const TEXT_BUTTON_CLASS = "gap-2 rounded-[8px] pl-2 pr-3 py-2";
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
          <NavHoverItem to="/wren" className={ICON_BUTTON_CLASS} aria-label="Wren AI chat">
            <IconMessageChatbot {...ICON_PROPS} aria-hidden />
          </NavHoverItem>
          <NavHoverItem to="/referrals" className={ICON_BUTTON_CLASS} aria-label="Referrals">
            <IconGift {...ICON_PROPS} aria-hidden />
          </NavHoverItem>
          <NavHoverItem
            to="/account"
            aria-label="Account"
            className={ICON_BUTTON_CLASS}
          >
            <IconUser {...ICON_PROPS} aria-hidden />
          </NavHoverItem>
        </nav>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            aria-label="Open menu"
            className="flex shrink-0 items-center justify-center rounded-[8px] p-2 md:hidden"
          >
            <IconMenu2 size={24} stroke={1.5} color="#241C12" aria-hidden />
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[280px] border-black/[0.08] p-0 font-['Google_Sans_Flex',sans-serif]"
            style={{ backgroundColor: "#FAF8F3" }}
          >
            <nav aria-label="Mobile" className="flex flex-col gap-1 px-4 pt-16 pb-6">
              {NAV_ITEMS.map(({ to, label, Icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setOpen(false)}
                  activeProps={{ className: "bg-[#241C12] [&_span]:text-white" }}
                  className="flex items-center gap-3 rounded-[8px] px-3 py-3 transition-colors hover:bg-[#EBE2CF]"
                >
                  <Icon size={20} stroke={1.5} className="shrink-0" aria-hidden />
                  <span className={LABEL_CLASS}>{label}</span>
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
