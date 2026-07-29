import { Router } from "express";
import { premiumController } from "./premium.controller";
import auth from "../../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import subscriptionGuard from "../../middleware/premiumGuard";

const router = Router();

// Get Premium Content
router.get(
  "/",
  auth(Role.USER, Role.ADMIN, Role.AUTHOR),
  subscriptionGuard(), // Middleware to check if the user has an active subscription
  premiumController.getPremiumContent,
);

export const premiumRoutes = router;
