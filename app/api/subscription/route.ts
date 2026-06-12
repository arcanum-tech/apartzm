import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const landlordId = searchParams.get("landlord_id");
  const status = searchParams.get("status");

  if (!landlordId) return NextResponse.json({ error: "Missing landlord_id" }, { status: 400 });

  if (status === "success") {
    const expires = new Date();
    expires.setMonth(expires.getMonth() + 1);

    const { error } = await supabaseAdmin
      .from("landlords")
      .update({
        subscription_tier: "pro",
        subscription_expires_at: expires.toISOString(),
      })
      .eq("id", landlordId);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.redirect(new URL(`/landlord/${landlordId}?upgraded=1`, req.url));
  }

  return NextResponse.redirect(new URL(`/landlord/${landlordId}?upgraded=0`, req.url));
}
