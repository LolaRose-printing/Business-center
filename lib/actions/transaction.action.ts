"use server";

import { redirect } from "next/navigation";
import Stripe from "stripe";
import { handleError } from "../utils";
import { PrismaClient } from "@prisma/client";
import { updateCredits } from "./user.actions";

const prisma = new PrismaClient();

type CheckoutTransactionParams = {
  amount: number;       // In dollars (e.g. 10 for $10)
  plan: string;
  credits: number;
  buyerId: string;      // Use string since Prisma User.id is string
};

type CreateTransactionParams = {
  stripeId: string;
  amount: number;
  plan?: string;
  credits?: number;
  buyerId: string;
};

export async function checkoutCredits(transaction: CheckoutTransactionParams) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const amountInCents = Math.round(transaction.amount * 100);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: amountInCents,
          product_data: {
            name: transaction.plan,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      plan: transaction.plan,
      credits: transaction.credits.toString(),
      buyerId: transaction.buyerId,
    },
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/profile?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/profile?canceled=true`,
  });

  return session.url; // ✅ Return the Stripe Checkout URL
}


export async function createTransaction(transaction: CreateTransactionParams) {
  try {
    // Create a new transaction record
    const newTransaction = await prisma.transaction.create({
      data: {
        stripeId: transaction.stripeId,
        amount: transaction.amount,
        plan: transaction.plan,
        credits: transaction.credits,
        buyerId: transaction.buyerId,
      },
    });

    // Update user's credit balance (+ credits)
    if (transaction.credits) {
      await updateCredits(transaction.buyerId, transaction.credits);
    }

    return newTransaction;
  } catch (error) {
    handleError(error);
    throw error;
  }
}
