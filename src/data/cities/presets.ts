import type { CityId } from "./types";

export interface NeighborhoodPreset {
  id: string;
  label: string;
  emoji: string;
  description: string;
  neighborhoods: string[];
}

/**
 * 6 curated quick-pick presets per city — common renter intents.
 * Names must match those in each CityConfig.neighborhoodGroups.
 */
const PRESETS: Record<CityId, NeighborhoodPreset[]> = {
  nyc: [
    { id: "young-bk", label: "Young & Brooklyn", emoji: "🎨", description: "Williamsburg, Bushwick, Greenpoint", neighborhoods: ["Williamsburg", "East Williamsburg", "Greenpoint", "Bushwick", "Bedford-Stuyvesant"] },
    { id: "family-uws", label: "Family-friendly UWS", emoji: "🌳", description: "Upper West Side & Morningside", neighborhoods: ["Upper West Side", "Morningside Heights", "Manhattan Valley", "Lincoln Square"] },
    { id: "downtown-cool", label: "Downtown cool", emoji: "🕶️", description: "SoHo, Tribeca, LES", neighborhoods: ["SoHo", "NoHo", "Tribeca", "Lower East Side", "East Village", "West Village"] },
    { id: "lic-commute", label: "LIC & quick commute", emoji: "🚇", description: "Easy Manhattan access", neighborhoods: ["Long Island City", "Hunters Point", "Astoria", "Sunnyside"] },
    { id: "budget-queens", label: "Budget Queens", emoji: "💰", description: "More space, lower rent", neighborhoods: ["Astoria", "Sunnyside", "Woodside", "Jackson Heights", "Ridgewood", "Forest Hills"] },
    { id: "luxury-mid", label: "Midtown luxury", emoji: "✨", description: "Doormen, high-rises", neighborhoods: ["Midtown East", "Midtown West", "Hudson Yards", "Lincoln Square", "Sutton Place"] },
  ],
  la: [
    { id: "westside", label: "Westside beach", emoji: "🏖️", description: "Venice, Santa Monica", neighborhoods: ["Venice", "Santa Monica", "Mar Vista", "Marina del Rey"] },
    { id: "eastside-cool", label: "Eastside cool", emoji: "🌵", description: "Silver Lake, Echo Park", neighborhoods: ["Silver Lake", "Echo Park", "Los Feliz", "Highland Park", "Eagle Rock"] },
    { id: "ktown-mid", label: "K-Town & Mid-City", emoji: "🍜", description: "Central, well-connected", neighborhoods: ["Koreatown", "Mid-Wilshire", "Mid-City", "Hancock Park"] },
    { id: "hollywood", label: "Hollywood scene", emoji: "🎬", description: "WeHo, Hollywood", neighborhoods: ["Hollywood", "West Hollywood", "East Hollywood", "Beverly Grove"] },
    { id: "valley", label: "Valley value", emoji: "🌴", description: "More space for less", neighborhoods: ["Studio City", "Sherman Oaks", "Valley Village", "North Hollywood", "Toluca Lake"] },
    { id: "dtla", label: "Downtown loft", emoji: "🏙️", description: "DTLA, Arts District", neighborhoods: ["Downtown", "Arts District", "Little Tokyo", "South Park"] },
  ],
  "sf-bay": [
    { id: "sf-classic", label: "Classic SF", emoji: "🌉", description: "Mission, Castro, Hayes", neighborhoods: ["Mission District", "Castro", "Hayes Valley", "Noe Valley"] },
    { id: "sf-quiet", label: "Quiet residential SF", emoji: "🌳", description: "Sunset, Richmond", neighborhoods: ["Inner Sunset", "Outer Sunset", "Inner Richmond", "Outer Richmond"] },
    { id: "sf-down", label: "Downtown SF", emoji: "🏙️", description: "SoMa, FiDi, Nob Hill", neighborhoods: ["SoMa", "Financial District", "Nob Hill", "Russian Hill"] },
    { id: "oakland-cool", label: "Oakland cool", emoji: "🎨", description: "Temescal, Rockridge", neighborhoods: ["Temescal", "Rockridge", "Piedmont Avenue", "Grand Lake"] },
    { id: "east-bay", label: "East Bay value", emoji: "💰", description: "Alameda, Berkeley", neighborhoods: ["Alameda", "Berkeley", "Albany", "Emeryville"] },
    { id: "peninsula", label: "Peninsula commute", emoji: "🚆", description: "Caltrain corridor", neighborhoods: ["South San Francisco", "San Mateo", "Burlingame", "Redwood City"] },
  ],
  chicago: [
    { id: "north-side", label: "North Side classic", emoji: "🌆", description: "Lincoln Park, Lakeview", neighborhoods: ["Lincoln Park", "Lakeview", "Lakeview East", "Wrigleyville"] },
    { id: "west-loop", label: "West Loop / Fulton", emoji: "🍴", description: "Restaurants & lofts", neighborhoods: ["West Loop", "Fulton Market", "River West"] },
    { id: "wicker", label: "Wicker Park scene", emoji: "🎨", description: "Trendy, walkable", neighborhoods: ["Wicker Park", "Bucktown", "Logan Square", "Humboldt Park"] },
    { id: "downtown-chi", label: "Downtown high-rise", emoji: "🏙️", description: "Loop & River North", neighborhoods: ["The Loop", "River North", "Streeterville", "Gold Coast"] },
    { id: "south-loop", label: "South Loop value", emoji: "💰", description: "Near downtown, less rent", neighborhoods: ["South Loop", "Printers Row", "Bronzeville"] },
    { id: "pilsen", label: "Pilsen & Latino arts", emoji: "🎭", description: "Culture & affordability", neighborhoods: ["Pilsen", "Little Village", "Bridgeport"] },
  ],
  dc: [
    { id: "dupont", label: "Dupont & Logan", emoji: "🌃", description: "Walkable, nightlife", neighborhoods: ["Dupont Circle", "Logan Circle", "U Street Corridor", "Adams Morgan"] },
    { id: "capitol", label: "Capitol Hill classic", emoji: "🏛️", description: "Rowhouses, brunch", neighborhoods: ["Capitol Hill", "Eastern Market", "H Street Corridor"] },
    { id: "arlington", label: "Arlington commute", emoji: "🚇", description: "Metro access", neighborhoods: ["Rosslyn", "Clarendon", "Ballston", "Courthouse"] },
    { id: "petworth", label: "Petworth & Brookland", emoji: "🌳", description: "Quieter, more space", neighborhoods: ["Petworth", "Brookland", "Columbia Heights"] },
    { id: "navy-yard", label: "Navy Yard new", emoji: "⚓", description: "New construction", neighborhoods: ["Navy Yard", "Capitol Riverfront", "Southwest Waterfront"] },
    { id: "georgetown", label: "Georgetown charm", emoji: "🌹", description: "Historic & upscale", neighborhoods: ["Georgetown", "Glover Park", "Foggy Bottom"] },
  ],
  boston: [
    { id: "back-bay", label: "Back Bay classic", emoji: "🏛️", description: "Brownstones, Newbury", neighborhoods: ["Back Bay", "Beacon Hill", "South End"] },
    { id: "cambridge", label: "Cambridge & Somerville", emoji: "🎓", description: "Universities", neighborhoods: ["Cambridge", "Somerville", "Davis Square", "Porter Square"] },
    { id: "south-boston", label: "South Boston young", emoji: "🍻", description: "Young professionals", neighborhoods: ["South Boston", "Seaport District", "Fort Point"] },
    { id: "jp", label: "JP & Roslindale", emoji: "🌳", description: "Tree-lined, value", neighborhoods: ["Jamaica Plain", "Roslindale", "West Roxbury"] },
    { id: "allston", label: "Allston student", emoji: "🎒", description: "Budget & social", neighborhoods: ["Allston", "Brighton", "Brookline"] },
    { id: "downtown-bos", label: "Downtown Boston", emoji: "🏙️", description: "Financial District", neighborhoods: ["Financial District", "Downtown Crossing", "North End", "West End"] },
  ],
  seattle: [
    { id: "capitol-hill", label: "Capitol Hill scene", emoji: "🌈", description: "Bars, walkable", neighborhoods: ["Capitol Hill", "First Hill", "Central District"] },
    { id: "ballard", label: "Ballard & Fremont", emoji: "🍺", description: "Breweries, families", neighborhoods: ["Ballard", "Fremont", "Wallingford", "Phinney Ridge"] },
    { id: "downtown-sea", label: "Downtown high-rise", emoji: "🏙️", description: "Walk to work", neighborhoods: ["Downtown", "Belltown", "South Lake Union", "Denny Triangle"] },
    { id: "queen-anne", label: "Queen Anne views", emoji: "🌄", description: "Hilltop, classic", neighborhoods: ["Queen Anne", "Lower Queen Anne", "Magnolia"] },
    { id: "u-district", label: "U-District value", emoji: "🎓", description: "Near UW", neighborhoods: ["University District", "Ravenna", "Roosevelt", "Wallingford"] },
    { id: "west-seattle", label: "West Seattle quiet", emoji: "🌊", description: "Beach, more space", neighborhoods: ["West Seattle", "Alki", "Admiral"] },
  ],
  miami: [
    { id: "brickell", label: "Brickell high-rise", emoji: "🏙️", description: "Walkable downtown", neighborhoods: ["Brickell", "Downtown Miami", "Edgewater"] },
    { id: "beach", label: "Miami Beach", emoji: "🏖️", description: "Sand at your door", neighborhoods: ["South Beach", "Mid-Beach", "North Beach"] },
    { id: "wynwood", label: "Wynwood & Design", emoji: "🎨", description: "Art district", neighborhoods: ["Wynwood", "Design District", "Midtown Miami"] },
    { id: "coconut", label: "Coconut Grove charm", emoji: "🌴", description: "Leafy, family", neighborhoods: ["Coconut Grove", "Coral Gables"] },
    { id: "little-havana", label: "Little Havana value", emoji: "🇨🇺", description: "Culture & affordability", neighborhoods: ["Little Havana", "Allapattah", "Little Haiti"] },
    { id: "kendall", label: "Kendall family", emoji: "🏡", description: "More space for less", neighborhoods: ["Kendall", "Pinecrest", "South Miami"] },
  ],
  austin: [
    { id: "east-austin", label: "East Austin scene", emoji: "🎸", description: "Music & food", neighborhoods: ["East Austin", "East Cesar Chavez", "Govalle", "Holly"] },
    { id: "downtown-atx", label: "Downtown high-rise", emoji: "🏙️", description: "Walkable", neighborhoods: ["Downtown", "Rainey Street", "Market District"] },
    { id: "south-congress", label: "South Congress vibe", emoji: "🌮", description: "SoCo, Bouldin", neighborhoods: ["South Congress", "Bouldin Creek", "Travis Heights"] },
    { id: "north", label: "North Austin tech", emoji: "💻", description: "Near tech campuses", neighborhoods: ["North Loop", "Hyde Park", "Crestview", "Brentwood"] },
    { id: "south-lamar", label: "South Lamar value", emoji: "💰", description: "South of river", neighborhoods: ["South Lamar", "Zilker", "Barton Hills"] },
    { id: "mueller", label: "Mueller family", emoji: "🌳", description: "Planned community", neighborhoods: ["Mueller", "Cherrywood", "Windsor Park"] },
  ],
  philadelphia: [
    { id: "center-city", label: "Center City classic", emoji: "🏛️", description: "Rittenhouse, Wash Sq", neighborhoods: ["Rittenhouse Square", "Washington Square West", "Center City"] },
    { id: "fishtown", label: "Fishtown & N. Liberties", emoji: "🎨", description: "Trendy, walkable", neighborhoods: ["Fishtown", "Northern Liberties", "Kensington"] },
    { id: "uni-city", label: "University City", emoji: "🎓", description: "Penn, Drexel", neighborhoods: ["University City", "Powelton Village", "Spruce Hill"] },
    { id: "south-philly", label: "South Philly food", emoji: "🍝", description: "Italian Market, Passyunk", neighborhoods: ["South Philadelphia", "Passyunk Square", "East Passyunk", "Bella Vista"] },
    { id: "old-city", label: "Old City historic", emoji: "🔔", description: "Cobblestones", neighborhoods: ["Old City", "Society Hill", "Queen Village"] },
    { id: "manayunk", label: "Manayunk quiet", emoji: "🌳", description: "Riverside, value", neighborhoods: ["Manayunk", "Roxborough", "East Falls"] },
  ],
};

export function getCityPresets(cityId: CityId): NeighborhoodPreset[] {
  return PRESETS[cityId] ?? [];
}

/**
 * Filter a preset's neighborhoods down to those actually present in the city config.
 * Names that don't match (typos / removed) are dropped silently.
 */
export function resolvePreset(
  preset: NeighborhoodPreset,
  knownNames: Set<string>,
): string[] {
  return preset.neighborhoods.filter((n) => knownNames.has(n));
}
