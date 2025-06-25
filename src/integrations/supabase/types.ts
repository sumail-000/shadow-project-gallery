export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          setting_key: string
          setting_value: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key: string
          setting_value: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: string
          updated_at?: string
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          created_at: string
          email: string
          id: string
          password_hash: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          password_hash: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          password_hash?: string
        }
        Relationships: []
      }
      admin_users_extended: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          is_active: boolean
          last_login: string | null
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id?: string
          is_active?: boolean
          last_login?: string | null
          role?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          is_active?: boolean
          last_login?: string | null
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      analytics: {
        Row: {
          created_at: string
          id: string
          page_path: string
          user_agent: string | null
          visitor_ip: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          page_path: string
          user_agent?: string | null
          visitor_ip?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          page_path?: string
          user_agent?: string | null
          visitor_ip?: string | null
        }
        Relationships: []
      }
      dummy_analytics: {
        Row: {
          created_at: string
          date: string
          id: string
          views: number
          visitors: number
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          views: number
          visitors: number
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          views?: number
          visitors?: number
        }
        Relationships: []
      }
      dummy_project_stats: {
        Row: {
          clicks: number
          created_at: string
          id: string
          location: string
          project_name: string
          views: number
        }
        Insert: {
          clicks: number
          created_at?: string
          id?: string
          location: string
          project_name: string
          views: number
        }
        Update: {
          clicks?: number
          created_at?: string
          id?: string
          location?: string
          project_name?: string
          views?: number
        }
        Relationships: []
      }
      hero_content: {
        Row: {
          created_at: string
          description: string
          email_url: string | null
          github_url: string | null
          id: string
          linkedin_url: string | null
          main_heading: string
          subtitle: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          email_url?: string | null
          github_url?: string | null
          id?: string
          linkedin_url?: string | null
          main_heading?: string
          subtitle?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          email_url?: string | null
          github_url?: string | null
          id?: string
          linkedin_url?: string | null
          main_heading?: string
          subtitle?: string
          updated_at?: string
        }
        Relationships: []
      }
      portfolio_settings: {
        Row: {
          contact_email: string
          id: string
          phone: string
          portfolio_title: string
          updated_at: string
        }
        Insert: {
          contact_email: string
          id?: string
          phone: string
          portfolio_title?: string
          updated_at?: string
        }
        Update: {
          contact_email?: string
          id?: string
          phone?: string
          portfolio_title?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          challenges: string[] | null
          client_name: string | null
          created_at: string
          demo_video_url: string | null
          description: string
          detailed_description: string | null
          features: string[] | null
          gallery_images: string[] | null
          github_url: string
          goals: string[] | null
          id: string
          image: string
          live_url: string
          objectives: string[] | null
          project_category: string | null
          project_duration: string | null
          project_status: string | null
          solutions: string[] | null
          team_size: number | null
          technologies: string[]
          title: string
          updated_at: string
          year: string
        }
        Insert: {
          challenges?: string[] | null
          client_name?: string | null
          created_at?: string
          demo_video_url?: string | null
          description: string
          detailed_description?: string | null
          features?: string[] | null
          gallery_images?: string[] | null
          github_url: string
          goals?: string[] | null
          id?: string
          image: string
          live_url: string
          objectives?: string[] | null
          project_category?: string | null
          project_duration?: string | null
          project_status?: string | null
          solutions?: string[] | null
          team_size?: number | null
          technologies?: string[]
          title: string
          updated_at?: string
          year: string
        }
        Update: {
          challenges?: string[] | null
          client_name?: string | null
          created_at?: string
          demo_video_url?: string | null
          description?: string
          detailed_description?: string | null
          features?: string[] | null
          gallery_images?: string[] | null
          github_url?: string
          goals?: string[] | null
          id?: string
          image?: string
          live_url?: string
          objectives?: string[] | null
          project_category?: string | null
          project_duration?: string | null
          project_status?: string | null
          solutions?: string[] | null
          team_size?: number | null
          technologies?: string[]
          title?: string
          updated_at?: string
          year?: string
        }
        Relationships: []
      }
      skills: {
        Row: {
          category: string
          created_at: string
          id: string
          level: number
          name: string
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          level: number
          name: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          level?: number
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          bio: string
          created_at: string
          email: string | null
          github: string | null
          id: string
          image: string
          linkedin: string | null
          name: string
          role: string
          skills: string[]
          updated_at: string
        }
        Insert: {
          bio: string
          created_at?: string
          email?: string | null
          github?: string | null
          id?: string
          image?: string
          linkedin?: string | null
          name: string
          role: string
          skills?: string[]
          updated_at?: string
        }
        Update: {
          bio?: string
          created_at?: string
          email?: string | null
          github?: string | null
          id?: string
          image?: string
          linkedin?: string | null
          name?: string
          role?: string
          skills?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      user_permissions: {
        Row: {
          analytics_read: boolean
          analytics_write: boolean
          created_at: string
          hero_read: boolean
          hero_write: boolean
          id: string
          is_super_admin: boolean
          projects_read: boolean
          projects_write: boolean
          settings_read: boolean
          settings_write: boolean
          team_read: boolean
          team_write: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          analytics_read?: boolean
          analytics_write?: boolean
          created_at?: string
          hero_read?: boolean
          hero_write?: boolean
          id?: string
          is_super_admin?: boolean
          projects_read?: boolean
          projects_write?: boolean
          settings_read?: boolean
          settings_write?: boolean
          team_read?: boolean
          team_write?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          analytics_read?: boolean
          analytics_write?: boolean
          created_at?: string
          hero_read?: boolean
          hero_write?: boolean
          id?: string
          is_super_admin?: boolean
          projects_read?: boolean
          projects_write?: boolean
          settings_read?: boolean
          settings_write?: boolean
          team_read?: boolean
          team_write?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_current_user_super_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_super_admin: {
        Args: { user_uuid?: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
