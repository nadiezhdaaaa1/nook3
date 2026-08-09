import type { CityId } from "./types";
import nycCard from "@/assets/NYC.png.asset.json";
import laCard from "@/assets/LA.png.asset.json";
import sfCard from "@/assets/SF.png.asset.json";
import chiCard from "@/assets/CHI.png.asset.json";
import dcCard from "@/assets/Washington.png.asset.json";
import bostonCard from "@/assets/Boston.png.asset.json";
import seattleCard from "@/assets/Seattle.png.asset.json";
import miamiCard from "@/assets/Miami.png.asset.json";
import austinCard from "@/assets/Austin.png.asset.json";
import phillyCard from "@/assets/Philadelphia.png.asset.json";

/** Card background tints per city (from design). */
export const CITY_TINT: Record<CityId, string> = {
  nyc: "#fbe5a3",
  la: "#ffcd92",
  "sf-bay": "#ffaa95",
  chicago: "#add0f0",
  dc: "#d9d9e5",
  boston: "#efc8c4",
  seattle: "#a9dfc4",
  miami: "#9de5e2",
  austin: "#f3cfa3",
  philadelphia: "#cddec6",
};

/** Darker hover shade per city card. */
export const CITY_TINT_HOVER: Record<CityId, string> = {
  nyc: "#fddd7e",
  la: "#ffbd6e",
  "sf-bay": "#ff8d71",
  chicago: "#8dbfed",
  dc: "#c3c3d7",
  boston: "#e9ada6",
  seattle: "#8dd7b2",
  miami: "#7ee0dc",
  austin: "#f2bf81",
  philadelphia: "#b9d2af",
};

/** Card photos. */
export const CITY_PHOTO: Partial<Record<CityId, string>> = {
  nyc: nycCard.url,
  la: laCard.url,
  "sf-bay": sfCard.url,
  chicago: chiCard.url,
  dc: dcCard.url,
  boston: bostonCard.url,
  seattle: seattleCard.url,
  miami: miamiCard.url,
  austin: austinCard.url,
  philadelphia: phillyCard.url,
};

/** Heading accent per city — tuned for contrast on the cream background. */
export const CITY_ACCENT: Record<CityId, string> = {
  nyc: "#a07f1a",
  la: "#c06a10",
  "sf-bay": "#da4724",
  chicago: "#3878b4",
  dc: "#5757a7",
  boston: "#b25048",
  seattle: "#349464",
  miami: "#18938c",
  austin: "#a3742c",
  philadelphia: "#58913f",
};
