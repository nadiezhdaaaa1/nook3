import { Lightbulb } from "lucide-react";
import type { BlogBlock } from "@/data/blog/articles";

export function BlogBody({ blocks }: { blocks: BlogBlock[] }) {
  return (
    <div className="space-y-6 text-[17px] leading-[1.7] text-[var(--color-charcoal-800)]">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "p":
            return <p key={i}>{b.text}</p>;
          case "h2":
            return (
              <h2
                key={i}
                id={b.id}
                className="scroll-mt-28 pt-6 font-display text-3xl font-medium tracking-[-0.01em] text-[var(--color-brand-charcoal)]"
              >
                {b.text}
              </h2>
            );
          case "h3":
            return (
              <h3
                key={i}
                id={b.id}
                className="scroll-mt-28 pt-2 font-display text-2xl font-medium text-[var(--color-brand-charcoal)]"
              >
                {b.text}
              </h3>
            );
          case "ul":
            return (
              <ul key={i} className="list-disc pl-6 space-y-2 marker:text-[var(--color-brand-sage)]">
                {b.items.map((it, j) => (
                  <li key={j}>{it}</li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i} className="list-decimal pl-6 space-y-2 marker:text-[var(--color-brand-sage)]">
                {b.items.map((it, j) => (
                  <li key={j}>{it}</li>
                ))}
              </ol>
            );
          case "info":
            return (
              <aside
                key={i}
                className="flex gap-3 rounded-card border p-5"
                style={{
                  backgroundColor: "var(--color-sage-100, #E8EEE3)",
                  borderColor: "var(--color-brand-sage)",
                }}
              >
                <Lightbulb className="h-5 w-5 shrink-0 mt-0.5 text-[var(--color-brand-sage)]" />
                <div>
                  {b.title && (
                    <div className="font-medium text-[var(--color-brand-charcoal)] mb-1">
                      {b.title}
                    </div>
                  )}
                  <div className="text-[15px] leading-relaxed text-[var(--color-charcoal-700)]">
                    {b.text}
                  </div>
                </div>
              </aside>
            );
          case "quote":
            return (
              <blockquote
                key={i}
                className="border-l-4 pl-5 italic text-[var(--color-charcoal-700)]"
                style={{ borderColor: "var(--color-brand-terracotta)" }}
              >
                {b.text}
                {b.cite && <footer className="mt-2 text-sm not-italic">— {b.cite}</footer>}
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
