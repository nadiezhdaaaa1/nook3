export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          billing_cycle: Database["public"]["Enums"]["billing_cycle"]
          completed_at: string | null
          created_at: string
          email: string
          email_verified: boolean
          id: string
          is_affiliate: boolean
          move_out: Json | null
          phone: string
          phone_verified: boolean
          plan: Database["public"]["Enums"]["app_plan"]
          referral_code: string
          timezone: string
          trial_active: boolean
          trial_ends_at: string | null
          trial_started_at: string | null
          updated_at: string
        }
        Insert: {
          billing_cycle?: Database["public"]["Enums"]["billing_cycle"]
          completed_at?: string | null
          created_at?: string
          email?: string
          email_verified?: boolean
          id: string
          is_affiliate?: boolean
          move_out?: Json | null
          phone?: string
          phone_verified?: boolean
          plan?: Database["public"]["Enums"]["app_plan"]
          referral_code?: string
          timezone?: string
          trial_active?: boolean
          trial_ends_at?: string | null
          trial_started_at?: string | null
          updated_at?: string
        }
        Update: {
          billing_cycle?: Database["public"]["Enums"]["billing_cycle"]
          completed_at?: string | null
          created_at?: string
          email?: string
          email_verified?: boolean
          id?: string
          is_affiliate?: boolean
          move_out?: Json | null
          phone?: string
          phone_verified?: boolean
          plan?: Database["public"]["Enums"]["app_plan"]
          referral_code?: string
          timezone?: string
          trial_active?: boolean
          trial_ends_at?: string | null
          trial_started_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          created_at: string
          id: string
          referred_user_id: string
          referrer_user_id: string
          reward_status: string
        }
        Insert: {
          created_at?: string
          id?: string
          referred_user_id: string
          referrer_user_id: string
          reward_status?: string
        }
        Update: {
          created_at?: string
          id?: string
          referred_user_id?: string
          referrer_user_id?: string
          reward_status?: string
        }
        Relationships: []
      }
      saved_alerts: {
        Row: {
          created_at: string
          id: string
          listing: Json
          search_id: string
          snoozed_until: string | null
          status: Database["public"]["Enums"]["alert_status"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          listing: Json
          search_id: string
          snoozed_until?: string | null
          status?: Database["public"]["Enums"]["alert_status"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          listing?: Json
          search_id?: string
          snoozed_until?: string | null
          status?: Database["public"]["Enums"]["alert_status"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_alerts_search_id_fkey"
            columns: ["search_id"]
            isOneToOne: false
            referencedRelation: "searches"
            referencedColumns: ["id"]
          },
        ]
      }
      searches: {
        Row: {
          alert_channel: Database["public"]["Enums"]["alert_channel"]
          amenities: Json
          archived_at: string | null
          bathrooms: string
          bedrooms: Json
          budget_max: number | null
          budget_min: number | null
          city_id: string
          commute: Json
          created_at: string
          frequency: Database["public"]["Enums"]["alert_freq"]
          id: string
          include_broker_fee: boolean
          move_in: Json
          name: string
          neighborhoods: Json
          rent_protection: string
          status: Database["public"]["Enums"]["search_status"]
          transit: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          alert_channel?: Database["public"]["Enums"]["alert_channel"]
          amenities?: Json
          archived_at?: string | null
          bathrooms?: string
          bedrooms?: Json
          budget_max?: number | null
          budget_min?: number | null
          city_id: string
          commute?: Json
          created_at?: string
          frequency?: Database["public"]["Enums"]["alert_freq"]
          id?: string
          include_broker_fee?: boolean
          move_in?: Json
          name: string
          neighborhoods?: Json
          rent_protection?: string
          status?: Database["public"]["Enums"]["search_status"]
          transit?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          alert_channel?: Database["public"]["Enums"]["alert_channel"]
          amenities?: Json
          archived_at?: string | null
          bathrooms?: string
          bedrooms?: Json
          budget_max?: number | null
          budget_min?: number | null
          city_id?: string
          commute?: Json
          created_at?: string
          frequency?: Database["public"]["Enums"]["alert_freq"]
          id?: string
          include_broker_fee?: boolean
          move_in?: Json
          name?: string
          neighborhoods?: Json
          rent_protection?: string
          status?: Database["public"]["Enums"]["search_status"]
          transit?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      alert_channel: "email" | "text" | "both"
      alert_freq: "minimal" | "balanced" | "maximum" | "weekly"
      alert_status: "new" | "saved" | "contacted" | "dismissed"
      app_plan: "free" | "premium" | "max"
      app_role: "admin" | "user"
      billing_cycle: "monthly" | "annual"
      search_status: "active" | "paused" | "archived"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      alert_channel: ["email", "text", "both"],
      alert_freq: ["minimal", "balanced", "maximum", "weekly"],
      alert_status: ["new", "saved", "contacted", "dismissed"],
      app_plan: ["free", "premium", "max"],
      app_role: ["admin", "user"],
      billing_cycle: ["monthly", "annual"],
      search_status: ["active", "paused", "archived"],
    },
  },
} as const
