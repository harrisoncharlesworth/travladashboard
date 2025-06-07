"use client"

import { useState } from "react"
import Link from "next/link" 
import Image from "next/image"
import useSWR from "swr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ChartContainer } from "@/components/ui/chart"
import { LineChart, Line, ResponsiveContainer } from "recharts"
import { MapPin, TrendingUp, TrendingDown, Users, DollarSign, Star } from "lucide-react"
import { cn } from "@/lib/utils"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface Property {
  id: string
  name: string
  location: string
  emoji: string
  photo_url: string | null
}

interface PropertyMetrics {
  occupancy: number
  revpar: number
  adr: number
  review_score: number
  trend: 'up' | 'down' | 'stable'
  sparklineData: { value: number }[]
}

const mockPropertyMetrics: Record<string, PropertyMetrics> = {
  "1": {
    occupancy: 85,
    revpar: 142.50,
    adr: 167.65,
    review_score: 4.6,
    trend: 'up',
    sparklineData: [
      { value: 135 }, { value: 138 }, { value: 141 }, { value: 139 }, { value: 142 }, { value: 140 }, { value: 142.5 }
    ]
  },
  "2": {
    occupancy: 62,
    revpar: 108.30,
    adr: 174.68,
    review_score: 4.4,
    trend: 'down',
    sparklineData: [
      { value: 118 }, { value: 115 }, { value: 112 }, { value: 110 }, { value: 109 }, { value: 107 }, { value: 108.3 }
    ]
  },
  "3": {
    occupancy: 78,
    revpar: 156.80,
    adr: 201.03,
    review_score: 4.5,
    trend: 'up',
    sparklineData: [
      { value: 148 }, { value: 151 }, { value: 153 }, { value: 154 }, { value: 155 }, { value: 157 }, { value: 156.8 }
    ]
  }
}

function PropertyCard({ property }: { property: Property }) {
  const metrics = mockPropertyMetrics[property.id] || {
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
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48">
        {property.photo_url ? (
          <Image
            src={property.photo_url}
            alt={property.name}
            fill
            className="object-cover"
          />
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
        <div className="absolute top-4 right-4">
          <Badge 
            variant={metrics.trend === 'up' ? 'default' : metrics.trend === 'down' ? 'destructive' : 'secondary'}
            className="bg-background/80 backdrop-blur"
          >
            <TrendIcon className="h-3 w-3 mr-1" />
            {metrics.trend}
          </Badge>
        </div>
      </div>

      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{property.name}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <MapPin className="h-3 w-3 mr-1" />
              {property.location}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-1">
              <Users className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Occupancy</span>
            </div>
            <div className="text-lg font-semibold">{metrics.occupancy}%</div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center space-x-1">
              <DollarSign className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">RevPAR</span>
            </div>
            <div className="text-lg font-semibold">${metrics.revpar}</div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center space-x-1">
              <DollarSign className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">ADR</span>
            </div>
            <div className="text-sm">${metrics.adr}</div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center space-x-1">
              <Star className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Score</span>
            </div>
            <div className="text-sm">{metrics.review_score}/5</div>
          </div>
        </div>

        {metrics.sparklineData.length > 0 && (
          <div className="mb-4">
            <div className="text-xs text-muted-foreground mb-2">RevPAR Trend (7 days)</div>
            <div className="h-12">
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
            </div>
          </div>
        )}

        <div className="flex space-x-2">
          <Button asChild size="sm" className="flex-1">
            <Link href={`/properties/${property.id}`}>
              View Details
            </Link>
          </Button>
          <Button variant="outline" size="sm">
            Quick Actions
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function PropertiesList() {
  const { data: response, error, isLoading } = useSWR('/api/metrics', fetcher, {
    refreshInterval: 10000
  })

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
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

  const properties = response?.data?.properties || []

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property: Property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  )
}
