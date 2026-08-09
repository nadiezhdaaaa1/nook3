import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends Omit<React.ComponentProps<"input">, "size"> {
  size?: "big" | "medium";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, size = "big", ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex w-full rounded-[12px] border border-black/20 bg-white px-4 text-[14px] font-['Google_Sans_Flex',sans-serif] text-[#241c12] transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-[rgba(36,28,18,0.5)] hover:border-black/[0.32] focus:border-[#9E2F11] focus:outline-none focus-visible:border-[#9E2F11] focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50",
          size === "medium" ? "h-[48px]" : "h-[56px]",
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
