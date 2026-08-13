ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS has_ever_subscribed boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS dev_no_credentials boolean NOT NULL DEFAULT false;

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
       OR NEW.has_ever_subscribed IS DISTINCT FROM OLD.has_ever_subscribed
       OR NEW.dev_no_credentials IS DISTINCT FROM OLD.dev_no_credentials
       OR NEW.is_affiliate IS DISTINCT FROM OLD.is_affiliate THEN
      RAISE EXCEPTION 'Billing/plan fields can only be updated by the backend service role'
        USING ERRCODE = 'insufficient_privilege';
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.dev_set_account_state(
  _user_id uuid,
  _plan app_plan DEFAULT NULL,
  _billing_cycle billing_cycle DEFAULT NULL,
  _status app_subscription_status DEFAULT NULL,
  _past_due_since timestamptz DEFAULT NULL,
  _clear_past_due boolean DEFAULT false,
  _onboarded boolean DEFAULT NULL,
  _has_ever_subscribed boolean DEFAULT NULL,
  _no_credentials boolean DEFAULT NULL
)
 RETURNS SETOF public.profiles
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'user id is required';
  END IF;

  PERFORM set_config('app.bypass_billing_guard', 'on', true);

  UPDATE public.profiles p
     SET plan = COALESCE(_plan, p.plan),
         billing_cycle = COALESCE(_billing_cycle, p.billing_cycle),
         subscription_status = COALESCE(_status, p.subscription_status),
         entitlement_state = CASE
           WHEN COALESCE(_plan, p.plan) = 'intro' THEN 'intro'::public.entitlement_state
           ELSE 'pro'::public.entitlement_state END,
         matches_per_digest = CASE
           WHEN COALESCE(_plan, p.plan) = 'intro' THEN 3 ELSE NULL END,
         past_due_since = CASE
           WHEN _clear_past_due THEN NULL
           WHEN _past_due_since IS NOT NULL THEN _past_due_since
           ELSE p.past_due_since END,
         completed_at = CASE
           WHEN _onboarded IS NULL THEN p.completed_at
           WHEN _onboarded THEN COALESCE(p.completed_at, now())
           ELSE NULL END,
         has_ever_subscribed = COALESCE(_has_ever_subscribed, p.has_ever_subscribed),
         dev_no_credentials = COALESCE(_no_credentials, p.dev_no_credentials)
   WHERE p.id = _user_id;

  PERFORM set_config('app.bypass_billing_guard', 'off', true);

  RETURN QUERY SELECT * FROM public.profiles WHERE id = _user_id;
END;
$function$;

REVOKE ALL ON FUNCTION public.dev_set_account_state(uuid, app_plan, billing_cycle, app_subscription_status, timestamptz, boolean, boolean, boolean, boolean) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.dev_set_account_state(uuid, app_plan, billing_cycle, app_subscription_status, timestamptz, boolean, boolean, boolean, boolean) TO service_role;