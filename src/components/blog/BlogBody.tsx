import { Lightbulb } from "lucide-react";
import type { BlogBlock } from "@/data/blog/articles";

const CSS = `
.art-body { min-width: 0; }
.art-p {
  font-family: "Google Sans Flex", system-ui, sans-serif;
  font-variation-settings: "GRAD" 0,"ROND" 0,"wdth" 100;
  font-weight: 400; font-size: 17px; line-height: 28.9px; color: #3a3a37;
  margin: 0 0 16px;
}
.art-p:last-child { margin-bottom: 0; }
.art-h2 {
  font-family: Fraunces, Georgia, serif;
  font-variation-settings: "SOFT" 0,"WONK" 1;
  font-weight: 600; font-size: 30px; line-height: 36px;
  letter-spacing: -0.3px; color: #2b2521;
  margin: 48px 0 16px; scroll-margin-top: 112px;
}
.art-h3 {
  font-family: "Google Sans Flex", system-ui, sans-serif;
  font-variation-settings: "GRAD" 0,"ROND" 0,"wdth" 100;
  font-weight: 600; font-size: 24px; line-height: 32px;
  letter-spacing: -0.36px; color: #2b2521;
  margin: 32px 0 16px; scroll-margin-top: 112px;
}
.art-body > *:first-child { margin-top: 0; }
.art-list {
  margin: 0 0 24px; padding-left: 22px; list-style: none;
  font-family: "Google Sans Flex", system-ui, sans-serif;
  font-variation-settings: "GRAD" 0,"ROND" 0,"wdth" 100;
  font-weight: 400; font-size: 17px; line-height: 28.9px; color: #3a3a37;
}
.art-list li { position: relative; }
.art-list li + li { margin-top: 16px; }
.art-list.art-ul li::before {
  content: "\\2022"; position: absolute; left: -22px; color: #3a3a37;
}
.art-list.art-ol { counter-reset: art; }
.art-list.art-ol li { counter-increment: art; }
.art-list.art-ol li::before {
  content: counter(art) "."; position: absolute; left: -22px; color: #3a3a37;
}
.art-lead {
  font-family: "Google Sans Flex", system-ui, sans-serif;
  font-variation-settings: "GRAD" 0,"ROND" 0,"wdth" 100;
  font-weight: 600; color: inherit; font-size: inherit;
}
.art-body a {
  color: #c2664e; text-decoration: none;
}
.art-body a:hover { text-decoration: underline; }
.art-callout {
  display: flex; gap: 12px; align-items: flex-start;
  background: #ebf0d5; border: 1px solid #809917; border-radius: 16px;
  padding: 16px; margin: 0 0 24px;
}
.art-callout-icon { width: 24px; height: 24px; flex: 0 0 24px; color: #809917; }
.art-callout-title {
  font-family: "Google Sans Flex", system-ui, sans-serif;
  font-variation-settings: "GRAD" 0,"ROND" 0,"wdth" 100;
  font-weight: 500; font-size: 18px; line-height: 24px; color: #2b2521;
}
.art-callout-text {
  font-family: "Google Sans Flex", system-ui, sans-serif;
  font-variation-settings: "GRAD" 0,"ROND" 0,"wdth" 100;
  font-weight: 400; font-size: 15px; line-height: 24px; color: #4a4a46;
  margin-top: 4px;
}
.art-quote {
  margin: 0 0 24px; padding-left: 20px; border-left: 2px solid #B94613;
  font-family: "Google Sans Flex", system-ui, sans-serif;
  font-variation-settings: "GRAD" 0,"ROND" 0,"wdth" 100;
  font-weight: 400; font-size: 17px; line-height: 28.9px; color: #4a4a46;
}
.art-quote footer {
  margin-top: 8px; font-size: 14px; color: #7a6f5c;
}
`;

/** Bolds a short "Lead-in: …" prefix, purely presentational. */
function withLeadIn(text: string) {
  const idx = text.indexOf(":");
  if (idx > 0 && idx <= 60 && !/[.!?]/.test(text.slice(0, idx))) {
    return (
      <>
        <strong className="art-lead">{text.slice(0, idx + 1)}</strong>
        {text.slice(idx + 1)}
      </>
    );
  }
  return text;
}

export function BlogBody({ blocks }: { blocks: BlogBlock[] }) {
  return (
    <div className="art-body">
      <style>{CSS}</style>
      {blocks.map((b, i) => {
        switch (b.type) {
          case "p":
            return (
              <p key={i} className="art-p">
                {withLeadIn(b.text)}
              </p>
            );
          case "h2":
            return (
              <h2 key={i} id={b.id} className="art-h2">
                {b.text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} id={b.id} className="art-h3">
                {b.text}
              </h3>
            );
          case "ul":
            return (
              <ul key={i} className="art-list art-ul">
                {b.items.map((it, j) => (
                  <li key={j}>{withLeadIn(it)}</li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i} className="art-list art-ol">
                {b.items.map((it, j) => (
                  <li key={j}>{withLeadIn(it)}</li>
                ))}
              </ol>
            );
          case "info":
            return (
              <aside key={i} className="art-callout">
                <Lightbulb className="art-callout-icon" aria-hidden="true" />
                <div>
                  {b.title && <div className="art-callout-title">{b.title}</div>}
                  <div className="art-callout-text">{b.text}</div>
                </div>
              </aside>
            );
          case "quote":
            return (
              <blockquote key={i} className="art-quote">
                {b.text}
                {b.cite && <footer>— {b.cite}</footer>}
              </blockquote>
            );
        }
      })}
    </div>
  );
}

export function extractToc(blocks: BlogBlock[]) {
  return blocks
    .filter((b): b is Extract<BlogBlock, { type: "h2" }> => b.type === "h2")
    .map((b) => ({ id: b.id, text: b.text }));
}
