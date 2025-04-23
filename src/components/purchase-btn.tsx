"use client"

import {Button} from "@/components/ui/button";
import {createCheckoutSession} from "@/actions/stripe-actions";

export default function PurchaseBtn() {
    return (
        <Button className="cursor-pointer" onClick={async () => {
            await createCheckoutSession()
        }}>
            Purchase
        </Button>
    )
}
