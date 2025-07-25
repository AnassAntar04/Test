export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action_type: string
          created_at: string | null
          details: Json | null
          entity_id: string
          entity_type: string
          id: string
          ip_address: unknown | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string | null
          details?: Json | null
          entity_id: string
          entity_type: string
          id?: string
          ip_address?: unknown | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string | null
          details?: Json | null
          entity_id?: string
          entity_type?: string
          id?: string
          ip_address?: unknown | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      auto_message_templates: {
        Row: {
          channels: string[]
          created_at: string | null
          custom_time: string | null
          custom_trigger: string | null
          id: string
          is_active: boolean | null
          message_template: string
          name: string
          schedule_time: string | null
          trigger_type: string
          updated_at: string | null
          variables: string[] | null
        }
        Insert: {
          channels: string[]
          created_at?: string | null
          custom_time?: string | null
          custom_trigger?: string | null
          id?: string
          is_active?: boolean | null
          message_template: string
          name: string
          schedule_time?: string | null
          trigger_type: string
          updated_at?: string | null
          variables?: string[] | null
        }
        Update: {
          channels?: string[]
          created_at?: string | null
          custom_time?: string | null
          custom_trigger?: string | null
          id?: string
          is_active?: boolean | null
          message_template?: string
          name?: string
          schedule_time?: string | null
          trigger_type?: string
          updated_at?: string | null
          variables?: string[] | null
        }
        Relationships: []
      }
      category: {
        Row: {
          cat_id: string
          is_active: boolean
          keywords: string
          name: string
          org_id: string
        }
        Insert: {
          cat_id?: string
          is_active?: boolean
          keywords: string
          name: string
          org_id: string
        }
        Update: {
          cat_id?: string
          is_active?: boolean
          keywords?: string
          name?: string
          org_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "category_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organisation"
            referencedColumns: ["org_id"]
          },
        ]
      }
      channel: {
        Row: {
          channel_id: string
          channel_type: string
          credentials: Json
          name: string
        }
        Insert: {
          channel_id?: string
          channel_type: string
          credentials?: Json
          name: string
        }
        Update: {
          channel_id?: string
          channel_type?: string
          credentials?: Json
          name?: string
        }
        Relationships: []
      }
      chat_attachments: {
        Row: {
          created_at: string | null
          file_name: string
          file_size: number
          file_type: string
          id: string
          message_id: string | null
          storage_path: string
          updated_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string | null
          file_name: string
          file_size: number
          file_type: string
          id?: string
          message_id?: string | null
          storage_path: string
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string | null
          file_name?: string
          file_size?: number
          file_type?: string
          id?: string
          message_id?: string | null
          storage_path?: string
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: []
      }
      chatbot_configs: {
        Row: {
          authorized_users: string[] | null
          auto_close_message: string | null
          auto_hide_resolved: boolean | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          message_retention: string | null
          name: string
          settings: Json | null
          type: string
          updated_at: string | null
        }
        Insert: {
          authorized_users?: string[] | null
          auto_close_message?: string | null
          auto_hide_resolved?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          message_retention?: string | null
          name: string
          settings?: Json | null
          type: string
          updated_at?: string | null
        }
        Update: {
          authorized_users?: string[] | null
          auto_close_message?: string | null
          auto_hide_resolved?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          message_retention?: string | null
          name?: string
          settings?: Json | null
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      conversation_messages: {
        Row: {
          attachment_ids: string[] | null
          conversation_id: string
          created_at: string | null
          id: string
          is_automated: boolean | null
          is_internal: boolean | null
          message_content: string
          message_type: string | null
          metadata: Json | null
          sender_id: string | null
          sender_name: string | null
          sender_type: string
        }
        Insert: {
          attachment_ids?: string[] | null
          conversation_id: string
          created_at?: string | null
          id?: string
          is_automated?: boolean | null
          is_internal?: boolean | null
          message_content: string
          message_type?: string | null
          metadata?: Json | null
          sender_id?: string | null
          sender_name?: string | null
          sender_type: string
        }
        Update: {
          attachment_ids?: string[] | null
          conversation_id?: string
          created_at?: string | null
          id?: string
          is_automated?: boolean | null
          is_internal?: boolean | null
          message_content?: string
          message_type?: string | null
          metadata?: Json | null
          sender_id?: string | null
          sender_name?: string | null
          sender_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_metrics: {
        Row: {
          agent_messages_count: number | null
          ai_resolution_attempted: boolean | null
          ai_resolution_successful: boolean | null
          chatbot_handoff_count: number | null
          conversation_id: string
          created_at: string | null
          escalation_count: number | null
          first_response_time: number | null
          guest_messages_count: number | null
          id: string
          resolution_time: number | null
          satisfaction_score: number | null
          tags_applied: string[] | null
          updated_at: string | null
        }
        Insert: {
          agent_messages_count?: number | null
          ai_resolution_attempted?: boolean | null
          ai_resolution_successful?: boolean | null
          chatbot_handoff_count?: number | null
          conversation_id: string
          created_at?: string | null
          escalation_count?: number | null
          first_response_time?: number | null
          guest_messages_count?: number | null
          id?: string
          resolution_time?: number | null
          satisfaction_score?: number | null
          tags_applied?: string[] | null
          updated_at?: string | null
        }
        Update: {
          agent_messages_count?: number | null
          ai_resolution_attempted?: boolean | null
          ai_resolution_successful?: boolean | null
          chatbot_handoff_count?: number | null
          conversation_id?: string
          created_at?: string | null
          escalation_count?: number | null
          first_response_time?: number | null
          guest_messages_count?: number | null
          id?: string
          resolution_time?: number | null
          satisfaction_score?: number | null
          tags_applied?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversation_metrics_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          assigned_agent_id: string | null
          assigned_chatbot_id: string | null
          booking_source: string | null
          channel_type: string
          created_at: string | null
          guest_id: string | null
          has_children: boolean | null
          id: string
          is_recurrent: boolean | null
          journey_phase: string
          last_message_at: string | null
          last_message_content: string | null
          priority: string | null
          reservation_id: string | null
          resolution_notes: string | null
          satisfaction_score: number | null
          state: string
          subject: string | null
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          assigned_agent_id?: string | null
          assigned_chatbot_id?: string | null
          booking_source?: string | null
          channel_type: string
          created_at?: string | null
          guest_id?: string | null
          has_children?: boolean | null
          id?: string
          is_recurrent?: boolean | null
          journey_phase?: string
          last_message_at?: string | null
          last_message_content?: string | null
          priority?: string | null
          reservation_id?: string | null
          resolution_notes?: string | null
          satisfaction_score?: number | null
          state?: string
          subject?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          assigned_agent_id?: string | null
          assigned_chatbot_id?: string | null
          booking_source?: string | null
          channel_type?: string
          created_at?: string | null
          guest_id?: string | null
          has_children?: boolean | null
          id?: string
          is_recurrent?: boolean | null
          journey_phase?: string
          last_message_at?: string | null
          last_message_content?: string | null
          priority?: string | null
          reservation_id?: string | null
          resolution_notes?: string | null
          satisfaction_score?: number | null
          state?: string
          subject?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_assigned_chatbot_id_fkey"
            columns: ["assigned_chatbot_id"]
            isOneToOne: false
            referencedRelation: "chatbot_configs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "guest"
            referencedColumns: ["guest_id"]
          },
          {
            foreignKeyName: "conversations_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "reservation"
            referencedColumns: ["res_id"]
          },
        ]
      }
      document_processing_queue: {
        Row: {
          attachment_id: string | null
          attempts: number | null
          completed_at: string | null
          created_at: string
          error_message: string | null
          id: string
          max_attempts: number | null
          priority: number | null
          processing_status: string
          processing_type: string
          result_data: Json | null
          scheduled_at: string | null
          started_at: string | null
          updated_at: string
        }
        Insert: {
          attachment_id?: string | null
          attempts?: number | null
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          max_attempts?: number | null
          priority?: number | null
          processing_status?: string
          processing_type: string
          result_data?: Json | null
          scheduled_at?: string | null
          started_at?: string | null
          updated_at?: string
        }
        Update: {
          attachment_id?: string | null
          attempts?: number | null
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          max_attempts?: number | null
          priority?: number | null
          processing_status?: string
          processing_type?: string
          result_data?: Json | null
          scheduled_at?: string | null
          started_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_processing_queue_attachment_id_fkey"
            columns: ["attachment_id"]
            isOneToOne: false
            referencedRelation: "chat_attachments"
            referencedColumns: ["id"]
          },
        ]
      }
      escalation_categories: {
        Row: {
          cat_id: string
          esc_id: string
        }
        Insert: {
          cat_id: string
          esc_id: string
        }
        Update: {
          cat_id?: string
          esc_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "escalation_categories_cat_id_fkey"
            columns: ["cat_id"]
            isOneToOne: false
            referencedRelation: "category"
            referencedColumns: ["cat_id"]
          },
          {
            foreignKeyName: "escalation_categories_esc_id_fkey"
            columns: ["esc_id"]
            isOneToOne: false
            referencedRelation: "escalation_rules_new"
            referencedColumns: ["esc_id"]
          },
        ]
      }
      escalation_history: {
        Row: {
          conversation_id: string
          created_at: string | null
          escalation_reason: string | null
          escalation_type: string | null
          from_agent_id: string | null
          from_role: string
          id: string
          notes: string | null
          to_agent_id: string | null
          to_role: string
          triggered_by_rule_id: string | null
        }
        Insert: {
          conversation_id: string
          created_at?: string | null
          escalation_reason?: string | null
          escalation_type?: string | null
          from_agent_id?: string | null
          from_role: string
          id?: string
          notes?: string | null
          to_agent_id?: string | null
          to_role: string
          triggered_by_rule_id?: string | null
        }
        Update: {
          conversation_id?: string
          created_at?: string | null
          escalation_reason?: string | null
          escalation_type?: string | null
          from_agent_id?: string | null
          from_role?: string
          id?: string
          notes?: string | null
          to_agent_id?: string | null
          to_role?: string
          triggered_by_rule_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "escalation_history_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "escalation_history_triggered_by_rule_id_fkey"
            columns: ["triggered_by_rule_id"]
            isOneToOne: false
            referencedRelation: "escalation_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      escalation_rules: {
        Row: {
          condition: string
          created_at: string
          from_role: string
          id: string
          is_active: boolean
          keywords: string[]
          name: string
          priority: number
          to_role: string
          updated_at: string
        }
        Insert: {
          condition?: string
          created_at?: string
          from_role: string
          id?: string
          is_active?: boolean
          keywords?: string[]
          name: string
          priority?: number
          to_role: string
          updated_at?: string
        }
        Update: {
          condition?: string
          created_at?: string
          from_role?: string
          id?: string
          is_active?: boolean
          keywords?: string[]
          name?: string
          priority?: number
          to_role?: string
          updated_at?: string
        }
        Relationships: []
      }
      escalation_rules_new: {
        Row: {
          condition: string
          created_at: string
          esc_id: string
          from_role: string
          is_active: boolean
          name: string
          org_id: string
          priority: number
          to_role: string
          updated_at: string
        }
        Insert: {
          condition?: string
          created_at?: string
          esc_id?: string
          from_role: string
          is_active?: boolean
          name: string
          org_id: string
          priority?: number
          to_role: string
          updated_at?: string
        }
        Update: {
          condition?: string
          created_at?: string
          esc_id?: string
          from_role?: string
          is_active?: boolean
          name?: string
          org_id?: string
          priority?: number
          to_role?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "escalation_rules_new_from_role_fkey"
            columns: ["from_role"]
            isOneToOne: false
            referencedRelation: "roles_new"
            referencedColumns: ["role_id"]
          },
          {
            foreignKeyName: "escalation_rules_new_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organisation"
            referencedColumns: ["org_id"]
          },
          {
            foreignKeyName: "escalation_rules_new_to_role_fkey"
            columns: ["to_role"]
            isOneToOne: false
            referencedRelation: "roles_new"
            referencedColumns: ["role_id"]
          },
        ]
      }
      guest: {
        Row: {
          country: string | null
          created_at: string
          email: string | null
          ext_id: string | null
          first_name: string | null
          guest_id: string
          last_name: string | null
          org_id: string
          phone: string | null
        }
        Insert: {
          country?: string | null
          created_at?: string
          email?: string | null
          ext_id?: string | null
          first_name?: string | null
          guest_id?: string
          last_name?: string | null
          org_id: string
          phone?: string | null
        }
        Update: {
          country?: string | null
          created_at?: string
          email?: string | null
          ext_id?: string | null
          first_name?: string | null
          guest_id?: string
          last_name?: string | null
          org_id?: string
          phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "guest_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organisation"
            referencedColumns: ["org_id"]
          },
        ]
      }
      integration_configs: {
        Row: {
          config_data: Json | null
          created_at: string | null
          error_message: string | null
          id: string
          integration_name: string
          last_sync: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          config_data?: Json | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          integration_name: string
          last_sync?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          config_data?: Json | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          integration_name?: string
          last_sync?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      mcp_audit_trail: {
        Row: {
          duration_ms: number
          error_message: string | null
          id: string
          ip_address: string | null
          method: string
          params: Json | null
          profile_type: string
          result: Json | null
          roles: string[] | null
          session_id: string
          timestamp: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          duration_ms: number
          error_message?: string | null
          id: string
          ip_address?: string | null
          method: string
          params?: Json | null
          profile_type: string
          result?: Json | null
          roles?: string[] | null
          session_id: string
          timestamp?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          duration_ms?: number
          error_message?: string | null
          id?: string
          ip_address?: string | null
          method?: string
          params?: Json | null
          profile_type?: string
          result?: Json | null
          roles?: string[] | null
          session_id?: string
          timestamp?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      notification_settings: {
        Row: {
          created_at: string | null
          delivery_method: string[] | null
          id: string
          is_enabled: boolean | null
          notification_type: string
          threshold_value: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          delivery_method?: string[] | null
          id?: string
          is_enabled?: boolean | null
          notification_type: string
          threshold_value?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          delivery_method?: string[] | null
          id?: string
          is_enabled?: boolean | null
          notification_type?: string
          threshold_value?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      organisation: {
        Row: {
          created_at: string
          name: string
          org_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          name: string
          org_id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          name?: string
          org_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      permissions: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      profile_permissions: {
        Row: {
          geographical_zones:
            | Database["public"]["Enums"]["geographical_zone"][]
            | null
          id: string
          permission_id: string
          profile_type: Database["public"]["Enums"]["user_profile"]
        }
        Insert: {
          geographical_zones?:
            | Database["public"]["Enums"]["geographical_zone"][]
            | null
          id?: string
          permission_id: string
          profile_type: Database["public"]["Enums"]["user_profile"]
        }
        Update: {
          geographical_zones?:
            | Database["public"]["Enums"]["geographical_zone"][]
            | null
          id?: string
          permission_id?: string
          profile_type?: Database["public"]["Enums"]["user_profile"]
        }
        Relationships: [
          {
            foreignKeyName: "profile_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          first_name: string | null
          geographical_zones:
            | Database["public"]["Enums"]["geographical_zone"][]
            | null
          id: string
          is_active: boolean | null
          last_name: string | null
          phone: string | null
          profile_type: Database["public"]["Enums"]["user_profile"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name?: string | null
          geographical_zones?:
            | Database["public"]["Enums"]["geographical_zone"][]
            | null
          id?: string
          is_active?: boolean | null
          last_name?: string | null
          phone?: string | null
          profile_type?: Database["public"]["Enums"]["user_profile"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string | null
          geographical_zones?:
            | Database["public"]["Enums"]["geographical_zone"][]
            | null
          id?: string
          is_active?: boolean | null
          last_name?: string | null
          phone?: string | null
          profile_type?: Database["public"]["Enums"]["user_profile"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      property: {
        Row: {
          address: string
          amenities: Json
          created_at: string
          ext_id: string | null
          latitude: number | null
          longitude: number | null
          name: string
          org_id: string
          property_id: string
          status: string
        }
        Insert: {
          address: string
          amenities?: Json
          created_at?: string
          ext_id?: string | null
          latitude?: number | null
          longitude?: number | null
          name: string
          org_id: string
          property_id?: string
          status?: string
        }
        Update: {
          address?: string
          amenities?: Json
          created_at?: string
          ext_id?: string | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          org_id?: string
          property_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organisation"
            referencedColumns: ["org_id"]
          },
        ]
      }
      property_channel: {
        Row: {
          channel_id: string
          external_listing_id: string | null
          property_id: string
        }
        Insert: {
          channel_id: string
          external_listing_id?: string | null
          property_id: string
        }
        Update: {
          channel_id?: string
          external_listing_id?: string | null
          property_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_channel_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channel"
            referencedColumns: ["channel_id"]
          },
          {
            foreignKeyName: "property_channel_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "property"
            referencedColumns: ["property_id"]
          },
        ]
      }
      request_types: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          display_order: number
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      reservation: {
        Row: {
          adults: number
          channel_id: string
          check_in: string
          check_out: string
          children: number
          created_at: string
          ext_res_id: string | null
          guest_id: string
          property_id: string
          res_id: string
          status: string
          total_amount: number | null
        }
        Insert: {
          adults?: number
          channel_id: string
          check_in: string
          check_out: string
          children?: number
          created_at?: string
          ext_res_id?: string | null
          guest_id: string
          property_id: string
          res_id?: string
          status: string
          total_amount?: number | null
        }
        Update: {
          adults?: number
          channel_id?: string
          check_in?: string
          check_out?: string
          children?: number
          created_at?: string
          ext_res_id?: string | null
          guest_id?: string
          property_id?: string
          res_id?: string
          status?: string
          total_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "reservation_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channel"
            referencedColumns: ["channel_id"]
          },
          {
            foreignKeyName: "reservation_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "guest"
            referencedColumns: ["guest_id"]
          },
          {
            foreignKeyName: "reservation_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "property"
            referencedColumns: ["property_id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          created_at: string
          id: string
          permission_id: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          created_at?: string
          id?: string
          permission_id: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          created_at?: string
          id?: string
          permission_id?: string
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
        ]
      }
      roles_new: {
        Row: {
          description: string | null
          name: string
          org_id: string
          role_id: string
        }
        Insert: {
          description?: string | null
          name: string
          org_id: string
          role_id?: string
        }
        Update: {
          description?: string | null
          name?: string
          org_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "roles_new_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organisation"
            referencedColumns: ["org_id"]
          },
        ]
      }
      routing_matrix: {
        Row: {
          created_at: string
          id: string
          permission_type: string
          request_type_id: string
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          permission_type: string
          request_type_id: string
          role: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          permission_type?: string
          request_type_id?: string
          role?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "routing_matrix_request_type_id_fkey"
            columns: ["request_type_id"]
            isOneToOne: false
            referencedRelation: "request_types"
            referencedColumns: ["id"]
          },
        ]
      }
      scheduled_reports: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          last_run_at: string | null
          next_run_at: string
          parameters: Json | null
          recipients: string[] | null
          report_name: string
          report_type: string
          schedule_pattern: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          last_run_at?: string | null
          next_run_at: string
          parameters?: Json | null
          recipients?: string[] | null
          report_name: string
          report_type: string
          schedule_pattern: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          last_run_at?: string | null
          next_run_at?: string
          parameters?: Json | null
          recipients?: string[] | null
          report_name?: string
          report_type?: string
          schedule_pattern?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      system_incidents: {
        Row: {
          assigned_to: string | null
          created_at: string
          description: string | null
          error_details: Json | null
          id: string
          incident_type: string
          resolution_notes: string | null
          resolved_at: string | null
          severity: string
          source_component: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          description?: string | null
          error_details?: Json | null
          id?: string
          incident_type: string
          resolution_notes?: string | null
          resolved_at?: string | null
          severity?: string
          source_component?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          description?: string | null
          error_details?: Json | null
          id?: string
          incident_type?: string
          resolution_notes?: string | null
          resolved_at?: string | null
          severity?: string
          source_component?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          category: string
          description: string | null
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          category: string
          description?: string | null
          id?: string
          setting_key: string
          setting_value: Json
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          category?: string
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: Json
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      webhook_configs: {
        Row: {
          created_at: string
          endpoint_url: string
          id: string
          is_active: boolean
          name: string
          retry_count: number
          secret_token: string | null
          timeout_seconds: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          endpoint_url: string
          id?: string
          is_active?: boolean
          name: string
          retry_count?: number
          secret_token?: string | null
          timeout_seconds?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          endpoint_url?: string
          id?: string
          is_active?: boolean
          name?: string
          retry_count?: number
          secret_token?: string | null
          timeout_seconds?: number
          updated_at?: string
        }
        Relationships: []
      }
      webhook_logs: {
        Row: {
          attempt_number: number
          created_at: string
          error_message: string | null
          event_type: string
          id: string
          payload: Json
          processing_time_ms: number | null
          response_body: string | null
          response_status: number | null
          webhook_config_id: string | null
        }
        Insert: {
          attempt_number?: number
          created_at?: string
          error_message?: string | null
          event_type: string
          id?: string
          payload: Json
          processing_time_ms?: number | null
          response_body?: string | null
          response_status?: number | null
          webhook_config_id?: string | null
        }
        Update: {
          attempt_number?: number
          created_at?: string
          error_message?: string | null
          event_type?: string
          id?: string
          payload?: Json
          processing_time_ms?: number | null
          response_body?: string | null
          response_status?: number | null
          webhook_config_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "webhook_logs_webhook_config_id_fkey"
            columns: ["webhook_config_id"]
            isOneToOne: false
            referencedRelation: "webhook_configs"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_metrics: {
        Row: {
          completed_at: string | null
          created_at: string
          duration_ms: number | null
          error_message: string | null
          execution_id: string | null
          id: string
          input_data: Json | null
          output_data: Json | null
          retry_count: number | null
          started_at: string
          status: string
          updated_at: string
          workflow_name: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          duration_ms?: number | null
          error_message?: string | null
          execution_id?: string | null
          id?: string
          input_data?: Json | null
          output_data?: Json | null
          retry_count?: number | null
          started_at?: string
          status?: string
          updated_at?: string
          workflow_name: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          duration_ms?: number | null
          error_message?: string | null
          execution_id?: string | null
          id?: string
          input_data?: Json | null
          output_data?: Json | null
          retry_count?: number | null
          started_at?: string
          status?: string
          updated_at?: string
          workflow_name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      assign_user_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
          _assigned_by: string
          _expires_at?: string
        }
        Returns: undefined
      }
      cleanup_mcp_audit_trail: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_current_user_profile_type: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["user_profile"]
      }
      get_user_role_level: {
        Args: { _user_id: string }
        Returns: number
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      trigger_webhook_notification: {
        Args: { webhook_name: string; event_type: string; payload: Json }
        Returns: undefined
      }
    }
    Enums: {
      app_role:
        | "super_admin"
        | "administrateur"
        | "superviseur"
        | "responsable_logistique"
        | "responsable_qualite"
        | "technicien"
        | "agent"
        | "comptabilite"
        | "femme_de_menage"
      geographical_zone:
        | "paris_centre"
        | "paris_ouest"
        | "paris_est"
        | "paris_nord"
        | "paris_sud"
        | "ile_de_france"
        | "province"
        | "international"
      user_profile:
        | "agent"
        | "comptabilite"
        | "femme_de_menage"
        | "technicien"
        | "administrateur"
        | "responsable_logistique"
        | "responsable_qualite"
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
      app_role: [
        "super_admin",
        "administrateur",
        "superviseur",
        "responsable_logistique",
        "responsable_qualite",
        "technicien",
        "agent",
        "comptabilite",
        "femme_de_menage",
      ],
      geographical_zone: [
        "paris_centre",
        "paris_ouest",
        "paris_est",
        "paris_nord",
        "paris_sud",
        "ile_de_france",
        "province",
        "international",
      ],
      user_profile: [
        "agent",
        "comptabilite",
        "femme_de_menage",
        "technicien",
        "administrateur",
        "responsable_logistique",
        "responsable_qualite",
      ],
    },
  },
} as const
