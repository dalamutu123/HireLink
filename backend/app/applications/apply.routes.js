import express from "express";
import { applyForJob } from "./applications.controller.js";
import { protect, restrictTo } from "../core/middleware.js";
import { applyForJobValidator } from "../core/validators.js";

const router = express.Router();

// POST /api/apply/:job_id
router.post("/:job_id", protect, restrictTo("jobseeker"), applyForJobValidator, applyForJob);

export default router;
