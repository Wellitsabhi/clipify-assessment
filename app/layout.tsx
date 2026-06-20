import type { Metadata } from "next";
import { Geist, Fraunces } from "next/font/google";
import "./globals.css";

// Body: clean, modern sans.
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

// Display: a characterful high-contrast serif for headings — warm, editorial,
// a touch old-world. Used for hero/section titles, not body copy.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

export const metadata: Metadata = {
  title: "MealPlan Pro — AI meal planning that fits your week",
  description:
    "Build weekly meal plans from a recipe catalog, generate new recipes with AI, and keep your kitchen organized.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${fraunces.variable} h-full`}>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
