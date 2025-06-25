
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface UserPermissions {
  id: string;
  user_id: string;
  analytics_read: boolean;
  analytics_write: boolean;
  hero_read: boolean;
  hero_write: boolean;
  projects_read: boolean;
  projects_write: boolean;
  team_read: boolean;
  team_write: boolean;
  settings_read: boolean;
  settings_write: boolean;
  is_super_admin: boolean;
}

export const useUserPermissions = () => {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<UserPermissions | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPermissions = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_permissions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching permissions:', error);
        return;
      }

      if (!data) {
        // Create default permissions for new user
        const { data: newPermissions, error: createError } = await supabase
          .from('user_permissions')
          .insert({
            user_id: user.id,
            is_super_admin: false
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating permissions:', createError);
          return;
        }

        setPermissions(newPermissions);
      } else {
        setPermissions(data);
      }
    } catch (error) {
      console.error('Error in fetchPermissions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, [user]);

  const updatePermissions = async (userId: string, updates: Partial<UserPermissions>) => {
    try {
      console.log('Updating permissions for user:', userId, 'with updates:', updates);
      
      // First check if permissions exist for this user
      const { data: existingPermissions, error: checkError } = await supabase
        .from('user_permissions')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking existing permissions:', checkError);
        throw checkError;
      }

      let result;
      
      if (!existingPermissions) {
        // Create new permissions if they don't exist
        console.log('Creating new permissions for user:', userId);
        result = await supabase
          .from('user_permissions')
          .insert({ user_id: userId, ...updates })
          .select()
          .single();
      } else {
        // Update existing permissions
        console.log('Updating existing permissions for user:', userId);
        result = await supabase
          .from('user_permissions')
          .update(updates)
          .eq('user_id', userId)
          .select()
          .single();
      }

      const { data, error } = result;

      if (error) {
        console.error('Error in updatePermissions:', error);
        throw error;
      }

      console.log('Successfully updated permissions:', data);

      // Update local state if this is the current user
      if (userId === user?.id) {
        setPermissions(data);
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error updating permissions:', error);
      return { success: false, error };
    }
  };

  return {
    permissions,
    loading,
    refetch: fetchPermissions,
    updatePermissions
  };
};
