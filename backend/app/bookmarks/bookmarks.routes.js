import express from "express";
import {
  getSavedJobs,
  saveJob,
  unsaveJob,
} from "./bookmarks.controller.js";
import { protect, restrictTo } from "../core/middleware.js";

const router = express.Router();

router.get("/", protect, restrictTo("jobseeker"), getSavedJobs);
router.post("/", protect, restrictTo("jobseeker"), saveJob);
router.delete("/", protect, restrictTo("jobseeker"), unsaveJob);

export default router;