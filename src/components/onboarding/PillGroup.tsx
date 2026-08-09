import { ObChip } from "@/components/onboarding/ObChip";

export interface PillOption {
  id: string;
  label: string;
  sub?: string;
}

interface Props {
  options: PillOption[];
  value: string | string[];
  onChange: (id: string) => void;
  multi?: boolean;
  size?: "md" | "lg";
}

export function PillGroup({ options, value, onChange, multi }: Props) {
  const isSelected = (id: string) =>
    multi ? (value as string[]).includes(id) : value === id;

  return (
    <div className="flex flex-wrap" style={{ gap: 12 }}>
      {options.map((opt) => {
        const selected = isSelected(opt.id);
        return (
          <ObChip key={opt.id} selected={selected} onClick={() => onChange(opt.id)}>
            <span className="inline-flex items-center gap-2">
              <span>{opt.label}</span>
              {opt.sub && <span className="text-[13px] opacity-70">{opt.sub}</span>}
            </span>
          </ObChip>
        );
      })}
    </div>
  );
}
