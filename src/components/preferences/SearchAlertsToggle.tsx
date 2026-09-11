import { useState } from "react";

import { setSearchAlertsEnabled } from "@/lib/preferences/notifications";
import { NotificationToggleSwitch } from "@/components/preferences/QuietHoursSection";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

/**
 * Green on/off switch for a single search's match alerts. Turning alerts OFF
 * asks for confirmation first; turning them on is immediate.
 */
export function SearchAlertsToggle({
  searchId,
  name,
  enabled,
}: {
  searchId: string;
  name: string;
  enabled: boolean;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <NotificationToggleSwitch
        checked={enabled}
        onChange={(v) => {
          if (v) setSearchAlertsEnabled(searchId, true);
          else setConfirmOpen(true);
        }}
      />
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Turn off notifications for "{name}"?</AlertDialogTitle>
            <AlertDialogDescription>
              You'll stop getting match alerts for this search. New matches still appear in the app,
              and your other searches aren't affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep them on</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => setSearchAlertsEnabled(searchId, false)}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Turn off notifications
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
