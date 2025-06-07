"use client"

import { useState, useEffect } from "react"
import useSWR from "swr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Star,
  Filter,
  Search,
  Clock,
  ExternalLink
} from "lucide-react"
import { cn } from "@/lib/utils"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface Insight {
  id: string
  property_id: string | null
  property_name?: string
  severity: 'low' | 'medium' | 'high'
  category: string
  text: string
  cta_label: string | null
  cta_href: string | null
  created_at: string
}

// Mock insights data with more variety
const mockInsights: Insight[] = [
  {
    id: "1",
    property_id: "1",
    property_name: "Surfers Paradise Resort",
    severity: "high",
    category: "revenue",
    text: "Weekend occupancy forecast below 65%. Flash sale could recover $12,000 in lost revenue.",
    cta_label: "Launch Flash Sale",
    cta_href: "/flash-sale",
    created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString()
  },
  {
    id: "2", 
    property_id: "2",
    property_name: "Byron Bay Beachfront",
    severity: "medium",
    category: "operations",
    text: "Staffing utilization at 68% with high occupancy expected. Consider calling casual staff.",
    cta_label: "View Staff Roster",
    cta_href: "/staffing",
    created_at: new Date(Date.now() - 25 * 60 * 1000).toISOString()
  },
  {
    id: "3",
    property_id: "3",
    property_name: "Melbourne CBD Tower",
    severity: "low",
    category: "satisfaction",
    text: "Guest satisfaction improved 0.3 points this week following housekeeping training program.",
    cta_label: "View Reviews",
    cta_href: "/reviews",
    created_at: new Date(Date.now() - 45 * 60 * 1000).toISOString()
  },
  {
    id: "4",
    property_id: "1", 
    property_name: "Surfers Paradise Resort",
    severity: "medium",
    category: "bookings",
    text: "Walk-in trend up 28% vs last week. Recommend holding 5-8 rooms for late arrivals.",
    cta_label: "Adjust Inventory",
    cta_href: "/inventory",
    created_at: new Date(Date.now() - 90 * 60 * 1000).toISOString()
  },
  {
    id: "5",
    property_id: null,
    property_name: "Portfolio",
    severity: "high",
    category: "revenue",
    text: "Portfolio RevPAR down 8.5% vs last year across all properties. Market analysis suggests pricing adjustment.",
    cta_label: "View Market Analysis",
    cta_href: "/market-analysis",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "6",
    property_id: "2",
    property_name: "Byron Bay Beachfront", 
    severity: "low",
    category: "trend",
    text: "OTA booking share decreased 3% this week. Direct booking campaign showing positive results.",
    cta_label: "View Campaign Stats",
    cta_href: "/campaigns",
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "7",
    property_id: "3",
    property_name: "Melbourne CBD Tower",
    severity: "medium",
    category: "operations",
    text: "Energy consumption 15% above budget this month. HVAC optimization could save $2,400.",
    cta_label: "Review Energy Usage",
    cta_href: "/energy",
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "8",
    property_id: "1",
    property_name: "Surfers Paradise Resort",
    severity: "low",
    category: "maintenance",
    text: "Pool maintenance scheduled for Thursday. Minimal guest impact expected during off-peak hours.",
    cta_label: "View Schedule",
    cta_href: "/maintenance",
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
  }
]

const severityConfig = {
  high: {
    color: "border-l-red-500 bg-red-50 dark:bg-red-950/20",
    badge: "destructive",
    icon: AlertTriangle
  },
  medium: {
    color: "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/20", 
    badge: "default",
    icon: TrendingDown
  },
  low: {
    color: "border-l-blue-500 bg-blue-50 dark:bg-blue-950/20",
    badge: "secondary", 
    icon: TrendingUp
  }
} as const

const categoryIcons = {
  revenue: DollarSign,
  operations: Users,
  satisfaction: Star,
  bookings: TrendingUp,
  trend: TrendingUp,
  maintenance: AlertTriangle
} as const

function formatTimeAgo(dateString: string): string {
  const now = new Date()
  const date = new Date(dateString)
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) return "Just now"
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h ago`
  
  const diffInDays = Math.floor(diffInHours / 24)
  return `${diffInDays}d ago`
}

function InsightCard({ insight }: { insight: Insight }) {
  const config = severityConfig[insight.severity]
  const CategoryIcon = categoryIcons[insight.category as keyof typeof categoryIcons] || AlertTriangle
  const SeverityIcon = config.icon

  return (
    <Card className={cn("border-l-4 transition-all hover:shadow-md", config.color)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <CategoryIcon className="h-4 w-4 text-muted-foreground" />
            <Badge variant={config.badge as any} className="text-xs">
              {insight.severity.toUpperCase()}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {insight.category}
            </Badge>
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            {formatTimeAgo(insight.created_at)}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">{insight.property_name}</span>
          {insight.property_id === null && (
            <Badge variant="outline" className="text-xs">Portfolio-wide</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm mb-4 leading-relaxed">{insight.text}</p>
        
        {insight.cta_label && insight.cta_href && (
          <div className="flex justify-end">
            <Button size="sm" variant="outline" asChild>
              <a href={insight.cta_href} className="flex items-center">
                {insight.cta_label}
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function InsightsFeed() {
  const [insights, setInsights] = useState<Insight[]>([])
  const [filteredInsights, setFilteredInsights] = useState<Insight[]>([])
  const [severityFilter, setSeverityFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [propertyFilter, setPropertyFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)

  // Simulate data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setInsights(mockInsights)
      setFilteredInsights(mockInsights)
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Filter insights when filters change
  useEffect(() => {
    let filtered = insights

    if (severityFilter !== "all") {
      filtered = filtered.filter(insight => insight.severity === severityFilter)
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(insight => insight.category === categoryFilter)
    }

    if (propertyFilter !== "all") {
      if (propertyFilter === "portfolio") {
        filtered = filtered.filter(insight => insight.property_id === null)
      } else {
        filtered = filtered.filter(insight => insight.property_id === propertyFilter)
      }
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(insight => 
        insight.text.toLowerCase().includes(query) ||
        insight.property_name?.toLowerCase().includes(query) ||
        insight.category.toLowerCase().includes(query)
      )
    }

    setFilteredInsights(filtered)
  }, [insights, severityFilter, categoryFilter, propertyFilter, searchQuery])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 flex-1" />
          ))}
        </div>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="border-l-4">
              <CardHeader>
                <div className="flex justify-between">
                  <div className="flex space-x-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <div className="flex justify-end">
                  <Skeleton className="h-8 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const uniqueCategories = [...new Set(insights.map(i => i.category))]
  const uniqueProperties = [...new Set(insights.filter(i => i.property_id).map(i => ({ id: i.property_id, name: i.property_name })))]

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search insights..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Severity</label>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All severities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {uniqueCategories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Property</label>
              <Select value={propertyFilter} onValueChange={setPropertyFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All properties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Properties</SelectItem>
                  <SelectItem value="portfolio">Portfolio-wide</SelectItem>
                  {uniqueProperties.map(property => (
                    <SelectItem key={property.id} value={property.id!}>
                      {property.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {filteredInsights.length} of {insights.length} insights
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="destructive" className="text-xs">
            {filteredInsights.filter(i => i.severity === 'high').length} High
          </Badge>
          <Badge variant="default" className="text-xs">
            {filteredInsights.filter(i => i.severity === 'medium').length} Medium
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {filteredInsights.filter(i => i.severity === 'low').length} Low
          </Badge>
        </div>
      </div>

      {/* Insights Feed */}
      <div className="space-y-4">
        {filteredInsights.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground">
                No insights match your current filters.
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredInsights.map(insight => (
            <InsightCard key={insight.id} insight={insight} />
          ))
        )}
      </div>

      {/* Load More Button - for infinite scroll simulation */}
      {filteredInsights.length > 0 && (
        <div className="flex justify-center pt-4">
          <Button variant="outline" disabled>
            All insights loaded
          </Button>
        </div>
      )}
    </div>
  )
}
