import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ARCHIVED_BADGE_LABEL } from "@/lib/listingAvailability";

const ARCHIVED_TOOLTIP_TEXT =
  "This place is no longer on the market — likely rented or taken down. We keep it saved so you don't lose the details.";

/**
 * The "Archived · No longer listed" pill, with a tooltip that explains the
 * state. The pill itself is the tooltip trigger (rendered as a span with
 * tabIndex={0}) so it is focusable for keyboard users; Radix handles the
 * aria-describedby wiring and the hover/focus open behavior.
 */
export function ArchivedBadge({
  className = "",
}: {
  className?: string;
}) {
  return (
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        <span
          tabIndex={0}
          role="img"
          aria-label={ARCHIVED_BADGE_LABEL}
          className={`mb-2 inline-flex w-fit cursor-help items-center rounded-full border border-black/10 bg-black/[0.05] px-2.5 py-1 text-[12px] font-semibold leading-[16px] text-[#4a4238] outline-none focus-visible:ring-2 focus-visible:ring-[#6a820a] focus-visible:ring-offset-2 focus-visible:ring-offset-white ${className}`}
        >
          {ARCHIVED_BADGE_LABEL}
        </span>
      </TooltipTrigger>
      <TooltipContent
        side="bottom"
        align="start"
        className="max-w-[260px] text-[12px] leading-[1.4]"
      >
        {ARCHIVED_TOOLTIP_TEXT}
      </TooltipContent>
    </Tooltip>
  );
}
