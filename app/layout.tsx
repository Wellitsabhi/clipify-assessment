import type { Metadata } from "next";
import { Geist, Bodoni_Moda } from "next/font/google";
import "./globals.css";

// Body: clean, modern sans.
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

// Display: Bodoni Moda — a dramatic, high-contrast fashion-editorial serif.
// Used for hero/section headings to give the product a distinctive, premium
// magazine voice. Optical sizing keeps the thin strokes crisp at large sizes.
const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "MealPlan Pro — AI meal planning that fits your week",
  description:
    "Build weekly meal plans from a recipe catalog, generate new recipes with AI, and keep your kitchen organized.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${bodoni.variable} h-full`}>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
