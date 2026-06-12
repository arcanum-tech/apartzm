import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { phone } = await req.json();
  if (!phone) return NextResponse.json({ error: "Phone required" }, { status: 400 });

  const normalized = phone.replace(/\s+/g, "").replace(/^\+/, "");
  const { data: landlord } = await supabaseAdmin
    .from("landlords")
    .select("id, name, phone, email, is_verified, subscription_tier")
    .or(`phone.eq.${phone},phone.eq.${normalized},phone.eq.0${normalized.slice(-9)}`)
    .single();

  if (!landlord) return NextResponse.json({ error: "No account found with that phone number." }, { status: 404 });
  return NextResponse.json({ landlord });
}
