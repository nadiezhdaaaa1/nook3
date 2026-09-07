ALTER TABLE public.listings
  ADD COLUMN IF NOT EXISTS property_type text NOT NULL DEFAULT 'apartment',
  ADD COLUMN IF NOT EXISTS sqft integer,
  ADD COLUMN IF NOT EXISTS street text,
  ADD COLUMN IF NOT EXISTS unit text,
  ADD COLUMN IF NOT EXISTS addr_city text,
  ADD COLUMN IF NOT EXISTS state text,
  ADD COLUMN IF NOT EXISTS zip text,
  ADD COLUMN IF NOT EXISTS listed_at timestamptz,
  ADD COLUMN IF NOT EXISTS provider text;

ALTER TABLE public.listings ALTER COLUMN baths DROP NOT NULL;
ALTER TABLE public.listings ALTER COLUMN image DROP NOT NULL;

ALTER TABLE public.listings
  DROP CONSTRAINT IF EXISTS listings_property_type_check;
ALTER TABLE public.listings
  ADD CONSTRAINT listings_property_type_check
  CHECK (property_type IN ('apartment', 'condo', 'house', 'townhouse'));

-- Deterministic per-row pseudo-random value from the slug
WITH h AS (
  SELECT id,
         ('x' || substr(md5(slug), 1, 8))::bit(32)::bigint AS n
  FROM public.listings
)
UPDATE public.listings l
SET
  street = trim(split_part(l.address, '#', 1)),
  unit = NULLIF(trim(split_part(l.address, '#', 2)), ''),
  addr_city = CASE l.city_id
    WHEN 'nyc' THEN 'New York'
    WHEN 'la' THEN 'Los Angeles'
    WHEN 'sf-bay' THEN 'San Francisco'
    WHEN 'chicago' THEN 'Chicago'
    WHEN 'boston' THEN 'Boston'
    WHEN 'austin' THEN 'Austin'
    WHEN 'miami' THEN 'Miami'
    WHEN 'seattle' THEN 'Seattle'
    WHEN 'dc' THEN 'Washington'
    WHEN 'philadelphia' THEN 'Philadelphia'
    ELSE initcap(l.city_id) END,
  state = CASE l.city_id
    WHEN 'nyc' THEN 'NY'
    WHEN 'la' THEN 'CA'
    WHEN 'sf-bay' THEN 'CA'
    WHEN 'chicago' THEN 'IL'
    WHEN 'boston' THEN 'MA'
    WHEN 'austin' THEN 'TX'
    WHEN 'miami' THEN 'FL'
    WHEN 'seattle' THEN 'WA'
    WHEN 'dc' THEN 'DC'
    WHEN 'philadelphia' THEN 'PA'
    ELSE 'NY' END,
  -- plausible ZIP: per-city base + stable offset from the neighborhood name
  zip = lpad((
    (CASE l.city_id
       WHEN 'nyc' THEN 10001
       WHEN 'la' THEN 90001
       WHEN 'sf-bay' THEN 94101
       WHEN 'chicago' THEN 60601
       WHEN 'boston' THEN 2108
       WHEN 'austin' THEN 78701
       WHEN 'miami' THEN 33101
       WHEN 'seattle' THEN 98101
       WHEN 'dc' THEN 20001
       WHEN 'philadelphia' THEN 19101
       ELSE 10001 END)
    + (('x' || substr(md5(l.neighborhood), 1, 6))::bit(24)::bigint % 60)
  )::text, 5, '0'),
  property_type = CASE
    WHEN h.n % 100 < 62 THEN 'apartment'
    WHEN h.n % 100 < 80 THEN 'condo'
    WHEN h.n % 100 < 92 THEN 'townhouse'
    ELSE 'house' END,
  sqft = CASE
    WHEN h.n % 10 = 0 THEN NULL
    ELSE 380 + l.beds * 260 + ((h.n / 7) % 220)::int
  END,
  baths = CASE WHEN h.n % 97 = 0 THEN NULL ELSE l.baths END,
  image = CASE WHEN h.n % 89 = 0 THEN NULL ELSE l.image END,
  listed_at = now() - make_interval(hours => 3 + ((h.n / 3) % 717)::int),
  provider = CASE
    WHEN h.n % 5 = 0 THEN 'rentcast'
    WHEN l.city_id = 'nyc' AND h.n % 5 = 1 THEN 'streeteasy'
    ELSE 'apartments.com' END,
  url = CASE WHEN h.n % 5 = 0 THEN NULL ELSE l.url END
FROM h
WHERE h.id = l.id;

ALTER TABLE public.listings ALTER COLUMN provider SET DEFAULT 'apartments.com';