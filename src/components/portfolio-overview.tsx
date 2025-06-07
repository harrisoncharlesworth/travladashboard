"use client"

// import { useState, useEffect } from "react"
import useSWR from "swr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, ResponsiveContainer, Area, AreaChart } from "recharts"
import { AlertTriangle, TrendingUp, TrendingDown, Minus, Calendar, Users, DollarSign, Star } from "lucide-react"
import { cn } from "@/lib/utils"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface KPICardData {
  title: string
  value: string
  change: number
  trend: 'up' | 'down' | 'stable'
  sparklineData: { value: number }[]
  format: 'currency' | 'percentage' | 'number' | 'rating'
}

interface PropertyOccupancy {
  id: string
  name: string
  occupancy: number
  date: string
}

interface AlertData {
  id: string
  severity: 'low' | 'medium' | 'high'
  message: string
  action?: string
  href?: string
}

const kpiCards: KPICardData[] = [
  {
    title: "Today's Pick-up",
    value: "47",
    change: 23.1,
    trend: 'up',
    format: 'number',
    sparklineData: [
      { value: 32 }, { value: 35 }, { value: 41 }, { value: 38 }, { value: 45 }, { value: 42 }, { value: 47 }
    ]
  },
  {
    title: "7-Day Pickup Velocity",
    value: "18.5%",
    change: -5.2,
    trend: 'down',
    format: 'percentage',
    sparklineData: [
      { value: 22 }, { value: 24 }, { value: 21 }, { value: 19 }, { value: 17 }, { value: 16 }, { value: 18.5 }
    ]
  },
  {
    title: "RevPAR YoY Delta",
    value: "$182",
    change: 8.7,
    trend: 'up',
    format: 'currency',
    sparklineData: [
      { value: 165 }, { value: 168 }, { value: 172 }, { value: 175 }, { value: 178 }, { value: 180 }, { value: 182 }
    ]
  },
  {
    title: "OTA vs Direct Ratio",
    value: "68:32",
    change: -2.1,
    trend: 'down',
    format: 'number',
    sparklineData: [
      { value: 70 }, { value: 69.5 }, { value: 69 }, { value: 68.8 }, { value: 68.5 }, { value: 68.2 }, { value: 68 }
    ]
  },
  {
    title: "Net Promoter Score",
    value: "4.6",
    change: 0.2,
    trend: 'up',
    format: 'rating',
    sparklineData: [
      { value: 4.4 }, { value: 4.3 }, { value: 4.4 }, { value: 4.5 }, { value: 4.5 }, { value: 4.6 }, { value: 4.6 }
    ]
  }
]

const mockOccupancyData: PropertyOccupancy[] = [
  { id: "1", name: "Surfers Paradise Resort", occupancy: 85, date: "2024-06-07" },
  { id: "2", name: "Byron Bay Beachfront", occupancy: 62, date: "2024-06-07" },
  { id: "3", name: "Melbourne CBD Tower", occupancy: 78, date: "2024-06-07" },
  { id: "1", name: "Surfers Paradise Resort", occupancy: 88, date: "2024-06-08" },
  { id: "2", name: "Byron Bay Beachfront", occupancy: 58, date: "2024-06-08" },
  { id: "3", name: "Melbourne CBD Tower", occupancy: 82, date: "2024-06-08" },
]

const mockAlerts: AlertData[] = [
  {
    id: "1",
    severity: "high",
    message: "Byron Bay Beachfront weekend forecast below 65%. Recommend flash sale.",
    action: "Launch Flash Sale",
    href: "/flash-sale"
  },
  {
    id: "2",
    severity: "medium",
    message: "Melbourne CBD Tower staffing below 70% with high occupancy expected.",
    action: "Call Casual Staff",
    href: "/staffing"
  }
]

function KPICard({ title, value, change, trend, sparklineData, format }: KPICardData) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <TrendIcon className={cn("h-4 w-4", trendColor)} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center justify-between mt-4">
          <div className={cn("text-xs flex items-center", trendColor)}>
            <TrendIcon className="h-3 w-3 mr-1" />
            {Math.abs(change).toFixed(1)}%
          </div>
          <div className="h-8 w-16">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData}>
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke={trend === 'up' ? '#16a34a' : trend === 'down' ? '#dc2626' : '#6b7280'}
                  fill={trend === 'up' ? '#16a34a20' : trend === 'down' ? '#dc262620' : '#6b728020'}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function OccupancyHeatmap({ data }: { data: PropertyOccupancy[] }) {
  const properties = [...new Set(data.map(d => d.name))]
  const dates = [...new Set(data.map(d => d.date))].sort()
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>30-Day Occupancy Forecast</CardTitle>
        <CardDescription>
          Occupancy percentage by property over the next 30 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {properties.map(property => {
            const propertyData = data.filter(d => d.name === property)
            const avgOccupancy = propertyData.reduce((sum, d) => sum + d.occupancy, 0) / propertyData.length
            
            return (
              <div key={property} className="flex items-center space-x-2">
                <div className="w-32 text-sm font-medium truncate">{property}</div>
                <div className="flex-1 h-6 bg-muted rounded">
                  <div 
                    className={cn(
                      "h-full rounded transition-all",
                      avgOccupancy >= 80 ? "bg-green-500" :
                      avgOccupancy >= 65 ? "bg-yellow-500" : "bg-red-500"
                    )}
                    style={{ width: `${avgOccupancy}%` }}
                  />
                </div>
                <div className="w-12 text-sm text-right">{Math.round(avgOccupancy)}%</div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export function PortfolioOverview() {
  const { data: metrics, error, isLoading } = useSWR('/api/metrics', fetcher, {
    refreshInterval: 3000,
    revalidateOnFocus: false
  })
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="space-y-0 pb-2">
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20 mb-4" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {kpiCards.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>

      {/* Critical Alerts Banner */}
      {mockAlerts.length > 0 && (
        <div className="space-y-3">
          {mockAlerts.map(alert => (
            <Alert key={alert.id} className={cn(
              "border-l-4",
              alert.severity === 'high' ? "border-l-red-500 bg-red-50 dark:bg-red-950/20" :
              alert.severity === 'medium' ? "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/20" :
              "border-l-blue-500 bg-blue-50 dark:bg-blue-950/20"
            )}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>{alert.message}</span>
                {alert.action && alert.href && (
                  <Button size="sm" variant="outline" asChild>
                    <a href={alert.href}>{alert.action}</a>
                  </Button>
                )}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OccupancyHeatmap data={mockOccupancyData} />
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Insights</CardTitle>
            <CardDescription>
              Latest automated insights and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="h-2 w-2 rounded-full bg-green-500 mt-2" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Walk-in trend up 28% at Surfers Paradise</p>
                  <p className="text-xs text-muted-foreground">Recommend holding inventory for late bookings</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="h-2 w-2 rounded-full bg-yellow-500 mt-2" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">RevPAR momentum slowing at Byron Bay</p>
                  <p className="text-xs text-muted-foreground">Consider dynamic pricing adjustment</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Guest satisfaction improving at Melbourne CBD</p>
                  <p className="text-xs text-muted-foreground">Recent operational changes showing positive impact</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
