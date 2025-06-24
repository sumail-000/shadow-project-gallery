
-- Create projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  technologies TEXT[] NOT NULL DEFAULT '{}',
  github_url TEXT NOT NULL,
  live_url TEXT NOT NULL,
  year TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create team members table
CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT NOT NULL,
  image TEXT NOT NULL DEFAULT '/placeholder.svg',
  skills TEXT[] NOT NULL DEFAULT '{}',
  github TEXT,
  linkedin TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create portfolio settings table
CREATE TABLE public.portfolio_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  portfolio_title TEXT NOT NULL DEFAULT 'Portfolio',
  contact_email TEXT NOT NULL,
  phone TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create analytics table for tracking
CREATE TABLE public.analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_path TEXT NOT NULL,
  visitor_ip TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin users table for authentication
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (for portfolio viewing)
CREATE POLICY "Allow public read access to projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Allow public read access to team members" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "Allow public read access to portfolio settings" ON public.portfolio_settings FOR SELECT USING (true);

-- Create policies for authenticated admin access
CREATE POLICY "Allow authenticated users to manage projects" ON public.projects FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow authenticated users to manage team members" ON public.team_members FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow authenticated users to manage portfolio settings" ON public.portfolio_settings FOR ALL USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow authenticated users to view analytics" ON public.analytics FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Allow public insert to analytics" ON public.analytics FOR INSERT WITH CHECK (true);

-- Insert default portfolio settings
INSERT INTO public.portfolio_settings (portfolio_title, contact_email, phone)
VALUES ('Portfolio', 'your.email@example.com', '+1 (555) 123-4567');

-- Insert sample projects
INSERT INTO public.projects (title, description, image, technologies, github_url, live_url, year) VALUES
('E-Commerce Platform', 'A full-stack e-commerce solution built with React, Node.js, and MongoDB. Features include user authentication, payment integration, and admin dashboard.', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80', '{"React", "Node.js", "MongoDB", "Stripe"}', '#', '#', '2024'),
('Task Management App', 'A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.', 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=800&q=80', '{"Vue.js", "Firebase", "Tailwind CSS"}', '#', '#', '2023'),
('Weather Dashboard', 'A responsive weather application that provides detailed weather information, forecasts, and location-based services using weather APIs.', 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?auto=format&fit=crop&w=800&q=80', '{"React", "TypeScript", "Weather API"}', '#', '#', '2023'),
('Portfolio Website', 'A modern, responsive portfolio website showcasing my projects and skills. Built with attention to performance and user experience.', 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=800&q=80', '{"React", "Tailwind CSS", "Framer Motion"}', '#', '#', '2024'),
('Chat Application', 'Real-time chat application with private messaging, group chats, file sharing, and emoji support. Built for seamless communication.', 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&w=800&q=80', '{"Socket.io", "React", "Express", "PostgreSQL"}', '#', '#', '2022'),
('Data Visualization Tool', 'Interactive dashboard for data visualization with charts, graphs, and real-time analytics. Designed for business intelligence needs.', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80', '{"D3.js", "React", "Python", "Flask"}', '#', '#', '2022');

-- Insert sample team members
INSERT INTO public.team_members (name, role, bio, skills, github, linkedin, email) VALUES
('John Doe', 'Lead Developer', 'Full-stack developer with 5+ years of experience in React, Node.js, and cloud technologies. Passionate about creating scalable web applications.', '{"React", "Node.js", "TypeScript", "AWS"}', 'https://github.com/johndoe', 'https://linkedin.com/in/johndoe', 'john@example.com'),
('Jane Smith', 'UI/UX Designer', 'Creative designer with expertise in user experience and modern design principles. Focused on creating intuitive and beautiful interfaces.', '{"Figma", "Adobe XD", "Prototyping", "User Research"}', 'https://github.com/janesmith', 'https://linkedin.com/in/janesmith', 'jane@example.com'),
('Mike Johnson', 'Backend Developer', 'Backend specialist with deep knowledge in database design, API development, and system architecture. Loves optimizing performance.', '{"Python", "PostgreSQL", "Docker", "Kubernetes"}', 'https://github.com/mikejohnson', 'https://linkedin.com/in/mikejohnson', 'mike@example.com');
