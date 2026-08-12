ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS deletion_cancel_subscription boolean DEFAULT true;