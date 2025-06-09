"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import useSWR from "swr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts"
import { 
  ArrowLeft, 
  MapPin, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Star, 
  AlertTriangle,
  Calendar,
  Phone,
  Mail,
  Settings
} from "lucide-react"
import { cn } from "@/lib/utils"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface PropertyDetailProps {
  propertyId: string
}

// Generate chart data from API metrics
function generateChartData(metrics: any[], propertyId: string) {
  const propertyMetrics = metrics.filter(m => m.property_id === propertyId)
  const last7Days = propertyMetrics.slice(-7)
  
  return last7Days.map(metric => ({
    date: new Date(metric.date).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' }),
    bookings: metric.bookings_today,
    revenue: metric.revenue_today,
    occupancy: metric.occupancy_rate,
    revpar: metric.revpar,
    walkins: metric.walk_ins,
    staffHours: metric.staff_hours_worked
  }))
}

const mockAlerts = [
  {
    id: "1",
    severity: "high" as const,
    message: "Rooms at >80% occupancy but staffing <70% rostered. Recommend calling in casuals.",
    action: "Call Casual Staff",
    href: "/staffing"
  },
  {
    id: "2", 
    severity: "medium" as const,
    message: "Weekend pricing below market rate. Consider dynamic adjustment.",
    action: "Adjust Pricing",
    href: "/pricing"
  },
  {
    id: "3",
    severity: "low" as const,
    message: "Guest satisfaction trending up with recent service improvements.",
    action: "View Feedback",
    href: "/reviews"
  }
]

export function PropertyDetail({ propertyId }: PropertyDetailProps) {
  const [activeTab, setActiveTab] = useState("bookings")
  
  const { data: response, error, isLoading } = useSWR('/api/metrics', fetcher, {
    refreshInterval: 5000
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            Failed to load property details. Please try again.
          </div>
        </CardContent>
      </Card>
    )
  }

  const properties = response?.data?.properties || []
  const metrics = response?.data?.metrics || []
  const property = properties.find((p: any) => p.id === propertyId)
  
  // Generate chart data from API
  const chartData = generateChartData(metrics, propertyId)
  
  // Get latest metrics for current stats
  const propertyMetrics = metrics.filter((m: any) => m.property_id === propertyId)
  const latestMetric = propertyMetrics[propertyMetrics.length - 1]

  if (!property) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            Property not found.
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb 
        items={[
          { label: "Properties", href: "/properties" },
          { label: property.name, current: true }
        ]}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/properties">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Properties
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{property.location.split(',')[1]?.trim()}</Badge>
          <Badge variant="secondary">ID: {property.id}</Badge>
        </div>
      </div>

      {/* Property Header */}
      <div className="relative overflow-hidden rounded-lg">
        <div className="h-64 relative">
          {property.photo_url ? (
            <Image
              src={property.photo_url}
              alt={property.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-8xl">{property.emoji}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-6 left-6 text-white">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-2xl">{property.emoji}</span>
              <Badge variant="secondary">Live</Badge>
            </div>
            <h1 className="text-3xl font-bold">{property.name}</h1>
            <p className="flex items-center mt-1 text-white/80">
              <MapPin className="h-4 w-4 mr-1" />
              {property.location}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
              <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
              <TabsTrigger value="ops">Operations</TabsTrigger>
            </TabsList>

            <TabsContent value="bookings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Booking Performance</CardTitle>
                  <CardDescription>
                    Daily bookings and occupancy trends
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{
                    bookings: {
                      label: "Bookings",
                      color: "#2563eb",
                    },
                    occupancy: {
                      label: "Occupancy %",
                      color: "#16a34a",
                    },
                  }}>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis yAxisId="left" />
                          <YAxis yAxisId="right" orientation="right" />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Area
                            yAxisId="left"
                            type="monotone"
                            dataKey="bookings"
                            stroke="#2563eb"
                            fill="#2563eb20"
                            name="Bookings"
                          />
                          <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="occupancy"
                            stroke="#16a34a"
                            strokeWidth={2}
                            dot={false}
                            name="Occupancy %"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </ChartContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="revenue" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Performance</CardTitle>
                  <CardDescription>
                    Daily revenue and RevPAR analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{
                    revenue: {
                      label: "Revenue ($)",
                      color: "#dc2626",
                    },
                  }} className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                          type="monotone"
                          dataKey="revenue"
                          stroke="#dc2626"
                          strokeWidth={3}
                          name="Revenue ($)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sentiment" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Guest Sentiment</CardTitle>
                  <CardDescription>
                    Recent reviews and satisfaction trends
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold">4.6/5</div>
                        <div className="text-sm text-muted-foreground">Average Rating</div>
                      </div>
                      <Badge variant="outline" className="text-green-600">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +0.2 this week
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm">"Amazing beachfront location with exceptional service. Will definitely return!"</p>
                          <p className="text-xs text-muted-foreground">Sarah M. • 2 hours ago</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="flex">
                          {Array.from({ length: 4 }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                          <Star className="h-4 w-4 text-gray-300" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm">"Great facilities but room could be cleaner. Staff was very helpful."</p>
                          <p className="text-xs text-muted-foreground">John D. • 5 hours ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ops" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Operations</CardTitle>
                  <CardDescription>
                    Staffing, maintenance, and operational metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Staff Hours Today</div>
                  <div className="text-2xl font-bold">{latestMetric?.staff_hours_worked || 0}</div>
                  <div className="text-xs text-muted-foreground">of {latestMetric?.staff_hours_scheduled || 0} scheduled</div>
                  </div>
                  
                  <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Walk-ins Today</div>
                  <div className="text-2xl font-bold">{latestMetric?.walk_ins || 0}</div>
                  <div className="text-xs text-green-600">Unexpected revenue</div>
                  </div>
                  
                  <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">ADR</div>
                  <div className="text-2xl font-bold">${latestMetric?.adr || 0}</div>
                  <div className="text-xs text-gray-600">Average daily rate</div>
                  </div>
                  
                  <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Revenue Today</div>
                  <div className="text-2xl font-bold">${latestMetric?.revenue_today || 0}</div>
                  <div className="text-xs text-green-600">Daily total</div>
                  </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Today's Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Occupancy</span>
                </div>
                <span className="font-semibold">{latestMetric?.occupancy_rate || 0}%</span>
                </div>
                
                <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">RevPAR</span>
                </div>
                <span className="font-semibold">${latestMetric?.revpar || 0}</span>
                </div>
                
                <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Bookings Today</span>
                </div>
                <span className="font-semibold">{latestMetric?.bookings_today || 0}</span>
                </div>
                
                <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Rating</span>
                </div>
                <span className="font-semibold">{latestMetric?.review_score || 0}/5</span>
              </div>
            </CardContent>
          </Card>

          {/* Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Active Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockAlerts.map(alert => (
                <Alert key={alert.id} className={cn(
                  "p-3",
                  alert.severity === 'high' ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20" :
                  alert.severity === 'medium' ? "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/20" :
                  "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20"
                )}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    <div className="space-y-2">
                      <p>{alert.message}</p>
                      {alert.action && alert.href && (
                        <Button size="sm" variant="outline" className="h-6 text-xs" asChild>
                          <a href={alert.href}>{alert.action}</a>
                        </Button>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Price Calendar
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Mail className="h-4 w-4 mr-2" />
                Email Campaigns
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Phone className="h-4 w-4 mr-2" />
                Staff Roster
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
