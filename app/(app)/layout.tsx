import { Toaster } from "sonner";
import Navbar from "@/app/components/Navbar";
import { RouteTransition } from "@/app/components/RouteTransition";
import { ConfirmProvider } from "@/app/components/ConfirmProvider";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ConfirmProvider>
      <div className="flex min-h-screen flex-col bg-background">
        <Navbar />
        <main className="min-h-0 flex-1">
          <RouteTransition>{children}</RouteTransition>
        </main>
      </div>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "var(--surface)",
            color: "var(--foreground)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
          },
        }}
      />
    </ConfirmProvider>
  );
}
