import { redirect } from "next/navigation"

interface ListingEditRedirectPageProps {
  params: Promise<{ id: string }>
}

export default async function ListingEditRedirectPage({ params }: ListingEditRedirectPageProps) {
  const { id } = await params
  redirect(`/dashboard/listing/${id}/edit`)
}
