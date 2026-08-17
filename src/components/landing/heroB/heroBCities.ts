import nycCard from "@/assets/B_NYC.png.asset.json";
import laCard from "@/assets/B_LA.png.asset.json";
import sfCard from "@/assets/B_SF.png.asset.json";
import chiCard from "@/assets/B_CHI.png.asset.json";
import nycMap from "@/assets/B3_Hero_NYC.png.asset.json";
import laMap from "@/assets/B3_Hero_LA.png.asset.json";
import sfMap from "@/assets/B3_Hero_SF.png.asset.json";
import chiMap from "@/assets/B3_Hero_CHI.png.asset.json";

export interface HeroBCity {
  key: "nyc" | "la" | "sf" | "chi";
  pillLabel: string;
  comingSoon: boolean;
  listingTitle: string;
  neighborhood: string;
  price: string;
  /** "1 bed · 1 bath · 620 sq ft" */
  specs: string;
  /** "L at Bedford Av · 4 min walk" */
  transit: string;
  /** concrete match reasons, never generic tags */
  reasons: string[];
  cardImg: string;
  mapImg: string;
}

export const HERO_B_CITIES: HeroBCity[] = [
  {
    key: "nyc",
    pillLabel: "New York City",
    comingSoon: false,
    listingTitle: "Renovated 1BR, South-Facing, Near McCarren Park",
    neighborhood: "Williamsburg · New York City",
    price: "$3,050",
    specs: "1 bed · 1 bath · 620 sq ft",
    transit: "L at Bedford Av · 4 min walk",
    reasons: ["$950 under budget", "South-facing", "Near the park"],
    cardImg: nycCard.url,
    mapImg: nycMap.url,
  },
  {
    key: "la",
    pillLabel: "Los Angeles",
    comingSoon: true,
    listingTitle: "Bright Studio with Private Courtyard",
    neighborhood: "Silver Lake · Los Angeles",
    price: "$2,150",
    specs: "Studio · 1 bath · 480 sq ft",
    transit: "Metro B at Vermont/Santa Monica · 12 min",
    reasons: ["$350 under budget", "Pet-friendly", "Near the reservoir"],
    cardImg: laCard.url,
    mapImg: laMap.url,
  },
  {
    key: "sf",
    pillLabel: "San Francisco Bay",
    comingSoon: true,
    listingTitle: "Sunny 1BR Near Dolores Park",
    neighborhood: "Mission District · San Francisco",
    price: "$2,895",
    specs: "1 bed · 1 bath · 560 sq ft",
    transit: "J Church at 18th St · 5 min walk",
    reasons: ["$605 under budget", "South-facing", "Near the park"],
    cardImg: sfCard.url,
    mapImg: sfMap.url,
  },
  {
    key: "chi",
    pillLabel: "Chicago",
    comingSoon: true,
    listingTitle: "Rehabbed 2BR Walk-Up",
    neighborhood: "Logan Square · Chicago",
    price: "$1,850",
    specs: "2 bed · 1 bath · 900 sq ft",
    transit: "Blue Line at Logan Square · 6 min walk",
    reasons: ["$450 under budget", "In-unit laundry", "Near the 606"],
    cardImg: chiCard.url,
    mapImg: chiMap.url,
  },
];

export const HERO_B_ALL_IMAGES = HERO_B_CITIES.flatMap((c) => [c.cardImg, c.mapImg]);

export const HERO_B_BASE = "#efe6d5";
export const HERO_B_MAP_BASE = "#ede5d6";
export const BADGE_GREEN = "#6a820a";
