"use client"

import { useState, useMemo } from "react"
import Link from "next/link" 
import Image from "next/image"
import useSWR from "swr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ChartContainer } from "@/components/ui/chart"
import { LineChart, Line, ResponsiveContainer } from "recharts"
import { MapPin, TrendingUp, TrendingDown, Users, DollarSign, Star, Search, Filter, Grid3X3, List, ArrowUpDown, ChevronLeft, ChevronRight, Plus, Minus, BarChart3, X, Settings, Calendar, Mail, Phone, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

// Enhanced fetcher with caching
const fetcher = async (url: string) => {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    
    // Cache successful responses in localStorage
    try {
      localStorage.setItem(`cache_${url}`, JSON.stringify({
        data,
        timestamp: Date.now(),
        expires: Date.now() + (5 * 60 * 1000) // 5 minute cache
      }))
    } catch (e) {
      // Ignore localStorage errors (quota exceeded, etc.)
    }
    
    return data
  } catch (error) {
    // Try to return cached data on error
    try {
      const cached = localStorage.getItem(`cache_${url}`)
      if (cached) {
        const parsedCache = JSON.parse(cached)
        if (parsedCache.expires > Date.now()) {
          console.log('Using cached data due to network error')
          return parsedCache.data
        }
      }
    } catch (e) {
      // Ignore cache errors
    }
    
    throw error
  }
}

interface Property {
  id: string
  name: string
  location: string
  emoji: string
  photo_url: string | null
}

interface PropertyWithMetrics extends Property {
  latestMetrics: {
    occupancy: number
    revpar: number
    adr: number
    review_score: number
    trend: 'up' | 'down' | 'stable'
  } | null
}

interface PropertyMetrics {
  occupancy: number
  revpar: number
  adr: number
  review_score: number
  trend: 'up' | 'down' | 'stable'
  sparklineData: { value: number }[]
}

interface ApiMetric {
  property_id: string
  date: string
  occupancy_rate: number
  revpar: number
  adr: number
  review_score: number
}

// Calculate trend based on recent data points
function calculateTrend(recentMetrics: ApiMetric[]): 'up' | 'down' | 'stable' {
  if (recentMetrics.length < 2) return 'stable'
  
  const latest = recentMetrics[recentMetrics.length - 1]
  const previous = recentMetrics[recentMetrics.length - 2]
  
  const revparChange = ((latest.revpar - previous.revpar) / previous.revpar) * 100
  
  if (revparChange > 2) return 'up'
  if (revparChange < -2) return 'down'
  return 'stable'
}

// Generate sparkline data from API metrics
function generateSparklineData(metrics: ApiMetric[]): { value: number }[] {
  return metrics.slice(-7).map(m => ({ value: m.revpar }))
}

function PropertyCard({ 
  property, 
  apiMetrics, 
  selectedForComparison, 
  onToggleComparison,
  selectedForBulkActions,
  onToggleBulkSelection
}: { 
  property: Property | PropertyWithMetrics; 
  apiMetrics: ApiMetric[];
  selectedForComparison: Set<string>;
  onToggleComparison: (propertyId: string) => void;
  selectedForBulkActions: Set<string>;
  onToggleBulkSelection: (propertyId: string) => void;
}) {
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  // Calculate metrics from API data
  const propertyMetrics = apiMetrics.filter(m => m.property_id === property.id)
  const latestMetric = propertyMetrics[propertyMetrics.length - 1]
  const isSelected = selectedForComparison.has(property.id)
  const isBulkSelected = selectedForBulkActions.has(property.id)
  
  const metrics: PropertyMetrics = latestMetric ? {
    occupancy: latestMetric.occupancy_rate,
    revpar: latestMetric.revpar,
    adr: latestMetric.adr,
    review_score: latestMetric.review_score,
    trend: calculateTrend(propertyMetrics),
    sparklineData: generateSparklineData(propertyMetrics)
  } : {
    occupancy: 0,
    revpar: 0,
    adr: 0,
    review_score: 0,
    trend: 'stable' as const,
    sparklineData: []
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600'
      case 'down': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return TrendingUp
      case 'down': return TrendingDown
      default: return () => null
    }
  }

  const TrendIcon = getTrendIcon(metrics.trend)

  return (
    <Card className={cn(
      "overflow-hidden hover:shadow-lg transition-all",
      isSelected && "ring-2 ring-primary",
      isBulkSelected && "ring-2 ring-blue-500 bg-blue-50/50 dark:bg-blue-950/20"
    )}>
      <div className="relative h-48">
        {/* Bulk selection checkbox */}
        <div className="absolute top-2 left-2 z-10">
          <Checkbox
            checked={isBulkSelected}
            onCheckedChange={() => onToggleBulkSelection(property.id)}
            className="bg-white/90 backdrop-blur shadow-sm"
          />
        </div>
        {property.photo_url && !imageError ? (
          <>
            {imageLoading && (
              <div className="w-full h-full bg-muted flex items-center justify-center absolute inset-0">
                <div className="animate-pulse bg-muted-foreground/20 w-full h-full" />
              </div>
            )}
            <Image
              src={property.photo_url}
              alt={property.name}
              fill
              className={cn(
                "object-cover transition-opacity duration-300",
                imageLoading ? "opacity-0" : "opacity-100"
              )}
              onLoad={() => setImageLoading(false)}
              onError={() => {
                setImageError(true)
                setImageLoading(false)
              }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={false}
            />
          </>
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-6xl">{property.emoji}</span>
          </div>
        )}
        <div className="absolute top-4 left-4">
          <Badge variant="secondary" className="bg-background/80 backdrop-blur">
            {property.emoji} {property.location.split(',')[1]?.trim()}
          </Badge>
        </div>
        <div className="absolute top-4 right-4 flex gap-2">
          <Badge 
            variant={metrics.trend === 'up' ? 'default' : metrics.trend === 'down' ? 'destructive' : 'secondary'}
            className="bg-background/80 backdrop-blur"
          >
            <TrendIcon className="h-3 w-3 mr-1" />
            {metrics.trend}
          </Badge>
          
          {/* Comparison toggle */}
          <Button
            size="sm"
            variant={isSelected ? "default" : "secondary"}
            className="h-6 w-6 p-0 bg-background/80 backdrop-blur hover:bg-background/90"
            onClick={(e) => {
              e.preventDefault()
              onToggleComparison(property.id)
            }}
          >
            {isSelected ? <Minus className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
          </Button>
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-base lg:text-lg truncate">{property.name}</CardTitle>
            <CardDescription className="flex items-center mt-1 text-xs lg:text-sm">
              <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
              <span className="truncate">{property.location}</span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-1">
              <Users className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Occupancy</span>
            </div>
            <div className="text-sm lg:text-lg font-semibold">{metrics.occupancy}%</div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center space-x-1">
              <DollarSign className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">RevPAR</span>
            </div>
            <div className="text-sm lg:text-lg font-semibold">${metrics.revpar}</div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center space-x-1">
              <DollarSign className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">ADR</span>
            </div>
            <div className="text-xs lg:text-sm">${metrics.adr}</div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center space-x-1">
              <Star className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Score</span>
            </div>
            <div className="text-xs lg:text-sm">{metrics.review_score}/5</div>
          </div>
        </div>

        {metrics.sparklineData.length > 0 && (
          <div className="mb-4">
            <div className="text-xs text-muted-foreground mb-2 flex items-center justify-between">
              <span>RevPAR Trend (7 days)</span>
              <span className={cn(
                "text-xs font-medium",
                metrics.trend === 'up' ? 'text-green-600' : 
                metrics.trend === 'down' ? 'text-red-600' : 
                'text-gray-600'
              )}>
                {metrics.trend === 'up' ? '+' : metrics.trend === 'down' ? '-' : '~'}
                {Math.abs(((metrics.sparklineData[metrics.sparklineData.length - 1]?.value || 0) - (metrics.sparklineData[0]?.value || 0)) / (metrics.sparklineData[0]?.value || 1) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="h-12 relative">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metrics.sparklineData}>
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke={metrics.trend === 'up' ? '#16a34a' : metrics.trend === 'down' ? '#dc2626' : '#6b7280'}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
              
              {/* Mini indicators */}
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="flex justify-between items-end h-full px-1">
                  {metrics.sparklineData.map((_, index) => (
                    <div 
                      key={index}
                      className="w-0.5 bg-current opacity-20" 
                      style={{ 
                        height: `${Math.max(10, (metrics.sparklineData[index]?.value || 0) / Math.max(...metrics.sparklineData.map(d => d.value)) * 100)}%` 
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex space-x-2">
          <Button asChild size="sm" className="flex-1 text-xs lg:text-sm h-7 lg:h-8">
            <Link href={`/properties/${property.id}`}>
              <span className="hidden sm:inline">View Details</span>
              <span className="sm:hidden">Details</span>
            </Link>
          </Button>
          <Button variant="outline" size="sm" className="text-xs lg:text-sm h-7 lg:h-8">
            <span className="hidden sm:inline">Quick Actions</span>
            <span className="sm:hidden">Actions</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function PropertiesList() {
  const { data: response, error, isLoading } = useSWR('/api/metrics', fetcher, {
    refreshInterval: 10000,
    dedupingInterval: 5000, // Prevent duplicate requests within 5 seconds
    revalidateOnFocus: false, // Don't refetch when window regains focus
    revalidateOnReconnect: true, // Refetch when connection is restored
    errorRetryCount: 3, // Retry failed requests up to 3 times
    errorRetryInterval: 5000, // Wait 5 seconds between retries
    fallback: {
      '/api/metrics': (() => {
        // Try to load from cache on initial load
        try {
          const cached = localStorage.getItem('cache_/api/metrics')
          if (cached) {
            const parsedCache = JSON.parse(cached)
            if (parsedCache.expires > Date.now()) {
              return parsedCache.data
            }
          }
        } catch (e) {
          // Ignore cache errors
        }
        return undefined
      })()
    }
  })

  // Filter and search state
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedState, setSelectedState] = useState("all")
  const [selectedTrend, setSelectedTrend] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedOccupancyRange, setSelectedOccupancyRange] = useState("all")
  const [selectedRevparRange, setSelectedRevparRange] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(12)
  const [selectedForComparison, setSelectedForComparison] = useState<Set<string>>(new Set())
  const [showComparison, setShowComparison] = useState(false)
  const [selectedForBulkActions, setSelectedForBulkActions] = useState<Set<string>>(new Set())
  const [showBulkActions, setShowBulkActions] = useState(false)

  // Get filtered and sorted properties
  const filteredAndSortedProperties = useMemo(() => {
    if (!response?.data?.properties || !response?.data?.metrics) return []
    
    const properties = response.data.properties
    const metrics = response.data.metrics
    
    // Add latest metrics to each property for filtering/sorting
    const propertiesWithMetrics = properties.map((property: Property): PropertyWithMetrics => {
      const propertyMetrics = metrics.filter((m: ApiMetric) => m.property_id === property.id)
      const latestMetric = propertyMetrics[propertyMetrics.length - 1]
      
      return {
        ...property,
        latestMetrics: latestMetric ? {
          occupancy: latestMetric.occupancy_rate,
          revpar: latestMetric.revpar,
          adr: latestMetric.adr,
          review_score: latestMetric.review_score,
          trend: calculateTrend(propertyMetrics)
        } : null
      }
    })

    // Filter properties
    let filtered = propertiesWithMetrics.filter((property: PropertyWithMetrics) => {
      // Search query filter
      if (searchQuery && !property.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !property.location.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }

      // State filter
      if (selectedState !== "all" && !property.location.includes(selectedState)) {
        return false
      }

      // Trend filter
      if (selectedTrend !== "all" && property.latestMetrics?.trend !== selectedTrend) {
        return false
      }

      // Occupancy range filter
      if (selectedOccupancyRange !== "all" && property.latestMetrics) {
        const occupancy = property.latestMetrics.occupancy
        switch (selectedOccupancyRange) {
          case "low": return occupancy < 60
          case "medium": return occupancy >= 60 && occupancy < 80
          case "high": return occupancy >= 80
          default: return true
        }
      }

      // RevPAR range filter
      if (selectedRevparRange !== "all" && property.latestMetrics) {
        const revpar = property.latestMetrics.revpar
        switch (selectedRevparRange) {
          case "low": return revpar < 100
          case "medium": return revpar >= 100 && revpar < 200
          case "high": return revpar >= 200
          default: return true
        }
      }

      return true
    })

    // Sort properties
    filtered.sort((a: PropertyWithMetrics, b: PropertyWithMetrics) => {
      let aValue, bValue
      
      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case "location":
          aValue = a.location.toLowerCase()
          bValue = b.location.toLowerCase()
          break
        case "occupancy":
          aValue = a.latestMetrics?.occupancy || 0
          bValue = b.latestMetrics?.occupancy || 0
          break
        case "revpar":
          aValue = a.latestMetrics?.revpar || 0
          bValue = b.latestMetrics?.revpar || 0
          break
        case "review_score":
          aValue = a.latestMetrics?.review_score || 0
          bValue = b.latestMetrics?.review_score || 0
          break
        default:
          return 0
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1
      return 0
    })

    return filtered
  }, [response, searchQuery, selectedState, selectedTrend, sortBy, sortOrder, selectedOccupancyRange, selectedRevparRange])

  // Get unique states for filter dropdown
  const states = useMemo(() => {
    if (!response?.data?.properties) return []
    const stateSet = new Set(response.data.properties.map((p: Property) => p.location.split(',')[1]?.trim()).filter(Boolean))
    return Array.from(stateSet).sort()
  }, [response])

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedProperties.length / pageSize)
  const paginatedProperties = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredAndSortedProperties.slice(startIndex, startIndex + pageSize)
  }, [filteredAndSortedProperties, currentPage, pageSize])

  // Reset to first page when filters change
  const resetPagination = () => setCurrentPage(1)

  // Comparison functions
  const togglePropertyComparison = (propertyId: string) => {
    const newSelection = new Set(selectedForComparison)
    if (newSelection.has(propertyId)) {
      newSelection.delete(propertyId)
    } else if (newSelection.size < 4) { // Limit to 4 properties
      newSelection.add(propertyId)
    }
    setSelectedForComparison(newSelection)
  }

  const clearComparison = () => {
    setSelectedForComparison(new Set())
    setShowComparison(false)
  }

  const getComparisonProperties = () => {
    return Array.from(selectedForComparison).map(id => 
      filteredAndSortedProperties.find((p: PropertyWithMetrics) => p.id === id)
    ).filter(Boolean)
  }

  // Bulk actions functions
  const toggleBulkSelection = (propertyId: string) => {
    const newSelection = new Set(selectedForBulkActions)
    if (newSelection.has(propertyId)) {
      newSelection.delete(propertyId)
    } else {
      newSelection.add(propertyId)
    }
    setSelectedForBulkActions(newSelection)
  }

  const selectAllProperties = () => {
    setSelectedForBulkActions(new Set(paginatedProperties.map((p: PropertyWithMetrics) => p.id)))
  }

  const clearBulkSelection = () => {
    setSelectedForBulkActions(new Set())
  }

  const performBulkAction = (action: string) => {
    // In a real app, this would make API calls
    console.log(`Performing ${action} on`, Array.from(selectedForBulkActions))
    // For demo, just clear selection after action
    clearBulkSelection()
  }

  // Market benchmarking helper
  const calculateBenchmark = (property: PropertyWithMetrics, metric: string, value: number) => {
    // Simplified benchmarking based on location and property type
    const location = property.location.split(',')[1]?.trim()
    let benchmark = 0
    
    if (metric === 'occupancy') {
      // Market average occupancy by location
      benchmark = location === 'NSW' ? 78 : location === 'VIC' ? 75 : location === 'QLD' ? 82 : 70
    } else if (metric === 'revpar') {
      // Market average RevPAR by location  
      benchmark = location === 'NSW' ? 180 : location === 'VIC' ? 165 : location === 'QLD' ? 195 : 145
    }
    
    const performance = ((value - benchmark) / benchmark) * 100
    return {
      benchmark,
      performance,
      status: performance > 5 ? 'above' : performance < -5 ? 'below' : 'average'
    }
  }

  // Export functionality
  const exportComparison = () => {
    const comparisonData = getComparisonProperties().map((property: PropertyWithMetrics) => {
      const propertyMetrics = metrics.filter((m: any) => m.property_id === property.id)
      const latestMetric = propertyMetrics[propertyMetrics.length - 1]
      
      return {
        name: property.name,
        location: property.location,
        occupancy: latestMetric?.occupancy_rate || 0,
        revpar: latestMetric?.revpar || 0,
        adr: latestMetric?.adr || 0,
        reviewScore: latestMetric?.review_score || 0,
        trend: calculateTrend(propertyMetrics)
      }
    })

    // Create CSV content
    const headers = ['Property Name', 'Location', 'Occupancy (%)', 'RevPAR ($)', 'ADR ($)', 'Review Score', 'Trend']
    const csvContent = [
      headers.join(','),
      ...comparisonData.map(row => [
        `"${row.name}"`,
        `"${row.location}"`,
        row.occupancy,
        row.revpar,
        row.adr,
        row.reviewScore,
        row.trend
      ].join(','))
    ].join('\n')

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `property-comparison-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Loading state for search and filters */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <Skeleton className="h-10 w-80" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
          <Skeleton className="h-4 w-48" />
        </div>

        {/* Loading state for property cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="space-y-1">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-6 w-12" />
                    </div>
                  ))}
                </div>
                <Skeleton className="h-12 w-full mb-4" />
                <div className="flex space-x-2">
                  <Skeleton className="h-8 flex-1" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            Failed to load properties. Please try again.
          </div>
        </CardContent>
      </Card>
    )
  }

  const metrics = response?.data?.metrics || []

  return (
    <div className="space-y-6">
      {/* Search and Filter Header */}
      <div className="space-y-4">
        {/* Search Bar and View Toggle */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search properties..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                resetPagination()
              }}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            
            <div className="flex items-center gap-2">
              {selectedForBulkActions.size > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowBulkActions(!showBulkActions)}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Actions ({selectedForBulkActions.size})
                </Button>
              )}
              
              {selectedForComparison.size > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowComparison(!showComparison)}
                  className="flex items-center gap-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  Compare ({selectedForComparison.size})
                </Button>
              )}
              
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <Card className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {/* State Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">State/Region</label>
                <Select value={selectedState} onValueChange={(value) => { setSelectedState(value); resetPagination() }}>
                  <SelectTrigger>
                    <SelectValue placeholder="All states" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All States</SelectItem>
                    {states.map((state) => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Trend Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Trend</label>
                <Select value={selectedTrend} onValueChange={(value) => { setSelectedTrend(value); resetPagination() }}>
                  <SelectTrigger>
                    <SelectValue placeholder="All trends" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Trends</SelectItem>
                    <SelectItem value="up">Trending Up</SelectItem>
                    <SelectItem value="stable">Stable</SelectItem>
                    <SelectItem value="down">Trending Down</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Occupancy Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Occupancy</label>
                <Select value={selectedOccupancyRange} onValueChange={(value) => { setSelectedOccupancyRange(value); resetPagination() }}>
                  <SelectTrigger>
                    <SelectValue placeholder="All ranges" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ranges</SelectItem>
                    <SelectItem value="high">High (80%+)</SelectItem>
                    <SelectItem value="medium">Medium (60-80%)</SelectItem>
                    <SelectItem value="low">Low (&lt;60%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* RevPAR Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">RevPAR</label>
                <Select value={selectedRevparRange} onValueChange={(value) => { setSelectedRevparRange(value); resetPagination() }}>
                  <SelectTrigger>
                    <SelectValue placeholder="All ranges" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ranges</SelectItem>
                    <SelectItem value="high">High ($200+)</SelectItem>
                    <SelectItem value="medium">Medium ($100-200)</SelectItem>
                    <SelectItem value="low">Low (&lt;$100)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort By */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Sort By</label>
                <Select value={sortBy} onValueChange={(value) => { setSortBy(value); resetPagination() }}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="location">Location</SelectItem>
                    <SelectItem value="occupancy">Occupancy</SelectItem>
                    <SelectItem value="revpar">RevPAR</SelectItem>
                    <SelectItem value="review_score">Review Score</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Order */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Order</label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  className="w-full justify-start"
                >
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  {sortOrder === "asc" ? "Ascending" : "Descending"}
                </Button>
              </div>
            </div>

            {/* Clear Filters */}
            <div className="mt-4 pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedState("all")
                  setSelectedTrend("all")
                  setSelectedOccupancyRange("all")
                  setSelectedRevparRange("all")
                  setSortBy("name")
                  setSortOrder("asc")
                  resetPagination()
                }}
              >
                Clear All Filters
              </Button>
            </div>
          </Card>
        )}

        {/* Results Summary and Pagination Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, filteredAndSortedProperties.length)} of {filteredAndSortedProperties.length} properties
            </div>
            
            {paginatedProperties.length > 0 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={selectAllProperties}
                  disabled={selectedForBulkActions.size === paginatedProperties.length}
                >
                  Select All
                </Button>
                {selectedForBulkActions.size > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearBulkSelection}
                  >
                    Clear ({selectedForBulkActions.size})
                  </Button>
                )}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            {/* Page Size Selector */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Show:</span>
              <Select value={pageSize.toString()} onValueChange={(value) => { setPageSize(Number(value)); resetPagination() }}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6</SelectItem>
                  <SelectItem value="12">12</SelectItem>
                  <SelectItem value="24">24</SelectItem>
                  <SelectItem value="48">48</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (currentPage <= 3) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = currentPage - 2 + i
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Properties Grid/List */}
      <div className={cn(
        viewMode === "grid" 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6"
          : "space-y-4"
      )}>
        {paginatedProperties.map((property: PropertyWithMetrics) => (
          <PropertyCard 
            key={property.id} 
            property={property} 
            apiMetrics={metrics}
            selectedForComparison={selectedForComparison}
            onToggleComparison={togglePropertyComparison}
            selectedForBulkActions={selectedForBulkActions}
            onToggleBulkSelection={toggleBulkSelection}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredAndSortedProperties.length === 0 && !isLoading && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              <div className="text-lg font-medium mb-2">No properties found</div>
              <div>Try adjusting your search criteria or filters</div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bulk Actions Panel */}
      {showBulkActions && selectedForBulkActions.size > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Bulk Actions ({selectedForBulkActions.size} selected)
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setShowBulkActions(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => performBulkAction('pricing')}
                className="flex items-center gap-2"
              >
                <DollarSign className="h-4 w-4" />
                Update Pricing
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => performBulkAction('marketing')}
                className="flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                Email Campaign
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => performBulkAction('scheduling')}
                className="flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                Schedule Reports
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => performBulkAction('settings')}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Bulk Settings
              </Button>
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {selectedForBulkActions.size} properties selected
                </span>
                <Button variant="outline" size="sm" onClick={clearBulkSelection}>
                  Clear Selection
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Property Comparison Panel */}
      {showComparison && selectedForComparison.size > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Property Comparison
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setShowComparison(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 font-medium">Property</th>
                    <th className="text-left p-2 font-medium">Location</th>
                    <th className="text-left p-2 font-medium">Occupancy</th>
                    <th className="text-left p-2 font-medium">RevPAR</th>
                    <th className="text-left p-2 font-medium">ADR</th>
                    <th className="text-left p-2 font-medium">Score</th>
                    <th className="text-left p-2 font-medium">Trend</th>
                    <th className="text-left p-2 font-medium">Benchmark</th>
                    <th className="text-left p-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                {getComparisonProperties().map((property: PropertyWithMetrics) => {
                    const propertyMetrics = metrics.filter((m: ApiMetric) => m.property_id === property.id)
                    const latestMetric = propertyMetrics[propertyMetrics.length - 1]
                    const comparisonMetrics = latestMetric ? {
                      occupancy: latestMetric.occupancy_rate,
                      revpar: latestMetric.revpar,
                      adr: latestMetric.adr,
                      review_score: latestMetric.review_score,
                      trend: calculateTrend(propertyMetrics)
                    } : null

                    // Calculate benchmarks
                    const occupancyBenchmark = calculateBenchmark(property, 'occupancy', comparisonMetrics?.occupancy || 0)
                    const revparBenchmark = calculateBenchmark(property, 'revpar', comparisonMetrics?.revpar || 0)

                    return (
                      <tr key={property.id} className="border-b">
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            <span>{property.emoji}</span>
                            <span className="font-medium">{property.name}</span>
                          </div>
                        </td>
                        <td className="p-2 text-sm text-muted-foreground">
                          {property.location}
                        </td>
                        <td className="p-2">
                          <span className="font-medium">{comparisonMetrics?.occupancy || 0}%</span>
                        </td>
                        <td className="p-2">
                          <span className="font-medium">${comparisonMetrics?.revpar || 0}</span>
                        </td>
                        <td className="p-2">
                          <span className="font-medium">${comparisonMetrics?.adr || 0}</span>
                        </td>
                        <td className="p-2">
                          <span className="font-medium">{comparisonMetrics?.review_score || 0}/5</span>
                        </td>
                        <td className="p-2">
                          <Badge variant={
                            comparisonMetrics?.trend === 'up' ? 'default' : 
                            comparisonMetrics?.trend === 'down' ? 'destructive' : 
                            'secondary'
                          }>
                            {comparisonMetrics?.trend || 'stable'}
                          </Badge>
                        </td>
                        <td className="p-2">
                          <div className="space-y-1">
                            <div className="text-xs">
                              <span className={cn(
                                "font-medium",
                                occupancyBenchmark.status === 'above' ? 'text-green-600' :
                                occupancyBenchmark.status === 'below' ? 'text-red-600' :
                                'text-gray-600'
                              )}>
                                Occ: {occupancyBenchmark.performance.toFixed(1)}%
                              </span>
                            </div>
                            <div className="text-xs">
                              <span className={cn(
                                "font-medium",
                                revparBenchmark.status === 'above' ? 'text-green-600' :
                                revparBenchmark.status === 'below' ? 'text-red-600' :
                                'text-gray-600'
                              )}>
                                RevPAR: {revparBenchmark.performance.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => togglePropertyComparison(property.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              <span className="text-sm text-muted-foreground">
                {selectedForComparison.size}/4 properties selected
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={clearComparison}>
                  Clear All
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => exportComparison()}
                >
                  Export Comparison
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bottom Pagination */}
      {totalPages > 1 && filteredAndSortedProperties.length > 0 && (
        <div className="flex justify-center pt-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            
            <span className="text-sm text-muted-foreground px-4">
              Page {currentPage} of {totalPages}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
