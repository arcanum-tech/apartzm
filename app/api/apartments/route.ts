import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const area = searchParams.get("area");
  const bedrooms = searchParams.get("bedrooms");
  const maxRent = searchParams.get("maxRent");
  const availability = searchParams.get("availability") ?? "available";

  let query = supabaseAdmin
    .from("apartments")
    .select("*, landlords(name, phone, is_verified)")
    .eq("is_active", true)
    .eq("availability", availability)
    .order("created_at", { ascending: false });

  if (area) query = query.ilike("area", `%${area}%`);
  if (bedrooms !== null) query = query.eq("bedrooms", parseInt(bedrooms));
  if (maxRent) query = query.lte("rent_zmw", parseFloat(maxRent));

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ apartments: data ?? [] });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { data, error } = await supabaseAdmin.from("apartments").insert([body]).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ apartment: data });
}
