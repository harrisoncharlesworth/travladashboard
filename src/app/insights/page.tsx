import { InsightsFeed } from "@/components/insights-feed"

export default function InsightsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Insights Feed</h1>
        <p className="text-muted-foreground">
          AI-powered insights and automated recommendations for your portfolio.
        </p>
      </div>
      <InsightsFeed />
    </div>
  )
}
