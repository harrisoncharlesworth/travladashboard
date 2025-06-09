import { PropertiesList } from "@/components/properties-list"
import { Breadcrumb } from "@/components/ui/breadcrumb"

export const revalidate = 180 // Revalidate every 3 minutes

export default function PropertiesPage() {
  return (
    <div className="space-y-6">
      <Breadcrumb 
        items={[
          { label: "Properties", current: true }
        ]}
      />
      
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Properties</h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Manage and monitor individual property performance across your portfolio.
        </p>
      </div>
      <PropertiesList />
    </div>
  )
}
