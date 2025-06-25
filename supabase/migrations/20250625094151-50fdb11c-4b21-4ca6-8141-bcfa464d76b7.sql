
-- Drop ALL existing policies on user_permissions table
DROP POLICY IF EXISTS "Users can view their own permissions" ON public.user_permissions;
DROP POLICY IF EXISTS "Super admins can view all permissions" ON public.user_permissions;
DROP POLICY IF EXISTS "Super admins can modify permissions" ON public.user_permissions;
DROP POLICY IF EXISTS "Super admins can insert permissions" ON public.user_permissions;
DROP POLICY IF EXISTS "Super admins can update permissions" ON public.user_permissions;
DROP POLICY IF EXISTS "Super admins can delete permissions" ON public.user_permissions;

-- Create a security definer function to check if current user is super admin
-- This prevents infinite recursion by bypassing RLS when checking permissions
CREATE OR REPLACE FUNCTION public.is_current_user_super_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT COALESCE(
    (SELECT is_super_admin 
     FROM public.user_permissions 
     WHERE user_id = auth.uid() 
     LIMIT 1), 
    false
  );
$$;

-- Create new RLS policies using the security definer function
CREATE POLICY "Users can view their own permissions" 
  ON public.user_permissions 
  FOR SELECT 
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Super admins can view all permissions" 
  ON public.user_permissions 
  FOR SELECT 
  TO authenticated
  USING (public.is_current_user_super_admin());

CREATE POLICY "Super admins can insert permissions" 
  ON public.user_permissions 
  FOR INSERT 
  TO authenticated
  WITH CHECK (public.is_current_user_super_admin());

CREATE POLICY "Super admins can update permissions" 
  ON public.user_permissions 
  FOR UPDATE 
  TO authenticated
  USING (public.is_current_user_super_admin());

CREATE POLICY "Super admins can delete permissions" 
  ON public.user_permissions 
  FOR DELETE 
  TO authenticated
  USING (public.is_current_user_super_admin());
