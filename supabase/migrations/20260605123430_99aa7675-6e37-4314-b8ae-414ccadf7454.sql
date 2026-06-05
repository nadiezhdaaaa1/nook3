
-- =====================================================================
-- 1. SCHEMA CHANGES
-- =====================================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_profiles_referred_by ON public.profiles(referred_by) WHERE referred_by IS NOT NULL;

ALTER TABLE public.referrals
  ADD COLUMN IF NOT EXISTS ip_hash TEXT,
  ADD COLUMN IF NOT EXISTS friend_credited_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS credited_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS UNIQUE_pair INT; -- placeholder, real unique below

-- ensure a referred user only ever has ONE referral row
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'referrals_referred_user_unique'
  ) THEN
    ALTER TABLE public.referrals
      ADD CONSTRAINT referrals_referred_user_unique UNIQUE (referred_user_id);
  END IF;
END $$;

ALTER TABLE public.referrals DROP COLUMN IF EXISTS UNIQUE_pair;

-- =====================================================================
-- 2. NEW TABLES
-- =====================================================================

-- Disposable / blocked email domains
CREATE TABLE IF NOT EXISTS public.blocked_email_domains (
  domain TEXT PRIMARY KEY,
  reason TEXT NOT NULL DEFAULT 'disposable',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.blocked_email_domains TO authenticated;
GRANT ALL    ON public.blocked_email_domains TO service_role;
ALTER TABLE public.blocked_email_domains ENABLE ROW LEVEL SECURITY;
-- read-only reference data; admins manage via service_role
CREATE POLICY "Anyone authenticated can read blocked domains"
  ON public.blocked_email_domains FOR SELECT TO authenticated USING (true);

-- Audit / analytics journal
CREATE TABLE IF NOT EXISTS public.referral_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  code TEXT,
  referrer_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  referred_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ip_hash TEXT,
  user_agent TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.referral_events TO authenticated;
GRANT ALL ON public.referral_events TO service_role;
ALTER TABLE public.referral_events ENABLE ROW LEVEL SECURITY;
-- Only service_role writes; users may see own events
CREATE POLICY "Users can read own referral events"
  ON public.referral_events FOR SELECT TO authenticated
  USING (referrer_user_id = auth.uid() OR referred_user_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_referral_events_referrer ON public.referral_events(referrer_user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_referral_events_code     ON public.referral_events(code, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_referral_events_ip       ON public.referral_events(ip_hash, created_at DESC);

-- Outbound notification queue (consumed by mailer in next phase)
CREATE TABLE IF NOT EXISTS public.referral_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kind TEXT NOT NULL CHECK (kind IN ('friend_joined','referrer_credited','week_active','milestone_4')),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','sent','failed','skipped')),
  attempts INT NOT NULL DEFAULT 0,
  sent_at TIMESTAMPTZ,
  last_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT ALL ON public.referral_notifications TO service_role;
ALTER TABLE public.referral_notifications ENABLE ROW LEVEL SECURITY;
-- no policies: service_role only

CREATE TRIGGER referral_notifications_set_updated_at
BEFORE UPDATE ON public.referral_notifications
FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE INDEX IF NOT EXISTS idx_referral_notifications_pending
  ON public.referral_notifications(created_at) WHERE status = 'pending';

-- =====================================================================
-- 3. SEED disposable domain list
-- =====================================================================

INSERT INTO public.blocked_email_domains(domain) VALUES
  ('mailinator.com'),('guerrillamail.com'),('guerrillamail.net'),('guerrillamail.org'),
  ('sharklasers.com'),('grr.la'),('trashmail.com'),('trashmail.net'),
  ('yopmail.com'),('yopmail.net'),('yopmail.fr'),
  ('10minutemail.com'),('10minutemail.net'),('temp-mail.org'),('tempmail.com'),
  ('tempmailo.com'),('tempr.email'),('throwawaymail.com'),('maildrop.cc'),
  ('getnada.com'),('inboxbear.com'),('emailondeck.com'),('moakt.com'),
  ('fakeinbox.com'),('mintemail.com'),('mailcatch.com'),('mohmal.com'),
  ('spamgourmet.com'),('dispostable.com'),('mytemp.email'),('fakemailgenerator.com'),
  ('mvrht.net'),('mt2014.com'),('mt2015.com'),('mailsac.com'),('emltmp.com')
ON CONFLICT (domain) DO NOTHING;

-- =====================================================================
-- 4. BILLING GUARD — allow internal trusted reward operations
-- =====================================================================

CREATE OR REPLACE FUNCTION public.prevent_billing_field_self_update()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Internal trusted code paths (referral credit, admin jobs) set this session GUC.
  IF current_setting('app.bypass_billing_guard', true) = 'on' THEN
    RETURN NEW;
  END IF;

  IF current_setting('request.jwt.claim.role', true) IS DISTINCT FROM 'service_role' THEN
    IF NEW.plan IS DISTINCT FROM OLD.plan
       OR NEW.billing_cycle IS DISTINCT FROM OLD.billing_cycle
       OR NEW.trial_active IS DISTINCT FROM OLD.trial_active
       OR NEW.trial_started_at IS DISTINCT FROM OLD.trial_started_at
       OR NEW.trial_ends_at IS DISTINCT FROM OLD.trial_ends_at
       OR NEW.is_affiliate IS DISTINCT FROM OLD.is_affiliate THEN
      RAISE EXCEPTION 'Billing/plan fields can only be updated by the backend service role'
        USING ERRCODE = 'insufficient_privilege';
    END IF;
  END IF;
  RETURN NEW;
END;
$function$;

-- =====================================================================
-- 5. HELPERS
-- =====================================================================

-- Extend trial by N days for a user. Sets trial_active and pushes trial_ends_at.
CREATE OR REPLACE FUNCTION public.grant_trial_extension(_user_id UUID, _days INT, _source TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  base TIMESTAMPTZ;
BEGIN
  IF _user_id IS NULL OR _days IS NULL OR _days <= 0 THEN RETURN; END IF;

  PERFORM set_config('app.bypass_billing_guard', 'on', true);

  SELECT GREATEST(COALESCE(trial_ends_at, now()), now()) INTO base
  FROM public.profiles WHERE id = _user_id;

  UPDATE public.profiles
  SET trial_active     = true,
      trial_started_at = COALESCE(trial_started_at, now()),
      trial_ends_at    = base + make_interval(days => _days)
  WHERE id = _user_id;

  PERFORM set_config('app.bypass_billing_guard', 'off', true);
END;
$$;

REVOKE ALL ON FUNCTION public.grant_trial_extension(UUID, INT, TEXT) FROM PUBLIC, anon, authenticated;

-- =====================================================================
-- 6. REPLACE handle_new_user — capture referral_code + anti-fraud
-- =====================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  _ref_code         TEXT;
  _ref_ip_hash      TEXT;
  _referrer         RECORD;
  _email_domain     TEXT;
  _is_blocked       BOOLEAN := false;
  _is_self          BOOLEAN := false;
  _referrals_30d    INT := 0;
  _ip_referrals_30d INT := 0;
  _profile_id       UUID := NEW.id;
  _final_ref_by     UUID := NULL;
BEGIN
  -- 1. Extract metadata
  _ref_code    := NULLIF(upper(trim(COALESCE(NEW.raw_user_meta_data->>'referral_code', ''))), '');
  _ref_ip_hash := NULLIF(trim(COALESCE(NEW.raw_user_meta_data->>'referral_ip_hash', '')), '');
  _email_domain := lower(split_part(COALESCE(NEW.email, ''), '@', 2));

  -- 2. Disposable email check
  IF _email_domain <> '' AND EXISTS (
    SELECT 1 FROM public.blocked_email_domains WHERE domain = _email_domain
  ) THEN
    _is_blocked := true;
  END IF;

  -- 3. Referrer lookup (if a code was provided AND email is not disposable)
  IF _ref_code IS NOT NULL AND NOT _is_blocked THEN
    SELECT p.id, p.email INTO _referrer
    FROM public.profiles p WHERE p.referral_code = _ref_code LIMIT 1;

    IF _referrer.id IS NOT NULL THEN
      -- self-referral by email
      IF lower(_referrer.email) = lower(COALESCE(NEW.email, '')) THEN
        _is_self := true;
      END IF;

      IF NOT _is_self THEN
        -- cap: max 50 referred accounts per referrer / rolling 30 days
        SELECT count(*) INTO _referrals_30d
        FROM public.referrals
        WHERE referrer_user_id = _referrer.id
          AND created_at >= now() - interval '30 days';

        -- cap: max 3 signups per IP / rolling 30 days
        IF _ref_ip_hash IS NOT NULL THEN
          SELECT count(*) INTO _ip_referrals_30d
          FROM public.referrals
          WHERE ip_hash = _ref_ip_hash
            AND created_at >= now() - interval '30 days';
        END IF;

        IF _referrals_30d < 50 AND _ip_referrals_30d < 3 THEN
          _final_ref_by := _referrer.id;
        END IF;
      END IF;
    END IF;
  END IF;

  -- 4. Insert profile (referred_by only set if all checks pass)
  INSERT INTO public.profiles (id, email, email_verified, phone, referred_by, email_verified_at)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    (NEW.email_confirmed_at IS NOT NULL),
    COALESCE(NEW.phone, ''),
    _final_ref_by,
    CASE WHEN NEW.email_confirmed_at IS NOT NULL THEN NEW.email_confirmed_at ELSE NULL END
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user')
  ON CONFLICT DO NOTHING;

  -- 5. Referral side-effects
  IF _final_ref_by IS NOT NULL THEN
    INSERT INTO public.referrals (referrer_user_id, referred_user_id, reward_status, ip_hash)
    VALUES (_final_ref_by, _profile_id, 'pending', _ref_ip_hash)
    ON CONFLICT (referred_user_id) DO NOTHING;

    -- Friend gets +7 days immediately
    PERFORM public.grant_trial_extension(_profile_id, 7, 'referral_signup');
    UPDATE public.referrals
       SET friend_credited_at = now()
     WHERE referred_user_id = _profile_id;

    INSERT INTO public.referral_events(event_type, code, referrer_user_id, referred_user_id, ip_hash, metadata)
    VALUES ('signup_completed', _ref_code, _final_ref_by, _profile_id, _ref_ip_hash, '{}'::jsonb);

    -- enqueue "friend_joined" email to referrer
    INSERT INTO public.referral_notifications (kind, user_id, payload)
    VALUES ('friend_joined', _final_ref_by,
            jsonb_build_object('referred_user_id', _profile_id, 'awaiting_verification', true));
  ELSIF _ref_code IS NOT NULL THEN
    -- log why it was rejected
    INSERT INTO public.referral_events(event_type, code, referred_user_id, ip_hash, metadata)
    VALUES (
      CASE
        WHEN _is_blocked THEN 'blocked_disposable'
        WHEN _is_self    THEN 'blocked_self_referral'
        WHEN _referrer.id IS NULL THEN 'invalid_code'
        ELSE 'blocked_cap'
      END,
      _ref_code, _profile_id, _ref_ip_hash,
      jsonb_build_object(
        'referrer_30d', _referrals_30d,
        'ip_30d',       _ip_referrals_30d,
        'email_domain', _email_domain
      )
    );
  END IF;

  RETURN NEW;
END $function$;

-- =====================================================================
-- 7. NEW TRIGGER — credit referrer once friend verifies email
-- =====================================================================

CREATE OR REPLACE FUNCTION public.handle_email_verified()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  _ref_row RECORD;
BEGIN
  -- Only fire on false→true transitions of email confirmation
  IF NEW.email_confirmed_at IS NULL THEN RETURN NEW; END IF;
  IF OLD.email_confirmed_at IS NOT NULL THEN RETURN NEW; END IF;

  -- Sync profile flag + timestamp
  PERFORM set_config('app.bypass_billing_guard', 'on', true);
  UPDATE public.profiles
     SET email_verified = true,
         email_verified_at = COALESCE(email_verified_at, NEW.email_confirmed_at)
   WHERE id = NEW.id;
  PERFORM set_config('app.bypass_billing_guard', 'off', true);

  -- Credit referrer if pending
  SELECT * INTO _ref_row
  FROM public.referrals
  WHERE referred_user_id = NEW.id
    AND reward_status = 'pending'
  LIMIT 1;

  IF _ref_row.id IS NOT NULL THEN
    PERFORM public.grant_trial_extension(_ref_row.referrer_user_id, 7, 'referral_verified');

    UPDATE public.referrals
       SET reward_status = 'granted',
           credited_at   = now()
     WHERE id = _ref_row.id;

    INSERT INTO public.referral_events(event_type, referrer_user_id, referred_user_id, metadata)
    VALUES ('referrer_credited', _ref_row.referrer_user_id, NEW.id,
            jsonb_build_object('days', 7));

    -- enqueue "referrer_credited" email
    INSERT INTO public.referral_notifications (kind, user_id, payload)
    VALUES ('referrer_credited', _ref_row.referrer_user_id,
            jsonb_build_object('referred_user_id', NEW.id, 'days', 7));

    -- milestone check: 4 verified friends → enqueue milestone email
    IF (SELECT count(*) FROM public.referrals
        WHERE referrer_user_id = _ref_row.referrer_user_id
          AND reward_status = 'granted') = 4 THEN
      INSERT INTO public.referral_notifications (kind, user_id, payload)
      VALUES ('milestone_4', _ref_row.referrer_user_id,
              jsonb_build_object('verified_count', 4, 'bonus_days', 30));

      PERFORM public.grant_trial_extension(_ref_row.referrer_user_id, 30, 'referral_milestone_4');

      INSERT INTO public.referral_events(event_type, referrer_user_id, metadata)
      VALUES ('milestone_reached', _ref_row.referrer_user_id,
              jsonb_build_object('milestone', 4, 'bonus_days', 30));
    END IF;
  END IF;

  RETURN NEW;
END $function$;

DROP TRIGGER IF EXISTS on_auth_user_email_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_email_confirmed
AFTER UPDATE OF email_confirmed_at ON auth.users
FOR EACH ROW
WHEN (OLD.email_confirmed_at IS DISTINCT FROM NEW.email_confirmed_at)
EXECUTE FUNCTION public.handle_email_verified();
