"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LandlordLogin() {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setError(data.error); return; }
    router.push(`/landlord/${data.landlord.id}`);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="bg-white rounded-2xl border shadow-sm p-8 w-full max-w-sm">
        <Link href="/" className="text-indigo-600 text-sm hover:underline">← Back to ApartZM</Link>
        <h1 className="text-2xl font-black text-gray-900 mt-4 mb-1">Landlord Login</h1>
        <p className="text-sm text-gray-500 mb-6">Enter your registered phone number</p>
        <form onSubmit={login} className="space-y-3">
          <input value={phone} onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. 0976123456" required
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-400" />
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-indigo-700 text-white font-bold py-3 rounded-xl text-sm hover:bg-indigo-800 disabled:opacity-50 transition-colors">
            {loading ? "Checking..." : "Log In"}
          </button>
        </form>
        <p className="text-center text-xs text-gray-400 mt-4">
          New landlord?{" "}
          <Link href="/list" className="text-indigo-600 font-medium">List your first apartment</Link>
        </p>
      </div>
    </div>
  );
}
