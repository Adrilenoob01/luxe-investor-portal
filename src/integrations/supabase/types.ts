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
      investments: {
        Row: {
          amount: number
          created_at: string
          has_insurance: boolean | null
          id: string
          is_cancelled: boolean | null
          payment_method: string
          project_id: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          has_insurance?: boolean | null
          id?: string
          is_cancelled?: boolean | null
          payment_method: string
          project_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          has_insurance?: boolean | null
          id?: string
          is_cancelled?: boolean | null
          payment_method?: string
          project_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "investments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "order_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "investments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_articles: {
        Row: {
          author_id: string | null
          content: string
          created_at: string
          id: string
          image_url: string | null
          is_published: boolean | null
          published_at: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          published_at?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          published_at?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "newsletter_articles_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      order_projects: {
        Row: {
          category: string | null
          collected_amount: number
          created_at: string
          description: string
          detailed_description: string | null
          end_date: string | null
          id: string
          image_url: string | null
          implementation_date: string | null
          is_active: boolean | null
          location: string | null
          min_amount: number
          name: string
          return_rate: number
          short_description: string | null
          status: string
          target_amount: number
          updated_at: string
        }
        Insert: {
          category?: string | null
          collected_amount?: number
          created_at?: string
          description?: string
          detailed_description?: string | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          implementation_date?: string | null
          is_active?: boolean | null
          location?: string | null
          min_amount?: number
          name: string
          return_rate: number
          short_description?: string | null
          status?: string
          target_amount?: number
          updated_at?: string
        }
        Update: {
          category?: string | null
          collected_amount?: number
          created_at?: string
          description?: string
          detailed_description?: string | null
          end_date?: string | null
          id?: string
          image_url?: string | null
          implementation_date?: string | null
          is_active?: boolean | null
          location?: string | null
          min_amount?: number
          name?: string
          return_rate?: number
          short_description?: string | null
          status?: string
          target_amount?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          available_balance: number
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          invested_amount: number
          is_admin: boolean | null
          last_name: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          available_balance?: number
          created_at?: string
          email?: string | null
          first_name?: string | null
          id: string
          invested_amount?: number
          is_admin?: boolean | null
          last_name?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          available_balance?: number
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          invested_amount?: number
          is_admin?: boolean | null
          last_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      withdrawals: {
        Row: {
          amount: number
          created_at: string
          fees: number | null
          iban: string | null
          id: string
          is_cancelled: boolean | null
          phone_number: string | null
          status: string
          updated_at: string
          user_id: string | null
          withdrawal_method: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          fees?: number | null
          iban?: string | null
          id?: string
          is_cancelled?: boolean | null
          phone_number?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
          withdrawal_method?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          fees?: number | null
          iban?: string | null
          id?: string
          is_cancelled?: boolean | null
          phone_number?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
          withdrawal_method?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "withdrawals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_email: {
        Args: {
          user_id: string
        }
        Returns: string
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
