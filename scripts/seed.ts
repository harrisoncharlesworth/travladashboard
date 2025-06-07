import { supabase } from '../src/lib/supabase'

async function seedDatabase() {
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

    if (propError) throw propError
    if (!properties || properties.length === 0) throw new Error('No properties returned')

    console.log(`✅ Inserted ${properties.length} properties`)

    // Generate metrics for the last 45 days
    console.log('📊 Generating metrics data...')
    const metrics = []
    const baseDate = new Date()

    for (let i = -45; i <= 0; i++) {
      const date = new Date(baseDate)
      date.setDate(date.getDate() + i)

      for (const property of properties) {
        // Generate realistic mock data with some variance
        const propertyIndex = properties.indexOf(property)
        const baseOccupancy = [85, 65, 78][propertyIndex]
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

    // Insert metrics in batches
    const batchSize = 100
    let insertedCount = 0
    
    for (let i = 0; i < metrics.length; i += batchSize) {
      const batch = metrics.slice(i, i + batchSize)
      const { error: metricsError } = await supabase
        .from('metrics')
        .insert(batch)

      if (metricsError) throw metricsError
      insertedCount += batch.length
      console.log(`📈 Inserted ${insertedCount}/${metrics.length} metrics...`)
    }

    console.log(`✅ Inserted ${metrics.length} metrics`)

    // Insert sample insights
    console.log('💡 Inserting insights...')
    const insightsData = [
      {
        property_id: properties[0].id,
        severity: 'high' as const,
        category: 'revenue',
        text: 'Weekend occupancy forecast below 65%. Flash sale could recover $12,000 in lost revenue.',
        cta_label: 'Launch Flash Sale',
        cta_href: '/flash-sale'
      },
      {
        property_id: properties[1].id,
        severity: 'medium' as const,
        category: 'operations',
        text: 'Staffing utilization at 68% with high occupancy expected. Consider calling casual staff.',
        cta_label: 'View Staff Roster',
        cta_href: '/staffing'
      },
      {
        property_id: properties[2].id,
        severity: 'low' as const,
        category: 'satisfaction',
        text: 'Guest satisfaction improved 0.3 points this week following housekeeping training program.',
        cta_label: 'View Reviews',
        cta_href: '/reviews'
      },
      {
        property_id: null,
        severity: 'high' as const,
        category: 'revenue',
        text: 'Portfolio RevPAR down 8.5% vs last year across all properties. Market analysis suggests pricing adjustment.',
        cta_label: 'View Market Analysis',
        cta_href: '/market-analysis'
      }
    ]

    const { error: insightsError } = await supabase
      .from('insights')
      .insert(insightsData)

    if (insightsError) throw insightsError

    console.log(`✅ Inserted ${insightsData.length} insights`)

    console.log('🎉 Database seed completed successfully!')
    
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase()
}

export { seedDatabase }
