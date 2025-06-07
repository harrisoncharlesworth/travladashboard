import { Metric, Property, Alert } from './types'

export function calculateBookingPace(metrics: Metric[]): number {
  if (metrics.length < 28) return 1
  
  const today = new Date()
  const dayOfWeek = today.getDay()
  
  // Get last 24h bookings
  const latest = metrics[metrics.length - 1]
  const todayBookings = latest.bookings_today
  
  // Get same weekday average for past 4 weeks
  const sameWeekdays = metrics.filter((m, index) => {
    const metricDate = new Date(m.date)
    return metricDate.getDay() === dayOfWeek && index < metrics.length - 1
  }).slice(-4)
  
  const avgBookings = sameWeekdays.reduce((sum, m) => sum + m.bookings_today, 0) / sameWeekdays.length
  
  return avgBookings > 0 ? todayBookings / avgBookings : 1
}

export function calculateRevPARDelta(metrics: Metric[]): number {
  if (metrics.length < 14) return 0
  
  const current7Days = metrics.slice(-7)
  const prev7Days = metrics.slice(-14, -7)
  
  const currentRevPAR = current7Days.reduce((sum, m) => sum + m.revpar, 0) / 7
  const prevRevPAR = prev7Days.reduce((sum, m) => sum + m.revpar, 0) / 7
  
  return prevRevPAR > 0 ? ((currentRevPAR - prevRevPAR) / prevRevPAR) * 100 : 0
}

export function calculateWalkInTrend(metrics: Metric[]): number {
  if (metrics.length < 17) return 0
  
  const last3Days = metrics.slice(-3)
  const prev14Days = metrics.slice(-17, -3)
  
  const recent3DayAvg = last3Days.reduce((sum, m) => sum + m.walk_ins, 0) / 3
  const prev14DayAvg = prev14Days.reduce((sum, m) => sum + m.walk_ins, 0) / 14
  
  return prev14DayAvg > 0 ? ((recent3DayAvg - prev14DayAvg) / prev14DayAvg) * 100 : 0
}

export function calculateStaffingLoad(metric: Metric): number {
  return metric.staff_hours_scheduled > 0 ? 
    metric.staff_hours_worked / metric.staff_hours_scheduled : 0
}

export function calculateSentimentShift(metrics: Metric[]): number {
  if (metrics.length < 14) return 0
  
  const current7Days = metrics.slice(-7)
  const prev7Days = metrics.slice(-14, -7)
  
  const currentScore = current7Days.reduce((sum, m) => sum + m.review_score, 0) / 7
  const prevScore = prev7Days.reduce((sum, m) => sum + m.review_score, 0) / 7
  
  return currentScore - prevScore
}

export function generateAlerts(property: Property, metrics: Metric[]): Alert[] {
  const alerts: Alert[] = []
  
  if (metrics.length === 0) return alerts
  
  const latestMetric = metrics[metrics.length - 1]
  
  // Booking pace alert
  const bookingPace = calculateBookingPace(metrics)
  if (bookingPace < 0.8) {
    alerts.push({
      id: `booking-pace-${property.id}`,
      severity: 'high',
      message: `Booking pace is ${Math.round(bookingPace * 100)}% of normal for ${property.name}`,
      action: 'Launch flash sale',
      href: '/flash-sale'
    })
  }
  
  // RevPAR delta alert
  const revparDelta = calculateRevPARDelta(metrics)
  if (revparDelta < -5) {
    alerts.push({
      id: `revpar-delta-${property.id}`,
      severity: 'medium',
      message: `RevPAR down ${Math.abs(revparDelta).toFixed(1)}% vs last week at ${property.name}`,
      action: 'Review pricing',
      href: '/pricing'
    })
  }
  
  // Occupancy + staffing mismatch
  if (latestMetric.occupancy_rate > 80 && calculateStaffingLoad(latestMetric) < 0.7) {
    alerts.push({
      id: `staffing-${property.id}`,
      severity: 'high',
      message: `High occupancy (${latestMetric.occupancy_rate}%) but low staffing at ${property.name}`,
      action: 'Call casual staff',
      href: '/staffing'
    })
  }
  
  // Walk-in trend
  const walkInTrend = calculateWalkInTrend(metrics)
  if (walkInTrend > 25) {
    alerts.push({
      id: `walkin-trend-${property.id}`,
      severity: 'low',
      message: `Walk-ins trending up ${walkInTrend.toFixed(1)}% at ${property.name}`,
      action: 'Hold inventory',
      href: '/inventory'
    })
  }
  
  // Sentiment shift
  const sentimentShift = calculateSentimentShift(metrics)
  if (sentimentShift < -0.3) {
    alerts.push({
      id: `sentiment-${property.id}`,
      severity: 'medium',
      message: `Guest satisfaction dropping at ${property.name} (${sentimentShift.toFixed(1)} point decline)`,
      action: 'Review recent feedback',
      href: '/reviews'
    })
  }
  
  // Weekend occupancy forecast
  const today = new Date()
  const daysToWeekend = (6 - today.getDay() + 7) % 7 || 7
  const weekendMetrics = metrics.slice(-daysToWeekend)
  const avgOccupancy = weekendMetrics.reduce((sum, m) => sum + m.occupancy_rate, 0) / weekendMetrics.length
  
  if (avgOccupancy < 65) {
    alerts.push({
      id: `weekend-occupancy-${property.id}`,
      severity: 'high',
      message: `Weekend forecast below 65% at ${property.name}`,
      action: 'Run flash sale',
      href: '/flash-sale'
    })
  }
  
  return alerts
}
