
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface HeroContent {
  id: string;
  main_heading: string;
  subtitle: string;
  description: string;
  github_url: string | null;
  linkedin_url: string | null;
  email_url: string | null;
  created_at: string;
  updated_at: string;
}

export const useHeroContent = () => {
  const [heroContent, setHeroContent] = useState<HeroContent | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchHeroContent = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_content')
        .select('*')
        .single();

      if (error) throw error;
      setHeroContent(data);
    } catch (error) {
      console.error('Error fetching hero content:', error);
      toast({
        title: "Error",
        description: "Failed to fetch hero content",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateHeroContent = async (updates: Partial<Omit<HeroContent, 'id' | 'created_at' | 'updated_at'>>) => {
    try {
      if (!heroContent) return { success: false, error: 'No hero content found' };

      const { data, error } = await supabase
        .from('hero_content')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', heroContent.id)
        .select()
        .single();

      if (error) throw error;

      setHeroContent(data);
      toast({
        title: "Success",
        description: "Hero content updated successfully",
      });
      
      return { success: true, data };
    } catch (error) {
      console.error('Error updating hero content:', error);
      toast({
        title: "Error",
        description: "Failed to update hero content",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  useEffect(() => {
    fetchHeroContent();
  }, []);

  return {
    heroContent,
    loading,
    updateHeroContent,
    refetch: fetchHeroContent
  };
};
