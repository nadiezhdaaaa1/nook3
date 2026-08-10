import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import * as React from "react";

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

/**
 * Header nav item with the exact hover sweep of the tertiary OriginButton:
 * a #EBE2CF circle expanding from the pointer position.
 */
export function NavHoverItem({
  to,
  onClick,
  className,
  children,
  onPointerEnter,
  onPointerLeave,
  onFocus,
  onBlur,
  ...rest
}: {
  to?: string;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
} & Pick<
  React.HTMLAttributes<HTMLElement>,
  | "aria-label"
  | "title"
  | "onPointerEnter"
  | "onPointerLeave"
  | "onFocus"
  | "onBlur"
>) {
  const nodeRef = React.useRef<HTMLElement | null>(null);
  const [hovered, setHovered] = React.useState(false);
  const [origin, setOrigin] = React.useState({ x: 0, y: 0 });
  const [coverSize, setCoverSize] = React.useState(0);

  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = to ? pathname === to : false;

  const handleEnter = (event: React.PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    setOrigin({ x, y });
    setCoverSize(getCoverDiameter(rect.width, rect.height, x, y));
    setHovered(true);
  };

  const handleFocus = (event: React.FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.matches(":focus-visible")) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.width / 2;
    const y = rect.height / 2;
    setOrigin({ x, y });
    setCoverSize(getCoverDiameter(rect.width, rect.height, x, y));
    setHovered(true);
  };

  const styledChildren = React.useMemo(() => {
    if (!isActive) return children;
    return React.Children.map(children, (child) => {
      if (!React.isValidElement(child)) return child;
      const props = child.props as { className?: string; color?: string };
      const newProps: Record<string, unknown> = {
        className: cn(props.className, "text-white"),
      };
      if ("color" in props) {
        newProps.color = "currentColor";
      }
      return React.cloneElement(child, newProps);
    });
  }, [children, isActive]);

  const inner = (
    <>
      <motion.span
        animate={{ scale: hovered && coverSize > 0 && !isActive ? 1 : 0 }}
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
      <span className="relative z-10 inline-flex items-center gap-2 whitespace-nowrap">
        {styledChildren}
      </span>
    </>
  );

  const shared = {
    className: cn(
      "relative inline-flex cursor-pointer select-none items-center justify-center overflow-hidden bg-transparent outline-none",
      "focus-visible:ring-2 focus-visible:ring-black/20",
      isActive && "bg-[#241C12] text-white",
      className,
    ),
    ...rest,
    onPointerEnter: (event: React.PointerEvent<HTMLElement>) => {
      onPointerEnter?.(event);
      handleEnter(event);
    },
    onPointerLeave: (event: React.PointerEvent<HTMLElement>) => {
      onPointerLeave?.(event);
      setHovered(false);
    },
    onFocus: (event: React.FocusEvent<HTMLElement>) => {
      onFocus?.(event);
      handleFocus(event);
    },
    onBlur: (event: React.FocusEvent<HTMLElement>) => {
      onBlur?.(event);
      setHovered(false);
    },
  };

  if (to) {
    return (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <Link to={to as any} ref={nodeRef as never} {...shared}>
        {inner}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} {...shared}>
      {inner}
    </button>
  );
}
