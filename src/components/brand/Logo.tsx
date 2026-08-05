import { cn } from "@/lib/utils";
import logoSvg from "@/assets/Nook_Green.svg.asset.json";

type LogoProps = {
  className?: string;
  accentClassName?: string;
};

export function Logo({ className, accentClassName }: LogoProps) {
  // The SVG is a fixed-color wordmark; accentClassName is kept for API compatibility.
  void accentClassName;
  return (
    <img
      src={logoSvg.url}
      alt="Nook"
      className={cn("h-[1em] w-auto", className)}
    />
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
        "rounded-pill inline-flex items-center justify-center font-display italic font-normal",
        className,
      )}
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.6),
        backgroundColor: "#6A820A",
        color: "#f4f1ea",
      }}
      aria-hidden
    >
      o
    </div>
  );
}

