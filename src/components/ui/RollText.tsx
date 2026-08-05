import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const EASE_REVEAL = [0.22, 1, 0.36, 1] as const;

export interface RollTextProps<T extends React.ElementType = "span"> {
  as?: T;
  children: React.ReactNode;
  className?: string;
  onHoverChange?: (hover: boolean) => void;
}

export function RollText<T extends React.ElementType = "span">({
  as,
  children,
  className,
  onHoverChange,
  ...rest
}: RollTextProps<T> & React.ComponentPropsWithoutRef<T>) {
  const [hover, setHover] = React.useState(false);
  const reduced = useReducedMotion();
  const label = typeof children === "string" ? children : "";
  const chars = label.split("");
  const Comp = as || "span";

  const setHoverState = React.useCallback(
    (value: boolean) => {
      setHover(value);
      onHoverChange?.(value);
    },
    [onHoverChange],
  );

  return (
    <Comp
      {...rest}
      className={cn("roll-text", className)}
      onMouseEnter={(e: React.MouseEvent) => {
        setHoverState(true);
        rest.onMouseEnter?.(e);
      }}
      onMouseLeave={(e: React.MouseEvent) => {
        setHoverState(false);
        rest.onMouseLeave?.(e);
      }}
      onFocus={(e: React.FocusEvent) => {
        setHoverState(true);
        rest.onFocus?.(e);
      }}
      onBlur={(e: React.FocusEvent) => {
        setHoverState(false);
        rest.onBlur?.(e);
      }}
    >
      <span className="roll-text-roll" aria-hidden="true">
        <span className="roll-text-layer">
          {chars.map((c, i) => (
            <motion.span
              key={`a-${i}`}
              className="roll-text-char"
              animate={reduced ? { opacity: hover ? 0 : 1 } : { y: hover ? "-100%" : "0%" }}
              transition={{
                duration: reduced ? 0.3 : 0.35,
                ease: EASE_REVEAL,
                delay: reduced ? 0 : i * 0.02,
              }}
            >
              {c === " " ? "\u00A0" : c}
            </motion.span>
          ))}
        </span>
        <span className="roll-text-layer roll-text-layer-2">
          {chars.map((c, i) => (
            <motion.span
              key={`b-${i}`}
              className="roll-text-char"
              animate={reduced ? { opacity: hover ? 1 : 0 } : { y: hover ? "-100%" : "0%" }}
              transition={{
                duration: reduced ? 0.3 : 0.35,
                ease: EASE_REVEAL,
                delay: reduced ? 0 : i * 0.02,
              }}
            >
              {c === " " ? "\u00A0" : c}
            </motion.span>
          ))}
        </span>
      </span>
      <span className="sr-only">{label}</span>

      <style>{`
        .roll-text {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .roll-text-roll {
          position: relative;
          display: block;
          overflow: hidden;
          line-height: 1.25;
        }
        .roll-text-layer { display: flex; }
        .roll-text-layer-2 { position: absolute; inset: 0; transform: translateY(100%); }
        .roll-text-layer-2 .roll-text-char { will-change: transform; }
        .roll-text-char { display: inline-block; will-change: transform; }
      `}</style>
    </Comp>
  );
}
