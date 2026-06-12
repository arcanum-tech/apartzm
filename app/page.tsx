"use client";

import { useState } from "react";
import Link from "next/link";

const AREAS = ["Woodlands", "Kalingalinga", "Ibex Hill", "Roma", "Kabulonga", "Chelstone", "Avondale", "Chilenje", "Olympia", "Northmead", "Emmasdale", "Matero"];
const BEDROOM_OPTIONS = [
  { label: "Bedsitter", value: 0 },
  { label: "1 Bedroom", value: 1 },
  { label: "2 Bedrooms", value: 2 },
  { label: "3 Bedrooms", value: 3 },
  { label: "4+ Bedrooms", value: 4 },
];

export default function Home() {
  const [area, setArea] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [maxRent, setMaxRent] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);

  async function search() {
    setLoading(true);
    setResults(null);
    const params = new URLSearchParams({ availability: "available" });
    if (area) params.set("area", area);
    if (bedrooms !== "") params.set("bedrooms", bedrooms);
    if (maxRent) params.set("maxRent", maxRent);
    try {
      const res = await fetch(`/api/apartments?${params}`);
      const data = await res.json();
      setResults(data.apartments ?? []);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-indigo-700 text-white px-4 py-4 shadow-md">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight">ApartZM 🇿🇲</h1>
            <p className="text-xs text-indigo-200">Lusaka's Apartment Finder</p>
          </div>
          <div className="flex gap-2">
            <Link href="/landlord/login" className="text-xs bg-indigo-500 text-white font-bold px-3 py-1.5 rounded-full">
              Log In
            </Link>
            <Link href="/list" className="text-xs bg-white text-indigo-700 font-bold px-3 py-1.5 rounded-full">
              List Apartment
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-indigo-700 text-white px-4 pb-10 pt-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-indigo-200 text-sm font-medium mb-2">🏠 All Lusaka apartments in one place</p>
          <h2 className="text-3xl font-black mb-2 leading-tight">Find your apartment.<br />Fast & discreet.</h2>
          <p className="text-indigo-100 text-sm mb-6">Verified listings · Real photos · Call or WhatsApp instantly</p>

          {/* Filter bar */}
          <div className="bg-white rounded-2xl p-3 shadow-xl max-w-2xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
              <select value={area} onChange={(e) => setArea(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-indigo-400">
                <option value="">All Areas</option>
                {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
              <select value={bedrooms} onChange={(e) => setBedrooms(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-indigo-400">
                <option value="">Any Size</option>
                {BEDROOM_OPTIONS.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
              </select>
              <input value={maxRent} onChange={(e) => setMaxRent(e.target.value)}
                placeholder="Max rent (ZMW)"
                className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-indigo-400" />
            </div>
            <button onClick={search} disabled={loading}
              className="w-full bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-2.5 rounded-xl text-sm disabled:opacity-50 transition-colors">
              {loading ? "Searching..." : "Search Apartments"}
            </button>
          </div>
        </div>
      </section>

      {/* Results */}
      {results !== null && (
        <section className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600 font-medium">{results.length} apartment{results.length !== 1 ? "s" : ""} found</p>
            <button onClick={() => setResults(null)} className="text-xs text-indigo-600 underline">Clear</button>
          </div>
          {results.length === 0 ? (
            <div className="text-center text-gray-500 text-sm py-10 bg-white rounded-xl border">
              No apartments found for those filters. Try adjusting your search or{" "}
              <Link href="/list" className="text-indigo-600 font-medium">list yours</Link>.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((apt) => <ApartmentCard key={apt.id} apt={apt} />)}
            </div>
          )}
        </section>
      )}

      {/* Browse areas */}
      {results === null && (
        <>
          <section className="max-w-5xl mx-auto px-4 py-6">
            <h3 className="text-lg font-bold text-gray-800 mb-1">Browse by Area</h3>
            <p className="text-sm text-gray-500 mb-4">Click an area to see available apartments</p>
            <div className="flex flex-wrap gap-2">
              {AREAS.map((a) => (
                <button key={a} onClick={() => { setArea(a); search(); }}
                  className="bg-white border border-gray-200 rounded-full px-4 py-2 text-sm font-medium hover:border-indigo-400 hover:text-indigo-700 transition-colors">
                  📍 {a}
                </button>
              ))}
            </div>
          </section>

          <section className="max-w-5xl mx-auto px-4 pb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Browse by Size</h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {BEDROOM_OPTIONS.map((b) => (
                <button key={b.value} onClick={() => { setBedrooms(String(b.value)); search(); }}
                  className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:border-indigo-400 hover:shadow-md transition-all">
                  <div className="text-2xl mb-1">{b.value === 0 ? "🛏️" : b.value === 1 ? "🏠" : b.value === 2 ? "🏡" : b.value >= 3 ? "🏘️" : "🏗️"}</div>
                  <p className="text-xs font-bold text-gray-800">{b.label}</p>
                </button>
              ))}
            </div>
          </section>

          <section className="max-w-5xl mx-auto px-4 pb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-indigo-700 text-white rounded-2xl p-6 shadow-lg">
                <div className="text-3xl mb-2">🏠</div>
                <h3 className="text-lg font-black mb-1">Have an apartment to rent?</h3>
                <p className="text-sm text-indigo-100 mb-3">List on Lusaka's biggest apartment finder. Tenants contact you directly.</p>
                <Link href="/list" className="inline-block bg-white text-indigo-700 font-bold text-sm px-4 py-2 rounded-full">
                  List Your Apartment →
                </Link>
              </div>
              <div className="bg-gray-900 text-white rounded-2xl p-6 shadow-lg">
                <div className="text-3xl mb-2">🔒</div>
                <h3 className="text-lg font-black mb-1">Private & discreet listings</h3>
                <p className="text-sm text-gray-400 mb-3">Some listings are marked private. Your enquiry goes directly to the landlord — no middlemen.</p>
                <button onClick={() => search()}
                  className="inline-block bg-indigo-700 text-white font-bold text-sm px-4 py-2 rounded-full">
                  Browse All →
                </button>
              </div>
            </div>
          </section>

          <section className="bg-white px-4 py-8 border-t">
            <div className="max-w-5xl mx-auto">
              <h3 className="text-lg font-bold text-gray-800 mb-6 text-center">Why ApartZM?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { icon: "📸", title: "Real Photos", desc: "Every listing has actual photos. No stock images — what you see is what you get." },
                  { icon: "📞", title: "Instant Contact", desc: "One tap to call or WhatsApp the caretaker. Check availability before you travel." },
                  { icon: "🔒", title: "Private Listings", desc: "Discreet apartments available. Your enquiry stays between you and the landlord." },
                ].map((f) => (
                  <div key={f.title} className="text-center">
                    <div className="text-3xl mb-2">{f.icon}</div>
                    <p className="font-bold text-gray-800 mb-1">{f.title}</p>
                    <p className="text-sm text-gray-500">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      <footer className="text-center py-6 text-xs text-gray-400 bg-gray-900 border-t border-gray-800">
        <p className="text-white font-bold mb-1">ApartZM 🇿🇲</p>
        <p>Powered by <span className="text-indigo-400">ARCANUM TECH LIMITED</span> | TPIN: 2003723894 | Lusaka, Zambia</p>
      </footer>
    </div>
  );
}

function ApartmentCard({ apt }: { apt: any }) {
  const bedroomLabel = apt.bedrooms === 0 ? "Bedsitter" : `${apt.bedrooms} Bed${apt.bedrooms > 1 ? "s" : ""}`;
  const availColor = apt.availability === "available" ? "bg-green-100 text-green-700" :
    apt.availability === "reserved" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-600";

  return (
    <Link href={`/apartment/${apt.id}`} className="bg-white rounded-xl border shadow-sm hover:shadow-md transition-all overflow-hidden">
      <div className="bg-gray-100 h-44 flex items-center justify-center text-5xl relative">
        {apt.images?.[0] ? (
          <img src={apt.images[0]} alt={apt.title} className="w-full h-full object-cover" />
        ) : "🏠"}
        <span className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full font-semibold ${availColor}`}>
          {apt.availability}
        </span>
        {apt.privacy_level === "private" || apt.privacy_level === "discreet" ? (
          <span className="absolute top-2 left-2 text-xs px-2 py-0.5 rounded-full font-semibold bg-gray-900 text-white">
            🔒 Private
          </span>
        ) : null}
      </div>
      <div className="p-3">
        <p className="text-sm font-bold text-gray-900 truncate">{apt.title}</p>
        <p className="text-xs text-gray-500 mt-0.5">📍 {apt.area} · {bedroomLabel} · {apt.furnished}</p>
        <div className="flex items-center justify-between mt-2">
          <p className="text-indigo-700 font-black text-sm">ZMW {Number(apt.rent_zmw).toLocaleString()}<span className="text-gray-400 font-normal">/mo</span></p>
          {apt.landlords?.is_verified && (
            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-indigo-100 text-indigo-700">✓ Verified</span>
          )}
        </div>
        {apt.amenities?.length > 0 && (
          <p className="text-xs text-gray-400 mt-1 truncate">{apt.amenities.slice(0, 3).join(" · ")}</p>
        )}
      </div>
    </Link>
  );
}
