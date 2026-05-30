// app/api/listings/report/route.ts
import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { listingId, reason, description } = body

    if (!listingId || !reason) {
      return NextResponse.json(
        { error: "Paramètres manquants" },
        { status: 400 }
      )
    }

    // Check if listing exists
    const { data: listing, error: listingError } = await supabase
      .from("listings")
      .select("id")
      .eq("id", listingId)
      .single()

    if (listingError || !listing) {
      return NextResponse.json(
        { error: "Annonce non trouvée" },
        { status: 404 }
      )
    }

    // Check if user already reported this listing
    const { data: existingReport } = await supabase
      .from("reported_listings")
      .select("id")
      .eq("listing_id", listingId)
      .eq("reported_by", user.id)
      .single()

    if (existingReport) {
      return NextResponse.json(
        { error: "Vous avez déjà signalé cette annonce" },
        { status: 400 }
      )
    }

    // Create report
    const { data: report, error: reportError } = await supabase
      .from("reported_listings")
      .insert({
        listing_id: listingId,
        reported_by: user.id,
        reason,
        description: description || null,
        status: "pending",
      })
      .select()
      .single()

    if (reportError) {
      throw reportError
    }

    return NextResponse.json(
      { success: true, report },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error reporting listing:", error)
    return NextResponse.json(
      { error: "Erreur lors du signalement" },
      { status: 500 }
    )
  }
}
