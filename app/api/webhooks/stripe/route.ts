import { createTransaction } from "@/lib/actions/transaction.action";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature") || "";
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    console.error("Stripe webhook error:", err.message);
    return NextResponse.json(
      { message: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const transaction = {
      stripeId: session.id,
      amount: session.amount_total ? session.amount_total / 100 : 0,
      plan: session.metadata?.plan || "",
      credits: Number(session.metadata?.credits) || 0,
      buyerId: session.metadata?.buyerId || "",
      createdAt: new Date(),
    };

    try {
      const newTransaction = await createTransaction(transaction);
      return NextResponse.json({ message: "OK", transaction: newTransaction });
    } catch (err) {
      console.error("Failed to create transaction:", err);
      return NextResponse.json(
        { message: "Failed to record transaction" },
        { status: 500 }
      );
    }
  }

  // For other event types, respond with 200
  return NextResponse.json({ received: true });
}
