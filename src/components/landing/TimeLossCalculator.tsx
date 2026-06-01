import { useMemo, useState } from "react";
import { Clock, TrendingDown, DollarSign } from "lucide-react";
import { Eyebrow } from "@/components/marketing/Eyebrow";

const HOURLY_WAGE = 32; // US median wage ~$32/hr

export function TimeLossCalculator() {
  const [hoursPerWeek, setHoursPerWeek] = useState(8);
  const [weeksSearching, setWeeksSearching] = useState(12);

  const stats = useMemo(() => {
    const totalHours = hoursPerWeek * weeksSearching;
    const dollarValue = Math.round(totalHours * HOURLY_WAGE);
    const fullDays = Math.round((totalHours / 24) * 10) / 10;
    const nookHours = Math.round(weeksSearching * 0.5); // ~30 min/week with Nook
    const hoursSaved = totalHours - nookHours;
    return { totalHours, dollarValue, fullDays, nookHours, hoursSaved };
  }, [hoursPerWeek, weeksSearching]);

  return (
    <section
      id="calculator"
      className="bg-charcoal-950 text-paper py-24 lg:py-32"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="max-w-3xl mb-16">
          <Eyebrow tone="ink">The math</Eyebrow>
          <h2 className="font-display font-bold text-4xl lg:text-6xl tracking-[-0.02em] leading-[1.05]">
            What your search{" "}
            <span className="accent-italic text-sage-300">actually costs.</span>
          </h2>
          <p className="mt-6 text-lg text-paper/70 leading-relaxed max-w-2xl">
            Most renters underestimate the time tax. Move the sliders and
            see what three months of refreshing has cost you so far.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-px bg-paper/10 rounded-card overflow-hidden border border-paper/15">
          {/* Sliders */}
          <div className="bg-charcoal-950 p-8 lg:p-12 space-y-10">
            <SliderRow
              label="Hours per week refreshing listings"
              value={hoursPerWeek}
              min={1}
              max={30}
              suffix="hrs"
              onChange={setHoursPerWeek}
            />
            <SliderRow
              label="Weeks you've been searching"
              value={weeksSearching}
              min={1}
              max={52}
              suffix="wks"
              onChange={setWeeksSearching}
            />

            <div className="pt-6 border-t border-paper/15">
              <div className="text-[11px] font-mono uppercase tracking-[0.16em] text-paper/50 font-semibold mb-2">
                Assumption
              </div>
              <p className="text-sm text-paper/70 leading-relaxed">
                US median hourly wage: ${HOURLY_WAGE}/hr (BLS, 2025). Time
                spent searching is time you can't spend earning, resting, or
                anything else.
              </p>
            </div>
          </div>

          {/* Results */}
          <div className="bg-paper/[0.04] p-8 lg:p-12 space-y-8">
            <ResultRow
              icon={Clock}
              big={`${stats.totalHours}`}
              unit="hours"
              label="lost so far"
              tone="paper"
            />
            <ResultRow
              icon={DollarSign}
              big={`$${stats.dollarValue.toLocaleString()}`}
              unit=""
              label="in opportunity cost"
              tone="peach"
            />
            <ResultRow
              icon={TrendingDown}
              big={`${stats.fullDays}`}
              unit="full days"
              label="of your life on refresh"
              tone="paper"
            />

            <div className="mt-8 p-5 rounded-card bg-sage-500/15 border border-sage-300/30">
              <div className="text-[11px] font-mono uppercase tracking-[0.16em] text-sage-300 font-semibold mb-2">
                With Nook
              </div>
              <div className="font-display text-2xl lg:text-3xl text-paper leading-tight">
                ~{stats.nookHours} hrs total.{" "}
                <span className="text-sage-300">
                  You get {stats.hoursSaved} hrs of your life back.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  suffix,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  suffix: string;
  onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between mb-3">
        <label className="text-sm text-paper/80 font-medium">{label}</label>
        <div className="font-display font-bold text-3xl lg:text-4xl tracking-[-0.02em] text-paper">
          {value}
          <span className="text-base text-paper/50 ml-1.5 font-mono uppercase tracking-[0.12em]">
            {suffix}
          </span>
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-pill appearance-none cursor-pointer accent-sage-300"
        style={{
          background: `linear-gradient(to right, rgb(166 215 175) 0%, rgb(166 215 175) ${pct}%, rgba(255,255,255,0.15) ${pct}%, rgba(255,255,255,0.15) 100%)`,
        }}
        aria-label={label}
      />
      <div className="flex justify-between mt-2 text-[10px] font-mono uppercase tracking-[0.14em] text-paper/40">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

function ResultRow({
  icon: Icon,
  big,
  unit,
  label,
  tone,
}: {
  icon: typeof Clock;
  big: string;
  unit: string;
  label: string;
  tone: "paper" | "peach";
}) {
  const color = tone === "peach" ? "text-peach-300" : "text-paper";
  return (
    <div className="flex items-start gap-4">
      <div className="mt-1 h-9 w-9 rounded-pill bg-paper/10 flex items-center justify-center shrink-0">
        <Icon className="h-4 w-4 text-paper/70" />
      </div>
      <div>
        <div
          className={`font-display font-bold text-4xl lg:text-5xl tracking-[-0.02em] leading-none ${color}`}
        >
          {big}
          {unit && (
            <span className="text-lg text-paper/50 ml-2 font-mono uppercase tracking-[0.12em] font-semibold">
              {unit}
            </span>
          )}
        </div>
        <div className="mt-2 text-sm text-paper/60">{label}</div>
      </div>
    </div>
  );
}
