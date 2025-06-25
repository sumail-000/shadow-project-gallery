
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  github_url: string;
  live_url: string;
  year: string;
  detailed_description?: string;
  goals?: string[];
  objectives?: string[];
  features?: string[];
  challenges?: string[];
  solutions?: string[];
  gallery_images?: string[];
  demo_video_url?: string;
  project_duration?: string;
  team_size?: number;
  project_status?: string;
  client_name?: string;
  project_category?: string;
}

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addProject = async (project: Omit<Project, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([project])
        .select()
        .single();

      if (error) throw error;
      
      setProjects(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Project added successfully",
      });
      return { success: true };
    } catch (error) {
      console.error('Error adding project:', error);
      toast({
        title: "Error",
        description: "Failed to add project",
        variant: "destructive",
      });
      return { success: false };
    }
  };

  const updateProject = async (id: string, project: Omit<Project, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(project)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setProjects(prev => prev.map(p => p.id === id ? data : p));
      toast({
        title: "Success",
        description: "Project updated successfully",
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating project:', error);
      toast({
        title: "Error",
        description: "Failed to update project",
        variant: "destructive",
      });
      return { success: false };
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setProjects(prev => prev.filter(p => p.id !== id));
      toast({
        title: "Success",
        description: "Project deleted successfully",
      });
      return { success: true };
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      });
      return { success: false };
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return { projects, loading, addProject, updateProject, deleteProject, refetch: fetchProjects };
};
