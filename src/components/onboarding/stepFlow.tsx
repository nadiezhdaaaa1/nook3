import { createContext, useCallback, useContext, type ReactNode } from "react";
import { Navigate, useNavigate } from "@tanstack/react-router";

/**
 * Lets the shared onboarding step screens (Step1Where … Step4Preferences) be
 * reused by the "add a new search" wizard under /search/new/$step.
 *
 * Without a provider the steps behave exactly as they do in onboarding.
 */
export interface StepFlowConfig {
  /** Param route holding the steps, e.g. "/search/new/$step". */
  basePath: string;
  /** Label of the primary CTA on the last step. */
  finalLabel: string;
  /** Called when the last step's primary CTA is pressed. */
  onFinish: () => void;
  /** Called when Back is pressed on step 1. Omit to disable the button. */
  onExit?: () => void;
  /** Show the "Skip" ghost button on the last step. */
  allowSkip?: boolean;
}

const StepFlowContext = createContext<StepFlowConfig | null>(null);

export function StepFlowProvider({
  value,
  children,
}: {
  value: StepFlowConfig;
  children: ReactNode;
}) {
  return <StepFlowContext.Provider value={value}>{children}</StepFlowContext.Provider>;
}

const ONBOARDING_BASE = "/onboarding/step/$step";

export function useStepFlow() {
  const ctx = useContext(StepFlowContext);
  const navigate = useNavigate();
  const basePath = ctx?.basePath ?? ONBOARDING_BASE;

  const goStep = useCallback(
    (n: number) => {
      navigate({ to: basePath, params: { step: String(n) } } as never);
    },
    [navigate, basePath],
  );

  const finish = useCallback(() => {
    if (ctx?.onFinish) {
      ctx.onFinish();
      return;
    }
    navigate({ to: "/onboarding/loading" });
  }, [ctx, navigate]);

  return {
    basePath,
    goStep,
    finish,
    finalLabel: ctx?.finalLabel ?? "Find apartments",
    allowSkip: ctx ? ctx.allowSkip === true : true,
    exit: ctx?.onExit,
  };
}

/** Redirect to a step within the current flow (used when city is missing). */
export function StepRedirect({ step = 1 }: { step?: number }) {
  const { basePath } = useStepFlow();
  return <Navigate to={basePath as never} params={{ step: String(step) } as never} />;
}
