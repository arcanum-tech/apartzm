import { supabaseAdmin } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import ViewingForm from "./ViewingForm";

export const dynamic = "force-dynamic";

export default async function ApartmentPage({ params }: { params: { id: string } }) {
  const { data: apt } = await supabaseAdmin
    .from("apartments")
    .select("*, landlords(name, phone, is_verified, subscription_tier)")
    .eq("id", params.id)
    .single();

  if (!apt) return notFound();

  // bump view count
  await supabaseAdmin.from("apartments").update({ views: (apt.views ?? 0) + 1 }).eq("id", params.id);

  const bedroomLabel = apt.bedrooms === 0 ? "Bedsitter" : `${apt.bedrooms} Bedroom${apt.bedrooms > 1 ? "s" : ""}`;
  const availColor = apt.availability === "available" ? "text-green-600" :
    apt.availability === "reserved" ? "text-yellow-600" : "text-red-500";

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-indigo-700 text-white px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Link href="/" className="text-indigo-200 hover:text-white text-sm">← Back</Link>
          <h1 className="text-lg font-black">ApartZM 🇿🇲</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Images */}
        <div className="bg-gray-200 rounded-2xl h-64 sm:h-80 overflow-hidden mb-6 flex items-center justify-center text-7xl">
          {apt.images?.[0] ? (
            <img src={apt.images[0]} alt={apt.title} className="w-full h-full object-cover" />
          ) : "🏠"}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl p-5 border">
              <div className="flex items-start justify-between mb-2">
                <h2 className="text-xl font-black text-gray-900">{apt.title}</h2>
                <span className={`text-sm font-bold capitalize ${availColor}`}>{apt.availability}</span>
              </div>
              <p className="text-sm text-gray-500 mb-3">📍 {apt.area}{apt.address ? ` · ${apt.address}` : ""}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full">{bedroomLabel}</span>
                <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">{apt.bathrooms} Bath</span>
                <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1 rounded-full capitalize">{apt.furnished}</span>
                {apt.privacy_level !== "standard" && (
                  <span className="bg-gray-900 text-white text-xs font-semibold px-3 py-1 rounded-full">🔒 {apt.privacy_level}</span>
                )}
              </div>
              <div className="border-t pt-3">
                <p className="text-2xl font-black text-indigo-700">ZMW {Number(apt.rent_zmw).toLocaleString()}<span className="text-gray-400 text-base font-normal">/day</span></p>
                {apt.deposit_zmw && (
                  <p className="text-sm text-gray-500 mt-0.5">Deposit: ZMW {Number(apt.deposit_zmw).toLocaleString()}</p>
                )}
              </div>
            </div>

            {apt.description && (
              <div className="bg-white rounded-xl p-5 border">
                <h3 className="font-bold text-gray-800 mb-2">About this apartment</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{apt.description}</p>
              </div>
            )}

            {apt.amenities?.length > 0 && (
              <div className="bg-white rounded-xl p-5 border">
                <h3 className="font-bold text-gray-800 mb-3">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {apt.amenities.map((a: string) => (
                    <span key={a} className="bg-green-50 text-green-700 text-xs font-medium px-3 py-1 rounded-full">✓ {a}</span>
                  ))}
                </div>
              </div>
            )}

            {apt.rules?.length > 0 && (
              <div className="bg-white rounded-xl p-5 border">
                <h3 className="font-bold text-gray-800 mb-3">House Rules</h3>
                <ul className="space-y-1">
                  {apt.rules.map((r: string) => (
                    <li key={r} className="text-sm text-gray-600">• {r}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Contact sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-5 border sticky top-4">
              <h3 className="font-bold text-gray-800 mb-1">Contact Landlord</h3>
              {apt.landlords?.is_verified && (
                <p className="text-xs text-indigo-600 font-semibold mb-3">✓ Verified landlord</p>
              )}
              <div className="space-y-2 mb-4">
                <a href={`tel:${apt.contact_phone}`}
                  className="flex items-center justify-center gap-2 w-full bg-indigo-700 text-white font-bold py-3 rounded-xl text-sm hover:bg-indigo-800 transition-colors">
                  📞 Call Now
                </a>
                {apt.contact_whatsapp && (
                  <a href={`https://wa.me/${apt.contact_whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-green-600 text-white font-bold py-3 rounded-xl text-sm hover:bg-green-700 transition-colors">
                    💬 WhatsApp
                  </a>
                )}
              </div>
              <p className="text-xs text-gray-400 text-center mb-4">Or book a viewing below</p>
              <ViewingForm apartmentId={apt.id} landlordId={apt.landlord_id} />
            </div>
          </div>
        </div>
      </main>

      <footer className="text-center py-6 text-xs text-gray-400 bg-gray-900 border-t border-gray-800 mt-10">
        <p className="text-white font-bold mb-1">ApartZM 🇿🇲</p>
        <p>Powered by <span className="text-indigo-400">ARCANUM TECH LIMITED</span> | Lusaka, Zambia</p>
      </footer>
    </div>
  );
}
