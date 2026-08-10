import { Link } from "@tanstack/react-router";
import {
  IconGift,
  IconHeart,
  IconHomeSearch,
  IconMessageChatbot,
  IconUser,
} from "@tabler/icons-react";

import { Logo } from "@/components/brand/Logo";
import { NavHoverItem } from "@/components/app/NavHoverItem";
import { PlanBadge, type PlanKey } from "@/components/app/PlanBadge";
import { useAppStore } from "@/lib/store";

const ICON_PROPS = {
  size: 20,
  stroke: 1.5,
  color: "#4A4A46",
} as const;

const LABEL_CLASS = "text-[14px] font-semibold leading-5 text-[#241C12]";
const TEXT_BUTTON_CLASS = "gap-2 rounded-[8px] px-3 py-2";
const ICON_BUTTON_CLASS = "rounded-[8px] p-2";

export function AppHeader({ plan }: { plan?: PlanKey }) {
  const storePlan = useAppStore((s) => s.user?.plan);
  const resolvedPlan: PlanKey =
    plan ?? (storePlan === "premium" || storePlan === "max" ? storePlan : "free");

  return (
    <header
      className="sticky top-0 z-40 w-full border-b border-black/[0.08] backdrop-blur font-['Google_Sans_Flex',sans-serif]"
      style={{ backgroundColor: "rgba(244, 241, 234, 0.95)" }}
    >
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-10">
        <div className="flex items-center gap-6">
          <Link to="/home" aria-label="Nook home" className="flex shrink-0 items-center">
            <Logo className="h-[28px] w-[81.22px]" />
          </Link>
          <PlanBadge plan={resolvedPlan} />
        </div>

        <div className="flex items-center gap-4">
          <nav aria-label="Main" className="flex items-center gap-[2px]">
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
          </nav>

          <NavHoverItem
            to="/account"
            aria-label="Account"
            className="h-9 w-9 rounded-[8px] border border-black/20"
          >
            <IconUser size={18} stroke={1.5} color="#D66C38" aria-hidden />
          </NavHoverItem>
        </div>
      </div>
    </header>
  );
}
