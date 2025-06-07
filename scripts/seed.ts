// Seed script disabled - using mock data for deployment
// import { supabase } from '../src/lib/supabase'

async function seedDatabase() {
  console.log('🌱 Database seeding skipped - using mock data in API routes')
  console.log('✅ To enable database seeding, configure Supabase and uncomment the code below')
  return

  /*
  console.log('🌱 Starting database seed...')

  try {
    // Clear existing data
    console.log('🧹 Clearing existing data...')
    await supabase.from('metrics').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('insights').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('properties').delete().neq('id', '00000000-0000-0000-0000-000000000000')

    // Insert properties
    console.log('🏨 Inserting properties...')
    const { data: properties, error: propError } = await supabase
      .from('properties')
      .insert([
        {
          name: 'Surfers Paradise Resort',
          location: 'Gold Coast, QLD',
          emoji: '🌊',
          photo_url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
        },
        {
          name: 'Byron Bay Beachfront',
          location: 'Byron Bay, NSW',
          emoji: '🏖️',
          photo_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
        },
        {
          name: 'Melbourne CBD Tower',
          location: 'Melbourne, VIC',
          emoji: '🌳',
          photo_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
        }
      ])
      .select()

    if (propError) {
      console.error('Error inserting properties:', propError)
      return
    }

    console.log(`✅ Inserted ${properties.length} properties`)

    // Generate and insert metrics for the last 45 days
    console.log('📊 Generating metrics data...')
    const metrics = []
    const baseDate = new Date()
    
    for (let i = -45; i <= 0; i++) {
      const date = new Date(baseDate)
      date.setDate(date.getDate() + i)
      
      for (const property of properties) {
        // Generate realistic mock data with some variance
        const baseOccupancy = property.name.includes('Surfers') ? 85 : 
                             property.name.includes('Byron') ? 65 : 78
        const occupancy = Math.max(30, Math.min(100, baseOccupancy + (Math.random() - 0.5) * 20))
        
        const adr = Math.max(80, 150 + (Math.random() - 0.5) * 40)
        const revpar = (occupancy / 100) * adr
        
        metrics.push({
          property_id: property.id,
          date: date.toISOString().split('T')[0],
          bookings_today: Math.floor(Math.random() * 50) + 20,
          revenue_today: Math.floor(revpar * 100),
          occupancy_rate: Math.round(occupancy),
          revpar: Math.round(revpar * 100) / 100,
          adr: Math.round(adr * 100) / 100,
          walk_ins: Math.floor(Math.random() * 10) + 2,
          staff_hours_scheduled: Math.floor(Math.random() * 20) + 40,
          staff_hours_worked: Math.floor(Math.random() * 15) + 35,
          review_score: Math.round((4.2 + Math.random() * 0.6) * 100) / 100
        })
      }
    }

    const { error: metricsError } = await supabase
      .from('metrics')
      .insert(metrics)

    if (metricsError) {
      console.error('Error inserting metrics:', metricsError)
      return
    }

    console.log(`✅ Inserted ${metrics.length} metrics records`)

    // Insert insights
    console.log('💡 Inserting insights...')
    const insights = [
      {
        property_id: properties[0].id,
        severity: 'low' as const,
        category: 'trend',
        text: 'Walk-in trend up 28% at Surfers Paradise Resort',
        cta_label: 'Hold Inventory',
        cta_href: '/inventory'
      },
      {
        property_id: properties[1].id,
        severity: 'medium' as const,
        category: 'revenue',
        text: 'RevPAR momentum slowing at Byron Bay Beachfront',
        cta_label: 'Adjust Pricing',
        cta_href: '/pricing'
      },
      {
        property_id: properties[2].id,
        severity: 'low' as const,
        category: 'satisfaction',
        text: 'Guest satisfaction improving at Melbourne CBD Tower',
        cta_label: 'View Reviews',
        cta_href: '/reviews'
      }
    ]

    const { error: insightsError } = await supabase
      .from('insights')
      .insert(insights)

    if (insightsError) {
      console.error('Error inserting insights:', insightsError)
      return
    }

    console.log(`✅ Inserted ${insights.length} insights`)
    console.log('🎉 Database seeding completed successfully!')

  } catch (error) {
    console.error('❌ Error during seeding:', error)
  }
  */
}

// Only run if called directly
if (require.main === module) {
  seedDatabase()
}

export default seedDatabase
