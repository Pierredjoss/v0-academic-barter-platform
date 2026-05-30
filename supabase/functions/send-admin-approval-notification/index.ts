// supabase/functions/send-admin-approval-notification/index.ts
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
    const { user_email } = await req.json()

    // Send approval email
    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
      },
      body: JSON.stringify({
        from: "noreply@dyo.platform",
        to: user_email,
        subject: "Votre demande d'accès administrateur a été approuvée",
        html: `
          <h2>Bienvenue en tant qu'administrateur! 🎉</h2>
          <p>Votre demande d'accès administrateur a été approuvée.</p>
          <p>Vous pouvez maintenant accéder au tableau de bord administrateur:</p>
          <p>
            <a href="https://dyo.platform/admin/dashboard" style="display: inline-block; padding: 10px 20px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 5px;">
              Accéder au tableau de bord
            </a>
          </p>
          <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
        `,
      }),
    })

    if (!emailRes.ok) {
      const error = await emailRes.text()
      console.error("Error sending email:", error)
    }

    return new Response(
      JSON.stringify({ success: true, message: "Approval notification sent" }),
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
