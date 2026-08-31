import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { Moon } from "lucide-react";

import { useOnboardingStore, type Frequency } from "@/lib/onboarding/store";
import { useAppStore } from "@/lib/store";
import { usePreferencesStore } from "@/lib/preferences/store";
import { StickySaveBar } from "@/components/preferences/StickySaveBar";
import { OriginButton } from "@/components/ui/origin-button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import freqInstant from "@/assets/freq-instant.png.asset.json";
import freqBalanced from "@/assets/freq-balanced.png.asset.json";
import freqDaily from "@/assets/freq-daily.png.asset.json";
import freqWeekly from "@/assets/freq-weekly.png.asset.json";

export const Route = createFileRoute("/_authenticated/search/$searchId/notifications")({
  component: NotificationsTab,
});

const FREQS: {
  id: Frequency; label: string; desc: string; bestFor: string;
  icon: string; iconAlt: string;
}[] = [
  { id: "maximum", label: "Instant", desc: "Every match, the moment it's listed.", bestFor: "Depending on your criteria, this can mean many alerts a day — narrow your search to receive fewer.", icon: freqInstant.url, iconAlt: "" },
  { id: "balanced", label: "Balanced", desc: "Top matches, grouped 2–3 times a day.", bestFor: "Best for an active search without the noise.", icon: freqBalanced.url, iconAlt: "" },
  { id: "minimal", label: "Daily", desc: "One roundup a day with your strongest matches.", bestFor: "Best for keeping watch without urgency.", icon: freqDaily.url, iconAlt: "" },
  { id: "weekly", label: "Weekly", desc: "One curated digest every week.", bestFor: "Best for planning a future move.", icon: freqWeekly.url, iconAlt: "" },
];


function detectTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "America/New_York";
  } catch {
    return "America/New_York";
  }
}

function formatTimeLabel(hhmm: string): string {
  const [hStr, mStr] = hhmm.split(":");
  const h = Number(hStr);
  const m = Number(mStr ?? "0");
  if (Number.isNaN(h)) return hhmm;
  const period = h >= 12 ? "PM" : "AM";
  const h12 = ((h + 11) % 12) + 1;
  return `${h12}:${m.toString().padStart(2, "0")} ${period}`;
}

function NotificationsTab() {
  const { frequency, set } = useOnboardingStore();
  const activeSearchId = useAppStore((s) => s.activeSearchId);
  const activeSearch = useAppStore((s) => s.searches.find((x) => x.id === s.activeSearchId));
  const { quietHours, setQuiet } = usePreferencesStore();

  const searchName = activeSearch?.name ?? "this search";

  const tz = useMemo(() => detectTimezone(), []);

  return (
    <div className="space-y-10 pb-32">
      {/* Frequency */}
      <section className="space-y-4">
        <div>
          <h3 className="font-display text-lg font-semibold text-charcoal-950">Frequency</h3>
        </div>
        <div className="ob-chips grid sm:grid-cols-2 gap-3">
          {FREQS.map((f) => {
            const selected = frequency === f.id;
            const Icon = f.icon;
            return (
              <OriginButton
                key={f.id}
                type="button"
                variant={selected ? "dark" : "tertiary"}
                size="big"
                aria-pressed={selected}
                onClick={() => set("frequency", f.id)}
                className="w-full h-auto min-h-[110px] px-6 py-4 text-[16px] justify-start items-start text-left"
              >
                <span className="flex w-full items-start gap-3">
                  <Icon aria-hidden="true" className="h-5 w-5 mt-0.5 shrink-0" />
                  <span className="flex-1 min-w-0">
                    <span className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold">{f.label}</span>
                    </span>
                    <span className="block text-[13px] opacity-80 mt-1 font-normal whitespace-normal">{f.desc}</span>
                    <span className="block text-[12px] italic opacity-70 mt-2 font-normal whitespace-normal leading-snug">
                      {f.bestFor}
                    </span>
                  </span>
                </span>
              </OriginButton>
            );
          })}
        </div>

      </section>

      {/* Quiet hours */}
      <section className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="font-display text-lg font-semibold text-charcoal-950 flex items-center gap-2">
              <Moon className="h-4 w-4 text-charcoal-500" /> Quiet hours
            </h3>
            <p className="text-xs text-charcoal-500 mt-1 leading-relaxed">
              No alerts during{" "}
              <span className="font-medium text-charcoal-700">
                {formatTimeLabel(quietHours.start)} – {formatTimeLabel(quietHours.end)}
              </span>{" "}
              <span className="text-charcoal-500">({tz}).</span>
              <br />
              <span className="text-charcoal-500">Applies to all searches.</span>
            </p>
          </div>
          <ToggleSwitch
            checked={quietHours.enabled}
            onChange={(v) => setQuiet("enabled", v)}
          />
        </div>
        {quietHours.enabled && (
          <div className="grid sm:grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="space-y-2">
              <label htmlFor="quiet-start" className="text-[11px] font-mono uppercase tracking-[0.18em] text-charcoal-500">
                Quiet hours start
              </label>
              <Input
                id="quiet-start"
                type="time"
                value={quietHours.start}
                onChange={(e) => setQuiet("start", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="quiet-end" className="text-[11px] font-mono uppercase tracking-[0.18em] text-charcoal-500">
                Quiet hours end
              </label>
              <Input
                id="quiet-end"
                type="time"
                value={quietHours.end}
                onChange={(e) => setQuiet("end", e.target.value)}
              />
            </div>
            <div className="sm:col-span-2 space-y-2">
              <label className="text-[11px] font-mono uppercase tracking-[0.18em] text-charcoal-500">
                Timezone
              </label>
              <div className="w-full h-11 px-4 rounded-md bg-paper-warm/60 border border-border text-sm font-medium text-charcoal-700 flex items-center justify-between">
                <span>{tz}</span>
                <span className="text-[11px] text-charcoal-500">detected from your browser</span>
              </div>
            </div>
          </div>
        )}
      </section>

      <StickySaveBar
        state={{
          frequency,
          quietHours,
        }}
        successMessage={activeSearchId ? `Settings saved · Applied to ${searchName}` : "Settings saved"}
        getChanges={(b, c) => {
          const out: string[] = [];
          if (b.frequency !== c.frequency) out.push("frequency");
          if (JSON.stringify(b.quietHours) !== JSON.stringify(c.quietHours)) out.push("quiet hours");
          return out;
        }}
        onDiscard={(snap) => {
          set("frequency", snap.frequency);
          setQuiet("enabled", snap.quietHours.enabled);
          setQuiet("start", snap.quietHours.start);
          setQuiet("end", snap.quietHours.end);
        }}
      />
    </div>
  );
}

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex shrink-0 rounded-full transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-charcoal-950/30 focus-visible:ring-offset-2 focus-visible:ring-offset-paper",
        checked ? "bg-charcoal-950" : "bg-charcoal-300",
      )}
      style={{ width: 44, height: 24, padding: 0 }}
    >
      <span
        aria-hidden="true"
        className="absolute top-1/2 -translate-y-1/2 rounded-full bg-paper-elevated shadow-sm transition-[left] duration-200 ease-out"
        style={{ width: 20, height: 20, left: checked ? 22 : 2 }}
      />
    </button>
  );
}
