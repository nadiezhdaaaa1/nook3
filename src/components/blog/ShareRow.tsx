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
      // Use native share sheet only on coarse-pointer (mobile/tablet) devices
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
      setTimeout(() => setCopied(false), 1800);
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

  const enc = encodeURIComponent;
  const shareLinks = {
    x: `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(title)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`,
    reddit: `https://www.reddit.com/submit?url=${enc(url)}&title=${enc(title)}`,
    email: `mailto:?subject=${enc(title)}&body=${enc((excerpt ? excerpt + "\n\n" : "") + url)}`,
  };

  if (canNativeShare) {
    return (
      <div
        className="flex items-center gap-3 py-4 border-y"
        style={{ borderColor: "var(--color-brand-clay)" }}
      >
        <span className="text-[10px] font-mono uppercase tracking-[0.18em] font-semibold text-[var(--color-charcoal-500)]">
          Share
        </span>
        <button
          type="button"
          onClick={handleNativeShare}
          className="ml-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-pill border bg-white text-sm font-semibold text-[var(--color-brand-charcoal)]"
          style={{ borderColor: "var(--color-brand-clay)" }}
        >
          <Share2 className="h-4 w-4" style={{ color: "var(--color-brand-sage-deep, var(--color-brand-sage))" }} />
          Share…
        </button>
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
      target="_blank"
      rel="noopener noreferrer"
      title={label}
      aria-label={label}
      className="w-10 h-10 rounded-full border bg-white flex items-center justify-center text-[var(--color-brand-charcoal)] hover:bg-[var(--color-sage-100,#E8EEE3)] transition-colors"
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
      <span className="text-[10px] font-mono uppercase tracking-[0.18em] font-semibold text-[var(--color-charcoal-500)]">
        Share
      </span>
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-pill border bg-white text-sm font-semibold text-[var(--color-brand-charcoal)] hover:border-[var(--color-brand-sage)] transition-colors"
        style={{ borderColor: "var(--color-brand-clay)" }}
      >
        {copied ? (
          <Check className="h-[15px] w-[15px]" style={{ color: "var(--color-brand-sage)" }} />
        ) : (
          <Link2 className="h-[15px] w-[15px]" style={{ color: "var(--color-brand-sage)" }} />
        )}
        {copied ? "Copied" : "Copy link"}
      </button>

      <div className="flex gap-2 sm:ml-auto">
        <IconBtn href={shareLinks.x} label="Share on X">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-[17px] h-[17px]">
            <path d="M4 4l16 16M20 4L4 20" />
          </svg>
        </IconBtn>
        <IconBtn href={shareLinks.facebook} label="Share on Facebook">
          <span className="font-bold text-[15px]">f</span>
        </IconBtn>
        <IconBtn href={shareLinks.linkedin} label="Share on LinkedIn">
          <span className="font-bold text-[12px]">in</span>
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
    </div>
  );
}
