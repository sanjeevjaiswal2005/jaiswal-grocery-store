import { Router } from "express";
import { register, login, logout, me } from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { authLimit } from "../middlewares/rateLimit.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";

const router = Router();

router.post(
  "/auth/register",
  authLimit,
  validate(registerSchema),
  asyncHandler(register),
);
router.post(
  "/auth/login",
  authLimit,
  validate(loginSchema),
  asyncHandler(login),
);
router.post("/auth/logout", logout);
router.get("/auth/me", protect, asyncHandler(me));

export default router;
