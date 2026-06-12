import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ApartZM — Find Apartments in Lusaka",
  description: "Browse all Lusaka apartments. Check availability, view photos, contact landlords instantly.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
