import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, Clock } from "lucide-react";

import { formatTimeLabel } from "@/lib/preferences/notifications";
import { cn } from "@/lib/utils";

/** 30-minute increments across 24h, values kept as "HH:mm". */
const TIME_OPTIONS: string[] = Array.from({ length: 48 }, (_, i) => {
  const h = Math.floor(i / 2);
  const m = i % 2 === 0 ? "00" : "30";
  return `${h.toString().padStart(2, "0")}:${m}`;
});

/**
 * Custom time picker replacing input[type=time] so the dropdown can follow
 * the app's design system. Value format stays "HH:mm".
 */
export function TimeField({
  id,
  value,
  onChange,
  className,
  "aria-label": ariaLabel,
}: {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  "aria-label"?: string;
}) {
  return (
    <SelectPrimitive.Root value={value} onValueChange={onChange}>
      <SelectPrimitive.Trigger
        id={id}
        aria-label={ariaLabel}
        className={cn(
          "flex h-11 w-full cursor-pointer items-center justify-between gap-2 rounded-[12px] border border-black/20 bg-white px-4",
          "text-[15px] text-charcoal-950 transition-colors hover:border-black/[0.32]",
          "focus:border-primary focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
      >
        <SelectPrimitive.Value>{formatTimeLabel(value)}</SelectPrimitive.Value>
        <Clock className="h-4 w-4 shrink-0 text-charcoal-500" aria-hidden="true" />
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          sideOffset={4}
          className={cn(
            "relative z-[10002] max-h-[280px] min-w-[var(--radix-select-trigger-width)] overflow-y-auto overflow-x-hidden",
            "rounded-[12px] border border-black/20 bg-white shadow-lg",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          )}
        >
          <SelectPrimitive.Viewport className="p-1">
            {TIME_OPTIONS.map((option) => (
              <SelectPrimitive.Item
                key={option}
                value={option}
                className={cn(
                  "relative flex cursor-pointer select-none items-center justify-between gap-2 rounded-[8px] px-3 py-2",
                  "text-[14px] text-charcoal-950 outline-none",
                  "data-[highlighted]:bg-[#f8f3e1] data-[state=checked]:text-primary data-[state=checked]:font-semibold",
                )}
              >
                <SelectPrimitive.ItemText>{formatTimeLabel(option)}</SelectPrimitive.ItemText>
                <SelectPrimitive.ItemIndicator>
                  <Check className="h-4 w-4 text-primary" />
                </SelectPrimitive.ItemIndicator>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
