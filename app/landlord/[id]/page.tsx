import { supabaseAdmin } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function LandlordDashboard({ params, searchParams }: { params: { id: string }; searchParams: { upgraded?: string } }) {
  const upgraded = searchParams.upgraded;
  const { data: landlord } = await supabaseAdmin
    .from("landlords")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!landlord) return notFound();

  const { data: apartments } = await supabaseAdmin
    .from("apartments")
    .select("*")
    .eq("landlord_id", params.id)
    .order("created_at", { ascending: false });

  const { data: viewings } = await supabaseAdmin
    .from("viewing_requests")
    .select("*, apartments(title)")
    .eq("landlord_id", params.id)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  const isPro = landlord.subscription_tier === "pro";
  const isBasic = landlord.subscription_tier === "basic";

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-indigo-700 text-white px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">ApartZM 🇿🇲</Link>
          <p className="text-sm text-indigo-200">Landlord Dashboard</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {upgraded === "1" && (
          <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl px-5 py-3 text-sm font-semibold">
            🎉 You are now a PRO landlord! Your listings are now featured at the top.
          </div>
        )}
        {upgraded === "0" && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-3 text-sm font-semibold">
            ⚠️ Payment was not completed. Try upgrading again.
          </div>
        )}
        {/* Profile */}
        <div className="bg-white rounded-xl p-5 border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-gray-900">{landlord.name}</h2>
              <p className="text-sm text-gray-500">{landlord.phone}</p>
            </div>
            <div className="flex gap-2">
              {landlord.is_verified && <span className="text-xs bg-indigo-100 text-indigo-700 font-bold px-3 py-1 rounded-full">✓ Verified</span>}
              {isPro && <span className="text-xs bg-yellow-100 text-yellow-700 font-bold px-3 py-1 rounded-full">⭐ PRO</span>}
              {isBasic && <span className="text-xs bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-full">Basic</span>}
            </div>
          </div>
          {!isPro && (
            <div className="mt-3 p-3 rounded-xl" style={{ background: "#fefce8", border: "1px solid #fde68a" }}>
              <p className="text-xs text-yellow-800 mb-2">
                <strong>Free:</strong> Unlimited listings · Tenants can contact you directly<br />
                <strong>PRO — ZMW 400/mo:</strong> Featured at top of search · Verified badge · Viewing requests dashboard
              </p>
              <a href={`https://arcanum-payments.vercel.app/pay?app=apartzm&product=Pro+Landlord+Subscription&amount=400&callback=${encodeURIComponent(`https://apartzm.vercel.app/api/subscription?landlord_id=${params.id}&status=success`)}`}
                className="inline-block font-black text-sm px-4 py-2 rounded-full text-yellow-900 hover:bg-yellow-300 transition-colors"
                style={{ background: "#fde047" }}>
                Upgrade to PRO — ZMW 400/mo →
              </a>
            </div>
          )}
        </div>

        {/* Pending viewing requests */}
        {(viewings?.length ?? 0) > 0 && (
          <div className="bg-white rounded-xl p-5 border">
            <h3 className="font-bold text-gray-800 mb-3">Pending Viewing Requests ({viewings!.length})</h3>
            <div className="space-y-3">
              {viewings!.map((v) => (
                <div key={v.id} className="border rounded-xl p-3 text-sm">
                  <p className="font-semibold text-gray-800">{v.requester_name} — <span className="text-indigo-600">{v.requester_phone}</span></p>
                  <p className="text-gray-500 text-xs mt-0.5">For: {v.apartments?.title}</p>
                  {v.preferred_date && <p className="text-gray-400 text-xs">Preferred date: {v.preferred_date}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Apartments */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-800">Your Listings ({apartments?.length ?? 0})</h3>
            <Link href={`/list?landlord_id=${params.id}`}
              className="text-xs bg-indigo-700 text-white font-bold px-3 py-1.5 rounded-full hover:bg-indigo-800 transition-colors">
              + Add Apartment
            </Link>
          </div>
          {(apartments?.length ?? 0) === 0 ? (
            <div className="bg-white rounded-xl border p-6 text-center text-gray-500 text-sm">
              No listings yet.{" "}
              <Link href={`/list?landlord_id=${params.id}`} className="text-indigo-600 font-medium">Add your first apartment →</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {apartments!.map((apt) => (
                <Link key={apt.id} href={`/apartment/${apt.id}`}
                  className="bg-white rounded-xl border p-4 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start">
                    <p className="font-bold text-gray-900 text-sm">{apt.title}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      apt.availability === "available" ? "bg-green-100 text-green-700" :
                      apt.availability === "reserved" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-600"
                    }`}>{apt.availability}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">📍 {apt.area} · {apt.bedrooms === 0 ? "Bedsitter" : `${apt.bedrooms} bed`}</p>
                  <p className="text-indigo-700 font-black text-sm mt-1">ZMW {Number(apt.rent_zmw).toLocaleString()}/day</p>
                  <p className="text-xs text-gray-400 mt-1">{apt.views ?? 0} views</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
