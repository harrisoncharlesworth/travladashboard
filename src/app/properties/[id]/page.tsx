import { PropertyDetail } from "@/components/property-detail"

export const revalidate = 180 // Revalidate every 3 minutes

export async function generateStaticParams() {
  // Generate paths for property IDs 1-20 (adjust based on your data)
  return Array.from({ length: 20 }, (_, i) => ({
    id: (i + 1).toString(),
  }))
}

interface PropertyDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const { id } = await params
  return <PropertyDetail propertyId={id} />
}
