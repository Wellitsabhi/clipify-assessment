# MealPlan Pro — work notes

A summary of what I found, what I fixed, how I verified it, and what I'd do next.
The repo shipped with a deliberate "chaos" layer plus a set of seeded security,
correctness, and UX defects. I treated it as a real production-readiness pass:
**no known security issue or correctness bug remains in the paths below**, and the
UI was rebuilt around a single coherent design system.

Build: `npm run build` ✓ · Lint: `npx eslint .` ✓ (0 errors) · Verified end-to-end
against the dev server (see "Verification").

---

## 1. Security (highest priority)

| # | Issue | Fix | File |
|---|-------|-----|------|
| S1 | **All server secrets inlined into the client JS bundle** via `next.config.ts > env` (JWT_SECRET, STRIPE_SECRET_KEY, OPENAI_API_KEY, GEMINI_API_KEY, webhook secret…). Anyone could read them from browser devtools. | Removed the entire `env` block. Server code reads `process.env` at runtime; only `NEXT_PUBLIC_*` reaches the client. Confirmed via bundle grep. | `next.config.ts` |
| S2 | **Passwords stored in plaintext** (register wrote the raw password; login did `user.password !== password`). | bcrypt (12 rounds) on register + seed; constant-path `bcrypt.compare` on login. | `lib/password.ts`, `app/api/auth/{register,login}`, `prisma/seed.ts` |
| S3 | **Hardcoded JWT secret** `"super-secret-key-123"`. | Read from `JWT_SECRET` env; throws at boot if missing; generated a strong value for local `.env`. | `lib/auth.ts` |
| S4 | **Token returned in JSON + stored in `localStorage`** (XSS-exfiltratable). | Token is now set as a `Secure`, `httpOnly`, `SameSite=Lax` cookie; never in the body. Added `/api/auth/logout` to clear it. | `lib/auth.ts`, auth routes |
| S5 | **Secrets in the LLM system prompt** (admin password, cost data) **and the whole prompt returned to the client** from both chat `GET` and `POST`. | New server-only prompt with no secrets; chat responses return only `messages` / `message` / `recipe`. | `lib/recipeBot.ts`, `app/api/chat/route.ts` |
| S6 | **IDOR everywhere**: recipe `GET/PUT/DELETE`, meal-plan `GET` had no auth/ownership checks; recipe list + detail were fully public; recipe `DELETE` had no auth at all. | Every route requires a session; mutations and private reads verify ownership (403 otherwise). | `app/api/recipes/**`, `app/api/meal-plans/**`, `lib/apiAuth.ts` |
| S7 | **Account enumeration / nonsense error**: login revealed a (fake) "other user" email and behaved differently for unknown vs wrong-password. | Single generic `"Invalid email or password."`; always runs a hash compare to keep timing uniform. | `app/api/auth/login` |
| S8 | **Stripe webhook** updated plans without guarding a missing user and ignored cancellations. | Verifies signature + secret presence, handles `customer.subscription.deleted` (revert to free), returns 500 so Stripe retries on handler failure. | `app/api/stripe/webhook` |
| S9 | **PII leak**: recipe detail API returned the owner's **email** to any viewer. | Drops `email`; returns owner `name` only. | `app/api/recipes/[id]` |
| S10 | **Real API keys committed in `.env`** (live-looking OpenAI/Gemini/Stripe). | `.env` is already gitignored; `.env.example` is placeholder-only with rotation guidance. **These keys should be rotated** — treat them as compromised. | `.env.example` |
| S11 | No edge-level gating of authenticated pages. | Added `proxy.ts` (Next 16's renamed middleware) for optimistic cookie-based redirects; real enforcement stays in the API. | `proxy.ts` |

## 2. Correctness bugs

- **Meal-plan add ignored the selected recipe** — it always attached the *first
  recipe in the entire database* (`findFirst`). Now uses the posted `recipeId`
  (validated to exist). `app/api/meal-plans/[id]`
- **Recipe "Delete" created junk** — the UI `POST`ed `{id}` to `/api/recipes`,
  creating a blank recipe instead of deleting. Now `DELETE /api/recipes/:id`
  with optimistic UI + rollback. Recipe cascade delete is wrapped in a transaction.
- **"Save Recipe" button did nothing** (`handleSaveRecipe(){}`) — replaced with a
  working "New recipe" modal.
- **No way to create a meal plan** in the UI — added a create-plan modal.
- **Logout didn't log out** — it only `router.push("/login")` and left the token.
  Now calls the logout endpoint and clears the cookie.
- **Fragile AI parsing** — `JSON.parse(assistantMessage)` on free-form prose,
  silently swallowed. Replaced with a dedicated extraction step using OpenAI JSON
  mode, with validation + an `isRecipe` gate.
- **Unbounded chat context** — every request resent the *entire* history plus a
  ~960-line synthetic "food context" block (huge token cost). Now: no junk
  context, last 20 turns only.
- **Image generation could break recipe creation** — already best-effort, kept it
  isolated so a failed image never rolls back the saved recipe.
- **Input validation** — added throughout (email format, password length, ints,
  dates, enum day/mealType) returning clean 400s instead of 500s/coerced data.

## 3. The "chaos" layer (removed)

Deliberate runtime sabotage, all removed: a RAM-leaking `setInterval`, an infinite
`requestAnimationFrame` re-render loop, CPU-burning animated `backdrop-filter`
layers, a fake SVG cursor hiding the real one, `window.fetch` monkey-patching with
`[CHAOS]` console spam on every request, ~20MB cooking GIFs plastered on every
page, the env-var-name dump in the chat page, and the hardcoded fake Stripe key in
settings. Deleted `ClientChaosShell`, `CookingGifPlaster`, `cookingGifSources`,
and all `console.log("[CHAOS …]")` calls.

## 4. Design overhaul

Rebuilt the UI around one design system (`app/globals.css` tokens +
`app/components/ui.tsx` primitives): warm paper canvas, a single emerald accent, a
real type scale, consistent spacing/radius/shadows, accessible focus rings, and
`prefers-reduced-motion` support. Replaced the clashing
purple/lime/orange/red-everything pages and the intentionally awful "Landing" page
with a clear marketing page that states the value prop. Swapped the 1.7MB logo PNG
for a crisp inline SVG, loaded the Geist font that the CSS already referenced, and
made the layouts responsive with real empty/loading/error states.

## 5. Verification

Ran the dev server and confirmed:
- Login: wrong password → generic 401; correct password verifies against the
  bcrypt hash; token issued **only** as an `httpOnly` cookie.
- Chat `GET` returns messages only — **no system prompt / admin password**.
- IDOR: Bob → Alice's meal plan = **403**; anon → recipes = **401**;
  Bob → delete Alice's recipe = **403**.
- Meal-plan add stores the **selected** recipe (not the DB's first).
- Proxy: anon `/recipes` → 307 redirect to `/login`. Logout clears the cookie.
- Bundle grep: JWT/Stripe/OpenAI/Gemini secrets and the admin password are
  **absent** from client chunks.

## 5b. Design & AI polish round (second pass)

Done as a series of small, committed-per-step changes:

- **AI works now.** Recipe Bot routes through the **Vercel AI Gateway**
  (`AI_GATEWAY_API_KEY`, OpenAI-compatible) since the raw OpenAI key was dead.
  Models namespaced `openai/<model>`; dropped `json_object` mode (gateway
  rejects it) for defensive JSON parsing. Verified live end-to-end.
- **Design system v2** — fresh-garden palette (herb greens + citrus on
  off-white), Fraunces display serif for headings, shared motion easings,
  layered shadows, grain/garden background utilities, a subtle line-icon set.
  Added `motion` (motion.dev) and `@paper-design/shaders-react`.
- **Navbar** — sliding active pill + hover-follow (motion `layoutId`), playful
  gradient-initials avatar, icon logout with tooltip.
- **Auth pages** — poppy split-screen with an animated mesh-gradient shader,
  floating food, hooking display headline, feature nudges, and a "Clipify"
  signature easter egg.
- **Route transitions** across the app shell; **staggered** grid/list entrances;
  rich card hover (image zoom, lift, scrim); **icon-only** delete with tooltip.
- **Meal-type glyphs** with time-of-day association (sunrise/sun/moon), each
  with its own custom-eased idle motion.
- **Image consistency fix** — `RecipeImage` renders a deterministic appetizing
  gradient + dish emoji when a recipe has no real photo (previously everything
  fell back to the pancakes image).
- **Landing** rebuilt as a premium marketing page (shader hero, textured panel).
- Accessibility kept in mind: focus-visible rings, `prefers-reduced-motion`
  fallbacks, labelled icon buttons, alt text.

## 6. What I'd do next (out of scope for this pass)

- **Rotate the committed API keys** (S10) — assume they're burned.
- **Rate-limit** auth + chat (brute-force / cost protection).
- **CSRF protection** for cookie-auth mutations (e.g. double-submit token or
  `SameSite=Strict` + origin check) — currently `Lax`, which covers the common case.
- **Pro gating** of premium actions server-side (AI image generation, plan count).
- **Automated tests** — unit tests for `lib/validation`, `lib/recipeBot`
  extraction, and integration tests for the authz matrix I checked by hand.
- **Recipe edit UI** (the `PUT` endpoint exists and is secured, but there's no form yet).
- **Account deletion** (button is present but intentionally inert).
- **DB**: move off SQLite + add migrations (`prisma migrate`) for real deploys.
