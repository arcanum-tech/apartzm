"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

const AREAS = ["Woodlands","Kalingalinga","Ibex Hill","Roma","Kabulonga","Chelstone","Avondale","Chilenje","Olympia","Northmead","Emmasdale","Matero","Other"];
const AMENITIES_OPTIONS = ["WiFi","DSTV","Borehole","Municipal Water","Parking","Security Guard","Electric Fence","Generator","Swimming Pool","Garden"];

type Unit = { bedrooms: string; bathrooms: string; rent_per_day: string; units_available: string; furnished: string; privacy: string };
const BLANK_UNIT: Unit = { bedrooms: "1", bathrooms: "1", rent_per_day: "", units_available: "1", furnished: "fully-furnished", privacy: "standard" };
function bedroomLabel(val: string) { return val === "0" ? "Bedsitter" : `${val} Bed${parseInt(val) > 1 ? "s" : ""}`; }

function ListForm() {
  const searchParams = useSearchParams();
  const existingLandlordId = searchParams.get("landlord_id") ?? "";
  const router = useRouter();

  const [landlordName, setLandlordName] = useState("");
  const [landlordPhone, setLandlordPhone] = useState("");
  const [propertyName, setPropertyName] = useState("");
  const [area, setArea] = useState("");
  const [address, setAddress] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactWhatsapp, setContactWhatsapp] = useState("");
  const [description, setDescription] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [rules, setRules] = useState("");
  const [units, setUnits] = useState<Unit[]>([{ ...BLANK_UNIT }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function toggleAmenity(a: string) {
    setSelectedAmenities((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]);
  }
  function updateUnit(i: number, field: keyof Unit, value: string) {
    setUnits((prev) => prev.map((u, idx) => idx === i ? { ...u, [field]: value } : u));
  }
  function addUnit() { setUnits((prev) => [...prev, { ...BLANK_UNIT }]); }
  function removeUnit(i: number) { setUnits((prev) => prev.filter((_, idx) => idx !== i)); }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    let landlordId = existingLandlordId;
    if (!landlordId) {
      const lRes = await fetch("/api/landlords", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: landlordName, phone: landlordPhone }) });
      const lData = await lRes.json();
      if (!lRes.ok) { setError(lData.error); setLoading(false); return; }
      landlordId = lData.landlord.id;
    }

    for (const unit of units) {
      const qty = parseInt(unit.units_available) || 1;
      for (let i = 0; i < qty; i++) {
        const title = qty > 1 ? `${propertyName} — ${bedroomLabel(unit.bedrooms)} (Unit ${i + 1})` : `${propertyName} — ${bedroomLabel(unit.bedrooms)}`;
        const res = await fetch("/api/apartments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            landlord_id: landlordId, title, area, address,
            bedrooms: parseInt(unit.bedrooms), bathrooms: parseInt(unit.bathrooms),
            rent_zmw: parseFloat(unit.rent_per_day), rate_type: "per_day",
            furnished: unit.furnished, privacy_level: unit.privacy,
            contact_phone: contactPhone || landlordPhone,
            contact_whatsapp: contactWhatsapp, description,
            amenities: selectedAmenities,
            rules: rules.split("\n").map((r) => r.trim()).filter(Boolean),
          }),
        });
        const data = await res.json();
        if (!res.ok) { setError(data.error); setLoading(false); return; }
      }
    }
    router.push(`/landlord/${landlordId}`);
  }

  const inp = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400 bg-gray-50";
  const sel = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-purple-400 bg-gray-50";

  return (
    <div className="min-h-screen" style={{ background: "#f8f7ff" }}>
      <header style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)" }} className="text-white px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link href="/" className="text-purple-200 hover:text-white text-sm">← Back</Link>
          <h1 className="text-lg font-black">ApartZM 🇿🇲</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-black text-gray-900 mb-1">List Your Property</h2>
        <p className="text-sm text-gray-500 mb-6">Register once — add as many unit types as you have on site</p>

        <form onSubmit={submit} className="space-y-5">
          {!existingLandlordId && (
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-3">
              <h3 className="font-black text-gray-800">Your Details</h3>
              <input value={landlordName} onChange={(e) => setLandlordName(e.target.value)} placeholder="Your full name" required className={inp} />
              <input value={landlordPhone} onChange={(e) => setLandlordPhone(e.target.value)} placeholder="Your phone (e.g. 0976123456)" required className={inp} />
            </div>
          )}

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-3">
            <h3 className="font-black text-gray-800">Property Details</h3>
            <input value={propertyName} onChange={(e) => setPropertyName(e.target.value)} placeholder="Property name (e.g. Woodlands Gardens, Ibex Suites)" required className={inp} />
            <div className="grid grid-cols-2 gap-3">
              <select value={area} onChange={(e) => setArea(e.target.value)} required className={sel}>
                <option value="">Select area</option>
                {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
              <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street / compound" className={inp} />
            </div>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the property..." rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400 bg-gray-50 resize-none" />
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-gray-800">Unit Types</h3>
              <span className="text-xs text-gray-400">One row per unit type</span>
            </div>

            {units.map((unit, i) => (
              <div key={i} className="rounded-xl p-4 space-y-3" style={{ background: "#f8f7ff", border: "1px solid #e0e7ff" }}>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-black" style={{ color: "#7c3aed" }}>Unit Type {i + 1}</p>
                  {units.length > 1 && (
                    <button type="button" onClick={() => removeUnit(i)} className="text-xs text-red-400 hover:text-red-600 font-semibold">✕ Remove</button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Bedrooms</label>
                    <select value={unit.bedrooms} onChange={(e) => updateUnit(i, "bedrooms", e.target.value)} className={sel}>
                      <option value="0">Bedsitter</option>
                      <option value="1">1 Bedroom</option>
                      <option value="2">2 Bedrooms</option>
                      <option value="3">3 Bedrooms</option>
                      <option value="4">4+ Bedrooms</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Bathrooms</label>
                    <select value={unit.bathrooms} onChange={(e) => updateUnit(i, "bathrooms", e.target.value)} className={sel}>
                      {["1","2","3","4"].map((n) => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Rate per day (ZMW)</label>
                    <input value={unit.rent_per_day} onChange={(e) => updateUnit(i, "rent_per_day", e.target.value)}
                      placeholder="e.g. 250" required type="number" className={inp} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">How many of this unit?</label>
                    <input value={unit.units_available} onChange={(e) => updateUnit(i, "units_available", e.target.value)}
                      placeholder="e.g. 3" required type="number" min="1" className={inp} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Furnished</label>
                    <select value={unit.furnished} onChange={(e) => updateUnit(i, "furnished", e.target.value)} className={sel}>
                      <option value="fully-furnished">Fully furnished</option>
                      <option value="semi-furnished">Semi-furnished</option>
                      <option value="unfurnished">Unfurnished</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Privacy</label>
                    <select value={unit.privacy} onChange={(e) => updateUnit(i, "privacy", e.target.value)} className={sel}>
                      <option value="standard">Standard</option>
                      <option value="private">Private</option>
                      <option value="discreet">Discreet</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}

            <button type="button" onClick={addUnit}
              className="w-full py-3 rounded-xl text-sm font-bold transition-colors hover:bg-purple-50"
              style={{ border: "2px dashed #c4b5fd", color: "#7c3aed" }}>
              + Add Another Unit Type
            </button>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-3">
            <h3 className="font-black text-gray-800">Property Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {AMENITIES_OPTIONS.map((a) => (
                <button type="button" key={a} onClick={() => toggleAmenity(a)}
                  className="text-xs px-3 py-1.5 rounded-full border font-semibold transition-colors"
                  style={selectedAmenities.includes(a)
                    ? { background: "linear-gradient(135deg,#4f46e5,#7c3aed)", color: "white", borderColor: "#7c3aed" }
                    : { background: "white", color: "#4b5563", borderColor: "#e5e7eb" }}>
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-3">
            <h3 className="font-black text-gray-800">Contact & House Rules</h3>
            <input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="Caretaker / contact phone for tenants" className={inp} />
            <input value={contactWhatsapp} onChange={(e) => setContactWhatsapp(e.target.value)} placeholder="WhatsApp number (optional)" className={inp} />
            <textarea value={rules} onChange={(e) => setRules(e.target.value)}
              placeholder={"House rules (one per line)\ne.g. Couples welcome\nNo loud music after 10pm"} rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400 bg-gray-50 resize-none" />
          </div>

          {error && <p className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-xl">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full text-white font-black py-4 rounded-xl text-sm disabled:opacity-50 transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg,#4f46e5,#7c3aed)" }}>
            {loading ? "Listing..." : `List Property with ${units.length} Unit Type${units.length > 1 ? "s" : ""} — Free`}
          </button>
          <p className="text-center text-xs text-gray-400">
            Already have an account?{" "}
            <Link href="/landlord/login" className="font-bold" style={{ color: "#7c3aed" }}>Log in →</Link>
          </p>
        </form>
      </main>
    </div>
  );
}

export default function ListPage() {
  return <Suspense><ListForm /></Suspense>;
}
