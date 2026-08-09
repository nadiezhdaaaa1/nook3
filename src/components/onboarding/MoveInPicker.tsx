import { useState } from "react";
import { format, parseISO, startOfDay } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { OriginButton } from "@/components/ui/origin-button";
import { cn } from "@/lib/utils";

interface Props {
  mode: "specific" | "flexible";
  date?: string;
  /** Whether the user has made an explicit choice yet. */
  chosen?: boolean;
  onChange: (mode: "specific" | "flexible", date?: string) => void;
}

const CHIP_CLASS =
  "w-full h-[54px] px-6 text-[16px] justify-start text-left";

function ThreeArrowsIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Arrow pointing up */}
      <path d="M12 12 L12 5" />
      <path d="M9 8 L12 5 L15 8" />
      {/* Arrow pointing down-right */}
      <path d="M12 12 L18 16" />
      <path d="M15 16 L18 16 L18 13" />
      {/* Arrow pointing down-left */}
      <path d="M12 12 L6 16" />
      <path d="M9 16 L6 16 L6 13" />
    </svg>
  );
}

export function MoveInPicker({ mode, date, chosen = false, onChange }: Props) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const selectedDate = date ? parseISO(date) : undefined;
  const specificOn = chosen && mode === "specific" && Boolean(selectedDate);
  const flexibleOn = chosen && mode === "flexible";

  return (
    <div className="ob-chips flex" style={{ gap: 12 }}>
      <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
        <PopoverTrigger asChild>
          <OriginButton
            type="button"
            variant={specificOn ? "dark" : "tertiary"}
            size="big"
            className={CHIP_CLASS}
            aria-pressed={specificOn}
          >
            <span className="inline-flex w-full items-center gap-2">
              <CalendarIcon aria-hidden="true" className="shrink-0" />
              <span className="truncate">
                {specificOn && selectedDate
                  ? `Specific date • ${format(selectedDate, "d MMM yyyy")}`
                  : "Specific date"}
              </span>
            </span>
          </OriginButton>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-white overflow-hidden" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(value) => {
              if (!value) return;
              onChange("specific", format(value, "yyyy-MM-dd"));
              setCalendarOpen(false);
            }}
            disabled={{ before: startOfDay(new Date()) }}
            initialFocus
            className={cn("pointer-events-auto p-3 bg-transparent")}
          />
        </PopoverContent>
      </Popover>

      <OriginButton
        type="button"
        variant={flexibleOn ? "dark" : "tertiary"}
        size="big"
        className={CHIP_CLASS}
        aria-pressed={flexibleOn}
        onClick={() => {
          setCalendarOpen(false);
          onChange("flexible");
        }}
      >
        <span className="inline-flex w-full items-center gap-2">
          <ThreeArrowsIcon className="shrink-0" />
          <span className="truncate">Flexible</span>
        </span>
      </OriginButton>
    </div>
  );
}

