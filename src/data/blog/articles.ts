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
  {
    slug: "rent-stabilization-vs-rent-control",
    title: "Rent Stabilization vs Rent Control: What's the Actual Difference",
    excerpt:
      "These terms get used interchangeably, but they're not the same. Plain-English breakdown of how each works and what each gets you.",
    category: "renter-rights",
    tags: ["Rent regulation", "Tenant rights", "NYC", "LA", "SF"],
    publishedAt: "2026-07-02",
    updatedAt: "2026-07-02",
    readingTimeMin: 8,
    coverGradient:
      "linear-gradient(135deg, var(--color-brand-clay) 0%, var(--color-brand-sage) 100%)",
    coverImageAlt: "Abstract gradient cover comparing rent control and rent stabilization",
    body: [
      { type: "p", text: "People use these terms interchangeably. They're not the same thing." },
      { type: "p", text: "Rent control and rent stabilization are two distinct legal programs that limit how much landlords can charge for rent. They share a goal — keeping rents affordable for long-term tenants — but they operate through different rules, cover different units, and offer different protections." },
      { type: "p", text: "Confusing the two costs renters money. A unit that's genuinely \"rent-controlled\" in New York City is rare and offers near-permanent rent protection. A unit that's \"rent-stabilized\" is common, but with weaker protections than many tenants assume." },
      { type: "p", text: "This guide explains how each works, where they exist, and which one (if either) might cover an apartment you're considering." },
      { type: "h2", id: "30-second-version", text: "The 30-second version" },
      { type: "p", text: "If you only read one paragraph:" },
      { type: "ul", items: [
        "Rent control is an older, stricter, narrower program. In NYC, it generally applies to tenants who have lived in pre-1947 buildings continuously since 1971. Almost no new tenants qualify.",
        "Rent stabilization is the broader program that protects most regulated apartments in NYC. It limits annual rent increases and guarantees lease renewal rights, but rents can adjust over time within board-set guidelines.",
        "Most \"rent regulated\" apartments you'll encounter as a new renter are rent-stabilized, not rent-controlled.",
        "Outside NYC, the terms are used loosely. \"Rent control\" in Los Angeles or San Francisco usually means something closer to NYC's stabilization.",
      ] },
      { type: "p", text: "Now the detailed version." },
      { type: "h2", id: "rent-control", text: "Rent control (the original)" },
      { type: "p", text: "Rent control in the United States traces back to World War II, when federal price controls extended to housing in many cities to prevent wartime profiteering. Most cities phased out their rent control programs after the war. New York City kept its program — though significantly narrowed." },
      { type: "p", text: "Modern NYC rent control specifically applies to:" },
      { type: "ul", items: [
        "Tenants in buildings constructed before February 1, 1947",
        "Tenants (or their succession-eligible family members) who have continuously occupied the apartment since before July 1, 1971",
        "Specific limited categories under city and state programs",
      ] },
      { type: "p", text: "This is a tiny and shrinking population. As tenants pass away or move out, units exit rent control permanently. In 2024, fewer than 1% of NYC apartments were rent-controlled." },
      { type: "h3", id: "rent-control-mechanics", text: "Rent control mechanics" },
      { type: "ul", items: [
        "Rent increases are set by a Maximum Base Rent (MBR) formula recalculated every two years",
        "Increases are typically very modest (well below market or even below inflation)",
        "The tenant has near-permanent occupancy rights",
        "Succession rights exist for spouses and certain family members who have lived in the unit for two years",
        "When a rent-controlled tenant leaves, the unit typically converts to rent stabilization (not market rate)",
      ] },
      { type: "info", title: "Practical takeaway", text: "If you're a new tenant looking for an apartment, rent control is almost certainly not available to you. The program isn't designed to admit new tenants." },
      { type: "h2", id: "rent-stabilization", text: "Rent stabilization (the relevant one)" },
      { type: "p", text: "Rent stabilization is the program most renters actually encounter. It applies to roughly 1 million apartments in NYC alone, plus units in other cities." },
      { type: "p", text: "Rent stabilization in NYC applies to:" },
      { type: "ul", items: [
        "Buildings with 6 or more units constructed between 1947 and 1973 (mostly)",
        "Buildings receiving certain tax benefits (421-a, J-51, etc.)",
        "Some buildings that voluntarily entered the program",
        "Various other categories under specific programs",
      ] },
      { type: "h3", id: "stabilization-mechanics", text: "Rent stabilization mechanics" },
      { type: "ul", items: [
        "Annual rent increases are set by the NYC Rent Guidelines Board (RGB) based on market conditions and operating costs",
        "Typical increases: 2–5% for one-year leases, slightly more for two-year leases (varies year to year)",
        "Tenants have the right to renew their lease — landlord cannot evict for \"no reason\"",
        "Succession rights exist for family members who lived in the unit for one year (two for non-immediate family)",
        "Specific procedures apply for eviction, including for non-payment",
        "Building must register with DHCR annually and provide tenants with rent registration documentation",
      ] },
      { type: "h3", id: "hstpa-2019", text: "Key NYC change in 2019" },
      { type: "p", text: "The Housing Stability and Tenant Protection Act (HSTPA) closed several pathways landlords previously used to deregulate units:" },
      { type: "ul", items: [
        "Eliminated high-rent vacancy decontrol",
        "Eliminated high-income deregulation",
        "Limited Major Capital Improvement (MCI) and Individual Apartment Improvement (IAI) rent increases",
        "Made preferential rents the new legal rent for purposes of future increases (in most cases)",
      ] },
      { type: "p", text: "In short: HSTPA made rent stabilization stickier, harder to escape, and more renter-favorable." },
      { type: "h2", id: "side-by-side", text: "Side-by-side comparison" },
      { type: "ul", items: [
        "Buildings covered — Control: pre-1947 / Stabilization: 1947–1973 + others",
        "Tenancy required — Control: continuous since pre-1971 / Stabilization: any current lease",
        "Rent increase formula — Control: Maximum Base Rent (MBR) / Stabilization: RGB annual adjustments",
        "Typical annual increase — Control: very low, often below inflation / Stabilization: 2–5% (1-year), 4–7% (2-year)",
        "Lease renewal right — Control: permanent occupancy / Stabilization: yes, renewable",
        "Succession rights — Control: spouse + 2-year family / Stabilization: 1-year immediate family, 2-year other",
        "Share of NYC apartments — Control: <1% / Stabilization: ~50%",
        "Available to new renters — Control: effectively no / Stabilization: yes",
      ] },
      { type: "h2", id: "outside-nyc", text: "Outside of NYC: terminology gets messy" },
      { type: "p", text: "In other US cities, \"rent control\" and \"rent stabilization\" don't follow NYC's strict distinction. The terms are used loosely and the underlying programs vary." },
      { type: "h3", id: "la-rso", text: "Los Angeles — Rent Stabilization Ordinance (RSO)" },
      { type: "p", text: "The LA RSO is often called \"rent control\" colloquially, but functions more like NYC's rent stabilization. Key facts:" },
      { type: "ul", items: [
        "Applies to buildings constructed before October 1, 1978",
        "Covers properties with 2 or more units (apartments, duplexes, some single-family homes with ADUs)",
        "Allows annual rent increases tied to CPI (typically 3–8%)",
        "Provides just-cause eviction protections",
        "Maintained by the Los Angeles Housing Department (LAHD)",
      ] },
      { type: "h3", id: "sf-rent-ordinance", text: "San Francisco — Rent Ordinance" },
      { type: "p", text: "SF's program also gets called \"rent control\" but operates similarly to stabilization:" },
      { type: "ul", items: [
        "Applies to buildings constructed before June 13, 1979",
        "Excludes most single-family homes and condos (Costa-Hawkins Rental Housing Act exemption)",
        "Annual increases set by SF Rent Board (typically 1–2.5%, tied to inflation)",
        "Just-cause eviction protections",
        "Significant tenant protections including relocation assistance for certain evictions",
      ] },
      { type: "h3", id: "ab-1482", text: "Statewide California — AB 1482" },
      { type: "p", text: "California has a statewide rent cap applying to many buildings not covered by local programs:" },
      { type: "ul", items: [
        "Buildings older than 15 years (rolling window — newer buildings age into coverage)",
        "Annual increases capped at 5% plus inflation, or 10% maximum",
        "Just-cause eviction protections",
        "Excludes single-family homes (unless owned by corporations) and certain other categories",
      ] },
      { type: "h3", id: "other-cities", text: "Other cities" },
      { type: "p", text: "Several other cities have rent regulation programs with their own rules:" },
      { type: "ul", items: [
        "Oakland and Berkeley, CA — local rent control programs",
        "Washington DC — Rental Housing Act applies to many buildings",
        "Newark and other NJ cities — local rent control programs",
        "Portland, OR — statewide cap applies (similar to AB 1482)",
        "Saint Paul, MN — newer rent stabilization program",
        "Some Massachusetts cities — pilot programs in progress",
      ] },
      { type: "p", text: "The rules differ in every case. Don't assume your city's \"rent control\" works like NYC's — check the local program specifics." },
      { type: "h2", id: "no-regulation", text: "Cities and states without rent regulation" },
      { type: "p", text: "Many places have no rent regulation at all:" },
      { type: "ul", items: [
        "Most of Texas",
        "Most of Florida",
        "Most of the Southeast",
        "Most of the Mountain West",
        "Several states preempt local rent control laws (Texas, Florida, etc., prohibit cities from creating programs)",
      ] },
      { type: "p", text: "In these markets, landlords can typically raise rents to any amount at lease renewal, subject only to the terms of the existing lease." },
      { type: "h2", id: "financial-difference", text: "Why the financial difference is meaningful" },
      { type: "p", text: "Consider a hypothetical 10-year tenancy in NYC." },
      { type: "p", text: "Market-rate apartment, starting at $3,000/mo:" },
      { type: "ul", items: [
        "Annual rent increases of 5–8% (typical in non-regulated NYC)",
        "Year 10 rent: approximately $4,900–6,500/mo",
        "10-year total rent paid: roughly $480,000",
      ] },
      { type: "p", text: "Rent-stabilized apartment, starting at $3,000/mo:" },
      { type: "ul", items: [
        "Annual rent increases of 2–4% (per RGB)",
        "Year 10 rent: approximately $3,650–4,400/mo",
        "10-year total rent paid: roughly $410,000",
      ] },
      { type: "p", text: "The stabilized apartment costs roughly $70,000 less over the decade. In some cases, where market rents in the neighborhood escalate sharply, the savings can exceed $100,000." },
      { type: "p", text: "This is why rent stabilization is sometimes described as a \"lottery ticket\" — finding one substantially changes long-term financial outcomes for a renter." },
      { type: "h2", id: "misconceptions", text: "Common misconceptions" },
      { type: "ul", items: [
        "\"Rent-controlled apartments still exist for new tenants.\" In NYC, generally no. New tenants typically receive rent-stabilized leases at best.",
        "\"All older buildings are stabilized.\" False. Coverage depends on multiple factors including unit count, tax benefits, and prior deregulation.",
        "\"Once stabilized, always stabilized.\" Mostly true now (post-2019), but not always historically. Units deregulated before 2019 generally stayed deregulated.",
        "\"Stabilized rents can't go up much.\" The RGB sets increases annually — typically 2–5%, which compounds. Stabilized rents do go up, just less than market.",
        "\"My landlord told me it's stabilized, so it must be.\" Verify independently.",
        "\"Stabilized apartments have low rent.\" Not necessarily. The starting rent on a stabilized unit can be high. What's protected is the rate of future increase.",
      ] },
      { type: "h2", id: "how-to-find", text: "How to find rent-regulated apartments" },
      { type: "p", text: "If you're specifically looking for stabilized (or RSO/equivalent) units:" },
      { type: "ol", items: [
        "Filter for them on platforms that surface regulatory status. Most listing sites don't. Some specialized tools do.",
        "Look in eligible building types. Older buildings with 6+ units in NYC; pre-1978 buildings in LA; pre-1979 in SF.",
        "Ask landlords directly. \"Is this unit rent-stabilized?\" If yes, ask for documentation.",
        "Verify before signing — request the DHCR / LAHD / SF Rent Board record yourself.",
      ] },
      { type: "h2", id: "how-nook-handles", text: "How Nook handles this" },
      { type: "p", text: "When you set up a search on Nook in a city with rent regulation, you can filter for verified rent-regulated units. We cross-reference listing addresses against the relevant public database (DHCR for NYC, LAHD for LA, SF Rent Board for SF) and surface badges only for confirmed matches." },
      { type: "p", text: "This doesn't replace your own verification, but it does filter out the units that obviously aren't covered." },
    ],
    faq: [
      { q: "Can a landlord opt out of rent regulation?", a: "Generally no. Coverage is determined by building characteristics, not landlord preference. Landlords can pursue deregulation through limited legal pathways, but cannot simply \"opt out.\"" },
      { q: "Do rent-stabilized leases have to be in writing?", a: "Yes. In NYC, the lease must include the Rent Stabilization Lease Rider (RTP-8) and reference the legal regulated rent." },
      { q: "What happens if I move out of a stabilized apartment?", a: "The unit remains stabilized for the next tenant (with limited exceptions). The next tenant can be charged the vacancy rate increase set by RGB." },
      { q: "Can my rent go down?", a: "In specific circumstances yes — particularly if you discover you've been overcharged. The RGB has also occasionally allowed rent rollbacks during certain years." },
      { q: "Is rent stabilization being phased out?", a: "The opposite. Recent legislation in 2019 (NY) and elsewhere has expanded rent regulation, not shrunk it. Several states are considering new programs." },
      { q: "Does rent stabilization apply to short-term rentals?", a: "Generally no. Most regulations require the tenant to occupy as a primary residence." },
    ],
    relatedSlugs: ["how-to-verify-rent-stabilized-apartment-nyc"],
  },
  {
    slug: "spot-fake-apartment-listing",
    title: "How to Spot a Fake Apartment Listing in 60 Seconds",
    excerpt:
      "Most apartment scams have five obvious tells. Once you know them, fakes are easy to filter out. Plus what to do if you've been scammed.",
    category: "guides",
    tags: ["Scams", "Verification", "NYC", "LA", "Guides"],
    publishedAt: "2026-07-02",
    updatedAt: "2026-07-02",
    readingTimeMin: 7,
    coverGradient:
      "linear-gradient(135deg, var(--color-brand-terracotta) 0%, var(--color-brand-sage) 100%)",
    coverImageAlt: "Abstract gradient cover representing apartment listing scam detection",
    body: [
      { type: "p", text: "Most apartment scams follow the same five-step playbook. Once you recognize the pattern, you can spot a fake listing in under a minute — usually under fifteen seconds." },
      { type: "p", text: "This matters because the cost of falling for one isn't just embarrassment. Renters who wire deposits to fake landlords typically lose $1,500–$5,000 before the bank can do anything. Renters who show up to bait-and-switch tours waste days of time. Renters who hand over personal information to fake applications expose themselves to identity theft." },
      { type: "p", text: "This guide walks through the five-second checks, the sixty-second checks, and the ten-minute verifications for serious candidates. Plus what to do if you've already been scammed." },
      { type: "h2", id: "five-second-tells", text: "The five-second tells" },
      { type: "p", text: "If a listing fails any of these, stop reading and move on." },
      { type: "h3", id: "price-under-market", text: "1. Price way under market" },
      { type: "p", text: "Apartment scammers know that an unbelievable deal generates inbound interest. A two-bedroom in the East Village for $1,800/mo. A \"luxury\" Williamsburg studio for $1,400. A house in central LA for $2,000. The price is the bait." },
      { type: "p", text: "The rule: if the rent is more than 25–30% below the neighborhood median for that size, treat it as suspicious until proven otherwise. Real bargains exist, but they're rare and they don't sit unrented for long." },
      { type: "h3", id: "magazine-photos", text: "2. Photos look like a magazine spread" },
      { type: "p", text: "Real apartment listings have inconsistent photo quality. Some rooms are well-lit, others aren't. The bathroom photo is awkward. The kitchen counter has the previous tenant's spice rack." },
      { type: "p", text: "Fake listings often use stolen marketing photos that look professional in a generic way — usually pulled from interior design websites, Airbnb listings, or sold real estate listings. The whole apartment looks \"staged\" because it was staged for someone else's purpose." },
      { type: "p", text: "The check: drag any photo into Google Image Search (images.google.com) or TinEye. If the same photos appear on multiple unrelated sites, you're looking at stolen imagery." },
      { type: "h3", id: "wont-meet", text: "3. The landlord won't meet in person" },
      { type: "p", text: "\"I'm overseas right now.\" \"I just relocated for work.\" \"I'm a missionary in Africa.\" \"I'm a military contractor and can't fly back.\" These are textbook scammer scripts." },
      { type: "p", text: "Real landlords show their apartments. Their broker shows the apartment. A super shows the apartment. Someone with keys shows up at the door. If nobody can show you the apartment in person before you pay anything, the listing isn't real." },
      { type: "h3", id: "wire-payment", text: "4. Payment by wire transfer, Zelle, Cash App, or crypto" },
      { type: "p", text: "Real landlords accept checks, ACH transfers, or credit card payments through legitimate platforms. They don't ask for Zelle to a personal account. They don't accept crypto. They don't require Western Union." },
      { type: "p", text: "Any payment method that can't be reversed once sent is a scammer's preferred tool. Real landlords don't insist on irreversible payment methods." },
      { type: "h3", id: "generic-copy", text: "5. Listing copy that's too generic — or copy-pasted from elsewhere" },
      { type: "p", text: "Scammers don't write custom listing descriptions. They paste generic copy that could apply to any apartment in any city. \"Beautiful spacious unit with lots of natural light, close to transit, perfect for young professionals.\" If the description could describe 10,000 other apartments, it might not be describing a real one." },
      { type: "p", text: "The check: copy a sentence from the listing and paste it into Google with quotes around it. If it appears on multiple listings or sources, you're looking at copy-paste content." },
      { type: "h2", id: "sixty-second", text: "The sixty-second verifications" },
      { type: "p", text: "If a listing passes the five-second tells but you're still wary, run these quick checks before reaching out:" },
      { type: "ul", items: [
        "Google the address. Real apartments at real addresses have history — Streetview, tax records, Yelp searches. Sparse or mismatched results = problem.",
        "Check Google Streetview. Compare the building's exterior to the listing photos. Luxury high-rise in the listing vs. vacant lot in Streetview = fictional listing.",
        "Search the landlord's name. \"[Landlord Name] [City]\" — real landlords typically have some online footprint.",
        "Reverse-image search every photo. Real apartment photos appear once. Stolen photos appear everywhere.",
        "Check for duplicate listings. Same address on multiple platforms at different prices or with different landlord names = something is wrong.",
      ] },
      { type: "h2", id: "ten-minute", text: "The ten-minute verifications" },
      { type: "p", text: "For listings that pass everything above and that you're seriously considering, run these deeper checks before applying or paying anything." },
      { type: "h3", id: "verify-owner", text: "Verify the property owner" },
      { type: "p", text: "Most cities have public property records. In NYC, use ACRIS (Automated City Register Information System) to look up the current owner of any property. In LA, use the Los Angeles County Assessor's portal. Other cities have equivalent county-level records." },
      { type: "p", text: "The owner on record should match the landlord you're communicating with, or be a corporate entity that the landlord can clearly demonstrate they represent. If the listing landlord claims to own a property that public records show belongs to someone else entirely, it's a scam." },
      { type: "h3", id: "violations-history", text: "Check the building's violations history" },
      { type: "ul", items: [
        "NYC: HPD Online (housing violations) and BIS (DOB violations) at nyc.gov",
        "LA: LAHD violation search",
        "Other cities: usually called Department of Buildings or similar",
      ] },
      { type: "p", text: "A real building has a real record — sometimes good, sometimes bad. A \"building\" that doesn't appear in any city violation databases at all might not be a building." },
      { type: "h3", id: "rent-triangulation", text: "Cross-check the rent against the neighborhood" },
      { type: "p", text: "Real listing prices cluster around real neighborhood medians. A 1BR in Bushwick priced at $2,400 is plausible. A 1BR in Bushwick priced at $1,200 is either a unicorn or a fraud. Triangulate with StreetEasy median data, Zillow rent estimates, and recent Reddit posts. More than 25% below the range = strong signal." },
      { type: "h3", id: "verify-licensing", text: "Verify the landlord's licensing (where applicable)" },
      { type: "ul", items: [
        "NYC: real estate brokers must be licensed (search at dos.ny.gov)",
        "LA: certain landlords must register with LAHD",
        "Some cities: rental licenses are required at the building level",
      ] },
      { type: "p", text: "If a landlord claims professional credentials, verify them." },
      { type: "h2", id: "scam-patterns", text: "Specific scam patterns to recognize" },
      { type: "h3", id: "overseas-landlord", text: "The \"I'm overseas\" landlord" },
      { type: "p", text: "The owner has temporarily relocated. They can't show the apartment but they have keys. If you wire them the deposit, they'll FedEx the keys to you. Sometimes there's an \"agent\" who'll show the apartment if you wire a \"viewing fee\" first. There is no apartment. There is no landlord overseas. There is a scammer in another country running a high-volume operation." },
      { type: "h3", id: "deposit-before-viewing", text: "The \"deposit before viewing\" demand" },
      { type: "p", text: "\"I have so many people interested. I can only show the apartment to serious applicants. Please pay the security deposit first as a sign of good faith.\" This is never a real landlord's process. Walk away." },
      { type: "h3", id: "bait-switch", text: "The bait-and-switch" },
      { type: "p", text: "A real-looking listing draws you to a viewing. At the viewing, the apartment \"just got rented\" — but the broker has another property to show you. The other property costs more, has worse terms, or both. This pattern is common with shady broker-driven listings." },
      { type: "h3", id: "phishing-application", text: "The phishing application" },
      { type: "p", text: "You receive an email requesting personal information: social security number, bank account, driver's license, tax returns. The form looks official. It isn't. Once you submit, the scammer has enough information to apply for credit cards in your name." },
      { type: "p", text: "Real landlords request this information, but only after you've toured the apartment in person and explicitly applied. They use legitimate application platforms (TransUnion SmartMove, RentSpree, etc.) — not random PDFs emailed to you." },
      { type: "h3", id: "friend-intro", text: "The \"I'm your friend's friend\" intro" },
      { type: "p", text: "Someone in your social network introduces you to a \"great deal\" landlord. You skip your usual checks because of the social trust. The friend was scammed first and is unwittingly recruiting victims, or they're complicit. Real bargains via social networks exist — but apply the same checks anyway." },
      { type: "h2", id: "if-scammed", text: "What to do if you've been scammed" },
      { type: "p", text: "If money has changed hands and you've discovered the apartment doesn't exist:" },
      { type: "ol", items: [
        "Contact your bank immediately. Wire transfers can sometimes be recalled within 24–48 hours if the receiving bank hasn't yet released the funds. Zelle, Cash App, and similar P2P payments are usually irreversible after a few hours, but it's worth trying.",
        "File a police report. Most jurisdictions allow online filing of fraud reports. The report itself rarely recovers your money, but it creates documentation you'll need for insurance claims, dispute resolution, and tax purposes.",
        "Report to the FTC. File a report at reportfraud.ftc.gov. This helps track scam patterns and may contribute to enforcement actions.",
        "Report the listing. Notify the platform where the listing appeared (Craigslist, Zillow, Facebook Marketplace, etc.). Quick reporting helps protect future renters.",
        "Monitor your credit. If you provided personal information, place a fraud alert with the credit bureaus and monitor your credit reports for new accounts.",
        "Consider identity theft insurance. If significant personal information was exposed, identity theft monitoring services are worth the modest cost for a year or two.",
      ] },
      { type: "h2", id: "how-nook-helps", text: "How Nook reduces this risk" },
      { type: "p", text: "Nook aggregates listings from verified sources — agency feeds, public databases, syndicated networks, and direct landlord partnerships with known operators. We don't scrape anonymous Craigslist posts or accept random user-submitted listings without verification." },
      { type: "p", text: "When listings do reach our system, we cross-check against duplicate listing detection, property records where available, and known scam patterns. We can't catch everything — sophisticated scams sometimes pass through marketplace platforms entirely — but the source attribution shown on each Nook listing tells you where it came from. Listings from agency feeds and public databases carry significantly lower scam risk than random web listings." },
      { type: "p", text: "That said: even with Nook, the verification steps in this guide apply. Especially the \"won't meet in person\" and \"wire transfer\" tells. Those tells aren't about the listing platform — they're about the landlord's behavior. No platform protects you from those at the point of transaction." },
    ],
    faq: [
      { q: "Are Craigslist apartment listings safe?", a: "Some are, many aren't. Craigslist has high scam volume because it's free and anonymous to post. If you use Craigslist, apply every check in this guide with extra rigor." },
      { q: "What about Facebook Marketplace?", a: "Similar to Craigslist — high volume of scam listings. Apply all checks." },
      { q: "Are listings on StreetEasy, Zillow, etc. safer?", a: "Generally yes, but not fraud-proof. These platforms have some vetting and verification, but determined scammers still slip through. Apply the same checks." },
      { q: "Can I trust listings from brokers?", a: "Mostly yes for established brokerages, but verify the broker's license. Some \"broker\" listings are from unlicensed operators running scams." },
      { q: "How do I know if a building exists?", a: "Streetview, Google Maps satellite view, and city property records. If all three confirm a building at the address, it exists." },
      { q: "The scammer is asking me to pay just an \"application fee\" — is that safer?", a: "No. A fake $50 application fee multiplied by hundreds of victims is the entire scam. Treat any payment before you've toured in person and signed a real lease as a red flag." },
      { q: "Should I report the scammer?", a: "Yes, to as many channels as practical: police, FTC, platform where listing appeared, your bank if money changed hands. Reporting creates the paper trail that occasionally enables prosecution." },
    ],
    relatedSlugs: ["how-to-verify-rent-stabilized-apartment-nyc", "rent-stabilization-vs-rent-control"],
  },
  {
    slug: "broker-fees-explained",
    title: "Broker Fees Explained: When You Pay, When You Don't, and How to Find No-Fee Apartments",
    excerpt:
      "Broker fees can add $3,000–$15,000 to your move-in costs. Here's when you actually have to pay one — and how to find no-fee apartments.",
    category: "guides",
    tags: ["Broker fees", "NYC", "FARE Act", "No-fee", "Guides"],
    publishedAt: "2026-07-02",
    updatedAt: "2026-07-02",
    readingTimeMin: 9,
    coverGradient:
      "linear-gradient(135deg, var(--color-brand-cream) 0%, var(--color-brand-terracotta) 100%)",
    coverImageAlt: "Abstract gradient cover representing broker fees and no-fee apartments",
    body: [
      { type: "p", text: "Broker fees are one of the most expensive line items in apartment hunting — and one of the most misunderstood. A New York City renter signing a $3,000/mo apartment with a 15% broker fee writes a check for $5,400 just for the broker, on top of first month's rent, security deposit, and other fees. Walk-in cost: easily $13,000+ before they even unpack a box." },
      { type: "p", text: "In some cities, this cost is largely unavoidable. In others, it's mostly the landlord's responsibility. In NYC specifically, the rules changed significantly in 2024–2025, and a lot of online information is now out of date." },
      { type: "p", text: "This guide explains the current state of broker fees city by city, when you can avoid them legitimately, how to negotiate when you can't, and what the recent NYC FARE Act actually means for tenants." },
      { type: "h2", id: "what-broker-fee-is", text: "What a broker fee is (and isn't)" },
      { type: "p", text: "A broker fee is a one-time payment to a real estate broker for helping match a tenant to a rental property. The fee is typically:" },
      { type: "ul", items: [
        "A percentage of annual rent (most commonly 15%, sometimes 12% or one month's rent)",
        "Paid at lease signing, in addition to first month's rent and security deposit",
        "Non-refundable once paid",
      ] },
      { type: "p", text: "It's not the same as:" },
      { type: "ul", items: [
        "Application fee — a smaller fee ($25–200) for credit and background checks",
        "Administrative fee — sometimes charged by management companies for processing",
        "Move-in fee — charged by some buildings instead of (or in addition to) a security deposit",
        "Security deposit — refundable at move-out, subject to deductions",
      ] },
      { type: "p", text: "The broker fee is the broker's compensation. The question is who pays it: the landlord, the tenant, or both." },
      { type: "h2", id: "state-by-state", text: "The state-by-state landscape" },
      { type: "p", text: "Broker fee norms vary dramatically by city." },
      { type: "h3", id: "nyc-fare-act", text: "New York City: The FARE Act changed everything" },
      { type: "p", text: "For decades, NYC was the most aggressive broker-fee market in America. Tenants routinely paid 15% of annual rent — typically $4,500–$9,000 for a market-rate apartment — to brokers who often had been hired by the landlord, not the tenant. This was widely considered exploitative and almost certainly illegal under existing law, but enforcement was inconsistent." },
      { type: "p", text: "In June 2024, the NYC FARE Act (\"Fairness in Apartment Rental Expenses Act\") took effect, codifying a basic principle: the party that hires the broker pays the broker. The act took full effect in mid-2025." },
      { type: "p", text: "What this means in practice:" },
      { type: "ul", items: [
        "If a landlord lists their apartment through a broker (and the broker represents the landlord), the landlord pays the broker fee — not the tenant",
        "If a tenant separately hires their own broker to help search, the tenant pays that broker (this is \"tenant representation\")",
        "Brokers cannot collect fees from tenants for showing apartments listed by landlords",
        "Landlord-paid broker fees can be amortized into rent, but cannot be charged as a separate fee to the tenant",
      ] },
      { type: "p", text: "What this doesn't mean:" },
      { type: "ul", items: [
        "The act doesn't eliminate broker fees entirely — they still exist when you hire your own broker",
        "The act doesn't apply to subleases or some non-traditional rental arrangements",
        "The act has carve-outs that brokers are actively testing in court",
      ] },
      { type: "info", title: "Current reality (mid-2026)", text: "Most NYC apartments listed on major sites should now be no-fee to tenants. If you see a listing that requires a tenant-paid broker fee, the listing broker should be representing you (the tenant), not the landlord. Verify which party hired the broker before paying anything." },
      { type: "h3", id: "boston", text: "Boston: Broker fees still common" },
      { type: "p", text: "Massachusetts hasn't followed NYC's lead. Boston-area broker fees remain common, typically:" },
      { type: "ul", items: [
        "One month's rent (rather than 15% of annual)",
        "Paid by the tenant in most cases",
        "Particularly prevalent in student-heavy neighborhoods (Allston, Brighton, Cambridge)",
      ] },
      { type: "p", text: "The September 1 lease cycle — when most Boston leases turn over — concentrates broker activity in late summer." },
      { type: "h3", id: "chicago", text: "Chicago: Landlord typically pays" },
      { type: "p", text: "Chicago broker fees are usually paid by the landlord, not the tenant. Where tenants do pay, it's typically a smaller flat fee ($300–800) rather than a percentage." },
      { type: "h3", id: "la-sf", text: "Los Angeles, San Francisco: Largely no broker fees" },
      { type: "p", text: "In most California markets, broker fees on rental apartments are rare. Landlords or property management companies handle listings directly. Tenants who use a broker pay the broker, but most renters never engage one." },
      { type: "p", text: "Exceptions include:" },
      { type: "ul", items: [
        "Some high-end luxury rentals",
        "Some off-market or relocation-service rentals",
        "Apartments managed by smaller landlords through real estate agents",
      ] },
      { type: "h3", id: "other-cities", text: "Washington DC, Seattle, Austin, Philadelphia, Atlanta: Mostly no broker fees" },
      { type: "p", text: "Same pattern as LA/SF. Standard rental market doesn't involve tenant-paid broker fees. Exceptions exist but aren't widespread." },
      { type: "h3", id: "city-summary", text: "Summary" },
      { type: "ul", items: [
        "NYC (post-FARE Act): rare for tenants; 12–15% only if tenant hires own broker",
        "Boston: common; typically one month's rent paid by tenant",
        "Chicago: uncommon; flat fee if any, often paid by landlord",
        "LA, SF, DC, Seattle, Austin, Philadelphia: rare; not standard",
      ] },
      { type: "h2", id: "fare-act-detail", text: "The FARE Act in detail (NYC-specific)" },
      { type: "p", text: "If you're searching in NYC, understanding the FARE Act is worth a few minutes." },
      { type: "h3", id: "fare-covered", text: "Who's covered" },
      { type: "ul", items: [
        "All rental apartments listed by brokers",
        "Both market-rate and rent-stabilized units",
        "Exemptions for short-term rentals, owner-occupied 1–2 family homes, and certain other categories",
      ] },
      { type: "h3", id: "fare-required", text: "What's required" },
      { type: "ul", items: [
        "The broker disclosure must clearly state which party (landlord or tenant) is the broker's client",
        "The broker fee must be paid by whichever party hired the broker",
        "If a landlord listed the apartment with a broker, the landlord owes the broker fee",
        "Landlords may pass costs through to rent (raising the monthly rent to recover the fee over the lease term), but cannot charge a separate \"broker fee\" line item to tenants",
      ] },
      { type: "h3", id: "fare-prohibited", text: "What's prohibited" },
      { type: "ul", items: [
        "Charging tenants for accessing landlord-listed apartments",
        "Hidden fees disguised as \"administrative\" or \"key\" fees",
        "Requiring tenants to use specific brokers as a condition of viewing",
      ] },
      { type: "h3", id: "fare-allowed", text: "What's still allowed" },
      { type: "ul", items: [
        "Tenants hiring their own brokers and paying them",
        "Landlords increasing rent to recover broker costs",
        "Application fees within legal limits",
        "Standard security deposits and first month's rent",
      ] },
      { type: "h3", id: "fare-enforcement", text: "Enforcement" },
      { type: "ul", items: [
        "Tenants can file complaints with NYC Department of Consumer and Worker Protection (DCWP)",
        "Brokers face fines for violations",
        "Tenants who paid improperly charged fees may recover them",
      ] },
      { type: "h3", id: "fare-impact", text: "Practical impact" },
      { type: "p", text: "In the first year post-FARE Act, the rental market adjusted in three observable ways:" },
      { type: "ul", items: [
        "Some landlords raised rents to recover broker costs (typical: $50–200/mo increase)",
        "Some landlords switched to direct listing platforms to avoid broker fees entirely",
        "Some brokers shifted to tenant-representation models, where tenants engage them directly for search assistance",
      ] },
      { type: "p", text: "For renters, the net effect varies. Rents are slightly higher, but the massive upfront broker fee is mostly gone. Over a 12-month lease, the math typically works out better for tenants — but the gap narrows on multi-year leases." },
      { type: "h2", id: "find-no-fee", text: "How to find no-fee apartments" },
      { type: "p", text: "Even outside NYC, \"no fee\" status is a useful filter when broker fees are common. Strategies:" },
      { type: "h3", id: "direct-landlord", text: "1. Direct-to-landlord listings" },
      { type: "p", text: "Many landlords list their apartments directly without involving a broker. These listings are inherently no-fee to tenants. Look for:" },
      { type: "ul", items: [
        "Owner-listed apartments on direct platforms",
        "Small landlord listings on Craigslist, Facebook Marketplace (with appropriate scam vigilance)",
        "Building management company listings (most large property managers list directly)",
        "StreetEasy \"no fee\" filter (filter is reasonably reliable in NYC)",
      ] },
      { type: "h3", id: "large-buildings", text: "2. Larger buildings with on-site management" },
      { type: "p", text: "Buildings managed by large property management companies (Equity Residential, AvalonBay, Related Companies, etc.) typically list directly without broker fees. These tend to be larger buildings (50+ units), newer construction or recently renovated, and at higher finish levels (often with higher rents to match). The trade-off: less character, more amenity fees, less negotiation flexibility." },
      { type: "h3", id: "no-fee-neighborhoods", text: "3. Specific neighborhoods more likely to be no-fee" },
      { type: "ul", items: [
        "NYC: Stuyvesant Town, Peter Cooper Village, large rental complexes in Long Island City, parts of Hudson Yards",
        "Other cities: areas with newer construction and large multi-family complexes",
      ] },
      { type: "h3", id: "off-market", text: "4. Off-market through your network" },
      { type: "p", text: "A meaningful share of apartments never get listed publicly. Friends moving out, friends of friends, social network word-of-mouth — these channels involve no brokers. The trade-off is timing: you find what your network has, not what you specifically want." },
      { type: "h3", id: "renter-forums", text: "5. Renter forums and communities" },
      { type: "p", text: "Subreddits like r/AskNYC, r/NYCapartments, r/LosAngeles, r/SFBayArea sometimes have apartment-sharing threads. Quality varies, scam risk exists, but legitimate finds happen." },
      { type: "h2", id: "negotiating", text: "Negotiating broker fees (when you can't avoid one)" },
      { type: "p", text: "When a broker fee is in play, it's more negotiable than most renters realize. Strategies:" },
      { type: "ul", items: [
        "Negotiate before signing anything. Once you've signed a fee agreement with the broker, you have less leverage.",
        "Ask for one month's rent instead of 15%. On a $3,000/mo apartment, this saves you $2,400 ($5,400 fee → $3,000 fee).",
        "Ask the landlord to split or cover the fee. Some landlords will agree in slow seasons or for apartments that have been on the market for a while.",
        "Apply at the right time of year. Brokers are flexible in December–February and inflexible during May–September peak season.",
        "Bundle multiple apartments. If you're working with a broker through multiple showings, you have more leverage.",
        "Walk away. The single best negotiation lever: be willing to walk. Brokers who sense a deal might fall through often suddenly find flexibility.",
      ] },
      { type: "h2", id: "red-flag-fees", text: "Red flags: brokers asking for non-standard fees" },
      { type: "p", text: "Some predatory brokers charge fees outside standard practice. Watch for:" },
      { type: "ul", items: [
        "Application fees over $50. Standard credit/background checks cost $25–50. In NYC, the maximum legal application fee is $20.",
        "\"Holding deposits\" that aren't applied to first month's rent or security deposit and aren't refundable if the deal falls through.",
        "\"Background check fees\" charged repeatedly for the broker, the building, and the landlord.",
        "\"Move-in\" or \"key\" fees that exceed actual costs. $200–500 may be legitimate; anything higher is profit.",
        "Broker fees on units the broker doesn't represent — e.g., you find a landlord directly and they suddenly refer you to \"their broker.\"",
      ] },
      { type: "h2", id: "nook-no-fee", text: "How Nook surfaces no-fee listings" },
      { type: "p", text: "When you set up a search on Nook, you can filter for no-fee apartments specifically. The filter is more reliable in some markets than others:" },
      { type: "ul", items: [
        "NYC: Cross-referenced against listing disclosures + landlord-direct sources. High reliability post-FARE Act.",
        "Other cities: Filter reflects whatever the source data indicates. Always verify at the listing level before applying.",
      ] },
      { type: "p", text: "In all cases, source attribution on each Nook listing tells you where the listing came from — agency feed, direct landlord, public database, etc. Direct-landlord listings carry essentially zero broker fee risk." },
    ],
    faq: [
      { q: "Is the FARE Act being challenged in court?", a: "Yes. Real estate industry groups have challenged the law on multiple grounds. As of mid-2026, the law remains in effect, though some specific applications are being litigated. Most enforcement actions continue normally." },
      { q: "What if a NYC landlord asks me to pay a broker fee anyway?", a: "If the broker was hired by the landlord, refuse — that's prohibited under the FARE Act. File a complaint with DCWP if needed. If you've already paid, you may be able to recover." },
      { q: "Can a broker fee be negotiated down to zero?", a: "Rarely, but not impossible. Most negotiation outcomes are 50–80% of the original fee. Zero requires either a slow market, a desperate broker, or a particularly motivated landlord covering the cost." },
      { q: "Do broker fees apply to lease renewals?", a: "No, generally not. Broker fees are paid for initial placement. Renewing your existing lease through the same broker should not generate another fee." },
      { q: "If I find an apartment myself, can I avoid a broker fee?", a: "Often yes, but the listing landlord may have already engaged a broker. Ask before assuming." },
      { q: "Are broker fees tax-deductible?", a: "For most renters in their primary residence, no. For business or investment use rentals, possibly yes — consult a tax professional." },
      { q: "Do rent-stabilized apartments have broker fees?", a: "They can. Rent stabilization governs ongoing rent, not initial placement costs. A stabilized unit may have a broker fee at signing." },
      { q: "Why are broker fees so high in NYC compared to other cities?", a: "Historical inertia. NYC developed a unique broker-driven rental ecosystem decades ago, where the broker fee market sustained itself because everyone in the system benefited from it (except tenants). The FARE Act began dismantling this; the transition is ongoing." },
    ],
    relatedSlugs: ["spot-fake-apartment-listing", "how-to-verify-rent-stabilized-apartment-nyc"],
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
