import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Pre-filled city the user is interested in. If null, user types it. */
  requestedCity?: string | null;
  requestedCityLabel?: string | null;
}

const TIMEFRAMES = [
  { value: "asap", label: "ASAP" },
  { value: "1-3m", label: "1–3 months" },
  { value: "3-6m", label: "3–6 months" },
  { value: "flex", label: "Just exploring" },
];

export function WaitlistDialog({ open, onOpenChange, requestedCity, requestedCityLabel }: Props) {
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [budget, setBudget] = useState("");
  const [timeframe, setTimeframe] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const targetCityLabel = requestedCityLabel ?? "your city";
  const askForCity = !requestedCity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from("waitlist").insert({
        email: email.trim().toLowerCase(),
        requested_city: requestedCity ?? (city.trim() || null),
        city: requestedCity ?? (city.trim() || null),
        budget_max: budget ? parseInt(budget, 10) || null : null,
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
      setCity("");
      setBudget("");
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Join the {targetCityLabel} waitlist</DialogTitle>
          <DialogDescription>
            Drop a few details and we'll reach out the moment Nook launches{requestedCity ? ` in ${targetCityLabel}` : ""}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
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
            <div className="space-y-1.5">
              <Label htmlFor="wl-city">Which city?</Label>
              <Input
                id="wl-city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Denver, Austin, Portland..."
              />
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="wl-budget">Max monthly budget (USD)</Label>
            <Input
              id="wl-budget"
              type="number"
              inputMode="numeric"
              min={0}
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="3000"
            />
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
