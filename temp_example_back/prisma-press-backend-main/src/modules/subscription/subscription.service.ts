import { subscriptionUtils } from "./subscription.utils";
import Stripe from "stripe";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import stripe from "../../lib/stripe";
import { SubscriptionStatus } from "../../../generated/prisma/enums";

// 1. Create Checkout Session
const createCheckoutSession = async (userId: string) => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
      include: {
        subscription: true,
      },
    });

    // old subscriber/Check if the user already has a Stripe customer ID
    let stripeCustomerId = user.subscription?.stripeCustomerId;

    if (!stripeCustomerId) {
      // new subscriber/Create a new Stripe customer if the user doesn't have one
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          userId: user.id,
        },
      });

      stripeCustomerId = customer.id;
    }

    // Create a new Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: config.stripe_product_price_id,
          //   price: "price_1ToHE6LLblvlipOFLihxmoqo", // Replace with your actual price ID
          quantity: 1,
        },
      ],
      mode: "subscription",
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      success_url: `${config.app_url}/premium/?success=true`,
      cancel_url: `${config.app_url}/payment?success=false`,
      metadata: {
        userId: user.id,
      },
    });

    return session.url;
  });

  // This will return the payment URL to the client, which can be used to redirect the user to the Stripe Checkout page/url.
  return {
    paymentUrl: transactionResult,
  };
};

// 2. Handle Webhook events from Stripe
const handleWebhook = async (payload: Buffer, signature: string) => {
  const endpointSecret = config.stripe_webhook_secret;
  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    endpointSecret,
  );

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      // Occurs when a Checkout Session has been successfully completed.
      // Handle the checkout session completed event
      await subscriptionUtils.handleCheckoutCompleted(event.data.object);
      break;
    case "customer.subscription.updated":
      // Occurs whenever a subscription changes (e.g., switching from one plan to another, or changing the status from trial to active)
      await subscriptionUtils.handleChangedSubscription(event.data.object);
      break;
    /*
            To test this run this command in terminal
            stripe subscriptions cancel sub_1PsYourSubIdHere (paste existinmg subscribed sub id)
      */

    case "customer.subscription.deleted":
      // Occurs whenever a customer’s subscription ends.
      await subscriptionUtils.handleChangedSubscription(event.data.object);
      break;
    default:
      // Unexpected event type
      console.log(`No event matched. Unhandled event type ${event.type}.`);
      break;
  }
};

// Get Subscription Status
const getSubscriptionStatus = async (userId: string) => {
  // Check if the subscription exists for the user
  const isSubscriptionExists = await prisma.subscription.findUnique({
    where: {
      userId,
    },
  });

  // Check if the subscription is active and not expired
  const isActive =
    isSubscriptionExists?.status === "ACTIVE" &&
    isSubscriptionExists?.currentPeriodEnd &&
    new Date(isSubscriptionExists.currentPeriodEnd) > new Date();

  return {
    status: isSubscriptionExists?.status,
    isSubscribed: isActive,
    currentPeriodEnd: isSubscriptionExists?.currentPeriodEnd,
  };
};

export const subscriptionService = {
  createCheckoutSession,
  handleWebhook,
  getSubscriptionStatus,
};
