import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  accentClassName?: string;
};

export function Logo({ className, accentClassName }: LogoProps) {
  return (
    <span
      className={cn(
        "font-display font-bold tracking-[-0.03em] leading-none",
        className,
      )}
      style={{ fontVariationSettings: '"opsz" 144' }}
    >
      No
      <span className={cn("italic font-normal", accentClassName ?? "text-primary")}>o</span>
      k
    </span>
  );
}

export function LogoMark({
  className,
  size = 28,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <div
      className={cn(
        "rounded-pill bg-primary text-primary-foreground inline-flex items-center justify-center font-display italic font-normal",
        className,
      )}
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.6),
        fontVariationSettings: '"opsz" 144',
      }}
      aria-hidden
    >
      o
    </div>
  );
}
