import {
  createApplication,
  findApplication,
  findApplicationById,
  findApplicationsByJobseeker,
  findApplicationsByJob,
  updateApplicationStatus,
  deleteApplication,
} from "./applications.model.js";
import { findJobById } from "../jobs/jobs.model.js";
import { findUserById } from "../users/users.model.js";
import { formatApplication, formatApplications } from "./applications.utils.js";
import { parsePagination, buildPagination } from "../core/pagination.js";
import { createNotification } from "../notifications/notifications.model.js";
import { sendApplicationStatusEmail, sendNewApplicationEmail } from "../core/email.js";

const getJobId = (req) => req.params.job_id || req.params.jobId;

// POST /api/apply/:job_id  |  POST /api/applications/:jobId
export const applyForJob = async (req, res) => {
  try {
    const jobId = getJobId(req);
    const userId = req.user.id;
    const { cover_letter } = req.body;

    const job = await findJobById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job listing not found" });
    }

    const existingApplication = await findApplication(jobId, userId);
    if (existingApplication) {
      return res.status(409).json({ message: "You have already applied for this job" });
    }

    const application = await createApplication(jobId, userId, cover_letter);

    const jobseeker = await findUserById(userId);
    const employer = await findUserById(job.employer_id);

    const notificationMessage = `${jobseeker.name} applied for your job posting "${job.title}".`;

    await createNotification(job.employer_id, "new_application", notificationMessage);

    try {
      await sendNewApplicationEmail({
        toEmail: employer.email,
        employerName: employer.name,
        jobseekerName: jobseeker.name,
        jobTitle: job.title,
        jobId,
      });
    } catch (emailError) {
      console.error("New application email error:", emailError.message);
    }

    res.status(201).json({
      message: "Application submitted successfully",
      application: formatApplication(application),
      notificationSent: true,
    });
  } catch (error) {
    console.error("Apply for job error:", error.message);
    res.status(500).json({ message: "Server error submitting application" });
  }
};

// GET /api/applications  |  GET /api/applications/me
export const getMyApplications = async (req, res) => {
  try {
    const { page, limit, offset } = parsePagination(req.query);
    const { rows, total } = await findApplicationsByJobseeker(req.user.id, { limit, offset });

    res.status(200).json({
      message: "Applications retrieved successfully",
      pagination: buildPagination(total, page, limit),
      applications: formatApplications(rows),
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
    const userId = req.user.id;

    const application = await findApplicationById(id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.jobseeker_id !== userId) {
      return res.status(403).json({ message: "You are not authorized to withdraw this application" });
    }

    if (application.status !== "applied") {
      return res.status(400).json({ message: "You can only withdraw an applied application" });
    }

    await deleteApplication(id);

    res.status(200).json({ message: "Application withdrawn successfully" });
  } catch (error) {
    console.error("Withdraw application error:", error.message);
    res.status(500).json({ message: "Server error withdrawing application" });
  }
};

// GET /api/applications/job/:job_id
export const getJobApplications = async (req, res) => {
  try {
    const jobId = getJobId(req);
    const employerId = req.user.id;

    const job = await findJobById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job listing not found" });
    }

    if (job.employer_id !== employerId) {
      return res.status(403).json({ message: "You are not authorized to view these applications" });
    }

    const { page, limit, offset } = parsePagination(req.query);
    const { rows, total } = await findApplicationsByJob(jobId, { limit, offset });

    res.status(200).json({
      message: "Applications retrieved successfully",
      pagination: buildPagination(total, page, limit),
      applications: formatApplications(rows),
    });
  } catch (error) {
    console.error("Get job applications error:", error.message);
    res.status(500).json({ message: "Server error getting applications" });
  }
};

// PATCH /api/applications/:id/status — employer accept/reject
export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const employerId = req.user.id;

    const application = await findApplicationById(id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.status !== "applied") {
      return res.status(400).json({
        message: "Only applications with status 'applied' can be accepted or rejected",
      });
    }

    const job = await findJobById(application.job_id);
    if (job.employer_id !== employerId) {
      return res.status(403).json({ message: "You are not authorized to update this application" });
    }

    const updatedApplication = await updateApplicationStatus(id, status);

    const jobseeker = await findUserById(application.jobseeker_id);
    const employer = await findUserById(employerId);

    const notificationType =
      status === "accepted" ? "application_accepted" : "application_rejected";

    const notificationMessage =
      status === "accepted"
        ? `Your application for "${job.title}" was accepted by ${employer.name}.`
        : `Your application for "${job.title}" was not selected.`;

    await createNotification(application.jobseeker_id, notificationType, notificationMessage);

    try {
      await sendApplicationStatusEmail({
        toEmail: jobseeker.email,
        jobseekerName: jobseeker.name,
        jobTitle: job.title,
        employerName: employer.name,
        status,
      });
    } catch (emailError) {
      console.error("Application status email error:", emailError.message);
    }

    const statusMessage =
      status === "accepted"
        ? "Application accepted"
        : "Application rejected";

    res.status(200).json({
      message: statusMessage,
      application: formatApplication(updatedApplication),
      notificationSent: true,
    });
  } catch (error) {
    console.error("Update application status error:", error.message);
    res.status(500).json({ message: "Server error updating application status" });
  }
};
