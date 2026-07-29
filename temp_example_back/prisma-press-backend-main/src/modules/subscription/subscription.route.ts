import { Router } from "express";
import { subscriptionController } from "./subscription.controller";
import auth from "../../middleware/auth";
import { Role } from "../../../generated/prisma/client";

const router = Router();

// Create Checkout Session
router.post(
  "/checkout",
  auth(Role.USER, Role.ADMIN, Role.AUTHOR),
  subscriptionController.createCheckoutSession,
);

// Cancel Subscription

// Create Customer Portal Session using Stripe Webhook
router.post("/webhook", subscriptionController.handleWebhook);

// Get Subscription Status
router.get(
  "/status",
  auth(Role.USER, Role.ADMIN, Role.AUTHOR),
  subscriptionController.getSubscriptionStatus,
);

export const subscriptionRoutes = router;
