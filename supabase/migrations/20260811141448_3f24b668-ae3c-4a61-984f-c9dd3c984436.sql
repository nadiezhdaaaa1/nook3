DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'entitlement_state') THEN
    CREATE TYPE public.entitlement_state AS ENUM ('intro', 'pro', 'expired');
  END IF;
END $$;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS entitlement_state public.entitlement_state NOT NULL DEFAULT 'intro',
  ADD COLUMN IF NOT EXISTS matches_per_digest integer;

UPDATE public.profiles
   SET entitlement_state = CASE WHEN plan = 'free' THEN 'intro'::public.entitlement_state
                                ELSE 'pro'::public.entitlement_state END,
       matches_per_digest = CASE WHEN plan = 'free' THEN 3 ELSE NULL END;

-- Billing guard must also protect the new entitlement fields
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
       OR NEW.is_affiliate IS DISTINCT FROM OLD.is_affiliate THEN
      RAISE EXCEPTION 'Billing/plan fields can only be updated by the backend service role'
        USING ERRCODE = 'insufficient_privilege';
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;

-- Quota now derives from entitlement state: intro/expired = 1, pro = 3
CREATE OR REPLACE FUNCTION public.enforce_search_quota()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  user_state public.entitlement_state;
  active_count int;
  max_allowed int;
BEGIN
  IF NEW.status <> 'active' THEN RETURN NEW; END IF;
  IF TG_OP = 'UPDATE' AND OLD.status = 'active' THEN RETURN NEW; END IF;

  SELECT entitlement_state INTO user_state FROM public.profiles WHERE id = NEW.user_id;
  IF user_state IS NULL THEN user_state := 'intro'; END IF;
  max_allowed := CASE user_state WHEN 'pro' THEN 3 ELSE 1 END;

  SELECT count(*) INTO active_count FROM public.searches
    WHERE user_id = NEW.user_id AND status = 'active' AND id <> NEW.id;

  IF active_count + 1 > max_allowed THEN
    RAISE EXCEPTION 'Plan quota exceeded: % active searches allowed on % plan', max_allowed, user_state
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END $function$;

-- Keep entitlement state in sync with plan changes
CREATE OR REPLACE FUNCTION public.admin_set_plan(_user_id uuid, _plan app_plan, _billing_cycle billing_cycle DEFAULT NULL::billing_cycle)
 RETURNS SETOF profiles
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
         entitlement_state = CASE WHEN _plan = 'free' THEN 'intro'::public.entitlement_state
                                  ELSE 'pro'::public.entitlement_state END,
         matches_per_digest = CASE WHEN _plan = 'free' THEN 3 ELSE NULL END,
         trial_active     = CASE WHEN _plan = 'free' THEN false ELSE p.trial_active END,
         trial_started_at = CASE WHEN _plan = 'free' THEN NULL  ELSE p.trial_started_at END,
         trial_ends_at    = CASE WHEN _plan = 'free' THEN NULL  ELSE p.trial_ends_at END
   WHERE p.id = _user_id;

  PERFORM set_config('app.bypass_billing_guard', 'off', true);

  RETURN QUERY SELECT * FROM public.profiles WHERE id = _user_id;
END;
$function$;