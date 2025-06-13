"use server";

import { redirect } from "next/navigation";
import Stripe from "stripe";
import { handleError } from "../utils";
import { PrismaClient } from "@prisma/client";
import { updateCredits } from "./user.actions";

const prisma = new PrismaClient();

export async function checkoutCredits(transaction: CheckoutTransactionParams) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    const amount = Number(transaction.amount) * 100;

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: amount,
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
        buyerId: transaction.buyerId.toString(),
      },
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/profile`,
      cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/`,
    });

    redirect(session.url!);
  } catch (error) {
    handleError(error);
  }
}

export async function createTransaction(transaction: CreateTransactionParams) {
  try {
    // Create a new transaction with Prisma
    const newTransaction = await prisma.transaction.create({
      data: {
        stripeId: transaction.stripeId,
        amount: transaction.amount,
        plan: transaction.plan,
        credits: transaction.credits,
        buyerId: transaction.buyerId,
      },
    });

    // Update user's credits
    await updateCredits(transaction.buyerId, transaction.credits);

    return newTransaction;
  } catch (error) {
    handleError(error);
  }
}
