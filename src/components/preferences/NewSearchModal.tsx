import { useState } from "react";
import { X, Sparkles, MapPin, Copy as CopyIcon, Plus } from "lucide-react";
import { CITY_LIST, type CityId } from "@/data/cities";
import {
  useAppStore,
  hydrateActiveSearchIntoOnboarding,
  syncOnboardingToActiveSearch,
  selectActiveSearch,
} from "@/lib/store";
import {
  useCreateSearchMutation,
  useDuplicateSearchMutation,
} from "@/lib/queries/searches";
import { cn } from "@/lib/utils";
import { searchNameSchema } from "@/lib/validation/schemas";

type Mode = "blank" | "duplicate";

export function NewSearchModal({ onClose }: { onClose: () => void }) {
  const active = useAppStore(selectActiveSearch);
  const createSearch = useAppStore((s) => s.createSearch);
  const duplicateSearch = useAppStore((s) => s.duplicateSearch);
  const createMut = useCreateSearchMutation();
  const dupMut = useDuplicateSearchMutation();

  const [mode, setMode] = useState<Mode>("blank");
  const [cityId, setCityId] = useState<CityId>((active?.cityId ?? "nyc") as CityId);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    syncOnboardingToActiveSearch();

    try {
      if (mode === "duplicate" && active) {
        // DB authoritative: dup on server, then mirror locally.
        await dupMut.mutateAsync(active.id);
        const localRes = duplicateSearch(active.id);
        if (!localRes.ok) {
          setError(localRes.error);
          return;
        }
      } else {
        const trimmed = name.trim() || `Search ${Date.now().toString().slice(-4)}`;
        await createMut.mutateAsync({
          name: trimmed,
          cityId,
        });
        const localRes = createSearch({ cityId, name: trimmed });
        if (!localRes.ok) {
          setError(localRes.error);
          return;
        }
      }
      hydrateActiveSearchIntoOnboarding();
      onClose();
    } catch (e: any) {
      setError(e?.message ?? "Failed to create search");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-charcoal-950/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-paper rounded-card w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-pill bg-sage-200 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-sage-800" />
            </div>
            <div className="font-display text-lg font-bold text-charcoal-950">New search</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-9 w-9 rounded-pill border border-charcoal-200 inline-flex items-center justify-center text-charcoal-700 hover:border-charcoal-950"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Mode toggle */}
          <div className="grid grid-cols-2 gap-2">
            <ModeCard
              active={mode === "blank"}
              icon={Plus}
              title="Start fresh"
              desc="Blank filters for a new city or vibe."
              onClick={() => setMode("blank")}
            />
            <ModeCard
              active={mode === "duplicate"}
              icon={CopyIcon}
              title="Duplicate current"
              desc={active ? `Copy "${active.name}" and tweak.` : "No active search to copy."}
              onClick={() => active && setMode("duplicate")}
              disabled={!active}
            />
          </div>

          {mode === "blank" && (
            <>
              <Field label="City">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-charcoal-400 pointer-events-none" />
                  <select
                    value={cityId}
                    onChange={(e) => setCityId(e.target.value as CityId)}
                    className="w-full h-11 pl-9 pr-3 rounded-md bg-surface-elevated border border-border focus:outline-none focus:border-charcoal-950 text-sm font-medium appearance-none"
                  >
                    {CITY_LIST.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.displayName}
                      </option>
                    ))}
                  </select>
                </div>
              </Field>

              <Field label="Name (optional)">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value.slice(0, 50))}
                  placeholder="e.g. Brooklyn 2BR under $4k"
                  className="w-full h-11 px-3 rounded-md bg-surface-elevated border border-border focus:outline-none focus:border-charcoal-950 text-sm font-medium"
                />
                <p className="text-[11px] text-charcoal-500 mt-1">
                  Leave blank to auto-name based on city.
                </p>
              </Field>
            </>
          )}

          {error && (
            <div className="text-xs text-danger bg-danger/8 rounded-md px-3 py-2">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-4 rounded-pill border border-charcoal-200 text-sm font-semibold text-charcoal-700 hover:border-charcoal-950"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={submit}
              className="h-10 px-5 rounded-pill bg-charcoal-950 text-paper text-sm font-semibold hover:bg-charcoal-800 inline-flex items-center gap-2"
            >
              {mode === "duplicate" ? <CopyIcon className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
              {mode === "duplicate" ? "Duplicate" : "Create search"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[11px] font-mono uppercase tracking-[0.18em] text-charcoal-500 block mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

function ModeCard({
  active,
  icon: Icon,
  title,
  desc,
  onClick,
  disabled,
}: {
  active: boolean;
  icon: typeof Plus;
  title: string;
  desc: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "p-3 rounded-card border-2 text-left transition-colors",
        active
          ? "border-charcoal-950 bg-surface-elevated"
          : "border-border hover:border-charcoal-400",
        disabled && "opacity-40 cursor-not-allowed",
      )}
    >
      <Icon className={cn("h-4 w-4 mb-1.5", active ? "text-sage-700" : "text-charcoal-400")} />
      <div className="text-sm font-semibold text-charcoal-950">{title}</div>
      <div className="text-[11px] text-charcoal-600 mt-0.5 leading-snug">{desc}</div>
    </button>
  );
}
