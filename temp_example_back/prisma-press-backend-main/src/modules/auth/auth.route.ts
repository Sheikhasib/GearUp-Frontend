import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

// Login user
router.post("/login", authController.loginUser);

// Logout user
router.post("/logout", authController.logoutUser);

// Refresh token
router.post("/refresh-token", authController.refreshToken);

export const authRoutes = router;
