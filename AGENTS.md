<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project conventions (verified against Next.js 16.2 docs)

- **Middleware is now `proxy.ts`** at the project root (Next 16 rename). Export a
  `proxy` function + `config.matcher`. See `node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md`.
  Use it only for optimistic auth redirects — do real authz in the route handlers.
- **Never put server secrets in `next.config.ts > env`** — that inlines them into
  the client bundle. Server code reads `process.env` directly; only `NEXT_PUBLIC_*`
  is meant for the browser.
- Route handler dynamic params are async: `({ params }: { params: Promise<{ id }> })`.
- **Auth:** JWT in a `Secure`/`httpOnly`/`SameSite=Lax` cookie (`lib/auth.ts`);
  passwords hashed with bcrypt (`lib/password.ts`); every API route guards with
  `requireSession` (`lib/apiAuth.ts`) and checks per-user ownership.
- **UI:** shared design tokens in `app/globals.css`, primitives in
  `app/components/ui.tsx`. Reuse them rather than re-styling ad hoc.

## Commands

- `npm run dev` · `npm run build` · `npx eslint .`
- `npx prisma db push && npx prisma db seed` (seed hashes passwords; test accounts in TEST_INSTRUCTIONS.md)
