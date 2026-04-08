import { createClient } from "@/lib/supabase/server"
import { PublishForm } from "@/components/publish/publish-form"

export default async function PublishPage() {
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name")

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold sm:text-3xl">
          <span className="gradient-text">Publish</span> a Listing
        </h1>
        <p className="text-muted-foreground">
          Share your academic resources with other students
        </p>
      </div>

      <PublishForm categories={categories || []} />
    </div>
  )
}
