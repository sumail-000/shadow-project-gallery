
-- Create a table for hero section content
CREATE TABLE public.hero_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  main_heading TEXT NOT NULL DEFAULT 'Full Stack Developer',
  subtitle TEXT NOT NULL DEFAULT 'Passionate about creating innovative solutions and bringing ideas to life through code.',
  description TEXT NOT NULL DEFAULT 'Welcome to my portfolio showcasing years of development experience.',
  github_url TEXT DEFAULT '#',
  linkedin_url TEXT DEFAULT '#',
  email_url TEXT DEFAULT '#'
);

-- Insert default hero content
INSERT INTO public.hero_content (main_heading, subtitle, description, github_url, linkedin_url, email_url)
VALUES (
  'Full Stack Developer',
  'Passionate about creating innovative solutions and bringing ideas to life through code.',
  'Welcome to my portfolio showcasing years of development experience.',
  '#',
  '#',
  '#'
);

-- Add Row Level Security (RLS) policies
ALTER TABLE public.hero_content ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read hero content (public portfolio)
CREATE POLICY "Anyone can view hero content" 
  ON public.hero_content 
  FOR SELECT 
  TO public
  USING (true);

-- Only authenticated users can update hero content (admin only)
CREATE POLICY "Authenticated users can update hero content" 
  ON public.hero_content 
  FOR UPDATE 
  TO authenticated
  USING (true);
