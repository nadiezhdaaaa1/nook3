import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { ARTICLES } from "@/data/blog/articles";

const BASE_URL = "https://thenook.rent";

function escapeXml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export const Route = createFileRoute("/blog/rss.xml")({
  server: {
    handlers: {
      GET: async () => {
        const sorted = [...ARTICLES].sort(
          (a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt),
        );
        const lastBuild = sorted[0] ? new Date(sorted[0].publishedAt).toUTCString() : new Date().toUTCString();

        const items = sorted.map((a) => {
          const url = `${BASE_URL}/blog/${a.slug}`;
          return [
            "  <item>",
            `    <title>${escapeXml(a.title)}</title>`,
            `    <link>${url}</link>`,
            `    <description>${escapeXml(a.excerpt)}</description>`,
            `    <pubDate>${new Date(a.publishedAt).toUTCString()}</pubDate>`,
            `    <guid isPermaLink="true">${url}</guid>`,
            `    <category>${escapeXml(a.category)}</category>`,
            "  </item>",
          ].join("\n");
        });

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<rss version="2.0">`,
          `<channel>`,
          `  <title>Nook Blog</title>`,
          `  <link>${BASE_URL}/blog</link>`,
          `  <description>Honest guides on US apartment hunting</description>`,
          `  <language>en-us</language>`,
          `  <lastBuildDate>${lastBuild}</lastBuildDate>`,
          ...items,
          `</channel>`,
          `</rss>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/rss+xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
