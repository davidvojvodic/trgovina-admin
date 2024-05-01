import Stripe from "stripe";

// Interfaces
interface CreateCheckoutParams {
  priceId: string;
  mode: "payment" | "subscription";
  successUrl: string;
  cancelUrl: string;
  couponId?: string | null;
  clientReferenceId?: string;
  user?: {
    customerId?: string;
    email?: string;
  };
}

interface CreateCustomerPortalParams {
  customerId: string;
  returnUrl: string;
}

// Variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-08-16",
  typescript: true,
});

// Functions
export const createCheckout = async (params: CreateCheckoutParams): Promise<{ url: string; checkoutSessionId: string } | null> => {
  try {
    const extraParams: Stripe.Checkout.SessionCreateParams = {};

    if (params.user?.customerId) {
      extraParams.customer = params.user.customerId;
    } else {
      if (params.mode === "payment") {
        extraParams.customer_creation = "always";
        extraParams.payment_intent_data = { setup_future_usage: "on_session" };
      }
      if (params.user?.email) {
        extraParams.customer_email = params.user.email;
      }
      extraParams.tax_id_collection = { enabled: true };
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: params.mode,
      allow_promotion_codes: true,
      client_reference_id: params.clientReferenceId,
      line_items: [
        {
          price: params.priceId,
          quantity: 1,
        },
      ],
      discounts: params.couponId
        ? [
            {
              coupon: params.couponId,
            },
          ]
        : [],
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      ...extraParams,
    });

    return { url: checkoutSession.url, checkoutSessionId: checkoutSession.id };
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const createCustomerPortal = async (params: CreateCustomerPortalParams): Promise<string> => {
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: params.customerId,
    return_url: params.returnUrl,
  });

  return portalSession.url;
};

export const findCheckoutSession = async (sessionId: string): Promise<Stripe.Checkout.Session | null> => {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items"],
    });

    return session || {};
  } catch (e) {
    console.error(e);
    return null;
  }
};
