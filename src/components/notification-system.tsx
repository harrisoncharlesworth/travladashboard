"use client"

import { useEffect, useRef } from "react"
import useSWR from "swr"
import { showToast } from "@/components/ui/toast"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface NotificationSystemProps {
  enabled?: boolean
}

export function NotificationSystem({ enabled = true }: NotificationSystemProps) {
  const previousDataRef = useRef<any>(null)
  
  const { data: response } = useSWR('/api/metrics', fetcher, {
    refreshInterval: enabled ? 10000 : 0, // Poll every 10 seconds when enabled
    revalidateOnFocus: false
  })

  useEffect(() => {
    if (!enabled || !response?.data?.metrics || !previousDataRef.current) {
      previousDataRef.current = response?.data
      return
    }

    const currentMetrics = response.data.metrics
    const previousMetrics = previousDataRef.current?.metrics || []
    
    if (previousMetrics.length === 0) {
      previousDataRef.current = response.data
      return
    }

    // Check for significant changes and alert conditions
    const properties = response.data.properties || []
    
    properties.forEach((property: any) => {
      const currentPropertyMetrics = currentMetrics
        .filter((m: any) => m.property_id === property.id)
        .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
      
      const previousPropertyMetrics = previousMetrics
        .filter((m: any) => m.property_id === property.id)
        .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())

      if (currentPropertyMetrics.length === 0 || previousPropertyMetrics.length === 0) return

      const current = currentPropertyMetrics[currentPropertyMetrics.length - 1]
      const previous = previousPropertyMetrics[previousPropertyMetrics.length - 1]

      // Check for significant occupancy drops
      if (current.occupancy_rate < previous.occupancy_rate - 10) {
        showToast({
          title: "Occupancy Alert",
          description: `${property.name} occupancy dropped to ${current.occupancy_rate}%`,
          variant: "destructive"
        })
      }

      // Check for high revenue performance
      if (current.revenue_today > previous.revenue_today * 1.2) {
        showToast({
          title: "Revenue Milestone",
          description: `${property.name} revenue up ${Math.round(((current.revenue_today - previous.revenue_today) / previous.revenue_today) * 100)}%!`,
          variant: "success"
        })
      }

      // Check for low staff coverage with high occupancy
      const staffUtilization = current.staff_hours_worked / current.staff_hours_scheduled
      if (current.occupancy_rate > 80 && staffUtilization < 0.7) {
        showToast({
          title: "Staffing Alert",
          description: `${property.name} needs more staff - ${current.occupancy_rate}% occupancy but only ${Math.round(staffUtilization * 100)}% staff coverage`,
          variant: "destructive"
        })
      }

      // Check for excellent review scores
      if (current.review_score > 4.5 && (previous.review_score <= 4.5 || Math.random() < 0.1)) {
        showToast({
          title: "Guest Satisfaction",
          description: `${property.name} achieving excellent ${current.review_score}/5 rating!`,
          variant: "success"
        })
      }
    })

    previousDataRef.current = response.data
  }, [response, enabled])

  return null // This component doesn't render anything visible
}
