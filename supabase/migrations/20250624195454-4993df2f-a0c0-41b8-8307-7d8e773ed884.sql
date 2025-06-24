
-- Add user management permissions to your current user (johnjoni1374@gmail.com)
UPDATE public.user_permissions 
SET 
  settings_read = true,
  settings_write = true,
  updated_at = now()
WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE email = 'johnjoni1374@gmail.com'
);
