
-- Add new columns to the existing projects table for enhanced details
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS detailed_description TEXT,
ADD COLUMN IF NOT EXISTS goals TEXT[],
ADD COLUMN IF NOT EXISTS objectives TEXT[],
ADD COLUMN IF NOT EXISTS features TEXT[],
ADD COLUMN IF NOT EXISTS challenges TEXT[],
ADD COLUMN IF NOT EXISTS solutions TEXT[],
ADD COLUMN IF NOT EXISTS gallery_images TEXT[],
ADD COLUMN IF NOT EXISTS demo_video_url TEXT,
ADD COLUMN IF NOT EXISTS project_duration TEXT,
ADD COLUMN IF NOT EXISTS team_size INTEGER,
ADD COLUMN IF NOT EXISTS project_status TEXT DEFAULT 'completed',
ADD COLUMN IF NOT EXISTS client_name TEXT,
ADD COLUMN IF NOT EXISTS project_category TEXT DEFAULT 'web-development';

-- Update existing projects with some mock detailed data
UPDATE public.projects 
SET 
  detailed_description = 'This is a comprehensive project that showcases modern web development practices and innovative solutions. The project demonstrates expertise in full-stack development, user experience design, and scalable architecture implementation.',
  goals = ARRAY['Create user-friendly interface', 'Implement scalable architecture', 'Ensure optimal performance', 'Maintain code quality'],
  objectives = ARRAY['Deliver on time', 'Meet client requirements', 'Exceed performance benchmarks', 'Ensure maintainability'],
  features = ARRAY['Responsive design', 'Real-time updates', 'User authentication', 'Data visualization', 'Mobile optimization'],
  challenges = ARRAY['Complex data integration', 'Performance optimization', 'Cross-browser compatibility', 'Scalability requirements'],
  solutions = ARRAY['Implemented efficient caching', 'Used modern frameworks', 'Applied best practices', 'Conducted thorough testing'],
  gallery_images = ARRAY[
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800', 
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800',
    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800'
  ],
  project_duration = '3-6 months',
  team_size = 3,
  project_status = 'completed',
  project_category = 'web-development'
WHERE detailed_description IS NULL;
