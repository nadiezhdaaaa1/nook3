import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[96px] w-full rounded-[12px] border border-black/20 bg-surface-elevated px-[18px] py-3 text-base text-foreground transition-colors placeholder:text-foreground/45 hover:border-black/[0.32] focus-visible:border-primary focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className,

        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
