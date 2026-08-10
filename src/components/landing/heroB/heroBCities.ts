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
  cardImg: string;
  mapImg: string;
}

export const HERO_B_CITIES: HeroBCity[] = [
  {
    key: "nyc",
    pillLabel: "New York City",
    comingSoon: false,
    listingTitle: "Renovated 1BR, South-Facing, Near McCarren Park",
    neighborhood: "Williamsburg, New York City",
    price: "$3,050",
    cardImg: nycCard.url,
    mapImg: nycMap.url,
  },
  {
    key: "la",
    pillLabel: "Los Angeles",
    comingSoon: true,
    listingTitle: "Bright Upper 1BR — Hardwood, Yard Access",
    neighborhood: "Highland Park, Los Angeles",
    price: "$1,995",
    cardImg: laCard.url,
    mapImg: laMap.url,
  },
  {
    key: "sf",
    pillLabel: "San Francisco Bay",
    comingSoon: true,
    listingTitle: "Sunny Studio — Half Block to Golden Gate Park",
    neighborhood: "Inner Sunset, San Francisco",
    price: "$2,250",
    cardImg: sfCard.url,
    mapImg: sfMap.url,
  },
  {
    key: "chi",
    pillLabel: "Chicago",
    comingSoon: true,
    listingTitle: "Ukrainian Village 2BR in Rehabbed Greystone",
    neighborhood: "Ukrainian Village, Chicago",
    price: "$2,650",
    cardImg: chiCard.url,
    mapImg: chiMap.url,
  },
];

export const HERO_B_ALL_IMAGES = HERO_B_CITIES.flatMap((c) => [c.cardImg, c.mapImg]);

export const HERO_B_BASE = "#efe6d5";
export const HERO_B_MAP_BASE = "#ede5d6";
export const BADGE_GREEN = "#6a820a";
