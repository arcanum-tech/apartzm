"use client";

import { useState } from "react";
import Link from "next/link";

const AREAS = ["Woodlands","Kalingalinga","Ibex Hill","Roma","Kabulonga","Chelstone","Avondale","Chilenje","Olympia","Northmead","Emmasdale","Matero"];
const BEDROOM_OPTIONS = [
  { label: "Bedsitter", value: 0, icon: "🛏️" },
  { label: "1 Bed", value: 1, icon: "🏠" },
  { label: "2 Beds", value: 2, icon: "🏡" },
  { label: "3 Beds", value: 3, icon: "🏘️" },
  { label: "4+ Beds", value: 4, icon: "🏗️" },
];

export default function Home() {
  const [area, setArea] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [maxRent, setMaxRent] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);

  async function search(overrideArea?: string, overrideBeds?: string) {
    setLoading(true);
    setResults(null);
    const params = new URLSearchParams({ availability: "available" });
    const a = overrideArea ?? area;
    const b = overrideBeds ?? bedrooms;
    if (a) params.set("area", a);
    if (b !== "") params.set("bedrooms", b);
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
    <div className="min-h-screen" style={{ background: "#f8f7ff", fontFamily: "system-ui, sans-serif" }}>

      {/* Header */}
      <header style={{ background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)" }} className="text-white px-6 py-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: "rgba(255,255,255,0.2)" }}>🏠</div>
            <div>
              <h1 className="text-xl font-black tracking-tight leading-none">ApartZM</h1>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>Lusaka's Apartment Finder 🇿🇲</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/landlord/login"
              className="text-xs font-bold px-4 py-2 rounded-full border border-white/30 hover:bg-white/10 transition-colors text-white">
              Log In
            </Link>
            <Link href="/list"
              className="text-xs font-black px-4 py-2 rounded-full text-purple-700 hover:bg-yellow-300 transition-colors"
              style={{ background: "#fde047" }}>
              + List Apartment
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)" }} className="text-white px-6 pt-10 pb-16">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4" style={{ background: "rgba(255,255,255,0.15)" }}>
            🏠 All Lusaka apartments in one place
          </div>
          <h2 className="text-4xl font-black mb-3 leading-tight">
            Find your apartment.<br />
            <span style={{ color: "#fde047" }}>Fast & discreet.</span>
          </h2>
          <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.8)" }}>
            Verified listings · Real photos · Call or WhatsApp instantly
          </p>

          {/* Search card */}
          <div className="bg-white rounded-2xl p-4 shadow-2xl max-w-2xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              <select value={area} onChange={(e) => setArea(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-purple-400 bg-gray-50">
                <option value="">📍 All Areas</option>
                {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
              <select value={bedrooms} onChange={(e) => setBedrooms(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-purple-400 bg-gray-50">
                <option value="">🛏️ Any Size</option>
                {BEDROOM_OPTIONS.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
              </select>
              <input value={maxRent} onChange={(e) => setMaxRent(e.target.value)}
                placeholder="💰 Max rent (ZMW)"
                className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-purple-400 bg-gray-50" />
            </div>
            <button onClick={() => search()} disabled={loading}
              className="w-full text-white font-black py-3 rounded-xl text-sm disabled:opacity-50 transition-all hover:opacity-90 active:scale-95"
              style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}>
              {loading ? "Searching..." : "Search Apartments →"}
            </button>
          </div>
        </div>
      </section>

      {/* Results */}
      {results !== null && (
        <section className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-gray-600 font-semibold">
              {results.length === 0 ? "No apartments found" : `${results.length} apartment${results.length !== 1 ? "s" : ""} available`}
            </p>
            <button onClick={() => setResults(null)} className="text-xs text-purple-600 font-semibold hover:underline">Clear results</button>
          </div>
          {results.length === 0 ? (
            <div className="text-center text-gray-500 text-sm py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="text-5xl mb-3">🏠</div>
              <p className="font-semibold text-gray-700 mb-1">No apartments found</p>
              <p className="text-xs text-gray-400 mb-4">Try adjusting your filters or be the first to list in this area</p>
              <Link href="/list" className="inline-block text-white font-bold text-sm px-5 py-2.5 rounded-full"
                style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}>
                List an Apartment →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {results.map((apt) => <ApartmentCard key={apt.id} apt={apt} />)}
            </div>
          )}
        </section>
      )}

      {/* Browse sections */}
      {results === null && (
        <div className="max-w-6xl mx-auto px-6 py-8 space-y-10">

          {/* Areas */}
          <section>
            <h3 className="text-lg font-black text-gray-800 mb-1">Browse by Area</h3>
            <p className="text-sm text-gray-500 mb-4">Tap an area to see available apartments</p>
            <div className="flex flex-wrap gap-2">
              {AREAS.map((a) => (
                <button key={a} onClick={() => { setArea(a); search(a); }}
                  className="px-4 py-2 rounded-full text-sm font-semibold border transition-all hover:shadow-md"
                  style={{ background: "white", borderColor: "#e5e7eb", color: "#374151" }}
                  onMouseEnter={(e) => { (e.target as HTMLElement).style.borderColor = "#7c3aed"; (e.target as HTMLElement).style.color = "#7c3aed"; }}
                  onMouseLeave={(e) => { (e.target as HTMLElement).style.borderColor = "#e5e7eb"; (e.target as HTMLElement).style.color = "#374151"; }}>
                  📍 {a}
                </button>
              ))}
            </div>
          </section>

          {/* Size */}
          <section>
            <h3 className="text-lg font-black text-gray-800 mb-4">Browse by Size</h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {BEDROOM_OPTIONS.map((b) => (
                <button key={b.value} onClick={() => { setBedrooms(String(b.value)); search(undefined, String(b.value)); }}
                  className="bg-white rounded-2xl p-4 text-center border border-gray-100 shadow-sm hover:shadow-md hover:border-purple-300 transition-all group">
                  <div className="text-3xl mb-2">{b.icon}</div>
                  <p className="text-xs font-black text-gray-700 group-hover:text-purple-700">{b.label}</p>
                </button>
              ))}
            </div>
          </section>

          {/* CTA cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl p-6 shadow-lg text-white" style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}>
              <div className="text-4xl mb-3">🏠</div>
              <h3 className="text-lg font-black mb-1">Have an apartment to rent?</h3>
              <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.8)" }}>List on Lusaka's biggest apartment finder. Tenants contact you directly.</p>
              <Link href="/list" className="inline-block font-black text-sm px-5 py-2.5 rounded-full text-purple-700 hover:bg-yellow-300 transition-colors"
                style={{ background: "#fde047" }}>
                List Your Apartment →
              </Link>
            </div>
            <div className="bg-gray-900 rounded-2xl p-6 shadow-lg text-white">
              <div className="text-4xl mb-3">🔒</div>
              <h3 className="text-lg font-black mb-1">Private & discreet listings</h3>
              <p className="text-sm text-gray-400 mb-4">Some listings are marked private. Your enquiry goes directly to the landlord.</p>
              <button onClick={() => search()}
                className="inline-block font-black text-sm px-5 py-2.5 rounded-full text-white transition-colors"
                style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}>
                Browse All →
              </button>
            </div>
          </section>

          {/* Features */}
          <section className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-black text-gray-800 mb-6 text-center">Why ApartZM?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                { icon: "📸", title: "Real Photos", desc: "Every listing has actual photos. No stock images — what you see is what you get." },
                { icon: "📞", title: "Instant Contact", desc: "One tap to call or WhatsApp the caretaker. Check availability before you travel." },
                { icon: "🔒", title: "Private Listings", desc: "Discreet apartments available. Your enquiry stays between you and the landlord." },
              ].map((f) => (
                <div key={f.title} className="text-center">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3"
                    style={{ background: "linear-gradient(135deg, #ede9fe, #ddd6fe)" }}>
                    {f.icon}
                  </div>
                  <p className="font-black text-gray-800 mb-1">{f.title}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      <footer className="text-center py-8 text-xs mt-4" style={{ background: "#111827", color: "#9ca3af" }}>
        <p className="text-white font-black text-base mb-1">ApartZM 🇿🇲</p>
        <p>Powered by <span style={{ color: "#a78bfa" }}>ARCANUM TECH LIMITED</span> · TPIN: 2003723894 · Lusaka, Zambia</p>
      </footer>
    </div>
  );
}

function ApartmentCard({ apt }: { apt: any }) {
  const bedroomLabel = apt.bedrooms === 0 ? "Bedsitter" : `${apt.bedrooms} Bed${apt.bedrooms > 1 ? "s" : ""}`;
  const availStyle = apt.availability === "available"
    ? { background: "#dcfce7", color: "#16a34a" }
    : apt.availability === "reserved"
    ? { background: "#fef9c3", color: "#ca8a04" }
    : { background: "#fee2e2", color: "#dc2626" };

  return (
    <Link href={`/apartment/${apt.id}`}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all overflow-hidden group">
      <div className="h-48 flex items-center justify-center text-6xl relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #ede9fe, #ddd6fe)" }}>
        {apt.images?.[0] ? (
          <img src={apt.images[0]} alt={apt.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : <span className="group-hover:scale-110 transition-transform duration-300">🏠</span>}
        <span className="absolute top-3 right-3 text-xs px-2.5 py-1 rounded-full font-bold" style={availStyle}>
          {apt.availability}
        </span>
        {(apt.privacy_level === "private" || apt.privacy_level === "discreet") && (
          <span className="absolute top-3 left-3 text-xs px-2.5 py-1 rounded-full font-bold text-white"
            style={{ background: "rgba(0,0,0,0.7)" }}>
            🔒 Private
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="text-sm font-black text-gray-900 truncate mb-1">{apt.title}</p>
        <p className="text-xs text-gray-500">📍 {apt.area} · {bedroomLabel} · <span className="capitalize">{apt.furnished}</span></p>
        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="text-lg font-black" style={{ color: "#4f46e5" }}>ZMW {Number(apt.rent_zmw).toLocaleString()}</span>
            <span className="text-xs text-gray-400">/mo</span>
          </div>
          {apt.landlords?.is_verified && (
            <span className="text-xs px-2 py-1 rounded-full font-bold" style={{ background: "#ede9fe", color: "#7c3aed" }}>✓ Verified</span>
          )}
        </div>
        {apt.amenities?.length > 0 && (
          <p className="text-xs text-gray-400 mt-2 truncate">{apt.amenities.slice(0, 3).join(" · ")}</p>
        )}
      </div>
    </Link>
  );
}
