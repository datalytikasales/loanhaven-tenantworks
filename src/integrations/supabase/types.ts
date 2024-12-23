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
      admin: {
        Row: {
          created_at: string | null
          email: string
          id: number
          password: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: number
          password: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: number
          password?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      app_admin_users: {
        Row: {
          company_id: number
          created_at: string | null
          email: string
          id: number
          password: string
          updated_at: string | null
        }
        Insert: {
          company_id: number
          created_at?: string | null
          email: string
          id?: number
          password: string
          updated_at?: string | null
        }
        Update: {
          company_id?: number
          created_at?: string | null
          email?: string
          id?: number
          password?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "app_admin_users_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      app_client_users: {
        Row: {
          client_id: number
          company_id: number
          created_at: string | null
          email: string
          id: number
          password: string
          updated_at: string | null
        }
        Insert: {
          client_id: number
          company_id: number
          created_at?: string | null
          email: string
          id?: number
          password: string
          updated_at?: string | null
        }
        Update: {
          client_id?: number
          company_id?: number
          created_at?: string | null
          email?: string
          id?: number
          password?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "app_client_users_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "app_client_users_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      app_manager_users: {
        Row: {
          company_id: number
          created_at: string | null
          email: string
          id: number
          manager_id: number
          password: string
          updated_at: string | null
        }
        Insert: {
          company_id: number
          created_at?: string | null
          email: string
          id?: number
          manager_id: number
          password: string
          updated_at?: string | null
        }
        Update: {
          company_id?: number
          created_at?: string | null
          email?: string
          id?: number
          manager_id?: number
          password?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "app_manager_users_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "app_manager_users_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "managers"
            referencedColumns: ["id"]
          },
        ]
      }
      client_id_tracker: {
        Row: {
          company_id: number
          created_at: string | null
          id: number
          last_id: string
          updated_at: string | null
        }
        Insert: {
          company_id: number
          created_at?: string | null
          id?: number
          last_id: string
          updated_at?: string | null
        }
        Update: {
          company_id?: number
          created_at?: string | null
          id?: number
          last_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_id_tracker_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      client_next_of_kin: {
        Row: {
          client_id: number
          created_at: string | null
          id: number
          id_photo_back: string
          id_photo_front: string
          name: string | null
          national_id: string | null
          phone_number: string | null
          relation: string | null
          residence: string | null
          updated_at: string | null
        }
        Insert: {
          client_id: number
          created_at?: string | null
          id?: number
          id_photo_back: string
          id_photo_front: string
          name?: string | null
          national_id?: string | null
          phone_number?: string | null
          relation?: string | null
          residence?: string | null
          updated_at?: string | null
        }
        Update: {
          client_id?: number
          created_at?: string | null
          id?: number
          id_photo_back?: string
          id_photo_front?: string
          name?: string | null
          national_id?: string | null
          phone_number?: string | null
          relation?: string | null
          residence?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_next_of_kin_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          client_id: string
          company_id: number
          county: string
          created_at: string | null
          date_of_birth: string
          date_of_onboarding: string
          email: string
          first_name: string
          gender: string | null
          id: number
          id_photo_back: string
          id_photo_front: string
          last_name: string
          national_id: string
          onboarding_officer: string
          passport_photo: string | null
          phone_number: string
          place_of_work: string | null
          residence_nearest_building: string
          residence_nearest_road: string
          salary: number | null
          town_centre: string
          updated_at: string | null
          work_economic_activity: string
        }
        Insert: {
          client_id: string
          company_id: number
          county: string
          created_at?: string | null
          date_of_birth: string
          date_of_onboarding: string
          email: string
          first_name: string
          gender?: string | null
          id?: number
          id_photo_back: string
          id_photo_front: string
          last_name: string
          national_id: string
          onboarding_officer: string
          passport_photo?: string | null
          phone_number: string
          place_of_work?: string | null
          residence_nearest_building: string
          residence_nearest_road: string
          salary?: number | null
          town_centre: string
          updated_at?: string | null
          work_economic_activity: string
        }
        Update: {
          client_id?: string
          company_id?: number
          county?: string
          created_at?: string | null
          date_of_birth?: string
          date_of_onboarding?: string
          email?: string
          first_name?: string
          gender?: string | null
          id?: number
          id_photo_back?: string
          id_photo_front?: string
          last_name?: string
          national_id?: string
          onboarding_officer?: string
          passport_photo?: string | null
          phone_number?: string
          place_of_work?: string | null
          residence_nearest_building?: string
          residence_nearest_road?: string
          salary?: number | null
          town_centre?: string
          updated_at?: string | null
          work_economic_activity?: string
        }
        Relationships: [
          {
            foreignKeyName: "clients_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      collateral: {
        Row: {
          created_at: string | null
          id: number
          loan_id: number
          name: string
          pic_1: string
          pic_2: string
          updated_at: string | null
          value: number
        }
        Insert: {
          created_at?: string | null
          id?: number
          loan_id: number
          name: string
          pic_1: string
          pic_2: string
          updated_at?: string | null
          value: number
        }
        Update: {
          created_at?: string | null
          id?: number
          loan_id?: number
          name?: string
          pic_1?: string
          pic_2?: string
          updated_at?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "collateral_loan_id_fkey"
            columns: ["loan_id"]
            isOneToOne: false
            referencedRelation: "loans"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          company_logo: string | null
          company_name: string
          company_password: string | null
          company_username: string
          contact_person_name: string | null
          created_at: string | null
          email: string
          id: number
          phone_number: string
          physical_address_county: string | null
          physical_address_nearest_road: string | null
          updated_at: string | null
        }
        Insert: {
          company_logo?: string | null
          company_name: string
          company_password?: string | null
          company_username: string
          contact_person_name?: string | null
          created_at?: string | null
          email: string
          id?: number
          phone_number: string
          physical_address_county?: string | null
          physical_address_nearest_road?: string | null
          updated_at?: string | null
        }
        Update: {
          company_logo?: string | null
          company_name?: string
          company_password?: string | null
          company_username?: string
          contact_person_name?: string | null
          created_at?: string | null
          email?: string
          id?: number
          phone_number?: string
          physical_address_county?: string | null
          physical_address_nearest_road?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      guarantors: {
        Row: {
          created_at: string | null
          id: number
          id_photo_back: string | null
          id_photo_front: string | null
          loan_id: number
          name: string | null
          national_id: string | null
          other_1: string | null
          other_2: string | null
          passport_photo: string | null
          phone_number: string | null
          place_of_work: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          id_photo_back?: string | null
          id_photo_front?: string | null
          loan_id: number
          name?: string | null
          national_id?: string | null
          other_1?: string | null
          other_2?: string | null
          passport_photo?: string | null
          phone_number?: string | null
          place_of_work?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          id_photo_back?: string | null
          id_photo_front?: string | null
          loan_id?: number
          name?: string | null
          national_id?: string | null
          other_1?: string | null
          other_2?: string | null
          passport_photo?: string | null
          phone_number?: string | null
          place_of_work?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "guarantors_loan_id_fkey"
            columns: ["loan_id"]
            isOneToOne: false
            referencedRelation: "loans"
            referencedColumns: ["id"]
          },
        ]
      }
      interest: {
        Row: {
          created_at: string | null
          id: number
          interest_model: string | null
          interest_period: string
          interest_rate: number
          loan_id: number
          repayment_installment: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          interest_model?: string | null
          interest_period: string
          interest_rate: number
          loan_id: number
          repayment_installment: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          interest_model?: string | null
          interest_period?: string
          interest_rate?: number
          loan_id?: number
          repayment_installment?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "interest_loan_id_fkey"
            columns: ["loan_id"]
            isOneToOne: true
            referencedRelation: "loans"
            referencedColumns: ["id"]
          },
        ]
      }
      loan_id_tracker: {
        Row: {
          company_id: number
          created_at: string | null
          id: number
          last_id: string
          updated_at: string | null
        }
        Insert: {
          company_id: number
          created_at?: string | null
          id?: number
          last_id: string
          updated_at?: string | null
        }
        Update: {
          company_id?: number
          created_at?: string | null
          id?: number
          last_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loan_id_tracker_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      loan_status_change: {
        Row: {
          created_at: string | null
          id: number
          loan_id: number
          loan_status: string
          loan_status_date: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          loan_id: number
          loan_status?: string
          loan_status_date?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          loan_id?: number
          loan_status?: string
          loan_status_date?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loan_status_change_loan_id_fkey"
            columns: ["loan_id"]
            isOneToOne: false
            referencedRelation: "loans"
            referencedColumns: ["id"]
          },
        ]
      }
      loan_tenor: {
        Row: {
          created_at: string | null
          duration: number
          duration_period: string
          id: number
          loan_id: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          duration: number
          duration_period: string
          id?: number
          loan_id: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          duration?: number
          duration_period?: string
          id?: number
          loan_id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loan_tenor_loan_id_fkey"
            columns: ["loan_id"]
            isOneToOne: false
            referencedRelation: "loans"
            referencedColumns: ["id"]
          },
        ]
      }
      loans: {
        Row: {
          client_id: number
          created_at: string | null
          id: number
          loan_applicant_email: string
          loan_applicant_role: string
          loan_id: string
          loan_purpose: string
          loan_status: string
          principal: number
          signed_application_form: string | null
          status_change_date: string
          updated_at: string | null
        }
        Insert: {
          client_id: number
          created_at?: string | null
          id?: number
          loan_applicant_email: string
          loan_applicant_role: string
          loan_id: string
          loan_purpose: string
          loan_status?: string
          principal: number
          signed_application_form?: string | null
          status_change_date: string
          updated_at?: string | null
        }
        Update: {
          client_id?: number
          created_at?: string | null
          id?: number
          loan_applicant_email?: string
          loan_applicant_role?: string
          loan_id?: string
          loan_purpose?: string
          loan_status?: string
          principal?: number
          signed_application_form?: string | null
          status_change_date?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loans_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      manager_id_tracker: {
        Row: {
          company_id: number
          created_at: string | null
          id: number
          last_id: string
          updated_at: string | null
        }
        Insert: {
          company_id: number
          created_at?: string | null
          id?: number
          last_id: string
          updated_at?: string | null
        }
        Update: {
          company_id?: number
          created_at?: string | null
          id?: number
          last_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "manager_id_tracker_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      manager_next_of_kin: {
        Row: {
          created_at: string | null
          id: number
          manager_id: number
          name: string
          phone_number: string
          relation: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          manager_id: number
          name: string
          phone_number: string
          relation: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          manager_id?: number
          name?: string
          phone_number?: string
          relation?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "manager_next_of_kin_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "managers"
            referencedColumns: ["id"]
          },
        ]
      }
      managers: {
        Row: {
          company_id: number
          county: string
          created_at: string | null
          date_of_onboarding: string
          dob: string
          email: string
          first_name: string
          gender: string | null
          id: number
          id_photo_back: string
          id_photo_front: string
          kra_pin: string
          last_name: string
          manager_id: string
          national_id: string
          nhif: string
          nssf: string
          phone_number: string
          residence_nearest_building: string
          residence_nearest_road: string
          town_centre: string
          updated_at: string | null
        }
        Insert: {
          company_id: number
          county: string
          created_at?: string | null
          date_of_onboarding: string
          dob: string
          email: string
          first_name: string
          gender?: string | null
          id?: number
          id_photo_back: string
          id_photo_front: string
          kra_pin: string
          last_name: string
          manager_id: string
          national_id: string
          nhif: string
          nssf: string
          phone_number: string
          residence_nearest_building: string
          residence_nearest_road: string
          town_centre: string
          updated_at?: string | null
        }
        Update: {
          company_id?: number
          county?: string
          created_at?: string | null
          date_of_onboarding?: string
          dob?: string
          email?: string
          first_name?: string
          gender?: string | null
          id?: number
          id_photo_back?: string
          id_photo_front?: string
          kra_pin?: string
          last_name?: string
          manager_id?: string
          national_id?: string
          nhif?: string
          nssf?: string
          phone_number?: string
          residence_nearest_building?: string
          residence_nearest_road?: string
          town_centre?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "managers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
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
