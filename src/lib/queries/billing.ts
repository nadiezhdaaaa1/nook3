import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { updatePlan } from "@/lib/billing.functions";
import { profileQueryKey } from "@/lib/queries/profile";
import { useAppStore, type Plan, type BillingCycle } from "@/lib/store";

export function useUpdatePlanMutation() {
  const qc = useQueryClient();
  const fn = useServerFn(updatePlan);
  const updateProfile = useAppStore((s) => s.updateProfile);
  return useMutation({
    mutationFn: (data: { plan: Plan; billingCycle?: BillingCycle }) =>
      fn({ data }),
    onSuccess: (user) => {
      updateProfile({ plan: user.plan, billingCycle: user.billingCycle, trialActive: user.trialActive });
      qc.invalidateQueries({ queryKey: profileQueryKey });
      if (user.plan === "free") {
        toast.success("Subscription cancelled", { description: "You're back on the Free plan." });
      } else {
        toast.success(`Welcome to ${user.plan === "premium" ? "Premium" : "Max"}!`, {
          description: "Your plan has been updated.",
        });
      }
    },
    onError: (e) =>
      toast.error("Couldn't update plan", {
        description: e instanceof Error ? e.message : "Try again",
      }),
  });
}
