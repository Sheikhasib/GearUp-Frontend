import Stripe from "stripe";
import stripe from "../../lib/stripe";
import { prisma } from "../../lib/prisma";
import { SubscriptionStatus } from "../../../generated/prisma/enums";

// get the current period end date from the subscription payload
const getPeriodEndDate = async (payload: Stripe.Subscription) => {
  const currentPeriodEndInMiliseconds = payload.items.data[0]
    ?.current_period_end as number;

  const currentPeriodEnd = new Date(currentPeriodEndInMiliseconds * 1000);

  return currentPeriodEnd;
};

// Helper function to handle the checkout session completed event
const handleCheckoutCompleted = async (session: Stripe.Checkout.Session) => {
  const userId = session.metadata?.userId;
  const stripeCustomerId = session.customer as string;
  const stripeSubscriptionId = session.subscription as string;

  if (!userId || !stripeCustomerId || !stripeSubscriptionId) {
    console.log("Webhook: Missing Values For Creating Checkout Session");
    return;
  }

  const stripeSubscription =
    await stripe.subscriptions.retrieve(stripeSubscriptionId);

  // console.log("Subscription Info: ", stripeSubscription.items.data[0]);
  // const currentPeriodStart =
  //   stripeSubscription.items.data[0]?.current_period_start;
  // const currentPeriodEndInMiliseconds = stripeSubscription.items.data[0]
  //   ?.current_period_end as number;

  // const currentPeriodEnd = new Date(currentPeriodEndInMiliseconds * 1000);

  // console.log(currentPeriodEnd, "End");

  const currentPeriodEnd = await getPeriodEndDate(stripeSubscription);

  // console.log(currentPeriodEnd, "End");

  // Upsert(Update or Insert) the subscription record in the database
  await prisma.subscription.upsert({
    where: {
      userId,
    },
    create: {
      userId,
      stripeCustomerId,
      stripeSubscriptionId,
      status: "ACTIVE",
      currentPeriodEnd,
    },
    update: {
      stripeCustomerId,
      stripeSubscriptionId,
      status: "ACTIVE",
      currentPeriodEnd,
    },
  });
};

// Helper function to handle the subscription updated or deleted events
const handleChangedSubscription = async (payload: Stripe.Subscription) => {
  const stripeSubscriptionId = payload.id;

  const status =
    payload.status === "active" || payload.status === "trialing"
      ? SubscriptionStatus.ACTIVE
      : payload.status === "canceled"
        ? SubscriptionStatus.CANCELED
        : SubscriptionStatus.EXPIRED;

  const currentPeriodEnd = await getPeriodEndDate(payload);

  // Check if the subscription exists in the database
  const isSubscriptionExists = await prisma.subscription.findUnique({
    where: {
      stripeSubscriptionId,
    },
  });

  // If the subscription does not exist, log a message and return early
  if (!isSubscriptionExists) {
    console.log(
      `Webhook: No subscription found for subscription id: ${stripeSubscriptionId}`,
    );
    return;
  }

  // Then update the subscription record in the database
  await prisma.subscription.update({
    where: {
      stripeSubscriptionId,
    },
    data: {
      status,
      currentPeriodEnd,
    },
  });
};

export const subscriptionUtils = {
  getPeriodEndDate,
  handleCheckoutCompleted,
  handleChangedSubscription,
};
