import { Router } from "express";
import { userController } from "./user.controller";
import { Role } from "../../../generated/prisma/enums";
import auth from "../../middleware/auth";

const router = Router();

// Register user
router.post("/register", userController.registerUser);

// Get My Profile
router.get(
  "/me",
  auth(Role.USER, Role.ADMIN, Role.AUTHOR),
  userController.getMyProfile,
);

// Update My Profile
router.put(
  "/my-profile",
  auth(Role.USER, Role.ADMIN, Role.AUTHOR),
  userController.updateMyProfile,
);

export const userRoutes = router;
