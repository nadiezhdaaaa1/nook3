import { HeroB } from "./heroB/HeroB";
import { HeroScrollNav } from "./shared/HeroScrollNav";

export function HeroAB() {
  return (
    <div className="relative">
      <HeroScrollNav />
      <HeroB />
    </div>
  );
}
