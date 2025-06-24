
-- Create admin_settings table
CREATE TABLE public.admin_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  description TEXT
);

-- Create user_permissions table
CREATE TABLE public.user_permissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  analytics_read BOOLEAN NOT NULL DEFAULT true,
  analytics_write BOOLEAN NOT NULL DEFAULT false,
  hero_read BOOLEAN NOT NULL DEFAULT true,
  hero_write BOOLEAN NOT NULL DEFAULT false,
  projects_read BOOLEAN NOT NULL DEFAULT true,
  projects_write BOOLEAN NOT NULL DEFAULT false,
  team_read BOOLEAN NOT NULL DEFAULT true,
  team_write BOOLEAN NOT NULL DEFAULT false,
  settings_read BOOLEAN NOT NULL DEFAULT false,
  settings_write BOOLEAN NOT NULL DEFAULT false,
  is_super_admin BOOLEAN NOT NULL DEFAULT false,
  UNIQUE(user_id)
);

-- Create admin_users table for additional user management
CREATE TABLE public.admin_users_extended (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'viewer',
  last_login TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Enable RLS
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users_extended ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin_settings
CREATE POLICY "Authenticated users can view admin settings" 
  ON public.admin_settings 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Only super admins can modify admin settings" 
  ON public.admin_settings 
  FOR ALL 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_permissions 
      WHERE user_id = auth.uid() AND is_super_admin = true
    )
  );

-- RLS Policies for user_permissions
CREATE POLICY "Users can view their own permissions" 
  ON public.user_permissions 
  FOR SELECT 
  TO authenticated
  USING (user_id = auth.uid());

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

CREATE POLICY "Super admins can modify permissions" 
  ON public.user_permissions 
  FOR ALL 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_permissions 
      WHERE user_id = auth.uid() AND is_super_admin = true
    )
  );

-- RLS Policies for admin_users_extended
CREATE POLICY "Users can view their own extended profile" 
  ON public.admin_users_extended 
  FOR SELECT 
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Super admins can view all extended profiles" 
  ON public.admin_users_extended 
  FOR SELECT 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_permissions 
      WHERE user_id = auth.uid() AND is_super_admin = true
    )
  );

CREATE POLICY "Super admins can modify extended profiles" 
  ON public.admin_users_extended 
  FOR ALL 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_permissions 
      WHERE user_id = auth.uid() AND is_super_admin = true
    )
  );

-- Insert default admin settings
INSERT INTO public.admin_settings (setting_key, setting_value, description) VALUES
('password_min_length', '8', 'Minimum password length requirement'),
('session_timeout', '3600', 'Session timeout in seconds'),
('max_login_attempts', '5', 'Maximum login attempts before lockout');
