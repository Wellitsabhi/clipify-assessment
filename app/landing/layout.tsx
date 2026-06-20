import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MealPlan Pro — Plan your week of meals in minutes",
};

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
