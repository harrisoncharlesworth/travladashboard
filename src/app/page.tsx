import { PortfolioOverview } from "@/components/portfolio-overview"

export default function Home() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Portfolio Overview</h1>
        <p className="text-muted-foreground">
          Real-time dashboard for your property portfolio performance and insights.
        </p>
      </div>
      <PortfolioOverview />
    </div>
  )
}
