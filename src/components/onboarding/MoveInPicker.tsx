import { format, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Props {
  mode: "specific" | "flexible";
  date?: string;
  /** Whether the user has made an explicit choice yet. */
  chosen?: boolean;
  onChange: (mode: "specific" | "flexible", date?: string) => void;
}

const CHIP: React.CSSProperties = {
  borderRadius: 12,
  height: 54,
  padding: "0 24px",
  fontWeight: 500,
  fontSize: 14,
  border: "1px solid rgba(0,0,0,0.2)",
  transition: "background-color .3s ease-out, border-color .3s ease-out, color .3s ease-out",
};

export function MoveInPicker({ mode, date, chosen = false, onChange }: Props) {
  const selectedDate = date ? parseISO(date) : undefined;
  const specificOn = chosen && mode === "specific" && Boolean(selectedDate);
  const flexibleOn = chosen && mode === "flexible";

  const selStyle = (on: boolean): React.CSSProperties =>
    on
      ? { ...CHIP, background: "#d66c38", borderColor: "#d66c38", color: "#ffffff" }
      : { ...CHIP, background: "transparent", color: "#3a3a37" };

  return (
    <div className="ob-chips flex" style={{ gap: 12 }}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            aria-pressed={specificOn}
            style={selStyle(specificOn)}
            className="w-full justify-start text-left font-medium"
          >
            <CalendarIcon aria-hidden="true" />
            {specificOn && selectedDate
              ? `Specific date • ${format(selectedDate, "d MMM yyyy")}`
              : "Specific date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(value) => {
              if (value) onChange("specific", format(value, "yyyy-MM-dd"));
            }}
            disabled={{ before: new Date() }}
            initialFocus
            className={cn("pointer-events-auto p-3")}
          />
        </PopoverContent>
      </Popover>

      <Button
        type="button"
        variant="outline"
        aria-pressed={flexibleOn}
        onClick={() => onChange("flexible")}
        style={selStyle(flexibleOn)}
      >
        Flexible
      </Button>
    </div>
  );
}
