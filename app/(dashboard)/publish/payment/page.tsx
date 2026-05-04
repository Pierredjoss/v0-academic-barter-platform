import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PaymentForm } from "@/components/publish/payment-form"

export default async function PublishPaymentPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Vérifier si l'utilisateur a déjà un paiement en cours ou complété récemment
  const { data: recentPayment } = await supabase
    .from("payments")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "completed")
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  // Si paiement récent (moins de 24h), rediriger vers publish
  if (recentPayment) {
    const paymentTime = new Date(recentPayment.created_at).getTime()
    const now = new Date().getTime()
    const hoursDiff = (now - paymentTime) / (1000 * 60 * 60)
    
    if (hoursDiff < 24) {
      redirect("/publish")
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-bold sm:text-3xl">
          <span className="gradient-text">Paiement</span> Requis
        </h1>
        <p className="text-muted-foreground">
          Pour publier une annonce, un paiement de 50 FCFA est requis
        </p>
      </div>

      <PaymentForm userId={user.id} />
    </div>
  )
}
