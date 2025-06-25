
-- Grant full admin permissions to johnjoni1374@gmail.com
UPDATE public.user_permissions 
SET 
  analytics_read = true,
  analytics_write = true,
  hero_read = true,
  hero_write = true,
  projects_read = true,
  projects_write = true,
  team_read = true,
  team_write = true,
  settings_read = true,
  settings_write = true,
  is_super_admin = true,
  updated_at = now()
WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE email = 'johnjoni1374@gmail.com'
);

-- Ensure the user exists in the user_permissions table (in case it doesn't)
INSERT INTO public.user_permissions (
  user_id,
  analytics_read,
  analytics_write,
  hero_read,
  hero_write,
  projects_read,
  projects_write,
  team_read,
  team_write,
  settings_read,
  settings_write,
  is_super_admin
)
SELECT 
  id,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true,
  true
FROM auth.users 
WHERE email = 'johnjoni1374@gmail.com'
AND id NOT IN (SELECT user_id FROM public.user_permissions);
