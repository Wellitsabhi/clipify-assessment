import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/apiAuth";

export async function POST(req: NextRequest) {
  const auth = requireSession(req);
  if (auth instanceof NextResponse) return auth;

  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    select: { stripeCustomerId: true },
  });

  try {
    // Cancel any active subscriptions for this customer in Stripe.
    if (user?.stripeCustomerId) {
      const subs = await stripe.subscriptions.list({
        customer: user.stripeCustomerId,
        status: "active",
        limit: 10,
      });
      await Promise.all(subs.data.map((s) => stripe.subscriptions.cancel(s.id)));
    }

    // Reflect the change locally right away; the webhook will also confirm it.
    await prisma.user.update({ where: { id: auth.userId }, data: { plan: "free" } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[stripe/cancel]", err);
    return NextResponse.json(
      { error: "Could not cancel your subscription. Please contact support." },
      { status: 500 }
    );
  }
}
