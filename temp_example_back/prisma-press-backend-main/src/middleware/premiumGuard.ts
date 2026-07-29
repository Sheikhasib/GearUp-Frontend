import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { prisma } from "../lib/prisma";
import { SubscriptionStatus } from "../../generated/prisma/enums";

const subscriptionGuard = () => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;

    // 1. Check if the user has a subscription
    const subscription = await prisma.subscription.findUnique({
      where: {
        userId,
      },
    });

    // Check if the user has a subscription
    if (!subscription) {
      throw new Error("Please subscribe to access premium content.");
    }

    // Check if the subscription is active(canceled or expired anyway)
    if (subscription?.status !== SubscriptionStatus.ACTIVE) {
      throw new Error("Please subscribe again to access premium content. ");
    }

    // Check if the subscription period has expired
    if (
      subscription.currentPeriodEnd &&
      new Date(subscription.currentPeriodEnd) <= new Date()
    ) {
      throw new Error("Your subscription has expired. Please subscribe again.");
    }

    // If the user has an active subscription, proceed to the controller
    next();
  });
};

export default subscriptionGuard;
