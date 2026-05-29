import {
  createApplication,
  findApplication,
  findApplicationById,
  findApplicationsByJobseeker,
  getApplicationStatsByJobseeker,
  findApplicationsByJob,
  updateApplicationStatus,
  deleteApplication,
  findApplicationsByEmployer,
  scheduleInterviewQuery,
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

    const seekerNotificationMessage = `You successfully applied for the "${job.title}" position at ${employer.name}.`;
    await createNotification(jobseeker.id, "application", seekerNotificationMessage);

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

// GET /api/applications  | // GET /api/applications/me
export const getMyApplications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page, limit, offset } = parsePagination(req.query);

    const { rows, total } = await findApplicationsByJobseeker(userId, { limit, offset });

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

// GET /api/applications/stats
export const getMyApplicationStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const rows = await getApplicationStatsByJobseeker(userId);

    const stats = { total: 0, applied: 0, accepted: 0, rejected: 0 };
    rows.forEach(row => {
      stats[row.status] = row.count;
      stats.total += row.count;
    });
    
    res.json(stats);
  } catch (error) {
    console.error("Error fetching application stats:", error);
    res.status(500).json({ message: "Server error" });
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

// PATCH /api/applications/:id/interview — employer schedules interview
export const scheduleInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const { interviewDate } = req.body;
    const employerId = req.user.id;

    if (!interviewDate) {
      return res.status(400).json({ message: "Interview date is required" });
    }

    const application = await findApplicationById(id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const job = await findJobById(application.job_id);
    if (job.employer_id !== employerId) {
      return res.status(403).json({ message: "You are not authorized to update this application" });
    }

    const updatedApplication = await scheduleInterviewQuery(id, interviewDate);
    const employer = await findUserById(employerId);

    const notificationMessage = `You have been invited to an interview for "${job.title}" by ${employer.name} on ${new Date(interviewDate).toLocaleString()}.`;

    await createNotification(application.jobseeker_id, "interview_scheduled", notificationMessage);

    res.status(200).json({
      message: "Interview scheduled successfully",
      application: formatApplication(updatedApplication),
      notificationSent: true,
    });
  } catch (error) {
    console.error("Schedule interview error:", error.message);
    res.status(500).json({ message: "Server error scheduling interview" });
  }
};

// GET /api/applications/employer — Get all applications for jobs posted by this employer
export const getEmployerApplications = async (req, res) => {
  try {
    const employerId = req.user.id;
    const { page, limit, offset } = parsePagination(req.query);

    const { rows, total } = await findApplicationsByEmployer(employerId, { limit, offset });

    res.status(200).json({
      message: "Applications retrieved successfully",
      pagination: buildPagination(total, page, limit),
      applications: formatApplications(rows),
    });
  } catch (error) {
    console.error("Get employer applications error:", error.message);
    res.status(500).json({ message: "Server error getting applications" });
  }
};
