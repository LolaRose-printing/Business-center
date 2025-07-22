"use client";

import { useState, useEffect } from "react";
import { loadStripe, Stripe } from "@stripe/stripe-js";

import { useToast } from "@/components/ui/use-toast";
import { checkoutCredits } from "@/lib/actions/transaction.action";

import { Button } from "../ui/button";

interface CheckoutProps {
  plan: string;
  amount: number;
  credits: number;
  buyerId: string;
}

let stripePromise: Promise<Stripe | null> | null = null;

const Checkout = ({ plan, amount, credits, buyerId }: CheckoutProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!stripePromise) {
      stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
    }

    // Check redirect status after returning from Stripe Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      toast({
        title: "Order placed!",
        description: "You will receive an email confirmation.",
        duration: 5000,
        className: "success-toast",
      });
    }
    if (query.get("canceled")) {
      toast({
        title: "Order canceled",
        description: "Continue to shop around and checkout when you're ready.",
        duration: 5000,
        className: "error-toast",
      });
    }
  }, [toast]);

  const onCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const transaction = { plan, amount, credits, buyerId };

      // Call your backend action which creates Stripe session and returns URL
      const checkoutUrl = await checkoutCredits(transaction);

      if (checkoutUrl) {
        const stripe = await stripePromise;
        if (!stripe) throw new Error("Stripe failed to load");

        // Redirect to Stripe hosted checkout page
        window.location.href = checkoutUrl;
      } else {
        toast({
          title: "Checkout failed",
          description: "Unable to initiate checkout. Please try again.",
          className: "error-toast",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message || "Unexpected error occurred.",
        className: "error-toast",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onCheckout}>
      <section>
        <Button
          type="submit"
          disabled={loading}
          role="link"
          className="w-full rounded-full bg-purple-gradient bg-cover"
        >
          {loading ? "Processing..." : "Buy Credit"}
        </Button>
      </section>
    </form>
  );
};

export default Checkout;
