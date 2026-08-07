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
  nyc: "#f2d98c",
  la: "#ffbf73",
  "sf-bay": "#f28c73",
  chicago: "#8cb8e0",
  dc: "#d9d9e5",
  boston: "#e5b8b2",
  seattle: "#66b28c",
  miami: "#4dd9d1",
  austin: "#f2c794",
  philadelphia: "#c7d9bf",
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
