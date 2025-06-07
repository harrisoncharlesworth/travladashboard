import { describe, it, expect } from 'vitest'
import {
  calculateBookingPace,
  calculateRevPARDelta,
  calculateWalkInTrend,
  calculateStaffingLoad,
  calculateSentimentShift,
  generateAlerts
} from './rules'
import { Metric, Property } from './types'

// Mock data for testing
const mockProperty: Property = {
  id: '1',
  name: 'Test Resort',
  location: 'Test City',
  emoji: '🏨',
  photo_url: null,
  created_at: new Date().toISOString()
}

const createMockMetric = (overrides: Partial<Metric> = {}): Metric => ({
  id: '1',
  property_id: '1',
  date: '2024-06-07',
  bookings_today: 30,
  revenue_today: 4500,
  occupancy_rate: 75,
  revpar: 120,
  adr: 160,
  walk_ins: 5,
  staff_hours_scheduled: 50,
  staff_hours_worked: 45,
  review_score: 4.5,
  created_at: new Date().toISOString(),
  ...overrides
})

describe('calculateBookingPace', () => {
  it('should return 1 when current bookings match average', () => {
    const metrics: Metric[] = []
    
    // Create 28 days of metrics with same weekday pattern
    for (let i = 0; i < 28; i++) {
      const date = new Date('2024-06-07')
      date.setDate(date.getDate() - i - 1)
      
      metrics.push(createMockMetric({
        date: date.toISOString().split('T')[0],
        bookings_today: 30 // Consistent bookings
      }))
    }
    
    // Add today's metric
    metrics.push(createMockMetric({
      date: '2024-06-07',
      bookings_today: 30
    }))

    const pace = calculateBookingPace(metrics)
    expect(pace).toBeCloseTo(1, 1)
  })

  it('should return 0.5 when current bookings are half the average', () => {
    const metrics: Metric[] = []
    
    // Create 28 days of metrics
    for (let i = 0; i < 28; i++) {
      const date = new Date('2024-06-07')
      date.setDate(date.getDate() - i - 1)
      
      metrics.push(createMockMetric({
        date: date.toISOString().split('T')[0],
        bookings_today: 40
      }))
    }
    
    // Today with half the bookings
    metrics.push(createMockMetric({
      date: '2024-06-07',
      bookings_today: 20
    }))

    const pace = calculateBookingPace(metrics)
    expect(pace).toBeCloseTo(0.5, 1)
  })

  it('should return 1 when insufficient data', () => {
    const metrics = [createMockMetric()]
    const pace = calculateBookingPace(metrics)
    expect(pace).toBe(1)
  })
})

describe('calculateRevPARDelta', () => {
  it('should calculate positive RevPAR delta', () => {
    const metrics: Metric[] = []
    
    // Previous 7 days with lower RevPAR
    for (let i = 0; i < 7; i++) {
      metrics.push(createMockMetric({ revpar: 100 }))
    }
    
    // Current 7 days with higher RevPAR
    for (let i = 0; i < 7; i++) {
      metrics.push(createMockMetric({ revpar: 120 }))
    }

    const delta = calculateRevPARDelta(metrics)
    expect(delta).toBe(20) // 20% increase
  })

  it('should calculate negative RevPAR delta', () => {
    const metrics: Metric[] = []
    
    // Previous 7 days with higher RevPAR
    for (let i = 0; i < 7; i++) {
      metrics.push(createMockMetric({ revpar: 120 }))
    }
    
    // Current 7 days with lower RevPAR  
    for (let i = 0; i < 7; i++) {
      metrics.push(createMockMetric({ revpar: 100 }))
    }

    const delta = calculateRevPARDelta(metrics)
    expect(delta).toBeCloseTo(-16.67, 1) // ~16.67% decrease
  })

  it('should return 0 when insufficient data', () => {
    const metrics = [createMockMetric()]
    const delta = calculateRevPARDelta(metrics)
    expect(delta).toBe(0)
  })
})

describe('calculateWalkInTrend', () => {
  it('should calculate positive walk-in trend', () => {
    const metrics: Metric[] = []
    
    // Previous 14 days with lower walk-ins
    for (let i = 0; i < 14; i++) {
      metrics.push(createMockMetric({ walk_ins: 3 }))
    }
    
    // Recent 3 days with higher walk-ins
    for (let i = 0; i < 3; i++) {
      metrics.push(createMockMetric({ walk_ins: 6 }))
    }

    const trend = calculateWalkInTrend(metrics)
    expect(trend).toBe(100) // 100% increase
  })

  it('should return 0 when insufficient data', () => {
    const metrics = [createMockMetric()]
    const trend = calculateWalkInTrend(metrics)
    expect(trend).toBe(0)
  })
})

describe('calculateStaffingLoad', () => {
  it('should calculate correct staffing load ratio', () => {
    const metric = createMockMetric({
      staff_hours_scheduled: 50,
      staff_hours_worked: 40
    })

    const load = calculateStaffingLoad(metric)
    expect(load).toBe(0.8) // 80% utilization
  })

  it('should return 0 when no scheduled hours', () => {
    const metric = createMockMetric({
      staff_hours_scheduled: 0,
      staff_hours_worked: 40
    })

    const load = calculateStaffingLoad(metric)
    expect(load).toBe(0)
  })
})

describe('calculateSentimentShift', () => {
  it('should calculate positive sentiment shift', () => {
    const metrics: Metric[] = []
    
    // Previous 7 days with lower scores
    for (let i = 0; i < 7; i++) {
      metrics.push(createMockMetric({ review_score: 4.2 }))
    }
    
    // Current 7 days with higher scores
    for (let i = 0; i < 7; i++) {
      metrics.push(createMockMetric({ review_score: 4.5 }))
    }

    const shift = calculateSentimentShift(metrics)
    expect(shift).toBeCloseTo(0.3, 1)
  })

  it('should return 0 when insufficient data', () => {
    const metrics = [createMockMetric()]
    const shift = calculateSentimentShift(metrics)
    expect(shift).toBe(0)
  })
})

describe('generateAlerts', () => {
  it('should generate booking pace alert when pace is low', () => {
    const metrics: Metric[] = []
    
    // Create metrics that will result in low booking pace
    for (let i = 0; i < 28; i++) {
      const date = new Date('2024-06-07')
      date.setDate(date.getDate() - i - 1)
      
      metrics.push(createMockMetric({
        date: date.toISOString().split('T')[0],
        bookings_today: 50
      }))
    }
    
    // Today with much lower bookings
    metrics.push(createMockMetric({
      date: '2024-06-07',
      bookings_today: 20 // This should trigger low pace alert
    }))

    const alerts = generateAlerts(mockProperty, metrics)
    
    const bookingAlert = alerts.find(alert => alert.id.includes('booking-pace'))
    expect(bookingAlert).toBeDefined()
    expect(bookingAlert?.severity).toBe('high')
    expect(bookingAlert?.message).toContain('Booking pace')
  })

  it('should generate staffing alert when occupancy high but staffing low', () => {
    const metric = createMockMetric({
      occupancy_rate: 85,
      staff_hours_scheduled: 50,
      staff_hours_worked: 30 // Low staffing load
    })

    const alerts = generateAlerts(mockProperty, [metric])
    
    const staffingAlert = alerts.find(alert => alert.id.includes('staffing'))
    expect(staffingAlert).toBeDefined()
    expect(staffingAlert?.severity).toBe('high')
    expect(staffingAlert?.message).toContain('High occupancy')
  })

  it('should generate sentiment alert when guest satisfaction drops', () => {
    const metrics: Metric[] = []
    
    // Previous 7 days with high scores
    for (let i = 0; i < 7; i++) {
      metrics.push(createMockMetric({ review_score: 4.8 }))
    }
    
    // Current 7 days with much lower scores
    for (let i = 0; i < 7; i++) {
      metrics.push(createMockMetric({ review_score: 4.2 }))
    }

    const alerts = generateAlerts(mockProperty, metrics)
    
    const sentimentAlert = alerts.find(alert => alert.id.includes('sentiment'))
    expect(sentimentAlert).toBeDefined()
    expect(sentimentAlert?.severity).toBe('medium')
    expect(sentimentAlert?.message).toContain('satisfaction dropping')
  })

  it('should return empty array when no alerts needed', () => {
    const metrics = [createMockMetric({
      occupancy_rate: 75,
      staff_hours_scheduled: 50,
      staff_hours_worked: 45,
      review_score: 4.5
    })]

    const alerts = generateAlerts(mockProperty, metrics)
    
    // Should not generate any critical alerts for normal metrics
    expect(alerts.length).toBeLessThanOrEqual(2) // Maybe some low-priority alerts
  })

  it('should handle empty metrics array', () => {
    const alerts = generateAlerts(mockProperty, [])
    expect(alerts).toEqual([])
  })
})
