"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

const AREAS = ["Woodlands", "Kalingalinga", "Ibex Hill", "Roma", "Kabulonga", "Chelstone", "Avondale", "Chilenje", "Olympia", "Northmead", "Emmasdale", "Matero", "Other"];
const AMENITIES_OPTIONS = ["WiFi", "DSTV", "Borehole", "Municipal Water", "Parking", "Security Guard", "Electric Fence", "Generator", "Swimming Pool", "Garden"];

function ListForm() {
  const searchParams = useSearchParams();
  const existingLandlordId = searchParams.get("landlord_id") ?? "";
  const router = useRouter();

  // Landlord fields (only shown if no existing account)
  const [landlordName, setLandlordName] = useState("");
  const [landlordPhone, setLandlordPhone] = useState("");

  // Apartment fields
  const [title, setTitle] = useState("");
  const [area, setArea] = useState("");
  const [address, setAddress] = useState("");
  const [bedrooms, setBedrooms] = useState("1");
  const [bathrooms, setBathrooms] = useState("1");
  const [rent, setRent] = useState("");
  const [deposit, setDeposit] = useState("");
  const [furnished, setFurnished] = useState("unfurnished");
  const [privacy, setPrivacy] = useState("standard");
  const [contactPhone, setContactPhone] = useState("");
  const [contactWhatsapp, setContactWhatsapp] = useState("");
  const [description, setDescription] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [rules, setRules] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function toggleAmenity(a: string) {
    setSelectedAmenities((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    let landlordId = existingLandlordId;

    // Create landlord account if new
    if (!landlordId) {
      const lRes = await fetch("/api/landlords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: landlordName, phone: landlordPhone }),
      });
      const lData = await lRes.json();
      if (!lRes.ok) { setError(lData.error); setLoading(false); return; }
      landlordId = lData.landlord.id;
    }

    const aptRes = await fetch("/api/apartments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        landlord_id: landlordId,
        title, area, address,
        bedrooms: parseInt(bedrooms),
        bathrooms: parseInt(bathrooms),
        rent_zmw: parseFloat(rent),
        deposit_zmw: deposit ? parseFloat(deposit) : null,
        furnished, privacy_level: privacy,
        contact_phone: contactPhone || landlordPhone,
        contact_whatsapp: contactWhatsapp,
        description,
        amenities: selectedAmenities,
        rules: rules.split("\n").map((r) => r.trim()).filter(Boolean),
      }),
    });
    const aptData = await aptRes.json();
    setLoading(false);
    if (!aptRes.ok) { setError(aptData.error); return; }
    router.push(`/landlord/${landlordId}`);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-indigo-700 text-white px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link href="/" className="text-indigo-200 hover:text-white text-sm">← Back</Link>
          <h1 className="text-lg font-black">ApartZM 🇿🇲</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-black text-gray-900 mb-1">List Your Apartment</h2>
        <p className="text-sm text-gray-500 mb-6">Free listing · Tenants contact you directly</p>

        <form onSubmit={submit} className="space-y-5">
          {!existingLandlordId && (
            <div className="bg-white rounded-xl p-5 border space-y-3">
              <h3 className="font-bold text-gray-800">Your Details</h3>
              <input value={landlordName} onChange={(e) => setLandlordName(e.target.value)} placeholder="Your full name" required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400" />
              <input value={landlordPhone} onChange={(e) => setLandlordPhone(e.target.value)} placeholder="Your phone (e.g. 0976123456)" required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400" />
            </div>
          )}

          <div className="bg-white rounded-xl p-5 border space-y-3">
            <h3 className="font-bold text-gray-800">Apartment Details</h3>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Listing title (e.g. Spacious 2-Bed in Woodlands)" required
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400" />
            <div className="grid grid-cols-2 gap-3">
              <select value={area} onChange={(e) => setArea(e.target.value)} required
                className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400">
                <option value="">Select area</option>
                {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
              <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street/compound (optional)"
                className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Bedrooms</label>
                <select value={bedrooms} onChange={(e) => setBedrooms(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400">
                  <option value="0">Bedsitter</option>
                  <option value="1">1 Bedroom</option>
                  <option value="2">2 Bedrooms</option>
                  <option value="3">3 Bedrooms</option>
                  <option value="4">4+ Bedrooms</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Bathrooms</label>
                <select value={bathrooms} onChange={(e) => setBathrooms(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400">
                  {["1","2","3","4"].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input value={rent} onChange={(e) => setRent(e.target.value)} placeholder="Monthly rent (ZMW)" required type="number"
                className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400" />
              <input value={deposit} onChange={(e) => setDeposit(e.target.value)} placeholder="Deposit (ZMW, optional)" type="number"
                className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Furnished</label>
                <select value={furnished} onChange={(e) => setFurnished(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400">
                  <option value="unfurnished">Unfurnished</option>
                  <option value="semi-furnished">Semi-furnished</option>
                  <option value="fully-furnished">Fully furnished</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Privacy level</label>
                <select value={privacy} onChange={(e) => setPrivacy(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400">
                  <option value="standard">Standard</option>
                  <option value="private">Private</option>
                  <option value="discreet">Discreet</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border space-y-3">
            <h3 className="font-bold text-gray-800">Contact Details</h3>
            <input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="Contact phone for tenants (e.g. 0976123456)"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400" />
            <input value={contactWhatsapp} onChange={(e) => setContactWhatsapp(e.target.value)} placeholder="WhatsApp number (optional)"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400" />
          </div>

          <div className="bg-white rounded-xl p-5 border space-y-3">
            <h3 className="font-bold text-gray-800">Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {AMENITIES_OPTIONS.map((a) => (
                <button type="button" key={a} onClick={() => toggleAmenity(a)}
                  className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${
                    selectedAmenities.includes(a) ? "bg-indigo-700 text-white border-indigo-700" : "bg-white text-gray-600 border-gray-200 hover:border-indigo-400"
                  }`}>{a}</button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border space-y-3">
            <h3 className="font-bold text-gray-800">Description & Rules</h3>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the apartment..." rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 resize-none" />
            <textarea value={rules} onChange={(e) => setRules(e.target.value)} placeholder={"House rules (one per line)\ne.g. No loud music after 10pm\nCouples welcome"} rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-400 resize-none" />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-indigo-700 text-white font-bold py-3.5 rounded-xl text-sm hover:bg-indigo-800 disabled:opacity-50 transition-colors">
            {loading ? "Listing..." : "List My Apartment — Free"}
          </button>
          <p className="text-center text-xs text-gray-400">Already have an account? <Link href="/landlord/login" className="text-indigo-600 font-medium">Log in →</Link></p>
        </form>
      </main>
    </div>
  );
}

export default function ListPage() {
  return <Suspense><ListForm /></Suspense>;
}
