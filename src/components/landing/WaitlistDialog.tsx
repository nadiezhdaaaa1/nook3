import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Pre-filled city the user is interested in. If null, user picks one. */
  requestedCity?: string | null;
  requestedCityLabel?: string | null;
}

const TIMEFRAMES = [
  { value: "asap", label: "ASAP" },
  { value: "1-3m", label: "1–3 months" },
  { value: "3-6m", label: "3–6 months" },
  { value: "flex", label: "Just exploring" },
];

// US cities with population > 1M (city-proper), plus Other → free input.
const CITY_TAGS = [
  "New York City",
  "Los Angeles",
  "Chicago",
  "Houston",
  "Phoenix",
  "Philadelphia",
  "San Antonio",
  "San Diego",
  "Dallas",
  "Austin",
  "Jacksonville",
  "San Jose",
  "Fort Worth",
] as const;

const BUDGET_MIN = 500;
const BUDGET_MAX = 10000;
const BUDGET_STEP = 100;
const BUDGET_DEFAULT = 3000;

function formatBudget(n: number) {
  if (n >= BUDGET_MAX) return `$${BUDGET_MAX.toLocaleString()}+`;
  return `$${n.toLocaleString()}`;
}

export function WaitlistDialog({ open, onOpenChange, requestedCity, requestedCityLabel }: Props) {
  const [email, setEmail] = useState("");
  const [cityTag, setCityTag] = useState<string>(""); // selected preset, "other", or ""
  const [cityOther, setCityOther] = useState("");
  const [budget, setBudget] = useState<number>(BUDGET_DEFAULT);
  const [timeframe, setTimeframe] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const targetCityLabel = requestedCityLabel ?? "your city";
  const askForCity = !requestedCity;

  const resolvedCity = requestedCity
    ? requestedCity
    : cityTag === "other"
      ? cityOther.trim() || null
      : cityTag || null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    if (askForCity && !resolvedCity) {
      toast.error("Pick a city or type yours");
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from("waitlist").insert({
        email: email.trim().toLowerCase(),
        requested_city: resolvedCity,
        city: resolvedCity,
        budget_max: budget,
        move_in_timeframe: timeframe || null,
        source: "landing",
        user_agent: typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 500) : null,
      });
      if (error) throw error;
      toast.success("You're on the waitlist", {
        description: "We'll email you the moment Nook opens here.",
      });
      onOpenChange(false);
      setEmail("");
      setCityTag("");
      setCityOther("");
      setBudget(BUDGET_DEFAULT);
      setTimeframe("");
    } catch (err) {
      console.error("waitlist insert failed", err);
      toast.error("Something went wrong. Try again?");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Join the {targetCityLabel} waitlist</DialogTitle>
          <DialogDescription>
            Drop a few details and we'll reach out the moment Nook launches{requestedCity ? ` in ${targetCityLabel}` : ""}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="wl-email">Email</Label>
            <Input
              id="wl-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
            />
          </div>

          {askForCity && (
            <div className="space-y-2">
              <Label>Which city?</Label>
              <div className="flex flex-wrap gap-1.5">
                {CITY_TAGS.map((c) => {
                  const active = cityTag === c;
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCityTag(active ? "" : c)}
                      className={`h-8 px-3 rounded-pill border text-xs font-medium transition-colors ${
                        active
                          ? "bg-charcoal-950 text-paper border-charcoal-950"
                          : "bg-transparent border-charcoal-200 text-charcoal-800 hover:border-charcoal-950"
                      }`}
                    >
                      {c}
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => setCityTag(cityTag === "other" ? "" : "other")}
                  className={`h-8 px-3 rounded-pill border text-xs font-medium transition-colors ${
                    cityTag === "other"
                      ? "bg-charcoal-950 text-paper border-charcoal-950"
                      : "bg-transparent border-dashed border-charcoal-300 text-charcoal-700 hover:border-charcoal-950"
                  }`}
                >
                  Other
                </button>
              </div>
              {cityTag === "other" && (
                <Input
                  autoFocus
                  type="text"
                  value={cityOther}
                  onChange={(e) => setCityOther(e.target.value)}
                  placeholder="Type your city..."
                  className="mt-2"
                />
              )}
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-baseline justify-between">
              <Label htmlFor="wl-budget">Max monthly budget</Label>
              <span className="text-sm font-semibold text-charcoal-950 tabular-nums">
                Up to {formatBudget(budget)}
              </span>
            </div>
            <Slider
              id="wl-budget"
              min={BUDGET_MIN}
              max={BUDGET_MAX}
              step={BUDGET_STEP}
              value={[budget]}
              onValueChange={(v) => setBudget(v[0] ?? BUDGET_DEFAULT)}
            />
            <div className="flex justify-between text-[11px] font-mono text-charcoal-400">
              <span>${BUDGET_MIN.toLocaleString()}</span>
              <span>${BUDGET_MAX.toLocaleString()}+</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>When are you looking to move?</Label>
            <div className="flex flex-wrap gap-2">
              {TIMEFRAMES.map((t) => {
                const active = timeframe === t.value;
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setTimeframe(active ? "" : t.value)}
                    className={`h-9 px-3 rounded-pill border text-xs font-medium transition-colors ${
                      active
                        ? "bg-charcoal-950 text-paper border-charcoal-950"
                        : "bg-transparent border-charcoal-200 text-charcoal-800 hover:border-charcoal-950"
                    }`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Join waitlist"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
