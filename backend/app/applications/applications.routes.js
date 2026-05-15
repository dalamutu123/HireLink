import express from "express";
import {
  applyForJob,
  getMyApplications,
  withdrawApplication,
  getJobApplications,
  updateStatus,
} from "./applications.controller.js";
import { protect, restrictTo } from "../core/middleware.js";
import {
  applyForJobValidator,
  updateStatusValidator,
} from "../core/validators.js";

const router = express.Router();

// ─── Jobseeker Only Routes ────────────────────────────────────
router.post("/:jobId", protect, restrictTo("jobseeker"), applyForJobValidator, applyForJob);
router.get("/me", protect, restrictTo("jobseeker"), getMyApplications);
router.delete("/:id", protect, restrictTo("jobseeker"), withdrawApplication);

// ─── Employer Only Routes ─────────────────────────────────────
router.get("/job/:jobId", protect, restrictTo("employer"), getJobApplications);
router.put("/:id/status", protect, restrictTo("employer"), updateStatusValidator, updateStatus);

export default router;