-- 1) Subscription status enum + columns
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_subscription_status') THEN
    CREATE TYPE public.app_subscription_status AS ENUM ('none','trialing','active','past_due','canceled');
  END IF;
END $$;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS subscription_status public.app_subscription_status NOT NULL DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS past_due_since timestamptz;

UPDATE public.profiles
   SET subscription_status = CASE
         WHEN plan::text IN ('premium','max') THEN 'active'::public.app_subscription_status
         WHEN trial_active THEN 'trialing'::public.app_subscription_status
         ELSE 'none'::public.app_subscription_status
       END;

-- 2) Backfill onboarding completion for accounts that already own a search
UPDATE public.profiles p
   SET completed_at = COALESCE(p.completed_at, p.created_at)
 WHERE EXISTS (SELECT 1 FROM public.searches s WHERE s.user_id = p.id);

-- 3) Swap the plan enum: free|premium|max -> intro|pro
CREATE TYPE public.app_plan_v2 AS ENUM ('intro','pro');

ALTER TABLE public.profiles ALTER COLUMN plan DROP DEFAULT;
ALTER TABLE public.profiles
  ALTER COLUMN plan TYPE public.app_plan_v2
  USING (CASE plan::text WHEN 'free' THEN 'intro' ELSE 'pro' END)::public.app_plan_v2;
ALTER TABLE public.profiles ALTER COLUMN plan SET DEFAULT 'intro'::public.app_plan_v2;

DROP FUNCTION IF EXISTS public.admin_set_plan(uuid, public.app_plan, public.billing_cycle);
DROP TYPE public.app_plan;
ALTER TYPE public.app_plan_v2 RENAME TO app_plan;

-- 4) Rebuild admin_set_plan against the new enum
CREATE OR REPLACE FUNCTION public.admin_set_plan(
  _user_id uuid,
  _plan public.app_plan,
  _billing_cycle public.billing_cycle DEFAULT NULL::public.billing_cycle,
  _subscription_status public.app_subscription_status DEFAULT NULL::public.app_subscription_status
)
RETURNS SETOF public.profiles
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF _user_id IS NULL OR _plan IS NULL THEN
    RAISE EXCEPTION 'user id and plan are required';
  END IF;

  PERFORM set_config('app.bypass_billing_guard', 'on', true);

  UPDATE public.profiles p
     SET plan = _plan,
         billing_cycle = COALESCE(_billing_cycle, p.billing_cycle),
         subscription_status = COALESCE(
           _subscription_status,
           CASE WHEN _plan = 'intro' THEN 'trialing'::public.app_subscription_status
                ELSE 'active'::public.app_subscription_status END),
         past_due_since = NULL,
         -- deprecated mirror, kept in sync until quota derives from plan
         entitlement_state = CASE WHEN _plan = 'intro' THEN 'intro'::public.entitlement_state
                                  ELSE 'pro'::public.entitlement_state END,
         matches_per_digest = CASE WHEN _plan = 'intro' THEN 3 ELSE NULL END,
         trial_active     = CASE WHEN _plan = 'intro' THEN p.trial_active ELSE p.trial_active END,
         trial_started_at = p.trial_started_at,
         trial_ends_at    = p.trial_ends_at
   WHERE p.id = _user_id;

  PERFORM set_config('app.bypass_billing_guard', 'off', true);

  RETURN QUERY SELECT * FROM public.profiles WHERE id = _user_id;
END;
$function$;

REVOKE ALL ON FUNCTION public.admin_set_plan(uuid, public.app_plan, public.billing_cycle, public.app_subscription_status) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_set_plan(uuid, public.app_plan, public.billing_cycle, public.app_subscription_status) FROM anon;
REVOKE ALL ON FUNCTION public.admin_set_plan(uuid, public.app_plan, public.billing_cycle, public.app_subscription_status) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.admin_set_plan(uuid, public.app_plan, public.billing_cycle, public.app_subscription_status) TO service_role;

-- 5) Service-role-only helper to expire a past_due subscription (self-healing)
CREATE OR REPLACE FUNCTION public.admin_expire_past_due(_user_id uuid)
RETURNS SETOF public.profiles
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  PERFORM set_config('app.bypass_billing_guard', 'on', true);

  UPDATE public.profiles
     SET subscription_status = 'canceled'::public.app_subscription_status
   WHERE id = _user_id
     AND subscription_status = 'past_due'
     AND past_due_since IS NOT NULL
     AND past_due_since < now() - interval '7 days';

  PERFORM set_config('app.bypass_billing_guard', 'off', true);

  RETURN QUERY SELECT * FROM public.profiles WHERE id = _user_id;
END;
$function$;

REVOKE ALL ON FUNCTION public.admin_expire_past_due(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_expire_past_due(uuid) FROM anon;
REVOKE ALL ON FUNCTION public.admin_expire_past_due(uuid) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.admin_expire_past_due(uuid) TO service_role;

-- 6) Guard trigger: protect the new billing columns from self-service writes
CREATE OR REPLACE FUNCTION public.prevent_billing_field_self_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF current_setting('app.bypass_billing_guard', true) = 'on' THEN
    RETURN NEW;
  END IF;

  IF current_setting('request.jwt.claim.role', true) IS DISTINCT FROM 'service_role' THEN
    IF NEW.plan IS DISTINCT FROM OLD.plan
       OR NEW.billing_cycle IS DISTINCT FROM OLD.billing_cycle
       OR NEW.trial_active IS DISTINCT FROM OLD.trial_active
       OR NEW.trial_started_at IS DISTINCT FROM OLD.trial_started_at
       OR NEW.trial_ends_at IS DISTINCT FROM OLD.trial_ends_at
       OR NEW.entitlement_state IS DISTINCT FROM OLD.entitlement_state
       OR NEW.matches_per_digest IS DISTINCT FROM OLD.matches_per_digest
       OR NEW.subscription_status IS DISTINCT FROM OLD.subscription_status
       OR NEW.past_due_since IS DISTINCT FROM OLD.past_due_since
       OR NEW.is_affiliate IS DISTINCT FROM OLD.is_affiliate THEN
      RAISE EXCEPTION 'Billing/plan fields can only be updated by the backend service role'
        USING ERRCODE = 'insufficient_privilege';
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;

-- 7) Mark the legacy column deprecated
COMMENT ON COLUMN public.profiles.entitlement_state IS
  'DEPRECATED: legacy mirror of plan, still synced by admin_set_plan and read by enforce_search_quota. Quota should later derive from plan + subscription_status; drop this column then.';
COMMENT ON COLUMN public.profiles.subscription_status IS
  'Whether the subscription is paid for. trialing/active grant access; past_due grants access for 7 days from past_due_since; none/canceled do not.';