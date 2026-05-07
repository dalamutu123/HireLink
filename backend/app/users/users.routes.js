import express from "express";
import {
  getMe,
  updateMe,
  deleteMe,
  getUsers,
  deleteUser,
  getUserById,
} from "./users.controller.js";
import { protect, restrictTo } from "../core/middleware.js";

const router = express.Router();

// ─── Current User Routes ─────────────────────────────────────
router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);
router.delete("/me", protect, deleteMe);

// ─── Admin Routes ─────────────────────────────────────────────
router.get("/", protect, restrictTo("admin"), getUsers);
router.delete("/:id", protect, restrictTo("admin"), deleteUser);

// ─── Public Profile Routes ────────────────────────────────────
router.get("/:id", protect, getUserById);

export default router;