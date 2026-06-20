# MealPlan Pro

An AI-powered meal planning application built with Next.js, Prisma, OpenAI, and Stripe.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript
- **Database:** SQLite via Prisma ORM
- **AI:** OpenAI API (GPT-4o-mini) for Recipe Bot
- **Image Generation:** Nano Banana Pro (recipe image generation)
- **Payments:** Stripe (test mode)
- **Auth:** Custom JWT authentication
- **Styling:** Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 20.9+
- npm

### Setup

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Push database schema and create tables
npx prisma db push

# Seed the database with sample data
npx prisma db seed

# Start development server
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Environment Variables

Create a `.env` file in the project root with the variables below (a populated `.env` may be provided for local setup).

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | SQLite database file path |
| `JWT_SECRET` | **Required.** Secret for signing session JWTs. Generate with `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`. The app throws at boot if unset. |
| `OPENAI_API_KEY` | OpenAI API key for the Recipe Bot |
| `GEMINI_API_KEY` | Google AI Studio key for recipe image generation (optional; image gen is best-effort) |
| `STRIPE_SECRET_KEY` | Stripe secret key (test mode) — **server only** |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `STRIPE_PRICE_ID` / `STRIPE_PRO_PRODUCT_ID` | Pin a Pro price, or resolve one from a product |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Public Stripe key for the frontend |
| `NEXT_PUBLIC_APP_URL` | Public origin for Stripe redirect URLs (optional; inferred from the request if unset) |

> **Security note:** secrets are read from `process.env` on the server only and are
> **never** exposed to the browser. Do not add server secrets to `next.config.ts`'s
> `env` block (that inlines them into the client bundle). Only `NEXT_PUBLIC_*` vars
> are sent to the client. See [NOTES.md](./NOTES.md).

**Product goals and seeded test accounts** are in [TEST_INSTRUCTIONS.md](./TEST_INSTRUCTIONS.md).

## Architecture

### Route Structure

```
app/
├── page.tsx                     # Root redirect
├── login/page.tsx               # Login form
├── register/page.tsx            # Registration form
├── (app)/                       # Authenticated shell
│   ├── layout.tsx               # Shared layout with Navbar
│   ├── recipes/page.tsx         # Recipe catalog
│   ├── recipes/[id]/page.tsx    # Recipe detail
│   ├── chat/page.tsx            # Recipe Bot conversation
│   ├── meal-plans/page.tsx      # Meal plan list
│   ├── meal-plans/[id]/page.tsx # Meal plan detail + weekly grid
│   └── settings/page.tsx        # Account, subscription, upgrade
├── checkout/
│   ├── success/page.tsx         # Stripe success return
│   └── cancel/page.tsx          # Stripe cancel return
└── api/
    ├── auth/{login,register,me,logout} # Cookie-based JWT auth
    ├── recipes/                 # Recipe CRUD (owner-scoped mutations)
    ├── chat/                    # Recipe Bot AI endpoint
    ├── meal-plans/              # Meal plan management (owner-scoped)
    └── stripe/{checkout,webhook,cancel} # Stripe integration
```

`proxy.ts` (Next.js 16's renamed middleware) provides an optimistic, cookie-based
auth redirect for the app pages; the API routes perform the real JWT verification
and ownership checks.

### Auth & data flow

Login/register set a `Secure`, `httpOnly`, `SameSite=Lax` cookie containing a
signed JWT (`{ userId, email }`, 7-day expiry). The browser sends it automatically;
the client never reads the token. Passwords are hashed with bcrypt (12 rounds).
Each API route resolves the session via `requireSession` and enforces per-user
ownership before reading or mutating rows.

### Database Schema

- **User** — email, password, name, plan (free/pro), Stripe customer ID
- **Recipe** — title, description, image, times, servings, nutrition, dietary tags
- **Ingredient** — name, amount, unit (belongs to Recipe)
- **MealPlan** — name, date range (belongs to User)
- **MealPlanRecipe** — day, meal type (joins MealPlan ↔ Recipe)
- **ChatMessage** — role, content (belongs to User)

### Stripe Integration

The app uses Stripe Checkout in test mode for upgrading from Free to Pro:

1. User clicks "Upgrade to Pro" on the settings page
2. Server creates a Stripe Checkout Session with the Pro price
3. User is redirected to Stripe's hosted checkout page
4. On success, the webhook upgrades the user's plan to `pro`
5. Cancelling (`/api/stripe/cancel`) cancels active subscriptions and reverts to `free`;
   the `customer.subscription.deleted` webhook also reverts the plan.

Create a test product/price in your Stripe dashboard and set `STRIPE_PRICE_ID`
(or `STRIPE_PRO_PRODUCT_ID`). Forward webhooks locally with:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

---

For a full account of the security/correctness/UX work done on this codebase, see
[NOTES.md](./NOTES.md).
