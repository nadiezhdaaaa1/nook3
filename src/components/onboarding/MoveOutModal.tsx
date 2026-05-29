import { useState } from "react";
import { X, Home } from "lucide-react";
import { useOnboardingStore, type MoveOutInfo } from "@/lib/onboarding/store";
import { cn } from "@/lib/utils";

interface Props {
  onClose: () => void;
}

export function MoveOutModal({ onClose }: Props) {
  const { set, moveOut } = useOnboardingStore();
  const [form, setForm] = useState<MoveOutInfo>(
    moveOut ?? {
      date: "",
      name: "",
      address: "",
      unit: "",
      beds: 1,
      baths: 1,
      roommates: 0,
      allowContact: true,
    },
  );

  const canSubmit = form.address.trim().length > 0 && form.date.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-charcoal-950/40 p-4 animate-fade-in">
      <div className="w-full max-w-lg rounded-card bg-paper shadow-elevated animate-scale-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-paper">
          <div className="flex items-center gap-2">
            <Home className="h-4 w-4 text-sage-700" />
            <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-charcoal-500">
              Tell us about your current place
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 inline-flex items-center justify-center rounded-pill hover:bg-charcoal-950/5"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-charcoal-600">
            Optional — helps the next renter find your place. We never share without your OK.
          </p>

          <Field label="Move-out date">
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className={inputCls}
            />
          </Field>

          <Field label="Your name (optional)">
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Alex"
              className={inputCls}
            />
          </Field>

          <Field label="Building address">
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="200 W 20th St"
              className={inputCls}
            />
          </Field>

          <div className="grid grid-cols-3 gap-3">
            <Field label="Unit">
              <input
                type="text"
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="Beds">
              <input
                type="number"
                min={0}
                value={form.beds}
                onChange={(e) => setForm({ ...form, beds: +e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="Baths">
              <input
                type="number"
                min={1}
                step={0.5}
                value={form.baths}
                onChange={(e) => setForm({ ...form, baths: +e.target.value })}
                className={inputCls}
              />
            </Field>
          </div>

          <label className="flex items-start gap-3 p-3 rounded-md border border-border cursor-pointer hover:border-charcoal-400">
            <input
              type="checkbox"
              checked={form.allowContact}
              onChange={(e) => setForm({ ...form, allowContact: e.target.checked })}
              className="mt-0.5 h-4 w-4 accent-charcoal-950"
            />
            <span className="text-sm text-charcoal-700">
              Let Nook connect interested renters to me directly.
            </span>
          </label>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="h-11 px-5 rounded-pill text-sm font-semibold text-charcoal-700 hover:text-charcoal-950"
            >
              Skip for now
            </button>
            <button
              type="button"
              disabled={!canSubmit}
              onClick={() => {
                set("moveOut", form);
                onClose();
              }}
              className={cn(
                "ml-auto h-11 px-6 rounded-pill text-sm font-semibold transition-colors",
                canSubmit
                  ? "bg-charcoal-950 text-paper hover:bg-charcoal-800"
                  : "bg-charcoal-200 text-charcoal-500 cursor-not-allowed",
              )}
            >
              Save move-out info
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "w-full h-11 px-3 rounded-md bg-surface-elevated border border-border focus:border-charcoal-950 focus:outline-none text-sm font-medium";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-charcoal-500">
        {label}
      </span>
      {children}
    </label>
  );
}
