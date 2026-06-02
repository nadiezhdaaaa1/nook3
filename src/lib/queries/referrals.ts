import { queryOptions } from "@tanstack/react-query";
import { getReferralStats } from "@/lib/referrals.functions";

export const referralStatsQueryKey = ["referral-stats"] as const;

export const referralStatsQueryOptions = () =>
  queryOptions({
    queryKey: referralStatsQueryKey,
    queryFn: () => getReferralStats(),
    staleTime: 60_000,
  });
