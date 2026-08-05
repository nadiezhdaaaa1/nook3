import nycCard from "@/assets/NYC.png.asset.json";
import laCard from "@/assets/LA.png.asset.json";
import sfCard from "@/assets/SF.png.asset.json";
import chiCard from "@/assets/CHI.png.asset.json";
import nycBg from "@/assets/Hero_NYC.png.asset.json";
import laBg from "@/assets/Hero_LA.png.asset.json";
import sfBg from "@/assets/Hero_SF.png.asset.json";
import chiBg from "@/assets/Hero_CHI.png.asset.json";

export interface HeroCity {
  key: "nyc" | "la" | "sf" | "chi";
  pillLabel: string;
  cardTitle: string;
  comingSoon: boolean;
  stats: { value: string; suffix?: string; label: string }[];
  cardImg: string;
  bgImg: string;
}

export const HERO_CITIES: HeroCity[] = [
  {
    key: "nyc",
    pillLabel: "New York City",
    cardTitle: "New York City",
    comingSoon: false,
    stats: [
      { value: "22,000", label: "Active listings" },
      { value: "50", suffix: "days", label: "Typical search" },
      { value: "300–600", label: "New listings every day" },
    ],
    cardImg: nycCard.url,
    bgImg: nycBg.url,
  },
  {
    key: "la",
    pillLabel: "Los Angeles",
    cardTitle: "Los Angeles",
    comingSoon: true,
    stats: [
      { value: "26,000", label: "Active listings" },
      { value: "75", suffix: "days", label: "Typical search" },
      { value: "330–500", label: "New listings every day" },
    ],
    cardImg: laCard.url,
    bgImg: laBg.url,
  },
  {
    key: "sf",
    pillLabel: "San Francisco Bay",
    cardTitle: "San Francisco",
    comingSoon: true,
    stats: [
      { value: "17,000", label: "Active listings" },
      { value: "40", suffix: "days", label: "Typical search" },
      { value: "375–650", label: "New listings every day" },
    ],
    cardImg: sfCard.url,
    bgImg: sfBg.url,
  },
  {
    key: "chi",
    pillLabel: "Chicago",
    cardTitle: "Chicago",
    comingSoon: true,
    stats: [
      { value: "19,000", label: "Active listings" },
      { value: "45", suffix: "days", label: "Typical search" },
      { value: "420–630", label: "New listings every day" },
    ],
    cardImg: chiCard.url,
    bgImg: chiBg.url,
  },
];

export const HERO_ALL_IMAGES = HERO_CITIES.flatMap((c) => [c.cardImg, c.bgImg]);

export const EASE_REVEAL = [0.22, 1, 0.36, 1] as const;
export const EASE_CROSS = [0.4, 0, 0.2, 1] as const;

export const COLORS = {
  base: "#f4f1ea",
  gradientBase: "#ede5d6",
  ink: "#2b2521",
  body: "#4a4a46",
  muted: "#5a5a55",
  pillMuted: "rgba(36,28,18,0.6)",
  pillCity: "#241c12",
  surface: "rgba(255,255,255,0.4)",
  surfaceHover: "rgba(255,255,255,0.65)",
  border: "#b3aea6",
  borderHover: "#8f8a80",
  clay: "#a05712",
  clayHover: "#b3621a",
  soonBg: "rgba(239,106,85,0.2)",
  soonText: "#c93822",
  navText: "#3a3a37",
} as const;

export const FONT_DISPLAY = '"Fraunces", "Times New Roman", serif';
export const FONT_UI = '"Google Sans Flex", "Inter Tight", system-ui, sans-serif';
export const UI_VAR = '"GRAD" 0, "ROND" 0, "wdth" 100';
export const DISPLAY_VAR = '"SOFT" 0, "WONK" 1';
