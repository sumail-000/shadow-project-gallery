
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Create super admin permissions for first user
        if (event === 'SIGNED_IN' && session?.user) {
          setTimeout(async () => {
            try {
              const { data: existingPermissions } = await supabase
                .from('user_permissions')
                .select('*')
                .eq('user_id', session.user.id)
                .single();

              if (!existingPermissions) {
                // Check if this is the first user
                const { data: allUsers } = await supabase
                  .from('user_permissions')
                  .select('*');

                const isFirstUser = !allUsers || allUsers.length === 0;

                await supabase
                  .from('user_permissions')
                  .insert({
                    user_id: session.user.id,
                    analytics_read: true,
                    analytics_write: isFirstUser,
                    hero_read: true,
                    hero_write: isFirstUser,
                    projects_read: true,
                    projects_write: isFirstUser,
                    team_read: true,
                    team_write: isFirstUser,
                    settings_read: isFirstUser,
                    settings_write: isFirstUser,
                    is_super_admin: isFirstUser
                  });
              }
            } catch (error) {
              console.error('Error creating user permissions:', error);
            }
          }, 0);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    signIn,
    signOut,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
