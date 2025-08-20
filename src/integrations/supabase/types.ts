// ...existing code...
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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      alerts: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          severity: Database["public"]["Enums"]["alert_severity"]
          startup_id: string
          type: Database["public"]["Enums"]["alert_type"]
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          severity?: Database["public"]["Enums"]["alert_severity"]
          startup_id: string
          type: Database["public"]["Enums"]["alert_type"]
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          severity?: Database["public"]["Enums"]["alert_severity"]
          startup_id?: string
          type?: Database["public"]["Enums"]["alert_type"]
        }
        Relationships: [
          {
            foreignKeyName: "alerts_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      metrics: {
        Row: {
          burn_rate: number
          created_at: string
          expenses: number
          id: string
          period_end: string
          period_start: string
          revenue: number
          runway: number | null
          startup_id: string
        }
        Insert: {
          burn_rate?: number
          created_at?: string
          expenses?: number
          id?: string
          period_end: string
          period_start: string
          revenue?: number
          runway?: number | null
          startup_id: string
        }
        Update: {
          burn_rate?: number
          created_at?: string
          expenses?: number
          id?: string
          period_end?: string
          period_start?: string
          revenue?: number
          runway?: number | null
          startup_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "metrics_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      models: {
        Row: {
          accuracy: number | null
          created_at: string
          id: string
          kind: Database["public"]["Enums"]["model_kind"]
          model_path: string | null
          startup_id: string | null
          version: number
        }
        Insert: {
          accuracy?: number | null
          created_at?: string
          id?: string
          kind: Database["public"]["Enums"]["model_kind"]
          model_path?: string | null
          startup_id?: string | null
          version?: number
        }
        Update: {
          accuracy?: number | null
          created_at?: string
          id?: string
          kind?: Database["public"]["Enums"]["model_kind"]
          model_path?: string | null
          startup_id?: string | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "models_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunities: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_archived: boolean | null
          score: number | null
          startup_id: string
          title: string
          type: Database["public"]["Enums"]["opportunity_type"]
          url: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_archived?: boolean | null
          score?: number | null
          startup_id: string
          title: string
          type: Database["public"]["Enums"]["opportunity_type"]
          url?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_archived?: boolean | null
          score?: number | null
          startup_id?: string
          title?: string
          type?: Database["public"]["Enums"]["opportunity_type"]
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "opportunities_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      predictions: {
        Row: {
          cashflow: number | null
          created_at: string
          failure_probability: number | null
          growth_rate: number | null
          id: string
          input_data: Json
          output_data: Json
          profit_loss: number | null
          runway_months: number | null
          startup_id: string
        }
        Insert: {
          cashflow?: number | null
          created_at?: string
          failure_probability?: number | null
          growth_rate?: number | null
          id?: string
          input_data: Json
          output_data: Json
          profit_loss?: number | null
          runway_months?: number | null
          startup_id: string
        }
        Update: {
          cashflow?: number | null
          created_at?: string
          failure_probability?: number | null
          growth_rate?: number | null
          id?: string
          input_data?: Json
          output_data?: Json
          profit_loss?: number | null
          runway_months?: number | null
          startup_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "predictions_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startups"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      startups: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          owner_id: string
          sector: Database["public"]["Enums"]["startup_sector"]
          stage: Database["public"]["Enums"]["startup_stage"]
          team_experience: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          owner_id: string
          sector: Database["public"]["Enums"]["startup_sector"]
          stage: Database["public"]["Enums"]["startup_stage"]
          team_experience?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          owner_id?: string
          sector?: Database["public"]["Enums"]["startup_sector"]
          stage?: Database["public"]["Enums"]["startup_stage"]
          team_experience?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "startups_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      alert_severity: "low" | "medium" | "high" | "critical"
      alert_type: "death_zone" | "cashflow_low" | "runway_low"
      model_kind: "profit" | "growth" | "failure"
      opportunity_type: "investor" | "grant" | "partner"
      startup_sector:
        | "saas"
        | "fintech"
        | "healthtech"
        | "edtech"
        | "ecommerce"
        | "marketplace"
        | "ai_ml"
        | "biotech"
        | "other"
      startup_stage:
        | "idea"
        | "prototype"
        | "mvp"
        | "early_stage"
        | "growth"
        | "mature"
      user_role: "admin" | "founder"
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
      alert_severity: ["low", "medium", "high", "critical"],
      alert_type: ["death_zone", "cashflow_low", "runway_low"],
      model_kind: ["profit", "growth", "failure"],
      opportunity_type: ["investor", "grant", "partner"],
      startup_sector: [
        "saas",
        "fintech",
        "healthtech",
        "edtech",
        "ecommerce",
        "marketplace",
        "ai_ml",
        "biotech",
        "other",
      ],
      startup_stage: [
        "idea",
        "prototype",
        "mvp",
        "early_stage",
        "growth",
        "mature",
      ],
      user_role: ["admin", "founder"],
    },
  },
} as const
