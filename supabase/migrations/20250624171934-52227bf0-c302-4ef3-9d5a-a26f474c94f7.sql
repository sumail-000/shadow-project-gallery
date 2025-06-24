
-- Create a table for dummy analytics data
CREATE TABLE public.dummy_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date TEXT NOT NULL,
  visitors INTEGER NOT NULL,
  views INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create a table for dummy project stats
CREATE TABLE public.dummy_project_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_name TEXT NOT NULL,
  views INTEGER NOT NULL,
  clicks INTEGER NOT NULL,
  location TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.dummy_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dummy_project_stats ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to dummy analytics" ON public.dummy_analytics FOR SELECT USING (true);
CREATE POLICY "Allow public read access to dummy project stats" ON public.dummy_project_stats FOR SELECT USING (true);

-- Create policies for authenticated admin access
CREATE POLICY "Allow authenticated users to manage dummy analytics" ON public.dummy_analytics FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow authenticated users to manage dummy project stats" ON public.dummy_project_stats FOR ALL USING (auth.uid() IS NOT NULL);

-- Insert dummy analytics data
INSERT INTO public.dummy_analytics (date, visitors, views) VALUES
('Mon', 120, 180),
('Tue', 150, 220),
('Wed', 180, 280),
('Thu', 200, 320),
('Fri', 250, 400),
('Sat', 300, 450),
('Sun', 280, 420);

-- Insert dummy project stats
INSERT INTO public.dummy_project_stats (project_name, views, clicks, location) VALUES
('E-commerce App', 1250, 85, 'US: 45%, EU: 30%, Asia: 25%'),
('Portfolio Website', 980, 72, 'US: 40%, EU: 35%, Others: 25%'),
('Task Manager', 750, 58, 'US: 50%, EU: 25%, Asia: 25%'),
('Weather App', 620, 41, 'Global: 100%');
