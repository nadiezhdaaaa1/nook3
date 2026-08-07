import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-14 w-full rounded-[12px] border border-black/20 bg-surface-elevated px-[18px] py-2 text-base text-foreground transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-foreground/45 hover:border-black/[0.32] focus-visible:border-primary focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className,

        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
