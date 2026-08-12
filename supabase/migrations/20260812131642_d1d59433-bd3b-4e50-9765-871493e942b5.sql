-- Backfill missing profile rows for existing accounts
INSERT INTO public.profiles (id, email, email_verified, email_verified_at, has_password)
SELECT u.id,
       COALESCE(u.email, ''),
       u.email_confirmed_at IS NOT NULL,
       u.email_confirmed_at,
       u.encrypted_password IS NOT NULL AND u.encrypted_password <> ''
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL;

-- Sync has_password for accounts that already set a password in auth
UPDATE public.profiles p
SET has_password = true
FROM auth.users u
WHERE u.id = p.id
  AND p.has_password = false
  AND u.encrypted_password IS NOT NULL
  AND u.encrypted_password <> '';
