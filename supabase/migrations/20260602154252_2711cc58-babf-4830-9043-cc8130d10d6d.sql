CREATE TABLE public.waitlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  city TEXT,
  requested_city TEXT,
  move_in_timeframe TEXT,
  budget_max INTEGER,
  source TEXT NOT NULL DEFAULT 'landing',
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_waitlist_email ON public.waitlist(email);
CREATE INDEX idx_waitlist_city ON public.waitlist(city);

GRANT INSERT ON public.waitlist TO anon, authenticated;
GRANT ALL ON public.waitlist TO service_role;

ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Anyone can sign up for the waitlist (anonymous form on landing)
CREATE POLICY "waitlist_insert_public"
ON public.waitlist
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- No SELECT/UPDATE/DELETE policies — only service_role can read/manage entries.