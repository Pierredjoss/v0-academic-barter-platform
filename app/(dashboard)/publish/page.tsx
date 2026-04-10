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
          <span className="gradient-text">Publier</span> une Annonce
        </h1>
        <p className="text-muted-foreground">
          Partagez vos ressources académiques avec d&apos;autres étudiants
        </p>
      </div>

      <PublishForm categories={categories || []} />
    </div>
  )
}
