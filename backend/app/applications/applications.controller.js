import {
  createApplication,
  findApplication,
  findApplicationById,
  findApplicationsByJobseeker,
  findApplicationsByJob,
  updateApplicationStatus,
  deleteApplication,
} from "./application.model.js";
import { findJobById } from "../jobs/jobs.model.js";

// POST /api/applications/:jobId
export const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const jobseekerId = req.user.id;
    const { cover_letter } = req.body;

    // Check if job exists
    const job = await findJobById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job listing not found" });
    }

    // Check if jobseeker has already applied
    const existingApplication = await findApplication(jobId, jobseekerId);
    if (existingApplication) {
      return res.status(409).json({ message: "You have already applied for this job" });
    }

    const application = await createApplication(jobId, jobseekerId, cover_letter);

    res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    console.error("Apply for job error:", error.message);
    res.status(500).json({ message: "Server error submitting application" });
  }
};

// GET /api/applications/me
export const getMyApplications = async (req, res) => {
  try {
    const jobseekerId = req.user.id;

    const applications = await findApplicationsByJobseeker(jobseekerId);

    if (!applications || applications.length === 0) {
      return res.status(404).json({ message: "You have not applied for any jobs yet" });
    }

    res.status(200).json({
      message: "Applications retrieved successfully",
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error("Get my applications error:", error.message);
    res.status(500).json({ message: "Server error getting applications" });
  }
};

// DELETE /api/applications/:id
export const withdrawApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const jobseekerId = req.user.id;

    // Check if application exists
    const application = await findApplicationById(id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Check if the jobseeker owns this application
    if (application.jobseeker_id !== jobseekerId) {
      return res.status(403).json({ message: "You are not authorized to withdraw this application" });
    }

    // Prevent withdrawing an already accepted or rejected application
    if (application.status !== "pending") {
      return res.status(400).json({ message: "You can only withdraw a pending application" });
    }

    await deleteApplication(id);

    res.status(200).json({ message: "Application withdrawn successfully" });
  } catch (error) {
    console.error("Withdraw application error:", error.message);
    res.status(500).json({ message: "Server error withdrawing application" });
  }
};

// GET /api/applications/job/:jobId
export const getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;
    const employerId = req.user.id;

    // Check if job exists
    const job = await findJobById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job listing not found" });
    }

    // Check if the employer owns this job
    if (job.employer_id !== employerId) {
      return res.status(403).json({ message: "You are not authorized to view these applications" });
    }

    const applications = await findApplicationsByJob(jobId);

    if (!applications || applications.length === 0) {
      return res.status(404).json({ message: "No applications found for this job" });
    }

    res.status(200).json({
      message: "Applications retrieved successfully",
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error("Get job applications error:", error.message);
    res.status(500).json({ message: "Server error getting applications" });
  }
};

// PUT /api/applications/:id/status
export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const employerId = req.user.id;

    // Validate status
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    if (!["pending", "accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Status must be pending, accepted or rejected" });
    }

    // Check if application exists
    const application = await findApplicationById(id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Check if the employer owns the job this application belongs to
    const job = await findJobById(application.job_id);
    if (job.employer_id !== employerId) {
      return res.status(403).json({ message: "You are not authorized to update this application" });
    }

    const updatedApplication = await updateApplicationStatus(id, status);

    res.status(200).json({
      message: "Application status updated successfully",
      application: updatedApplication,
    });
  } catch (error) {
    console.error("Update application status error:", error.message);
    res.status(500).json({ message: "Server error updating application status" });
  }
};