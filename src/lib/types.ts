export interface Property {
  id: string
  name: string
  location: string
  emoji: string
  photo_url: string | null
  created_at: string
}

export interface Metric {
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

export interface Insight {
  id: string
  property_id: string | null
  severity: 'low' | 'medium' | 'high'
  category: string
  text: string
  cta_label: string | null
  cta_href: string | null
  created_at: string
}

export interface KPICard {
  title: string
  value: string
  change: number
  trend: 'up' | 'down' | 'stable'
  sparklineData: number[]
}

export interface Alert {
  id: string
  severity: 'low' | 'medium' | 'high'
  message: string
  action?: string
  href?: string
}
