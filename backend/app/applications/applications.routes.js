import express from "express";
import {
  applyForJob,
  getMyApplications,
  getMyApplicationStats,
  withdrawApplication,
  getJobApplications,
  updateStatus,
  getEmployerApplications,
  scheduleInterview,
} from "./applications.controller.js";
import { protect, restrictTo } from "../core/middleware.js";
import {
  applyForJobValidator,
  patchStatusValidator,
  paginationQueryValidator,
} from "../core/validators.js";

const router = express.Router();

// ─── Jobseeker Only Routes ────────────────────────────────────
router.get("/stats", protect, restrictTo("jobseeker"), getMyApplicationStats);
router.get("/", protect, restrictTo("jobseeker"), paginationQueryValidator, getMyApplications);
router.get("/me", protect, restrictTo("jobseeker"), paginationQueryValidator, getMyApplications);
router.post("/:jobId", protect, restrictTo("jobseeker"), applyForJobValidator, applyForJob);
router.delete("/:id", protect, restrictTo("jobseeker"), withdrawApplication);

// ─── Employer Only Routes ─────────────────────────────────────
router.get("/employer", protect, restrictTo("employer"), paginationQueryValidator, getEmployerApplications);
router.get("/job/:job_id", protect, restrictTo("employer"), paginationQueryValidator, getJobApplications);
router.patch("/:id/status", protect, restrictTo("employer"), patchStatusValidator, updateStatus);
router.patch("/:id/interview", protect, restrictTo("employer"), scheduleInterview);

export default router;