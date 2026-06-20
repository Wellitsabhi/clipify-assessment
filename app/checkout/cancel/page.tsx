import Link from "next/link";
import ChefLogo from "@/app/components/ChefLogo";

export default function CheckoutCancelPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md animate-in rounded-(--radius-card) border border-border bg-surface p-8 text-center shadow-(--shadow-md)">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-stone-100 text-2xl">
          ↩
        </div>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight text-foreground">
          Checkout cancelled
        </h1>
        <p className="mt-2 text-sm text-muted">
          No charges were made. You can upgrade anytime from settings.
        </p>
        <Link
          href="/settings"
          className="mt-6 inline-block rounded-lg border border-(--border-strong) bg-surface px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-background"
        >
          Back to settings
        </Link>
        <div className="mt-6 flex justify-center opacity-60">
          <ChefLogo size={28} href={null} />
        </div>
      </div>
    </main>
  );
}
