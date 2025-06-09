import { NextResponse } from 'next/server'
// import { supabase } from '@/lib/supabase'

// Mock data for development - replace with real Supabase queries
const mockMetrics = {
  properties: generateRealProperties(),
  metrics: generateMockMetrics(),
  insights: generateRealisticInsights()
}

function generateRealProperties() {
  return [
    // Major Cities - Sydney
    { id: "1", name: "Sydney Harbour Luxury Hotel", location: "Sydney, NSW", emoji: "🏨", photo_url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: "2", name: "Bondi Beach Resort", location: "Bondi, NSW", emoji: "🌊", photo_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: "3", name: "Circular Quay Executive Suites", location: "Sydney, NSW", emoji: "🏙️", photo_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: "4", name: "Darling Harbour View Hotel", location: "Sydney, NSW", emoji: "🌉", photo_url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: "5", name: "Manly Beach Hotel", location: "Manly, NSW", emoji: "🏄‍♂️", photo_url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },

    // Melbourne
    { id: "6", name: "Melbourne CBD Tower", location: "Melbourne, VIC", emoji: "🌳", photo_url: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: "7", name: "Southbank Riverside Hotel", location: "Melbourne, VIC", emoji: "🌊", photo_url: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: "8", name: "St Kilda Beachfront", location: "St Kilda, VIC", emoji: "🎡", photo_url: "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: "9", name: "Fitzroy Boutique Hotel", location: "Fitzroy, VIC", emoji: "🎨", photo_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: "10", name: "Docklands Waterfront Resort", location: "Docklands, VIC", emoji: "⛵", photo_url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },

    // Brisbane & Gold Coast
    { id: "11", name: "Brisbane River Hotel", location: "Brisbane, QLD", emoji: "🏞️", photo_url: "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: "12", name: "Surfers Paradise Resort", location: "Gold Coast, QLD", emoji: "🏄‍♀️", photo_url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: "13", name: "Broadbeach Luxury Tower", location: "Gold Coast, QLD", emoji: "🏢", photo_url: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: "14", name: "Byron Bay Beachfront", location: "Byron Bay, NSW", emoji: "🏖️", photo_url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: "15", name: "Coolangatta Surf Resort", location: "Gold Coast, QLD", emoji: "🌊", photo_url: "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },

    // Perth
    { id: "16", name: "Perth City Centre Hotel", location: "Perth, WA", emoji: "🌆", photo_url: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: "17", name: "Fremantle Historic Hotel", location: "Fremantle, WA", emoji: "⚓", photo_url: "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: "18", name: "Cottesloe Beach Resort", location: "Perth, WA", emoji: "🏖️", photo_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: "19", name: "Swan River Lodge", location: "Perth, WA", emoji: "🦢", photo_url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },

    // Adelaide
    { id: "20", name: "Adelaide Hills Retreat", location: "Adelaide, SA", emoji: "🍷", photo_url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: "21", name: "Glenelg Beach Hotel", location: "Adelaide, SA", emoji: "🌅", photo_url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: "22", name: "Barossa Valley Inn", location: "Barossa Valley, SA", emoji: "🍇", photo_url: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },

    // Canberra
    { id: "23", name: "Parliament House Hotel", location: "Canberra, ACT", emoji: "🏛️", photo_url: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: "24", name: "Lake Burley Griffin Lodge", location: "Canberra, ACT", emoji: "🏞️", photo_url: "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },

    // Darwin & Top End
    { id: "25", name: "Darwin Waterfront Hotel", location: "Darwin, NT", emoji: "🐊", photo_url: "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: "26", name: "Kakadu Safari Lodge", location: "Kakadu, NT", emoji: "🦅", photo_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: "27", name: "Uluru Desert Resort", location: "Uluru, NT", emoji: "🏜️", photo_url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },

    // Tasmania
    { id: "28", name: "Hobart Historic Hotel", location: "Hobart, TAS", emoji: "🏔️", photo_url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: "29", name: "Cradle Mountain Lodge", location: "Cradle Mountain, TAS", emoji: "⛰️", photo_url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: "30", name: "Launceston Heritage Inn", location: "Launceston, TAS", emoji: "🌲", photo_url: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },

    // Regional NSW
    { id: "31", name: "Blue Mountains Retreat", location: "Katoomba, NSW", emoji: "🚂", photo_url: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: "32", name: "Hunter Valley Vineyard Hotel", location: "Hunter Valley, NSW", emoji: "🍷", photo_url: "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: "33", name: "Port Stephens Marina Resort", location: "Port Stephens, NSW", emoji: "🐬", photo_url: "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: "34", name: "Newcastle Beach Hotel", location: "Newcastle, NSW", emoji: "⚓", photo_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: "35", name: "Coffs Harbour Resort", location: "Coffs Harbour, NSW", emoji: "🍌", photo_url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },

    // Regional Victoria
    { id: "36", name: "Great Ocean Road Lodge", location: "Torquay, VIC", emoji: "🌊", photo_url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: "37", name: "Twelve Apostles Hotel", location: "Port Campbell, VIC", emoji: "🗿", photo_url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: "38", name: "Yarra Valley Winery Lodge", location: "Yarra Valley, VIC", emoji: "🍇", photo_url: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: "39", name: "Ballarat Heritage Hotel", location: "Ballarat, VIC", emoji: "⚡", photo_url: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: "40", name: "Mornington Peninsula Resort", location: "Mornington, VIC", emoji: "🍷", photo_url: "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },

    // Regional Queensland
    { id: "41", name: "Cairns Tropical Resort", location: "Cairns, QLD", emoji: "🐠", photo_url: "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: "42", name: "Port Douglas Rainforest Lodge", location: "Port Douglas, QLD", emoji: "🌴", photo_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: "43", name: "Whitsunday Islands Resort", location: "Whitsundays, QLD", emoji: "⛵", photo_url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: "44", name: "Townsville Marina Hotel", location: "Townsville, QLD", emoji: "🏖️", photo_url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: "45", name: "Noosa Heads Beachfront", location: "Noosa, QLD", emoji: "🐨", photo_url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },

    // New Zealand - North Island
    { id: "46", name: "Auckland Harbour Hotel", location: "Auckland, NZ", emoji: "🌉", photo_url: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: "47", name: "Bay of Islands Resort", location: "Paihia, NZ", emoji: "🐋", photo_url: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: "48", name: "Wellington Capital Hotel", location: "Wellington, NZ", emoji: "🎭", photo_url: "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: "49", name: "Rotorua Thermal Lodge", location: "Rotorua, NZ", emoji: "♨️", photo_url: "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: "50", name: "Taupo Lakeside Resort", location: "Taupo, NZ", emoji: "🏔️", photo_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },

    // New Zealand - South Island
    { id: "51", name: "Christchurch Garden Hotel", location: "Christchurch, NZ", emoji: "🌺", photo_url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: "52", name: "Queenstown Adventure Lodge", location: "Queenstown, NZ", emoji: "🎿", photo_url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: "53", name: "Milford Sound Resort", location: "Milford Sound, NZ", emoji: "🏔️", photo_url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: "54", name: "Franz Josef Glacier Hotel", location: "Franz Josef, NZ", emoji: "🧊", photo_url: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: "55", name: "Dunedin Historic Hotel", location: "Dunedin, NZ", emoji: "🐧", photo_url: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },

    // Boutique & Luxury Properties
    { id: "56", name: "Kangaroo Island Eco Lodge", location: "Kangaroo Island, SA", emoji: "🦘", photo_url: "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: "57", name: "Lord Howe Island Resort", location: "Lord Howe Island, NSW", emoji: "🏝️", photo_url: "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: "58", name: "Kimberley Outback Lodge", location: "Broome, WA", emoji: "🌅", photo_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: "59", name: "Flinders Ranges Retreat", location: "Flinders Ranges, SA", emoji: "🦎", photo_url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: "60", name: "Grampians Mountain Lodge", location: "Grampians, VIC", emoji: "🏔️", photo_url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },

    // Resort Destinations
    { id: "61", name: "Hamilton Island Resort", location: "Hamilton Island, QLD", emoji: "🏖️", photo_url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: "62", name: "Heron Island Resort", location: "Heron Island, QLD", emoji: "🐢", photo_url: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: "63", name: "Lizard Island Lodge", location: "Lizard Island, QLD", emoji: "🦎", photo_url: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: "64", name: "King Island Retreat", location: "King Island, TAS", emoji: "🧀", photo_url: "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: "65", name: "Bruny Island Lodge", location: "Bruny Island, TAS", emoji: "🦘", photo_url: "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },

    // Urban Business Hotels
    { id: "66", name: "Sydney Airport Hotel", location: "Sydney, NSW", emoji: "✈️", photo_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: "67", name: "Melbourne Conference Centre", location: "Melbourne, VIC", emoji: "🏢", photo_url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: "68", name: "Brisbane Exhibition Hotel", location: "Brisbane, QLD", emoji: "🎪", photo_url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: "69", name: "Perth Convention Centre Hotel", location: "Perth, WA", emoji: "🏛️", photo_url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: "70", name: "Adelaide Festival Hotel", location: "Adelaide, SA", emoji: "🎭", photo_url: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },

    // Final Properties
    { id: "71", name: "Stewart Island Eco Lodge", location: "Stewart Island, NZ", emoji: "🦅", photo_url: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: "72", name: "Coromandel Peninsula Resort", location: "Coromandel, NZ", emoji: "🌊", photo_url: "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" },
    { id: "73", name: "Waiheke Island Vineyard Hotel", location: "Waiheke Island, NZ", emoji: "🍷", photo_url: "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" }
  ]
}

function generateMockMetrics() {
  const metrics = []
  const properties = generateRealProperties()
  const baseDate = new Date()
  
  for (let i = -45; i <= 0; i++) {
    const date = new Date(baseDate)
    date.setDate(date.getDate() + i)
    
    for (const property of properties) {
      // Generate realistic mock data with variance based on property type and location
      let baseOccupancy = 75
      let baseADR = 180
      
      // Adjust base metrics by location and property type
      if (property.location.includes('Sydney') || property.location.includes('Melbourne')) {
        baseOccupancy = 82
        baseADR = 220
      } else if (property.location.includes('Gold Coast') || property.location.includes('Byron Bay')) {
        baseOccupancy = 78
        baseADR = 195
      } else if (property.location.includes('Perth') || property.location.includes('Brisbane')) {
        baseOccupancy = 75
        baseADR = 165
      } else if (property.location.includes('NZ')) {
        baseOccupancy = 70
        baseADR = 145
      } else if (property.location.includes('Island') || property.name.includes('Resort')) {
        baseOccupancy = 85
        baseADR = 280
      } else if (property.name.includes('Eco') || property.name.includes('Retreat')) {
        baseOccupancy = 68
        baseADR = 200
      }
      
      // Add seasonal variance (higher in summer months for Australia)
      const month = date.getMonth()
      const isAusSummer = month >= 11 || month <= 2
      const isNZSummer = month >= 11 || month <= 2
      
      if (property.location.includes('QLD') || property.location.includes('NSW')) {
        baseOccupancy += isAusSummer ? 15 : -5
        baseADR += isAusSummer ? 30 : -15
      } else if (property.location.includes('NZ')) {
        baseOccupancy += isNZSummer ? 12 : -8
        baseADR += isNZSummer ? 25 : -20
      }
      
      const occupancy = Math.max(25, Math.min(100, baseOccupancy + (Math.random() - 0.5) * 25))
      const adr = Math.max(80, baseADR + (Math.random() - 0.5) * 60)
      const revpar = (occupancy / 100) * adr
      
      metrics.push({
        id: `${property.id}-${date.toISOString().split('T')[0]}`,
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
        review_score: Math.round((4.2 + Math.random() * 0.6) * 100) / 100,
        created_at: new Date().toISOString()
      })
    }
  }
  
  return metrics
}

function generateRealisticInsights() {
  const properties = generateRealProperties()
  const insights = []
  
  // Generate 25 varied insights across different properties
  const insightTemplates = [
    { severity: "high", category: "revenue", template: "Revenue down 15% at {name} - competitor pricing aggressive", cta: "Review Pricing" },
    { severity: "medium", category: "trend", template: "Walk-in bookings trending up 22% at {name}", cta: "Hold Inventory" },
    { severity: "low", category: "satisfaction", template: "Guest satisfaction scores improving at {name} (+0.3 points)", cta: "View Reviews" },
    { severity: "medium", category: "staffing", template: "Labor costs 8% over budget at {name}", cta: "Adjust Schedule" },
    { severity: "high", category: "occupancy", template: "Occupancy forecast showing 20% decline next week at {name}", cta: "Boost Marketing" },
    { severity: "low", category: "trend", template: "Corporate bookings up 18% at {name}", cta: "Expand B2B Sales" },
    { severity: "medium", category: "revenue", template: "RevPAR momentum slowing at {name} (-5% vs last month)", cta: "Adjust Strategy" },
    { severity: "low", category: "operational", template: "Checkout efficiency improved by 12 minutes at {name}", cta: "Share Best Practice" },
    { severity: "high", category: "competitive", template: "New competitor opened 500m from {name}", cta: "Competitive Analysis" },
    { severity: "medium", category: "maintenance", template: "Air conditioning issues reported at {name} - guest complaints rising", cta: "Schedule Repair" },
    { severity: "low", category: "digital", template: "Online review response rate at 95% for {name}", cta: "Maintain Engagement" },
    { severity: "medium", category: "booking", template: "Cancellation rate up 12% at {name}", cta: "Review Policy" },
    { severity: "high", category: "staffing", template: "High staff turnover detected at {name} (25% last quarter)", cta: "HR Review" },
    { severity: "low", category: "upsell", template: "Room upgrade conversion rate increased to 28% at {name}", cta: "Expand Program" },
    { severity: "medium", category: "seasonal", template: "Shoulder season demand stronger than expected at {name}", cta: "Optimize Rates" },
    { severity: "low", category: "loyalty", template: "Repeat guest percentage at 42% for {name}", cta: "Loyalty Program" },
    { severity: "high", category: "reputation", template: "Negative review trend emerging at {name} - service quality concerns", cta: "Immediate Action" },
    { severity: "medium", category: "forecast", template: "Group bookings 30% below forecast at {name}", cta: "Sales Outreach" },
    { severity: "low", category: "efficiency", template: "Energy costs reduced 8% at {name} with new systems", cta: "Scale Solution" },
    { severity: "medium", category: "technology", template: "WiFi satisfaction scores below average at {name}", cta: "Upgrade Infrastructure" },
    { severity: "high", category: "compliance", template: "Safety audit required at {name} - certification expires soon", cta: "Schedule Audit" },
    { severity: "low", category: "amenity", template: "Spa bookings up 35% at {name}", cta: "Expand Services" },
    { severity: "medium", category: "distribution", template: "OTA commission costs rising at {name} (+$2.5k this month)", cta: "Direct Booking Push" },
    { severity: "low", category: "event", template: "Wedding inquiry volume up 45% at {name}", cta: "Event Marketing" },
    { severity: "medium", category: "ancillary", template: "Restaurant revenue per guest down 18% at {name}", cta: "Menu Analysis" }
  ]
  
  // Select random properties and insights
  for (let i = 0; i < 25; i++) {
    const randomProperty = properties[Math.floor(Math.random() * properties.length)]
    const randomTemplate = insightTemplates[i % insightTemplates.length]
    
    insights.push({
      id: (i + 1).toString(),
      property_id: randomProperty.id,
      severity: randomTemplate.severity as 'low' | 'medium' | 'high',
      category: randomTemplate.category,
      text: randomTemplate.template.replace('{name}', randomProperty.name),
      cta_label: randomTemplate.cta,
      cta_href: `/${randomTemplate.category}`,
      created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() // Random time within last week
    })
  }
  
  return insights
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
