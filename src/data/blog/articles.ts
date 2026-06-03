// Blog content store (Phase 1: file-based, no CMS yet).
// Adding a new article = append an object to ARTICLES. Slugs must be unique.

export type BlogCategory =
  | "renter-rights"
  | "guides"
  | "tools-comparisons"
  | "market-intelligence";

export const CATEGORIES: Array<{ slug: BlogCategory | "all"; label: string }> = [
  { slug: "all", label: "All" },
  { slug: "renter-rights", label: "Renter Rights" },
  { slug: "guides", label: "Guides" },
  { slug: "tools-comparisons", label: "Tools & Comparisons" },
  { slug: "market-intelligence", label: "Market Intelligence" },
];

export const CATEGORY_LABEL: Record<BlogCategory, string> = {
  "renter-rights": "Renter Rights",
  guides: "Guides",
  "tools-comparisons": "Tools & Comparisons",
  "market-intelligence": "Market Intelligence",
};

export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string; id: string }
  | { type: "h3"; text: string; id: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "info"; title?: string; text: string }
  | { type: "quote"; text: string; cite?: string };

export interface BlogFaq {
  q: string;
  a: string;
}

export interface BlogArticle {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  tags: string[];
  publishedAt: string; // ISO
  updatedAt?: string; // ISO
  readingTimeMin: number;
  coverGradient: string; // CSS gradient as cover placeholder
  coverImageAlt: string;
  featured?: boolean;
  body: BlogBlock[];
  faq?: BlogFaq[];
  relatedSlugs?: string[];
}

export const ARTICLES: BlogArticle[] = [
  {
    slug: "best-apartment-search-apps-2026",
    title: "Best Apartment Search Apps in 2026: an Honest Comparison",
    excerpt:
      "We compared the top US apartment-search apps on listing freshness, alert speed, and how loudly they upsell. Here's what we found.",
    category: "tools-comparisons",
    tags: ["Tools comparison", "AI tools", "NYC"],
    publishedAt: "2026-05-22",
    updatedAt: "2026-06-01",
    readingTimeMin: 11,
    coverGradient:
      "linear-gradient(135deg, var(--color-brand-terracotta) 0%, var(--color-brand-clay) 100%)",
    coverImageAlt: "Abstract gradient cover representing apartment search apps",
    featured: true,
    body: [
      {
        type: "p",
        text: "Every renter we talk to has the same loop: open StreetEasy, refresh Zillow, scroll Apartments.com, repeat. Most of them couldn't tell you which app actually got them the apartment — just that it took weeks.",
      },
      {
        type: "p",
        text: "We spent a month using the most-recommended apps side by side in NYC, LA, and Chicago. Here's how they actually compare on the three things that matter: how fresh the listings are, how fast alerts arrive, and how aggressively they push you toward paid features.",
      },
      {
        type: "h2",
        id: "what-we-measured",
        text: "What we measured",
      },
      {
        type: "ul",
        items: [
          "Median delay between a listing going live and showing up in the app",
          "Alert latency (email + push) from listing publication",
          "Share of listings flagged as 'no-fee' that actually were no-fee",
          "Friction added by upsells, paid-only filters, and account walls",
        ],
      },
      {
        type: "info",
        title: "Methodology",
        text: "We tracked 642 new NYC listings over 30 days using public broker feeds as the ground truth, then measured when each app surfaced them. Full dataset linked at the bottom.",
      },
      {
        type: "h2",
        id: "the-shortlist",
        text: "The shortlist",
      },
      {
        type: "p",
        text: "These five came up over and over in renter surveys: StreetEasy, Zillow, Apartments.com, Zumper, and Nook. We're listed last because we built this — feel free to skip our section if you want a neutral read.",
      },
      {
        type: "h3",
        id: "streeteasy",
        text: "StreetEasy",
      },
      {
        type: "p",
        text: "Still the default for Manhattan and Brooklyn. Excellent listing coverage in core neighborhoods, but the email alerts arrive in batches and many high-demand listings are gone before you see them.",
      },
      {
        type: "h3",
        id: "zillow",
        text: "Zillow",
      },
      {
        type: "p",
        text: "Best coverage outside NYC. Alerts are slow (often 6–12 hours behind) and a large share of 'available' listings are stale or already rented.",
      },
      {
        type: "h2",
        id: "what-actually-matters",
        text: "What actually matters",
      },
      {
        type: "p",
        text: "Speed beats search filters. The single best predictor of getting an apartment was being one of the first ten people to email about a listing. Pretty filters don't matter if the listing has 40 inquiries by the time you see it.",
      },
    ],
    faq: [
      {
        q: "Which app has the freshest NYC listings?",
        a: "StreetEasy and Nook lead in NYC. StreetEasy because brokers post there first; Nook because we re-index every few minutes across 100+ sources.",
      },
      {
        q: "Are 'no-fee' filters actually accurate?",
        a: "About 60–70% of the time. Brokers sometimes mislabel listings or change terms after you contact them. Always confirm in writing before viewing.",
      },
      {
        q: "Do I need a paid plan to get fast alerts?",
        a: "On most apps, yes — free tiers usually batch alerts hourly or daily. On Nook, free alerts run on a 3-hour delay; real-time alerts are part of Premium.",
      },
    ],
    relatedSlugs: ["how-to-verify-rent-stabilized-apartment-nyc"],
  },
  {
    slug: "how-to-verify-rent-stabilized-apartment-nyc",
    title: "How to Verify a Rent-Stabilized Apartment in NYC",
    excerpt:
      "Landlords misrepresent stabilized status more often than you'd think. Here's the 10-minute check that confirms it before you sign.",
    category: "renter-rights",
    tags: ["Rent regulation", "Verification", "Tenant rights", "NYC"],
    publishedAt: "2026-03-06",
    updatedAt: "2026-05-18",
    readingTimeMin: 9,
    coverGradient:
      "linear-gradient(135deg, var(--color-brand-sage) 0%, var(--color-brand-cream) 100%)",
    coverImageAlt: "Abstract gradient cover representing NYC rent regulation",
    body: [
      {
        type: "p",
        text: "If a NYC apartment is rent-stabilized, your annual rent increases are capped by law and you have an automatic right to renew the lease. About one million NYC apartments qualify — but landlords sometimes claim stabilization to land a tenant, then deny it at renewal.",
      },
      {
        type: "p",
        text: "Here's how to verify the status yourself in under 10 minutes, for free, before you sign anything.",
      },
      {
        type: "h2",
        id: "request-rent-history",
        text: "Step 1 — Request the rent history",
      },
      {
        type: "p",
        text: "The NY Division of Housing and Community Renewal (DHCR) maintains a registered rent history for every stabilized apartment going back to 1984. You can request yours for free.",
      },
      {
        type: "ol",
        items: [
          "Go to the DHCR Rent History Request page.",
          "Enter the full apartment address including unit number.",
          "Submit. Results arrive by mail in 2–6 weeks, or instantly if you use the online portal.",
        ],
      },
      {
        type: "info",
        title: "Tip",
        text: "If the apartment has a registered history, it's stabilized. If DHCR has no record at all, it's almost certainly not stabilized — regardless of what the listing says.",
      },
      {
        type: "h2",
        id: "check-the-lease-rider",
        text: "Step 2 — Check the lease rider",
      },
      {
        type: "p",
        text: "Every stabilized lease must include a DHCR rider (RA-LR1) listing your initial rent, any preferential rent agreement, and the previous tenant's rent. If the lease is missing this rider, push back before signing.",
      },
      {
        type: "h2",
        id: "watch-for-vacancy-tricks",
        text: "Step 3 — Watch for vacancy tricks",
      },
      {
        type: "p",
        text: "Before the 2019 Housing Stability and Tenant Protection Act, landlords could deregulate a stabilized unit by raising the rent above a threshold. That loophole is closed — but some landlords still claim a unit was 'deregulated' years ago. The rent history will show you the truth.",
      },
    ],
    faq: [
      {
        q: "Is the DHCR rent history free?",
        a: "Yes. There is no charge to request your apartment's rent history from DHCR.",
      },
      {
        q: "What if the landlord refuses to confirm stabilization status?",
        a: "Request the DHCR rent history yourself. You don't need the landlord's permission, and the result is authoritative.",
      },
      {
        q: "Can a stabilized apartment become deregulated mid-lease?",
        a: "No. Since the 2019 HSTPA, vacancy and high-income deregulation are no longer permitted. Once stabilized, always stabilized.",
      },
    ],
    relatedSlugs: ["best-apartment-search-apps-2026"],
  },
];

export function getArticle(slug: string): BlogArticle | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export function getFeatured(): BlogArticle {
  return ARTICLES.find((a) => a.featured) ?? ARTICLES[0]!;
}

export function getRelated(slug: string, limit = 3): BlogArticle[] {
  const article = getArticle(slug);
  if (!article) return [];
  const manual = (article.relatedSlugs ?? [])
    .map((s) => getArticle(s))
    .filter((a): a is BlogArticle => Boolean(a));
  if (manual.length >= limit) return manual.slice(0, limit);
  const more = ARTICLES.filter(
    (a) =>
      a.slug !== slug &&
      !manual.some((m) => m.slug === a.slug) &&
      a.tags.some((t) => article.tags.includes(t)),
  );
  return [...manual, ...more].slice(0, limit);
}
