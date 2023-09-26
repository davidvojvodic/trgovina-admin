/* This code snippet defines an asynchronous function called POST that handles a POST request.
It imports various modules and libraries such as Stripe, Next.js, and a couple of custom modules.
The function receives a request object req and extracts the request body and a signature from the request headers.
It then tries to construct a Stripe event using the Stripe webhook, which verifies the authenticity of the event.
If an error occurs during this process, a response with an error message and a status code of 400 is returned.
If the event type is "checkout.session.completed", the function updates an order in a database using the prismadb module.
It marks the order as paid, updates the address and phone number, and includes the associated order items.
It also updates multiple products in the database, marking them as archived.
Finally, the function returns a response with a status code of 200. */

// Import necessary modules and libraries
import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";

// Define an asynchronous function to handle POST requests
export async function POST(req: Request) {
    // Parse the request body into text
    const body = await req.text();

    // Retrieve the Stripe-Signature header from the request
    const signature = headers().get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        // Construct a Stripe event using the request body and signature
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: any) {
        // Handle errors related to webhook signature verification
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    // Extract relevant data from the Stripe event
    const session = event.data.object as Stripe.Checkout.Session;
    const address = session?.customer_details?.address;

    // Create an array of address components
    const addressComponents = [
        address?.line1,
        address?.line2,
        address?.city,
        address?.state,
        address?.postal_code,
        address?.country,
    ];

    // Combine address components into a single string, filtering out null values
    const addressString = addressComponents.filter((c) => c !== null).join(", ");

    // Check the type of Stripe event
    if (event.type === "checkout.session.completed") {
        // Update an order in the database when a checkout session is completed
        const order = await prismadb.order.update({
            where: {
                id: session?.metadata?.orderId,
            },
            data: {
                isPaid: true,
                address: addressString,
                phone: session?.customer_details?.phone || "",
            },
            include: {
                orderItems: true,
            },
        });

        // Extract product IDs from the order for further processing
        const productIds = order.orderItems.map((orderItem) => orderItem.productId);

        // Update multiple products in the database, setting them as archived
        await prismadb.product.updateMany({
            where: {
                id: {
                    in: [...productIds],
                },
            },
            data: {
                isArchived: true,
            },
        });
    }

    // Respond with a success status code
    return new NextResponse(null, { status: 200 });
}
