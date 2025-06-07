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

const mockChartData = [
  { date: '06/01', bookings: 32, revenue: 4800, occupancy: 75 },
  { date: '06/02', bookings: 28, revenue: 4200, occupancy: 72 },
  { date: '06/03', bookings: 35, revenue: 5250, occupancy: 78 },
  { date: '06/04', bookings: 42, revenue: 6300, occupancy: 85 },
  { date: '06/05', bookings: 38, revenue: 5700, occupancy: 82 },
  { date: '06/06', bookings: 45, revenue: 6750, occupancy: 89 },
  { date: '06/07', bookings: 47, revenue: 7050, occupancy: 85 },
]

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
  const property = properties.find((p: any) => p.id === propertyId)

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
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/properties">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Properties
          </Link>
        </Button>
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
                        <AreaChart data={mockChartData}>
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
                      <LineChart data={mockChartData}>
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
                      <div className="text-sm text-muted-foreground">Staff Utilization</div>
                      <div className="text-2xl font-bold">72%</div>
                      <div className="text-xs text-red-600">Below optimal</div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Maintenance Tasks</div>
                      <div className="text-2xl font-bold">3</div>
                      <div className="text-xs text-green-600">On schedule</div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Energy Usage</div>
                      <div className="text-2xl font-bold">94%</div>
                      <div className="text-xs text-gray-600">Of budget</div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Inventory Status</div>
                      <div className="text-2xl font-bold">98%</div>
                      <div className="text-xs text-green-600">Stocked</div>
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
                <span className="font-semibold">85%</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">RevPAR</span>
                </div>
                <span className="font-semibold">$142.50</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Check-ins</span>
                </div>
                <span className="font-semibold">23</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Rating</span>
                </div>
                <span className="font-semibold">4.6/5</span>
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
