import express from "express";

import {
  register,
  login,
  refreshToken , logout , getMe
} from "../controllers/auth.controller.js";

import { csrfToken } from "../middleware/csrf.middleware.js";
import { authenticate } from "../middleware/auth.middleware.js";

// express.Router() creates a mini-app just for handling routes.
const router = express.Router();

router.get("/me", authenticate, getMe);
router.get("/csrf", csrfToken);

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/logout",logout);

export default router;