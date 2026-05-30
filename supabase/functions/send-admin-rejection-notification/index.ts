// supabase/functions/send-admin-rejection-notification/index.ts
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

    // Send rejection email
    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
      },
      body: JSON.stringify({
        from: "noreply@dyo.platform",
        to: user_email,
        subject: "Concernant votre demande d'accès administrateur",
        html: `
          <h2>Accès administrateur</h2>
          <p>Merci de votre intérêt pour rejoindre l'équipe administrative de la plateforme ɖyɔ̌.</p>
          <p>Malheureusement, votre demande d'accès administrateur n'a pas pu être approuvée à ce moment.</p>
          <p>Si vous avez des questions ou souhaitez renouveler votre demande, n'hésitez pas à nous contacter.</p>
          <p>Cordialement,<br>L'équipe ɖyɔ̌</p>
        `,
      }),
    })

    if (!emailRes.ok) {
      const error = await emailRes.text()
      console.error("Error sending email:", error)
    }

    return new Response(
      JSON.stringify({ success: true, message: "Rejection notification sent" }),
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
