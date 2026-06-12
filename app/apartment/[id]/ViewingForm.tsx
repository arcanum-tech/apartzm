"use client";

import { useState } from "react";

export default function ViewingForm({ apartmentId, landlordId }: { apartmentId: string; landlordId: string }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/viewing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apartment_id: apartmentId, landlord_id: landlordId, requester_name: name, requester_phone: phone, preferred_date: date }),
    });
    setSubmitted(true);
    setLoading(false);
  }

  if (submitted) return (
    <div className="text-center py-4">
      <p className="text-green-600 font-bold text-sm">✓ Viewing request sent!</p>
      <p className="text-xs text-gray-500 mt-1">The landlord will contact you to confirm.</p>
    </div>
  );

  return (
    <form onSubmit={submit} className="space-y-2">
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required
        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-400" />
      <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Your phone number" required
        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-400" />
      <input value={date} onChange={(e) => setDate(e.target.value)} placeholder="Preferred date (optional)"
        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-400" />
      <button type="submit" disabled={loading}
        className="w-full bg-gray-900 text-white font-bold py-2.5 rounded-xl text-sm hover:bg-gray-800 transition-colors disabled:opacity-50">
        {loading ? "Sending..." : "Book Viewing"}
      </button>
    </form>
  );
}
