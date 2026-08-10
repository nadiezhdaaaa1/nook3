import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
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

const FILL_DURATION = 0.5;
const FILL_EASE = [0.16, 1, 0.3, 1] as const;
const FILL_COLOR = "#EBE2CF";

function getCoverDiameter(width: number, height: number, x: number, y: number) {
  return Math.ceil(
    2 *
      Math.max(
        Math.hypot(x, y),
        Math.hypot(width - x, y),
        Math.hypot(x, height - y),
        Math.hypot(width - x, height - y),
      ),
  );
}

function MobileNavItem({
  to,
  label,
  Icon,
  disabled,
}: {
  to: string;
  label: string;
  Icon: (typeof NAV_ITEMS)[number]["Icon"];
  disabled?: boolean;
}) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = pathname === to;
  const [hovered, setHovered] = useState(false);
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const [coverSize, setCoverSize] = useState(0);

  const handlePointerEnter = (event: React.PointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setOrigin({ x, y });
    setCoverSize(getCoverDiameter(rect.width, rect.height, x, y));
    setHovered(true);
  };

  const handleFocus = (event: React.FocusEvent<HTMLDivElement>) => {
    if (disabled || !event.currentTarget.matches(":focus-visible")) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.width / 2;
    const y = rect.height / 2;
    setOrigin({ x, y });
    setCoverSize(getCoverDiameter(rect.width, rect.height, x, y));
    setHovered(true);
  };

  return (
    <DropdownMenuItem
      disabled={disabled}
      onSelect={() => {
        if (disabled) return;
        navigate({ to });
      }}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={() => setHovered(false)}
      onFocus={handleFocus}
      onBlur={() => setHovered(false)}
      className={cn(
        "group relative flex w-full cursor-pointer select-none items-center gap-3 overflow-hidden rounded-[12px] bg-[#FAF6EE] px-3 py-2.5 outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-black/20 focus:bg-transparent",
        isActive && "bg-[#241C12] text-white focus:bg-[#241C12] focus:text-white",
        disabled && "cursor-not-allowed opacity-50",
      )}
    >
      {!isActive && !disabled && (
        <motion.span
          animate={{ scale: hovered && coverSize > 0 ? 1 : 0 }}
          aria-hidden
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
          initial={false}
          style={{
            backgroundColor: FILL_COLOR,
            height: coverSize,
            left: origin.x,
            top: origin.y,
            width: coverSize,
          }}
          transition={{ duration: FILL_DURATION, ease: FILL_EASE }}
        />
      )}
      <span className="relative z-10 inline-flex items-center gap-3">
        <Icon
          size={20}
          stroke={1.5}
          className={cn("shrink-0", isActive ? "text-white" : "text-[#241C12]")}
          aria-hidden
        />
        <span className="flex flex-col">
          <span
            className={cn(
              "text-[14px] font-semibold leading-5",
              isActive ? "text-white" : "text-[#241C12]",
            )}
          >
            {label}
          </span>
          {disabled && (
            <span className="text-[12px] leading-4 opacity-70">(coming soon)</span>
          )}
        </span>
      </span>
    </DropdownMenuItem>
  );
}

const ICON_PROPS = {
  size: 20,
  stroke: 1.5,
  color: "#4A4A46",
} as const;

const LABEL_CLASS = "text-[14px] font-semibold leading-5 text-[#241C12]";
const TEXT_BUTTON_CLASS = "gap-2 rounded-[8px] pl-2.5 pr-3 py-2";
const ICON_BUTTON_CLASS = "rounded-[8px] p-2";

const NAV_ITEMS = [
  { to: "/home", label: "Searches", Icon: IconHomeSearch, disabled: false },
  { to: "/saved", label: "Saved", Icon: IconHeart, disabled: false },
  { to: "/wren", label: "Wren AI chat", Icon: IconMessageChatbot, disabled: true },
  { to: "/referrals", label: "Referrals", Icon: IconGift, disabled: false },
  { to: "/account", label: "Account", Icon: IconUser, disabled: false },
] as const;

export function AppHeader({ plan }: { plan?: PlanKey }) {
  const storePlan = useAppStore((s) => s.user?.plan);
  const resolvedPlan: PlanKey =
    plan ?? (storePlan === "premium" || storePlan === "max" ? storePlan : "free");

  return (
    <header
      className="sticky top-0 z-40 w-full border-b border-black/[0.08] bg-white backdrop-blur font-['Google_Sans_Flex',sans-serif]"
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
              <NavHoverItem
                disabled
                className={ICON_BUTTON_CLASS}
                aria-label="Wren AI chat"
              >
                <IconMessageChatbot {...ICON_PROPS} aria-hidden />
              </NavHoverItem>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <div className="text-center leading-tight">
                <div>Wren AI chat</div>
                <div className="text-xs opacity-70">(coming soon)</div>
              </div>
            </TooltipContent>
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

        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label="Open menu"
            className="flex shrink-0 items-center justify-center rounded-[8px] p-2 outline-none transition-colors hover:bg-[#EBE2CF] focus-visible:ring-2 focus-visible:ring-black/20 md:hidden"
          >
            <IconMenu2 size={24} stroke={1.5} color="#241C12" aria-hidden />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-[220px] rounded-[12px] border-black/[0.08] bg-[#FAF6EE] p-2 shadow-lg font-['Google_Sans_Flex',sans-serif]"
          >
            <nav aria-label="Mobile" className="flex flex-col gap-1">
              {NAV_ITEMS.map(({ to, label, Icon, disabled }) => (
                <MobileNavItem
                  key={to}
                  to={to}
                  label={label}
                  Icon={Icon}
                  disabled={disabled}
                />
              ))}
            </nav>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

