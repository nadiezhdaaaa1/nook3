import { useState } from "react";
import { Check, Link2 } from "lucide-react";

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
  font-weight: 700; font-size: 13px; letter-spacing: 1.82px;
  text-transform: uppercase; color: #241c12;
}
.shr-copy {
  margin-top: 16px; width: 100%;
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  background: #ffffff; border: 1px solid rgba(0,0,0,0.1); border-radius: 12px;
  padding: 16px 24px;
  font-family: "Google Sans Flex", system-ui, sans-serif;
  font-variation-settings: "GRAD" 0,"ROND" 0,"wdth" 100;
  font-weight: 500; font-size: 16px; line-height: 1; color: #241c12;
  transition: border-color .2s ease, background-color .2s ease;
}
.shr-copy:hover { border-color: rgba(0,0,0,0.32); background: #f8f3e1; }
.shr-copy:focus-visible { outline: 2px solid #241c12; outline-offset: 2px; }
.shr-copy svg { width: 20px; height: 20px; flex: 0 0 20px; }
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
      <button type="button" onClick={handleCopy} aria-label="Copy link to this article" className="shr-copy">
        {copied ? <Check aria-hidden="true" /> : <Link2 aria-hidden="true" />}
        {copied ? "Copied" : "Copy link"}
      </button>

      <div className="shr-icons">
        <IconLink href={shareLinks.x} label="Share on X">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.22-6.82-5.96 6.82H1.67l7.49-8.56L1 2.25h6.83l4.86 6.43 5.55-6.43Zm-1.16 17.52h1.83L6.99 4.13H5.03l12.05 15.64Z" />
          </svg>
        </IconLink>
        <IconLink href={shareLinks.facebook} label="Share on Facebook">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.45 2.91h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
          </svg>
        </IconLink>
        <IconLink href={shareLinks.linkedin} label="Share on LinkedIn">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM3 9h4v12H3V9Zm6.5 0h3.83v1.64h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.44 4.78 5.61V21h-4v-5.63c0-1.34-.02-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97V21h-4V9Z" />
          </svg>
        </IconLink>
        <IconLink href={shareLinks.reddit} label="Share on Reddit">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M22 11.5a2.1 2.1 0 0 0-3.56-1.5 10.3 10.3 0 0 0-5.1-1.6l1.02-3.2 2.72.62a1.6 1.6 0 1 0 .2-1.06l-3.26-.74a.55.55 0 0 0-.64.37l-1.25 3.94a10.4 10.4 0 0 0-5.29 1.6A2.1 2.1 0 1 0 3.7 13.6c-.03.26-.05.52-.05.78 0 3.32 3.74 6.02 8.35 6.02s8.35-2.7 8.35-6.02c0-.25-.02-.5-.05-.75A2.1 2.1 0 0 0 22 11.5ZM8.6 13.1a1.2 1.2 0 1 1 1.2 1.2 1.2 1.2 0 0 1-1.2-1.2Zm6.72 3.9c-.87.86-2.4.93-3.32.93-.93 0-2.46-.07-3.32-.93a.4.4 0 0 1 .56-.57c.55.55 1.72.74 2.76.74s2.21-.19 2.76-.74a.4.4 0 0 1 .56.57Zm-.93-2.7a1.2 1.2 0 1 1 1.2-1.2 1.2 1.2 0 0 1-1.2 1.2Z" />
          </svg>
        </IconLink>
      </div>

      <span aria-live="polite" className="sr-only">
        {copied ? "Link copied to clipboard" : ""}
      </span>
    </div>
  );
}
