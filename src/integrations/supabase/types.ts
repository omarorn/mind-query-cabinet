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
      ai_service_logs: {
        Row: {
          created_at: string
          id: string
          metadata: Json | null
          prompt: string
          response: string | null
          service: string
          status: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json | null
          prompt: string
          response?: string | null
          service: string
          status?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json | null
          prompt?: string
          response?: string | null
          service?: string
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
      bORING: {
        Row: {
          Value: string[] | null
        }
        Insert: {
          Value?: string[] | null
        }
        Update: {
          Value?: string[] | null
        }
        Relationships: []
      }
      bus_locations: {
        Row: {
          bus_id: string
          heading: number | null
          id: number
          latitude: number
          longitude: number
          route_id: number | null
          route_number: string
          speed: number | null
          timestamp: string
          updated_at: string
        }
        Insert: {
          bus_id: string
          heading?: number | null
          id?: number
          latitude: number
          longitude: number
          route_id?: number | null
          route_number: string
          speed?: number | null
          timestamp?: string
          updated_at?: string
        }
        Update: {
          bus_id?: string
          heading?: number | null
          id?: number
          latitude?: number
          longitude?: number
          route_id?: number | null
          route_number?: string
          speed?: number | null
          timestamp?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bus_locations_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "bus_routes"
            referencedColumns: ["id"]
          },
        ]
      }
      bus_routes: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          id: number
          name: string
          route_number: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: number
          name: string
          route_number: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: number
          name?: string
          route_number?: string
          updated_at?: string
        }
        Relationships: []
      }
      bus_stops: {
        Row: {
          address: string | null
          created_at: string
          id: number
          latitude: number
          longitude: number
          name: string
          stop_id: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          id?: number
          latitude: number
          longitude: number
          name: string
          stop_id: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          id?: number
          latitude?: number
          longitude?: number
          name?: string
          stop_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      ideas: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          status: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          status?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          status?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      "Input Database": {
        Row: {
          AiTools: string | null
          created_at: string | null
          Description: string | null
          HttpsEmbedCode: string | null
          id: string
          "Last Modified": string | null
          Links: string | null
          "Resource Name": string | null
          "Resource Type": string | null
        }
        Insert: {
          AiTools?: string | null
          created_at?: string | null
          Description?: string | null
          HttpsEmbedCode?: string | null
          id?: string
          "Last Modified"?: string | null
          Links?: string | null
          "Resource Name"?: string | null
          "Resource Type"?: string | null
        }
        Update: {
          AiTools?: string | null
          created_at?: string | null
          Description?: string | null
          HttpsEmbedCode?: string | null
          id?: string
          "Last Modified"?: string | null
          Links?: string | null
          "Resource Name"?: string | null
          "Resource Type"?: string | null
        }
        Relationships: []
      }
      playlist_questions: {
        Row: {
          added_at: string
          id: string
          playlist_id: string
          question_id: string
        }
        Insert: {
          added_at?: string
          id?: string
          playlist_id: string
          question_id: string
        }
        Update: {
          added_at?: string
          id?: string
          playlist_id?: string
          question_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "playlist_questions_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "saved_playlists"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      route_schedules: {
        Row: {
          arrival_time: string
          created_at: string
          day_type: string
          departure_time: string
          id: number
          route_id: number
          stop_id: number
          updated_at: string
        }
        Insert: {
          arrival_time: string
          created_at?: string
          day_type: string
          departure_time: string
          id?: number
          route_id: number
          stop_id: number
          updated_at?: string
        }
        Update: {
          arrival_time?: string
          created_at?: string
          day_type?: string
          departure_time?: string
          id?: number
          route_id?: number
          stop_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "route_schedules_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "bus_routes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "route_schedules_stop_id_fkey"
            columns: ["stop_id"]
            isOneToOne: false
            referencedRelation: "bus_stops"
            referencedColumns: ["id"]
          },
        ]
      }
      route_stops: {
        Row: {
          created_at: string
          id: number
          route_id: number
          stop_id: number
          stop_order: number
        }
        Insert: {
          created_at?: string
          id?: number
          route_id: number
          stop_id: number
          stop_order: number
        }
        Update: {
          created_at?: string
          id?: number
          route_id?: number
          stop_id?: number
          stop_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "route_stops_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "bus_routes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "route_stops_stop_id_fkey"
            columns: ["stop_id"]
            isOneToOne: false
            referencedRelation: "bus_stops"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_playlists: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      scraped_data: {
        Row: {
          data: Json
          domain: string
          id: string
          pages_scraped: number
          scraped_at: string
          url: string
        }
        Insert: {
          data: Json
          domain: string
          id?: string
          pages_scraped: number
          scraped_at?: string
          url: string
        }
        Update: {
          data?: Json
          domain?: string
          id?: string
          pages_scraped?: number
          scraped_at?: string
          url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_logs_count_by_service: {
        Args: Record<PropertyKey, never>
        Returns: {
          service: string
          count: number
          last_used: string
        }[]
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
