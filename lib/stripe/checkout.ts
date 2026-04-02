import { getStripe } from "./client";

interface CreateCheckoutParams {
  priceAmountCents: number;
  description: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}

export async function createCheckoutSession({
  priceAmountCents,
  description,
  successUrl,
  cancelUrl,
  metadata,
}: CreateCheckoutParams) {
  return getStripe().checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: description },
          unit_amount: priceAmountCents,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata,
  });
}
