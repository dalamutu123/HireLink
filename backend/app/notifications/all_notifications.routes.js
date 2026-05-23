import express from "express";
import { getAllNotifications } from "./notifications.controller.js";
import { protect, restrictTo } from "../core/middleware.js";

const router = express.Router();

// GET /api/all_notifications
router.get("/", protect, restrictTo("jobseeker", "employer"), getAllNotifications);

export default router;
