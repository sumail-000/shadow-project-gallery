
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  skills: string[];
  github?: string;
  linkedin?: string;
  email?: string;
}

export const useTeamMembers = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTeamMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTeamMembers(data || []);
    } catch (error) {
      console.error('Error fetching team members:', error);
      toast({
        title: "Error",
        description: "Failed to load team members",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addTeamMember = async (member: Omit<TeamMember, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .insert([member])
        .select()
        .single();

      if (error) throw error;
      
      setTeamMembers(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Team member added successfully",
      });
      return { success: true };
    } catch (error) {
      console.error('Error adding team member:', error);
      toast({
        title: "Error",
        description: "Failed to add team member",
        variant: "destructive",
      });
      return { success: false };
    }
  };

  const updateTeamMember = async (id: string, member: Omit<TeamMember, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .update(member)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setTeamMembers(prev => prev.map(m => m.id === id ? data : m));
      toast({
        title: "Success",
        description: "Team member updated successfully",
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating team member:', error);
      toast({
        title: "Error",
        description: "Failed to update team member",
        variant: "destructive",
      });
      return { success: false };
    }
  };

  const deleteTeamMember = async (id: string) => {
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setTeamMembers(prev => prev.filter(m => m.id !== id));
      toast({
        title: "Success",
        description: "Team member deleted successfully",
      });
      return { success: true };
    } catch (error) {
      console.error('Error deleting team member:', error);
      toast({
        title: "Error",
        description: "Failed to delete team member",
        variant: "destructive",
      });
      return { success: false };
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  return { teamMembers, loading, addTeamMember, updateTeamMember, deleteTeamMember, refetch: fetchTeamMembers };
};
