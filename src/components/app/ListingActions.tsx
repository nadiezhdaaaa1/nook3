import { useState } from "react";
import { Flag, Heart, Loader2, ThumbsDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import type { ReportReason } from "@/lib/listingReports.functions";

const REASON_LABELS: { value: ReportReason; label: string }[] = [
  { value: "spam", label: "Spam or advertising" },
  { value: "fraud", label: "Scam or fraud" },
  { value: "duplicate", label: "Duplicate listing" },
  { value: "wrong_price", label: "Wrong price or details" },
  { value: "unavailable", label: "No longer available" },
  { value: "offensive", label: "Offensive or discriminatory" },
  { value: "other", label: "Something else" },
];

const BTN =
  "inline-flex h-9 items-center gap-1.5 rounded-[8px] border border-black/10 bg-white px-3 text-[13px] font-semibold text-[#241c12] transition-colors hover:border-black/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#241c12] disabled:opacity-60";

interface Props {
  saved: boolean;
  saving?: boolean;
  onToggleSave: () => void;
  onDislike: () => void;
  onReport: (reason: ReportReason, details: string) => void;
}

export function ListingActions({ saved, saving, onToggleSave, onDislike, onReport }: Props) {
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [details, setDetails] = useState("");

  const close = () => {
    setReason(null);
    setDetails("");
  };

  return (
    <div
      className="mt-4 flex flex-wrap items-center gap-2 border-t border-black/[0.06] pt-3"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={onToggleSave}
        disabled={saving}
        aria-pressed={saved}
        aria-label={saved ? "Remove from saved listings" : "Save listing"}
        className={BTN}
        style={saved ? { borderColor: "#6a820a", color: "#4d5f07" } : undefined}
      >
        {saving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Heart className="h-4 w-4" fill={saved ? "#6a820a" : "none"} color={saved ? "#6a820a" : "#6e6459"} />
        )}
        {saved ? "Saved" : "Save"}
      </button>

      <button
        type="button"
        onClick={onDislike}
        aria-label="Not interested in this listing"
        className={BTN}
      >
        <ThumbsDown className="h-4 w-4" color="#6e6459" />
        Not for me
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label="Report this listing"
          className={`${BTN} ml-auto`}
        >
          <Flag className="h-4 w-4" color="#6e6459" />
          Report
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>What's wrong with this listing?</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {REASON_LABELS.map((r) => (
            <DropdownMenuItem
              key={r.value}
              onSelect={() => {
                setReason(r.value);
                setDetails("");
              }}
            >
              {r.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={reason !== null} onOpenChange={(o) => !o && close()}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle>Report this listing</DialogTitle>
            <DialogDescription>
              {REASON_LABELS.find((r) => r.value === reason)?.label}. Add anything that helps us
              review it faster (optional).
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={details}
            maxLength={1000}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="What did you notice?"
            className="min-h-[96px]"
          />
          <DialogFooter>
            <button type="button" className={BTN} onClick={close}>
              Cancel
            </button>
            <button
              type="button"
              className="inline-flex h-9 items-center rounded-[8px] bg-[#241c12] px-4 text-[13px] font-semibold text-white hover:opacity-90"
              onClick={() => {
                if (reason) onReport(reason, details.trim());
                close();
              }}
            >
              Send report
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
