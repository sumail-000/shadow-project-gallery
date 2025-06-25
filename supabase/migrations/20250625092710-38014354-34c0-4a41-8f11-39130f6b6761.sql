
-- First, let's drop the existing problematic policies
DROP POLICY IF EXISTS "Super admins can modify permissions" ON public.user_permissions;
DROP POLICY IF EXISTS "Super admins can view all permissions" ON public.user_permissions;

-- Create better policies that handle upsert operations correctly
CREATE POLICY "Super admins can view all permissions" 
  ON public.user_permissions 
  FOR SELECT 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_permissions 
      WHERE user_id = auth.uid() AND is_super_admin = true
    )
  );

CREATE POLICY "Super admins can insert permissions" 
  ON public.user_permissions 
  FOR INSERT 
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_permissions 
      WHERE user_id = auth.uid() AND is_super_admin = true
    )
  );

CREATE POLICY "Super admins can update permissions" 
  ON public.user_permissions 
  FOR UPDATE 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_permissions 
      WHERE user_id = auth.uid() AND is_super_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_permissions 
      WHERE user_id = auth.uid() AND is_super_admin = true
    )
  );

CREATE POLICY "Super admins can delete permissions" 
  ON public.user_permissions 
  FOR DELETE 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_permissions 
      WHERE user_id = auth.uid() AND is_super_admin = true
    )
  );
