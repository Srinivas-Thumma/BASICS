import express from "express";

import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controllers/task.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authenticate, createTask);

router.get("/", authenticate, getTasks);

router.get("/:id", authenticate, getTaskById);

router.patch("/:id", authenticate, updateTask);

router.delete("/:id", authenticate, deleteTask);

export default router;