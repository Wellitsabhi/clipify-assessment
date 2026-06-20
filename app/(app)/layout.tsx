import Navbar from "@/app/components/Navbar";
import { RouteTransition } from "@/app/components/RouteTransition";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="min-h-0 flex-1">
        <RouteTransition>{children}</RouteTransition>
      </main>
    </div>
  );
}
