import { PropertiesList } from "@/components/properties-list"

export default function PropertiesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Properties</h1>
        <p className="text-muted-foreground">
          Manage and monitor individual property performance across your portfolio.
        </p>
      </div>
      <PropertiesList />
    </div>
  )
}
