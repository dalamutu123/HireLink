import express from "express";
import {
  postJob,
  updateJob,
  deleteJob,
  getJobs,
  getJob,
} from "./jobs.controller.js";
import { protect, restrictTo } from "../core/middleware.js";
import {
  postJobValidator,
  updateJobValidator,
} from "../core/validators.js";

const router = express.Router();

// ─── General Routes ───────────────────────────────────────────
router.get("/", protect, getJobs);
router.get("/:id", protect, getJob);

// ─── Employer Only Routes ─────────────────────────────────────
router.post("/", protect, restrictTo("employer"), postJobValidator, postJob);
router.put("/:id", protect, restrictTo("employer"), updateJobValidator, updateJob);
router.delete("/:id", protect, restrictTo("employer"), deleteJob);

export default router;