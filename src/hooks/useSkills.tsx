
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Skill {
  id: string;
  name: string;
  level: number;
  category: string;
  created_at?: string;
  updated_at?: string;
}

export const useSkills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSkills = async () => {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('category', { ascending: true })
        .order('level', { ascending: false });

      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      setSkills(data || []);
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const addSkill = async (skillData: Omit<Skill, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('skills')
        .insert([skillData])
        .select()
        .single();

      if (error) throw error;

      setSkills(prev => [...prev, data]);
      toast({
        title: "Success",
        description: "Skill added successfully",
      });

      return { success: true, data };
    } catch (error) {
      console.error('Error adding skill:', error);
      toast({
        title: "Error",
        description: "Failed to add skill",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const updateSkill = async (id: string, skillData: Partial<Skill>) => {
    try {
      const { data, error } = await supabase
        .from('skills')
        .update({ ...skillData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setSkills(prev => prev.map(skill => skill.id === id ? data : skill));
      toast({
        title: "Success",
        description: "Skill updated successfully",
      });

      return { success: true, data };
    } catch (error) {
      console.error('Error updating skill:', error);
      toast({
        title: "Error",
        description: "Failed to update skill",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const deleteSkill = async (id: string) => {
    try {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSkills(prev => prev.filter(skill => skill.id !== id));
      toast({
        title: "Success",
        description: "Skill deleted successfully",
      });

      return { success: true };
    } catch (error) {
      console.error('Error deleting skill:', error);
      toast({
        title: "Error",
        description: "Failed to delete skill",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  return {
    skills,
    loading,
    addSkill,
    updateSkill,
    deleteSkill,
    refetch: fetchSkills
  };
};
