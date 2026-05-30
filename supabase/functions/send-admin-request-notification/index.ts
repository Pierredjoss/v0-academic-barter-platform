// supabase/functions/send-admin-request-notification/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const { user_name, user_email, university, reason } = await req.json()

    // Get manager email from environment or database
    const managerEmail = Deno.env.get("MANAGER_EMAIL") || "admin@dyo.platform"

    // Send email to manager
    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
      },
      body: JSON.stringify({
        from: "noreply@dyo.platform",
        to: managerEmail,
        subject: `Nouvelle demande d'accès administrateur - ${user_name}`,
        html: `
          <h2>Nouvelle demande d'accès administrateur</h2>
          <p><strong>Nom:</strong> ${user_name}</p>
          <p><strong>Email:</strong> ${user_email}</p>
          <p><strong>Université:</strong> ${university || "Non spécifié"}</p>
          <p><strong>Raison:</strong></p>
          <p>${reason}</p>
          <p>
            <a href="https://dyo.platform/admin/requests">
              Voir la demande dans le tableau de bord
            </a>
          </p>
        `,
      }),
    })

    if (!emailRes.ok) {
      const error = await emailRes.text()
      console.error("Error sending email:", error)
    }

    return new Response(
      JSON.stringify({ success: true, message: "Notification sent" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  } catch (error) {
    console.error("Error:", error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    )
  }
})
