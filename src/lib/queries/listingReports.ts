import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

import { reportListing, type ReportReason } from "@/lib/listingReports.functions";
import { saveListingSnapshot, type AlertListing } from "@/lib/alerts.functions";
import { alertsQueryKey } from "@/lib/queries/alerts";

export function useReportListingMutation() {
  const fn = useServerFn(reportListing);
  return useMutation({
    mutationFn: (vars: {
      listingRef: string;
      reason: ReportReason;
      details?: string;
      searchId?: string | null;
      alertId?: string | null;
      listing?: Record<string, unknown>;
    }) => fn({ data: vars as never }),
    onSuccess: () =>
      toast.success("Thanks — reported", {
        description: "Our team reviews flagged listings within 24 hours.",
      }),
    onError: (e) =>
      toast.error("Couldn't send the report", {
        description: e instanceof Error ? e.message : "Try again",
      }),
  });
}

export function useSaveListingSnapshotMutation() {
  const qc = useQueryClient();
  const fn = useServerFn(saveListingSnapshot);
  return useMutation({
    mutationFn: (vars: { searchId: string; listing: AlertListing }) => fn({ data: vars }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: alertsQueryKey });
      toast.success("Saved to your listings");
    },
    onError: (e) =>
      toast.error("Couldn't save this listing", {
        description: e instanceof Error ? e.message : "Try again",
      }),
  });
}
