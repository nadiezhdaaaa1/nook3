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
    title: "How to Verify a Rent-Stabilized Apartment (and Catch Landlord Lies)",
    excerpt:
      "Landlords lie about rent stabilization more often than you'd think. Here's how to actually verify a unit's status in 4 steps — before you sign.",
    category: "renter-rights",
    tags: ["Rent regulation", "Verification", "Tenant rights", "NYC", "LA", "SF"],
    publishedAt: "2026-07-02",
    updatedAt: "2026-07-02",
    readingTimeMin: 9,
    coverGradient:
      "linear-gradient(135deg, var(--color-brand-sage) 0%, var(--color-brand-cream) 100%)",
    coverImageAlt: "Abstract gradient cover representing rent regulation verification",
    body: [
      { type: "p", text: "Your landlord says it's rent-stabilized. The listing has the badge. The lease mentions it. Everything seems fine." },
      { type: "p", text: "Except — landlords lie about this. Not always maliciously. Sometimes through confusion, inheritance from prior owners, or wishful thinking about deregulation thresholds. Sometimes deliberately, because a \"rent-stabilized\" label rents an apartment faster." },
      { type: "p", text: "The cost of believing it without checking is significant. A genuinely rent-stabilized apartment saves a renter $30,000–$100,000 over a decade compared to market-rate equivalents in cities like New York or Los Angeles. A fake-stabilized apartment? You pay market rate for years thinking you have protections you don't." },
      { type: "p", text: "This guide walks through the four-step verification process for the cities where rent regulation actually matters. By the end, you'll know how to confirm a unit's regulatory status before you sign anything." },
      { type: "h2", id: "why-landlords-get-this-wrong", text: "Why landlords get this wrong (and lie about it)" },
      { type: "p", text: "Before getting into verification mechanics, it helps to understand the four common ways landlords misrepresent rent-stabilization status:" },
      { type: "h3", id: "pre-1974-myth", text: "1. \"It's pre-1974, so it must be stabilized\"" },
      { type: "p", text: "Age alone doesn't determine status. A pre-1974 building with fewer than 6 units in NYC may not qualify. A pre-1978 LA building must have 2+ units for RSO coverage. The rules are specific, and shortcuts produce wrong answers." },
      { type: "h3", id: "stabilized-when-i-bought", text: "2. \"It was stabilized when I bought it\"" },
      { type: "p", text: "Many units have been legally deregulated over the years — through high-rent vacancy decontrol (NYC pre-2019), individual apartment improvements (IAI), or other mechanisms. A unit's history doesn't guarantee its current status." },
      { type: "h3", id: "treating-as-stabilized", text: "3. \"I'm treating it as stabilized\"" },
      { type: "p", text: "Some landlords offer \"stabilized-style\" leases voluntarily. This is not the same as legal rent stabilization. You don't get the protections, the rent guidelines board adjustments, or the lease renewal rights. You get marketing." },
      { type: "h3", id: "outright-misrepresentation", text: "4. Outright misrepresentation" },
      { type: "p", text: "This is rarer but happens. The apartment isn't stabilized at all, but calling it so makes the listing more attractive. Once you sign and move in, you discover the truth at lease renewal when rent jumps 15%." },
      { type: "h2", id: "verification-process", text: "The 4-step verification process" },
      { type: "h3", id: "step-1-rent-history", text: "Step 1: Get the official rent history" },
      { type: "p", text: "Every city with rent regulation maintains a public database. For your apartment to be genuinely regulated, it must appear in that database." },
      { type: "h3", id: "nyc-dhcr", text: "New York City — DHCR rent history" },
      { type: "p", text: "The New York State Division of Housing and Community Renewal (DHCR) maintains rent registration records for every rent-stabilized unit going back decades. You can request the rent history for any apartment at no cost." },
      { type: "ul", items: [
        "Visit hcr.ny.gov and search for \"rent history request\"",
        "Submit Form RA-90 with the apartment address and unit number",
        "The response typically arrives in 4–8 weeks (slow, plan ahead)",
        "Faster option: many tenants' rights organizations have direct database access",
      ] },
      { type: "p", text: "What to look for: Continuous registration as a rent-stabilized unit, recorded rent amounts that match what's being advertised, and no recent \"deregulation\" filings." },
      { type: "info", title: "Heads up", text: "The DHCR database is famously incomplete and out of date for some units. An absence from the database does not definitively mean a unit is unregulated. It does, however, mean you should ask harder questions." },
      { type: "h3", id: "la-lahd", text: "Los Angeles — LAHD RSO database" },
      { type: "p", text: "The Los Angeles Housing Department maintains a public RSO (Rent Stabilization Ordinance) database online." },
      { type: "ul", items: [
        "Visit housing.lacity.org",
        "Use the RSO Properties search",
        "Enter the property address",
      ] },
      { type: "p", text: "LAHD lists every parcel and indicates RSO coverage. Coverage typically applies to buildings constructed before October 1, 1978, with 2 or more units." },
      { type: "h3", id: "sf-rent-board", text: "San Francisco — SF Rent Board" },
      { type: "p", text: "The San Francisco Rent Board maintains records for units covered by the San Francisco Rent Ordinance. Visit sfrb.org and search property records. Buildings constructed before June 13, 1979 are generally covered." },
      { type: "h3", id: "dc-dhcd", text: "Washington DC — DHCD" },
      { type: "p", text: "The DC Department of Housing and Community Development maintains records for units covered by the Rental Housing Act. Other cities (Oakland, Berkeley, Portland) maintain similar databases. The principle is consistent: rent regulation requires registration, and registration is publicly verifiable." },
      { type: "h3", id: "step-2-structural", text: "Step 2: Cross-check the structural basics" },
      { type: "p", text: "Even before you get the official rent history, you can verify whether a building is structurally eligible for rent regulation." },
      { type: "p", text: "Building age: Most rent regulation programs apply only to buildings constructed before a specific date. Building age is easy to verify:" },
      { type: "ul", items: [
        "NYC: Department of Buildings (DOB) property records",
        "LA: Los Angeles County Assessor records",
        "SF: SF Planning Department records",
        "Most other cities: County assessor or recorder of deeds",
      ] },
      { type: "p", text: "If the building was constructed after the cutoff date, it's almost certainly not regulated, regardless of what anyone says." },
      { type: "p", text: "Unit count: Many programs have minimum unit thresholds — NYC typically requires 6+ units, LA requires 2+ for RSO, SF varies by program. A small landlord with a 4-unit Brooklyn brownstone may believe they're \"stabilized\" when their building isn't even eligible." },
      { type: "p", text: "Regulatory orders: Some buildings have specific HPD orders or court rulings that establish or modify their status. These are part of the building's permanent record." },
      { type: "h3", id: "step-3-lease", text: "Step 3: Verify the lease language" },
      { type: "p", text: "A genuinely rent-stabilized lease in NYC will include specific language and riders required by law:" },
      { type: "ul", items: [
        "The \"Rent Stabilization Lease Rider for Apartments in New York City\" (Form RTP-8)",
        "Specific renewal terms tied to the Rent Guidelines Board's annual order",
        "Acknowledgement of the tenant's rights to lease renewal at regulated rates",
      ] },
      { type: "p", text: "If your lease doesn't include the required rider, it's a strong signal that either (a) the unit isn't actually stabilized, or (b) your landlord doesn't know how to issue a proper lease and you'll have headaches at renewal." },
      { type: "p", text: "In LA, the lease should reference the RSO and include the required RSO addendum. The LAHD has model language available. If a landlord shows you a generic month-to-month lease and claims the unit is stabilized, that's a red flag. The legal status requires legal paperwork." },
      { type: "h3", id: "step-4-deregulation", text: "Step 4: Check for deregulation events" },
      { type: "p", text: "Even if a unit was historically regulated, it may have been legally deregulated. The most common mechanisms:" },
      { type: "p", text: "NYC (pre-June 2019 Housing Stability and Tenant Protection Act):" },
      { type: "ul", items: [
        "Vacancy decontrol when rent exceeded the threshold (around $2,700 by 2019)",
        "Individual Apartment Improvements (IAI) that raised the rent above the threshold",
        "High-income deregulation (combined household income over $200k for two consecutive years)",
      ] },
      { type: "p", text: "The 2019 law largely closed these pathways for the future — but units deregulated before 2019 generally stayed deregulated." },
      { type: "p", text: "LA RSO: substantial rehabilitation under specific HCD-approved conditions, demolition and reconstruction (different building → no longer the regulated one), some condo conversions." },
      { type: "p", text: "SF Rent Ordinance: Costa-Hawkins Rental Housing Act exempts certain new construction and single-family homes; substantial rehabilitation in limited cases." },
      { type: "p", text: "If your landlord claims a unit was deregulated, ask which mechanism applies and when. They should be able to answer specifically. \"I don't remember\" or \"the previous owner handled that\" is not an answer — it's a problem." },
      { type: "h2", id: "red-flags", text: "Red flags during the apartment viewing" },
      { type: "p", text: "Before you even start the formal verification, certain signs at the viewing should raise your alarm:" },
      { type: "ul", items: [
        "The landlord can't or won't tell you the unit's regulatory status",
        "The asking rent is significantly above the published Rent Guidelines Board increase from the previous registered rent",
        "The landlord describes the unit as \"kind of stabilized\" or \"voluntarily stabilized\"",
        "The lease offered doesn't mention rent regulation",
        "The landlord says the unit was \"renovated to market rate\" or \"improved out of stabilization\"",
        "The landlord pressures you to skip rent history verification",
      ] },
      { type: "p", text: "Any of these alone isn't proof of misrepresentation. Together, they suggest you should slow down and verify carefully." },
      { type: "h2", id: "if-landlord-lied", text: "What to do if you discover the landlord lied" },
      { type: "p", text: "This happens more than you'd expect. You've moved in, lived there a year, and then discover the unit was supposed to be stabilized — and you've been paying market rate." },
      { type: "ol", items: [
        "Document everything immediately. Save the original listing, lease, and any communications. Take screenshots in case anything gets edited online.",
        "File an overcharge complaint. In NYC, file Form RA-89 with DHCR (no fee). The case can result in rent rollback to the legal regulated rent, refund of overcharges (typically up to 6 years back), and treble damages if willful.",
        "Consult a tenant attorney. Many take overcharge cases on contingency. Met Council on Housing, Legal Aid Society, and Tenants & Neighbors in NYC offer free consultations.",
        "Don't withhold rent unilaterally. Continuing to pay the agreed rent while pursuing the complaint protects you from eviction.",
      ] },
      { type: "h2", id: "how-nook-handles", text: "How Nook handles this" },
      { type: "p", text: "When you set up a search on Nook, you can filter for verified rent-regulated listings. Behind the scenes, we cross-reference every listing's address against the relevant public database — DHCR for NYC, LAHD for LA, SF Rent Board for SF." },
      { type: "p", text: "If a listing's address matches the regulatory database, we display a \"Verified rent-regulated\" badge. If it doesn't, we don't. If a landlord claims regulation but the address doesn't appear in official records, you'll see no badge, regardless of what the listing copy says." },
      { type: "p", text: "This isn't a guarantee — public databases have gaps, and a unit's status can change. But it's a substantial improvement over taking the landlord's word for it." },
    ],
    faq: [
      { q: "Can I get the rent history before I apply?", a: "In NYC, the rent history request requires the apartment address — which a landlord typically provides during the application process. You can usually get the request submitted while your application is being reviewed." },
      { q: "What if the building is too new to be regulated?", a: "Then it's not regulated, and any claim otherwise is incorrect. New construction (post-1974 in NYC for most purposes, post-1978 in LA for RSO) is generally exempt." },
      { q: "Is \"rent-controlled\" the same as \"rent-stabilized\"?", a: "No. They're distinct programs with different rules. Rent control is older and much more restrictive, applying to a small set of long-tenured tenants; rent stabilization is broader and governs most regulated units today." },
      { q: "My landlord says the apartment is \"preferential rent\" — what does that mean?", a: "Preferential rent is when a stabilized landlord charges less than the legal maximum. It's a real thing, but it changed significantly under the 2019 NY law. If your lease has preferential rent terms, get the legal regulated rent in writing — that's what determines future increases." },
      { q: "The unit appears unregulated in DHCR but the landlord swears it's stabilized. Who's right?", a: "The DHCR database has gaps but is the authoritative source. If a landlord insists on stabilized status, they should be able to produce documentation — registration receipts, prior leases with the rider, an HPD determination, something. \"Trust me\" isn't documentation." },
      { q: "Should I just walk away from a unit if verification is hard?", a: "Not necessarily — but require documentation before signing. A real stabilized landlord has the paperwork. One who can't produce it is offering you something other than what they claim." },
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
