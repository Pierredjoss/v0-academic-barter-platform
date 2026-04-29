import { redirect } from "next/navigation"

interface ListingRedirectPageProps {
  params: Promise<{ id: string }>
}

export default async function ListingRedirectPage({ params }: ListingRedirectPageProps) {
  const { id } = await params
  redirect(`/dashboard/listing/${id}`)
}
