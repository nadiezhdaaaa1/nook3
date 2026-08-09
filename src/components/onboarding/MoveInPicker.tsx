import { useRef } from "react";

interface Props {
  mode: "specific" | "flexible";
  date?: string;
  /** Whether the user has made an explicit choice yet. */
  chosen?: boolean;
  onChange: (mode: "specific" | "flexible", date?: string) => void;
}

function fmt(iso: string) {
  const d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

const CHIP: React.CSSProperties = {
  borderRadius: 12,
  padding: "16px 24px",
  fontWeight: 500,
  fontSize: 14,
  border: "1px solid rgba(0,0,0,0.2)",
  transition: "background-color .3s ease-out, border-color .3s ease-out, color .3s ease-out",
};

export function MoveInPicker({ mode, date, chosen = true, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const defaultDate = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().slice(0, 10);
  })();
  const effective = date ?? defaultDate;

  const specificOn = chosen && mode === "specific";
  const flexibleOn = chosen && mode === "flexible";

  const openPicker = () => {
    onChange("specific", effective);
    const el = inputRef.current;
    if (el) {
      if (typeof el.showPicker === "function") el.showPicker();
      else el.focus();
    }
  };

  const selStyle = (on: boolean): React.CSSProperties =>
    on
      ? { ...CHIP, background: "#D04305", borderColor: "#D04305", color: "#ffffff" }
      : { ...CHIP, background: "transparent", color: "#3a3a37" };

  return (
    <div className="ob-chips flex" style={{ gap: 12 }}>
      <div className="relative">
        <button type="button" aria-pressed={specificOn} onClick={openPicker} style={selStyle(specificOn)} className="w-full">
          {specificOn ? `Specific date • ${fmt(effective)}` : "Specific date"}
        </button>
        <input
          ref={inputRef}
          type="date"
          value={effective}
          onChange={(e) => onChange("specific", e.target.value)}
          aria-label="Move-in date"
          className="absolute left-3 bottom-0 h-0 w-0 opacity-0 pointer-events-none"
          tabIndex={-1}
        />
      </div>

      <button
        type="button"
        aria-pressed={flexibleOn}
        onClick={() => onChange("flexible")}
        style={selStyle(flexibleOn)}
      >
        Flexible
      </button>
    </div>
  );
}
