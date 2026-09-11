import { createFileRoute } from "@tanstack/react-router";

import { type Frequency } from "@/lib/onboarding/store";
import { useAppStore } from "@/lib/store";
import { setSearchFrequency } from "@/lib/preferences/notifications";
import { StickySaveBar } from "@/components/preferences/StickySaveBar";
import { QuietHoursRow } from "@/components/preferences/QuietHoursSection";
import { SearchAlertsToggle } from "@/components/preferences/SearchAlertsToggle";
import { OriginButton } from "@/components/ui/origin-button";
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

function NotificationsTab() {
  const { searchId } = Route.useParams();
  const search = useAppStore((s) => s.searches.find((x) => x.id === searchId));

  if (!search) return null;

  const frequency = search.frequency;
  const enabled = search.alertsEnabled;

  return (
    <div className="space-y-10 pb-32">
      {/* Master toggle */}
      <section className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-display text-[18px] font-semibold text-charcoal-950">
            Notifications for this search
          </h2>
          <div className="flex shrink-0 items-center gap-3">
            <span
              className="font-display text-[18px] font-semibold"
              style={{ color: enabled ? "#6A820A" : "#C76B4A" }}
            >
              {enabled ? "Enabled" : "Disabled"}
            </span>
            <SearchAlertsToggle searchId={search.id} name={search.name} enabled={enabled} />
          </div>
        </div>
        {!enabled && (
          <p className="text-[13px] leading-relaxed text-charcoal-600">
            No match alerts for this search — new matches still appear in the app. Your other
            searches aren't affected.
          </p>
        )}
      </section>

      {enabled && (
        <>
          {/* Frequency */}
          <section className="space-y-4">
            <div>
              <h3 className="font-display text-lg font-semibold text-charcoal-950">Frequency</h3>
            </div>
            <div className="ob-chips grid sm:grid-cols-2 gap-3">
              {FREQS.map((f) => {
                const selected = frequency === f.id;
                return (
                  <OriginButton
                    key={f.id}
                    type="button"
                    variant={selected ? "dark" : "tertiary"}
                    size="big"
                    aria-pressed={selected}
                    onClick={() => setSearchFrequency(search.id, f.id)}
                    className="w-full h-auto min-h-[110px] pl-4 pr-6 py-4 text-[16px] justify-start items-start text-left"
                  >
                    <span className="flex w-full items-start gap-3">
                      <img
                        src={f.icon}
                        alt=""
                        aria-hidden="true"
                        className="h-8 w-8 shrink-0 object-cover"
                      />

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
          <section>
            <QuietHoursRow />
          </section>

          <StickySaveBar
            state={{ frequency }}
            successMessage={`Settings saved · Applied to ${search.name}`}
            getChanges={(b, c) => (b.frequency !== c.frequency ? ["frequency"] : [])}
            onDiscard={(snap) => setSearchFrequency(search.id, snap.frequency)}
          />
        </>
      )}
    </div>
  );
}
