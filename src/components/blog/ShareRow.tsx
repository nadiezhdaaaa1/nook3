import { useEffect, useState } from "react";
import { Check, Link2, Mail, Share2 } from "lucide-react";

type Props = {
  url: string;
  title: string;
  excerpt?: string;
};

export function ShareRow({ url, title, excerpt }: Props) {
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      const isCoarse =
        typeof window !== "undefined" &&
        window.matchMedia?.("(pointer: coarse)").matches;
      setCanNativeShare(Boolean(isCoarse));
    }
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleNativeShare = async () => {
    try {
      await navigator.share({ title, text: excerpt, url });
    } catch {
      // user cancelled
    }
  };

  const openShare = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const w = 600;
    const h = 500;
    const left = window.screenX + Math.max(0, (window.outerWidth - w) / 2);
    const top = window.screenY + Math.max(0, (window.outerHeight - h) / 2);
    window.open(
      href,
      "share",
      `popup=yes,width=${w},height=${h},left=${left},top=${top},noopener,noreferrer`,
    );
  };

  const enc = encodeURIComponent;
  const shareLinks = {
    x: `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(title)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`,
    reddit: `https://www.reddit.com/submit?url=${enc(url)}&title=${enc(title)}`,
    email: `mailto:?subject=${enc(title)}&body=${enc(url)}`,
  };

  const label = (
    <span className="text-[10px] font-mono uppercase tracking-[0.18em] font-semibold text-[var(--color-charcoal-500)]">
      Share
    </span>
  );

  const liveRegion = (
    <span aria-live="polite" className="sr-only">
      {copied ? "Link copied to clipboard" : ""}
    </span>
  );

  if (canNativeShare) {
    return (
      <div className="flex items-center gap-3 py-4 border-y" style={{ borderColor: "var(--color-brand-clay)" }}>
        {label}
        <button
          type="button"
          onClick={handleNativeShare}
          aria-label="Share this article"
          className="ml-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-pill border bg-white text-sm font-semibold text-[var(--color-brand-charcoal)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-sage)]"
          style={{ borderColor: "var(--color-brand-clay)" }}
        >
          <Share2 className="h-4 w-4" style={{ color: "var(--color-brand-sage)" }} />
          Share…
        </button>
        {liveRegion}
      </div>
    );
  }

  const IconBtn = ({
    href,
    label,
    children,
  }: {
    href: string;
    label: string;
    children: React.ReactNode;
  }) => (
    <a
      href={href}
      onClick={openShare(href)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className="w-10 h-10 rounded-full border bg-white flex items-center justify-center text-[var(--color-brand-charcoal)] hover:bg-[var(--color-sage-100,#ECF1E6)] hover:border-[var(--color-brand-sage)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-sage)]"
      style={{ borderColor: "var(--color-brand-clay)" }}
    >
      {children}
    </a>
  );

  return (
    <div
      className="flex flex-wrap items-center gap-3 py-4 border-y"
      style={{ borderColor: "var(--color-brand-clay)" }}
    >
      {label}
      <button
        type="button"
        onClick={handleCopy}
        aria-label="Copy link to this article"
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-pill border bg-white text-sm font-semibold text-[var(--color-brand-charcoal)] hover:border-[var(--color-brand-sage)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-sage)]"
        style={{ borderColor: "var(--color-brand-clay)" }}
      >
        {copied ? (
          <Check className="h-[15px] w-[15px]" style={{ color: "var(--color-brand-sage)" }} />
        ) : (
          <Link2 className="h-[15px] w-[15px]" style={{ color: "var(--color-brand-sage)" }} />
        )}
        {copied ? "Copied ✓" : "Copy link"}
      </button>

      <div className="flex flex-wrap gap-2 w-full sm:w-auto sm:ml-auto">
        <IconBtn href={shareLinks.x} label="Share on X">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-[17px] h-[17px]">
            <path d="M4 4l16 16M20 4L4 20" />
          </svg>
        </IconBtn>
        <IconBtn href={shareLinks.facebook} label="Share on Facebook">
          <span className="font-bold text-[15px] leading-none">f</span>
        </IconBtn>
        <IconBtn href={shareLinks.linkedin} label="Share on LinkedIn">
          <span className="font-bold text-[12px] leading-none">in</span>
        </IconBtn>
        <IconBtn href={shareLinks.reddit} label="Share on Reddit">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-[17px] h-[17px]">
            <circle cx="12" cy="13" r="7" />
            <circle cx="9" cy="12.5" r="1" fill="currentColor" stroke="none" />
            <circle cx="15" cy="12.5" r="1" fill="currentColor" stroke="none" />
            <path d="M9 16c1.8 1.2 4.2 1.2 6 0M12 6l1-3 3 .7" />
          </svg>
        </IconBtn>
        <IconBtn href={shareLinks.email} label="Share by email">
          <Mail className="w-[17px] h-[17px]" />
        </IconBtn>
      </div>
      {liveRegion}
    </div>
  );
}
