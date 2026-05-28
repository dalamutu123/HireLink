import express from "express";
import { getMyNotifications, getAllNotifications, markNotificationAsRead } from "./notifications.controller.js";
import { protect, restrictTo } from "../core/middleware.js";
import { paginationQueryValidator } from "../core/validators.js";

const router = express.Router();

router.get("/all", protect, restrictTo("jobseeker", "employer"), getAllNotifications);
router.get("/", protect, restrictTo("jobseeker", "employer"), paginationQueryValidator, getMyNotifications);
router.patch("/:id/read", protect, restrictTo("jobseeker", "employer"), markNotificationAsRead);

export default router;
