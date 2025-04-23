"use server"

import {redirect} from "next/navigation";
import Stripe from "stripe";
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-03-31.basil",
});

export async function createCheckoutSession() {
    // authentication check
    const {getUser} = getKindeServerSession();
    const user = await getUser();

    const session = await stripe.checkout.sessions.create({
        customer_email: user.email!,
        client_reference_id: user.id,
        line_items: [
            {
                price: "price_1REXb5PDNKKfnCIweCqdYwF8",
                quantity: 1,
            },
        ],
        mode: "payment",
        // use in live site
        success_url: `${process.env.CANONICAL_URL}/dashboard?payment=success`,
        // use in demo site
        // success_url: `${process.env.CANONICAL_URL}/dashboard`,
        cancel_url: `${process.env.CANONICAL_URL}`,
    });

    redirect(session.url!);
}
