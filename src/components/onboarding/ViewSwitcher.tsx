import { motion, useReducedMotion } from "framer-motion";
import type { ComponentType } from "react";

const INK = "#2b2521";
const BODY = "#4a4a46";
const FONT_UI =
  "'Google Sans Flex', 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
const UI_VAR = "'wght' 500";

const ui = { fontFamily: FONT_UI, fontVariationSettings: UI_VAR } as const;

interface IconProps {
  className?: string;
  size?: number;
  stroke?: number;
}

interface ViewSwitcherOption<T extends string> {
  value: T;
  label: string;
  icon: ComponentType<IconProps>;
}

interface ViewSwitcherProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: [ViewSwitcherOption<T>, ViewSwitcherOption<T>];
  ariaLabel?: string;
}

export function ViewSwitcher<T extends string>({
  value,
  onChange,
  options,
  ariaLabel = "View",
}: ViewSwitcherProps<T>) {
  const reduce = useReducedMotion();
  const dur = reduce ? 0 : 0.25;

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      style={{
        display: "inline-flex",
        gap: 2,
        padding: 4,
        borderRadius: 16,
        background: "rgba(0,0,0,0.08)",
        height: 52,
        boxSizing: "border-box",
      }}
    >
      {options.map((option) => {
        const active = value === option.value;
        const Icon = option.icon;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.value)}
            className="group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#241c12]"
            style={{
              ...ui,
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              padding: "12px 20px",
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 600,
              color: active ? INK : BODY,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              transition: "background-color 0.2s ease, color 0.2s ease",
            }}
          >
            {active && (
              <motion.span
                layoutId="view-toggle-pill"
                transition={{ duration: dur, ease: "easeOut" }}
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 12,
                  background: "#ffffff",
                  boxShadow: "0 1px 2px rgba(12,12,13,0.10), 0 1px 2px rgba(12,12,13,0.05)",
                }}
                aria-hidden
              />
            )}
            <Icon
              size={16}
              stroke={2}
              className="relative"
            />
            <span style={{ position: "relative" }}>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
