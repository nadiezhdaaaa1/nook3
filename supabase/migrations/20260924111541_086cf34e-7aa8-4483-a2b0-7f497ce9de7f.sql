DROP FUNCTION IF EXISTS public.admin_expire_past_due(uuid);

COMMENT ON COLUMN public.profiles.subscription_status IS
  'Whether the subscription currently receives new matches. Only trialing and active receive new matches; none and canceled browse existing frozen data. The legacy past_due enum value is retained for compatibility but is treated as canceled by the application.';

COMMENT ON COLUMN public.profiles.past_due_since IS
  'Historical payment-failure marker used to distinguish payment-failure cancellation from voluntary cancellation.';