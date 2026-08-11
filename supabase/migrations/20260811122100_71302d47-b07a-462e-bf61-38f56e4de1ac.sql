CREATE OR REPLACE FUNCTION public.enforce_search_quota()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  user_plan public.app_plan;
  active_count int;
  max_allowed int;
BEGIN
  -- Only 'active' searches consume quota (paused/archived do not).
  IF NEW.status <> 'active' THEN RETURN NEW; END IF;
  -- Unchanged status on update: nothing new is being consumed.
  IF TG_OP = 'UPDATE' AND OLD.status = 'active' THEN RETURN NEW; END IF;

  SELECT plan INTO user_plan FROM public.profiles WHERE id = NEW.user_id;
  IF user_plan IS NULL THEN user_plan := 'free'; END IF;
  max_allowed := CASE user_plan WHEN 'free' THEN 1 WHEN 'premium' THEN 3 ELSE 2147483647 END;

  SELECT count(*) INTO active_count FROM public.searches
    WHERE user_id = NEW.user_id AND status = 'active' AND id <> NEW.id;

  IF active_count + 1 > max_allowed THEN
    RAISE EXCEPTION 'Plan quota exceeded: % active searches allowed on % plan', max_allowed, user_plan
      USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END $$;

REVOKE EXECUTE ON FUNCTION public.enforce_search_quota() FROM PUBLIC, anon, authenticated;