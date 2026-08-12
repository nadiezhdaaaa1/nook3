import { useQuery } from "@tanstack/react-query";
import trashAsset from "@/assets/trash-2.png.asset.json";
import { OriginButton } from "@/components/ui/origin-button";
import {
  profileQueryOptions,
  useCancelAccountDeletionMutation,
} from "@/lib/queries/profile";
import { useHasSession } from "@/lib/queries/useHasSession";

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function daysLeft(iso: string) {
  const ms = new Date(iso).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

/**
 * Global notice shown on every authenticated screen while the account is
 * scheduled for deletion. Nothing is deleted during the grace period, so the
 * user can reverse it from anywhere in the app.
 */
export function AccountDeletionBanner() {
  const hasSession = useHasSession();
  const { data: profile } = useQuery({
    ...profileQueryOptions(),
    enabled: hasSession,
    retry: false,
  });
  const cancel = useCancelAccountDeletionMutation();

  const scheduledAt = profile?.deletionScheduledAt;
  if (!scheduledAt) return null;

  const left = daysLeft(scheduledAt);

  return (
    <div
      role="status"
      aria-live="polite"
      className="sticky top-0 z-50 bg-danger text-white"
    >
      <div className="mx-auto max-w-[1440px] px-6 py-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col items-center gap-2.5 sm:flex-row sm:items-center">
          <img
            src={trashAsset.url}
            alt=""
            aria-hidden
            className="h-10 w-10 shrink-0 object-contain"
          />
          <p className="text-sm leading-relaxed text-center sm:text-left">
            <span className="font-semibold">
              Your account is scheduled for deletion on {formatDate(scheduledAt)}
            </span>{" "}
            <span className="text-white/85">
              ({left} {left === 1 ? "day" : "days"} left). Nothing has been
              deleted yet — your searches, alerts and saved listings are all
              still here. You can reverse this any time before that date.
            </span>
          </p>
        </div>
        <div className="shrink-0 sm:pl-4">
          <OriginButton
            variant="dark"
            size="medium"
            onClick={() => cancel.mutate()}
            disabled={cancel.isPending}
          >
            {cancel.isPending ? "Restoring…" : "Keep my account"}
          </OriginButton>
        </div>
      </div>
    </div>
  );
}
