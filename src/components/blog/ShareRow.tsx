import { useState } from "react";
import { Check, Link2 } from "lucide-react";
import { OriginButton } from "@/components/ui/origin-button";

type Props = {
  url: string;
  title: string;
  excerpt?: string;
};

const CSS = `
.shr-card {
  background: #ffffff; border: 1px solid rgba(36,28,18,0.2);
  border-radius: 20px; padding: 20px;
}
.shr-label {
  font-family: "Google Sans Flex", system-ui, sans-serif;
  font-variation-settings: "GRAD" 0,"ROND" 0,"wdth" 100;
  font-weight: 700; font-size: 12px; letter-spacing: 1.82px;
  text-transform: uppercase; color: #241c12;
}
.shr-copy-wrap { margin-top: 16px; }
.shr-icons {
  margin-top: 16px; display: flex; align-items: center; justify-content: center; gap: 16px;
}
.shr-icon {
  width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center;
  color: #4A4A46; transition: color .2s ease;
}
.shr-icon:hover { color: #D66C38; }
.shr-icon:focus-visible { outline: 2px solid #241c12; outline-offset: 3px; border-radius: 4px; }
.shr-icon svg { width: 20px; height: 20px; }
`;

export function ShareRow({ url, title }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
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
  };

  const IconLink = ({
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
      className="shr-icon"
    >
      {children}
    </a>
  );

  return (
    <div className="shr-card">
      <style>{CSS}</style>
      <div className="shr-label">Share</div>
      <div className="shr-copy-wrap">
        <OriginButton
          variant="tertiary"
          className="w-full"
          onClick={handleCopy}
          aria-label="Copy link to this article"
        >
          {copied ? <Check aria-hidden="true" /> : <Link2 aria-hidden="true" />}
          {copied ? "Copied" : "Copy link"}
        </OriginButton>
      </div>

      <div className="shr-icons">
        <IconLink href={shareLinks.x} label="Share on X">
          <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M14.7402 2.55209L10.5762 7.31189L6.97603 2.55209H1.76172L7.99199 10.6989L2.08714 17.4479H4.61561L9.17299 12.2405L13.1559 17.4479H18.2411L11.7465 8.86184L17.2672 2.55209H14.7402ZM13.8533 15.9354L4.71262 3.98515H6.21519L15.2535 15.9354H13.8533Z" />
          </svg>
        </IconLink>
        <IconLink href={shareLinks.facebook} label="Share on Facebook">
          <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M10.0013 1.66666C5.3988 1.66666 1.66797 5.39749 1.66797 9.99999C1.66797 14.1592 4.71547 17.6067 8.69964 18.2317V12.4092H6.58297V9.99999H8.69964V8.16416C8.69964 6.07582 9.94297 4.92249 11.8471 4.92249C12.7588 4.92249 13.7121 5.08499 13.7121 5.08499V7.13499H12.6621C11.6263 7.13499 11.3038 7.77749 11.3038 8.43666V9.99999H13.6146L13.2455 12.4083H11.3038V18.2317C15.2871 17.6075 18.3338 14.16 18.3338 9.99999C18.3338 5.39749 14.6038 1.66666 10.0013 1.66666Z" />
          </svg>
        </IconLink>
        <IconLink href={shareLinks.linkedin} label="Share on LinkedIn">
          <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M5.78259 4.1666C5.78229 4.84519 5.37059 5.45584 4.74164 5.7106C4.11269 5.96536 3.39209 5.81336 2.91961 5.32628C2.44714 4.83919 2.31715 4.11428 2.59094 3.49338C2.86474 2.87248 3.48764 2.47957 4.16593 2.49993C5.06682 2.52697 5.783 3.2653 5.78259 4.1666ZM5.83259 7.0666H2.49926V17.4999H5.83259V7.0666ZM11.0993 7.0666H7.78259V17.4999H11.0659V12.0249C11.0659 8.97491 15.0409 8.69157 15.0409 12.0249V17.4999H18.3326V10.8916C18.3326 5.74993 12.4493 5.9416 11.0659 8.46657L11.0993 7.0666Z" />
          </svg>
        </IconLink>
        <IconLink href={shareLinks.reddit} label="Share on Reddit">
          <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M14.3796 0.749908C15.4736 0.749908 16.361 1.6367 16.3611 2.73072C16.3611 3.82481 15.4736 4.71234 14.3796 4.71234C13.4435 4.71234 12.6604 4.06248 12.4533 3.18971C11.3011 3.34497 10.4098 4.33281 10.4098 5.52697C10.4097 5.52908 10.4083 5.53137 10.4082 5.53347C12.1814 5.5991 13.8027 6.09845 15.0867 6.89335C15.5581 6.5312 16.1481 6.3156 16.7884 6.31555C18.3326 6.31555 19.5846 7.56757 19.5846 9.11182C19.5846 10.2272 18.9311 11.1901 17.9863 11.6387C17.8971 14.887 14.3611 17.4996 10.0086 17.4997C5.65898 17.4997 2.1239 14.8906 2.03011 11.6452C1.07795 11.1993 0.418058 10.2327 0.417969 9.11182C0.417983 7.56758 1.66999 6.31557 3.21419 6.31555C3.85724 6.31555 4.44919 6.53337 4.92155 6.89823C6.19304 6.10896 7.79662 5.61102 9.5513 5.53673C9.55114 5.53383 9.55047 5.53072 9.55047 5.52778C9.55047 3.86402 10.8195 2.49026 12.4403 2.32463C12.6278 1.42542 13.4247 0.749915 14.3796 0.749908ZM10.0078 13.097C9.03672 13.097 8.10524 13.1445 7.24495 13.2321C7.09773 13.2467 7.00448 13.3994 7.06185 13.5357C7.54419 14.6873 8.68205 15.4969 10.0078 15.4969C11.3336 15.4969 12.4726 14.6874 12.9538 13.5357C13.0113 13.3993 12.9169 13.2466 12.7706 13.2321C11.9093 13.1445 10.979 13.097 10.0078 13.097ZM6.31397 9.09474C5.53022 9.09474 4.85675 9.75324 4.81006 10.7597C4.76366 11.7662 5.36178 12.3133 6.14551 12.3133C6.88019 12.3132 7.51709 11.9913 7.63233 11.1219L7.6486 10.9421C7.69516 9.93541 7.0977 9.09482 6.31397 9.09474ZM13.7033 9.09474C12.9195 9.09474 12.3221 9.93541 12.3686 10.9421L12.3841 11.1219C12.4994 11.9913 13.1371 12.3132 13.8717 12.3133C14.6555 12.3133 15.2528 11.7662 15.2064 10.7597C15.1597 9.75324 14.4871 9.09474 13.7033 9.09474Z" />
          </svg>
        </IconLink>
      </div>

      <span aria-live="polite" className="sr-only">
        {copied ? "Link copied to clipboard" : ""}
      </span>
    </div>
  );
}
