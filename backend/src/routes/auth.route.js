import express from "express";

import {
  register,
  login,
  refreshToken , logout
} from "../controllers/auth.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";

// express.Router() creates a mini-app just for handling routes.
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/logout",logout);

export default router;