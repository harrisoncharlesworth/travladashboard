import { PropertyDetail } from "@/components/property-detail"

interface PropertyDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const { id } = await params
  return <PropertyDetail propertyId={id} />
}
