import Link from "next/link";
import ChefLogo from "@/app/components/ChefLogo";

export default function CheckoutSuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md animate-in rounded-(--radius-card) border border-border bg-surface p-8 text-center shadow-(--shadow-md)">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft text-2xl">
          ✓
        </div>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight text-foreground">
          You&apos;re on Pro
        </h1>
        <p className="mt-2 text-sm text-muted">
          Thanks for upgrading. Your account now has every Pro feature unlocked.
        </p>
        <Link
          href="/recipes"
          className="mt-6 inline-block rounded-lg bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
        >
          Go to your recipes
        </Link>
        <div className="mt-6 flex justify-center opacity-60">
          <ChefLogo size={28} href={null} />
        </div>
      </div>
    </main>
  );
}
