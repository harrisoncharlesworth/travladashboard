import { NextResponse } from 'next/server'
// import { supabase } from '@/lib/supabase'

// Mock data for development - replace with real Supabase queries
const mockMetrics = {
  properties: [
    {
      id: "1",
      name: "Surfers Paradise Resort",
      location: "Gold Coast, QLD",
      emoji: "🌊",
      photo_url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: "2", 
      name: "Byron Bay Beachfront",
      location: "Byron Bay, NSW",
      emoji: "🏖️",
      photo_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: "3",
      name: "Melbourne CBD Tower", 
      location: "Melbourne, VIC",
      emoji: "🌳",
      photo_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    }
  ],
  metrics: generateMockMetrics(),
  insights: [
    {
      id: "1",
      property_id: "1",
      severity: "low",
      category: "trend",
      text: "Walk-in trend up 28% at Surfers Paradise Resort",
      cta_label: "Hold Inventory",
      cta_href: "/inventory",
      created_at: new Date().toISOString()
    },
    {
      id: "2", 
      property_id: "2",
      severity: "medium",
      category: "revenue",
      text: "RevPAR momentum slowing at Byron Bay Beachfront", 
      cta_label: "Adjust Pricing",
      cta_href: "/pricing",
      created_at: new Date().toISOString()
    },
    {
      id: "3",
      property_id: "3", 
      severity: "low",
      category: "satisfaction",
      text: "Guest satisfaction improving at Melbourne CBD Tower",
      cta_label: "View Reviews",
      cta_href: "/reviews", 
      created_at: new Date().toISOString()
    }
  ]
}

function generateMockMetrics() {
  const metrics = []
  const properties = ["1", "2", "3"]
  const baseDate = new Date()
  
  for (let i = -45; i <= 0; i++) {
    const date = new Date(baseDate)
    date.setDate(date.getDate() + i)
    
    for (const propertyId of properties) {
      // Generate realistic mock data with some variance
      const baseOccupancy = propertyId === "1" ? 85 : propertyId === "2" ? 65 : 78
      const occupancy = Math.max(30, Math.min(100, baseOccupancy + (Math.random() - 0.5) * 20))
      
      const adr = Math.max(80, 150 + (Math.random() - 0.5) * 40)
      const revpar = (occupancy / 100) * adr
      
      metrics.push({
        id: `${propertyId}-${date.toISOString().split('T')[0]}`,
        property_id: propertyId,
        date: date.toISOString().split('T')[0],
        bookings_today: Math.floor(Math.random() * 50) + 20,
        revenue_today: Math.floor(revpar * 100),
        occupancy_rate: Math.round(occupancy),
        revpar: Math.round(revpar * 100) / 100,
        adr: Math.round(adr * 100) / 100,
        walk_ins: Math.floor(Math.random() * 10) + 2,
        staff_hours_scheduled: Math.floor(Math.random() * 20) + 40,
        staff_hours_worked: Math.floor(Math.random() * 15) + 35,
        review_score: Math.round((4.2 + Math.random() * 0.6) * 100) / 100,
        created_at: new Date().toISOString()
      })
    }
  }
  
  return metrics
}

export async function GET() {
  try {
    // Simple test response first
    return NextResponse.json({
      success: true,
      message: "API is working",
      data: mockMetrics
    })
    
  } catch (error) {
    console.error('Error fetching metrics:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch metrics' },
      { status: 500 }
    )
  }
}
