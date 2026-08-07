import type { CityId } from "./types";
import nycCard from "@/assets/NYC.png.asset.json";
import laCard from "@/assets/LA.png.asset.json";
import sfCard from "@/assets/SF.png.asset.json";
import chiCard from "@/assets/CHI.png.asset.json";

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

/** Card photos. Cities without a photo yet render the tint only. */
export const CITY_PHOTO: Partial<Record<CityId, string>> = {
  nyc: nycCard.url,
  la: laCard.url,
  "sf-bay": sfCard.url,
  chicago: chiCard.url,
};
