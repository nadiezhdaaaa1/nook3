CREATE TABLE public.listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id text NOT NULL,
  slug text NOT NULL UNIQUE,
  address text NOT NULL,
  rent integer NOT NULL,
  beds integer NOT NULL DEFAULT 1,
  baths numeric NOT NULL DEFAULT 1,
  neighborhood text NOT NULL DEFAULT '',
  below_median_pct integer,
  tag text,
  building_note text,
  image text NOT NULL DEFAULT '',
  url text,
  lat double precision,
  lng double precision,
  amenities jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.listings TO anon;
GRANT SELECT ON public.listings TO authenticated;
GRANT ALL ON public.listings TO service_role;

ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "listings_select_active_public"
  ON public.listings FOR SELECT
  TO anon, authenticated
  USING (status = 'active');

CREATE INDEX listings_city_rent_idx ON public.listings (city_id, rent);
CREATE INDEX listings_city_beds_idx ON public.listings (city_id, beds);
CREATE INDEX listings_city_hood_idx ON public.listings (city_id, neighborhood);

CREATE TRIGGER listings_updated_at
  BEFORE UPDATE ON public.listings
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();