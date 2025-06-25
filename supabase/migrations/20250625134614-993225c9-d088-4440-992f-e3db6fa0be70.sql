
-- Create skills table
CREATE TABLE public.skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  level INTEGER NOT NULL CHECK (level >= 0 AND level <= 100),
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

-- Create policies for skills table (making it publicly readable but only admin writable)
CREATE POLICY "Anyone can view skills" 
  ON public.skills 
  FOR SELECT 
  USING (true);

CREATE POLICY "Only authenticated users can insert skills" 
  ON public.skills 
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can update skills" 
  ON public.skills 
  FOR UPDATE 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Only authenticated users can delete skills" 
  ON public.skills 
  FOR DELETE 
  USING (auth.role() = 'authenticated');

-- Insert some initial skills data
INSERT INTO public.skills (name, level, category) VALUES
  ('React', 90, 'Frontend'),
  ('TypeScript', 85, 'Frontend'),
  ('Vue.js', 80, 'Frontend'),
  ('Tailwind CSS', 90, 'Frontend'),
  ('Next.js', 75, 'Frontend'),
  ('Node.js', 85, 'Backend'),
  ('Python', 80, 'Backend'),
  ('Express.js', 85, 'Backend'),
  ('PostgreSQL', 75, 'Backend'),
  ('MongoDB', 80, 'Backend'),
  ('Git', 90, 'Tools & Others'),
  ('Docker', 70, 'Tools & Others'),
  ('AWS', 65, 'Tools & Others'),
  ('Figma', 75, 'Tools & Others'),
  ('Jest', 80, 'Tools & Others');
