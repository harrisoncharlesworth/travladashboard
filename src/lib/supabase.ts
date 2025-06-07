import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      properties: {
        Row: {
          id: string
          name: string
          location: string
          emoji: string
          photo_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          location: string
          emoji: string
          photo_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          location?: string
          emoji?: string
          photo_url?: string | null
          created_at?: string
        }
      }
      metrics: {
        Row: {
          id: string
          property_id: string
          date: string
          bookings_today: number
          revenue_today: number
          occupancy_rate: number
          revpar: number
          adr: number
          walk_ins: number
          staff_hours_scheduled: number
          staff_hours_worked: number
          review_score: number
          created_at: string
        }
        Insert: {
          id?: string
          property_id: string
          date: string
          bookings_today: number
          revenue_today: number
          occupancy_rate: number
          revpar: number
          adr: number
          walk_ins: number
          staff_hours_scheduled: number
          staff_hours_worked: number
          review_score: number
          created_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          date?: string
          bookings_today?: number
          revenue_today?: number
          occupancy_rate?: number
          revpar?: number
          adr?: number
          walk_ins?: number
          staff_hours_scheduled?: number
          staff_hours_worked?: number
          review_score?: number
          created_at?: string
        }
      }
      insights: {
        Row: {
          id: string
          property_id: string | null
          severity: 'low' | 'medium' | 'high'
          category: string
          text: string
          cta_label: string | null
          cta_href: string | null
          created_at: string
        }
        Insert: {
          id?: string
          property_id?: string | null
          severity: 'low' | 'medium' | 'high'
          category: string
          text: string
          cta_label?: string | null
          cta_href?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          property_id?: string | null
          severity?: 'low' | 'medium' | 'high'
          category?: string
          text?: string
          cta_label?: string | null
          cta_href?: string | null
          created_at?: string
        }
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
  }
}
