import {
  createJob,
  findAllJobs,
  findJobById,
  updateJobById,
  deleteJobById,
  searchJobs,
} from "./jobs.model.js";
import { parsePagination, buildPagination } from "../core/pagination.js";

// POST /api/jobs
export const postJob = async (req, res) => {
  try {
    const employerId = req.user.id;
    const { title, description, location, industry, salary, salary_min, salary_max, job_type, deadline } = req.body;

    if (!title || !description || !location || !industry || !job_type) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    if (!["full-time", "part-time", "contract"].includes(job_type)) {
      return res.status(400).json({ message: "Job type must be full-time, part-time or contract" });
    }

    if (salary_min != null && salary_max != null && salary_min > salary_max) {
      return res.status(400).json({ message: "salary_min cannot be greater than salary_max" });
    }

    const job = await createJob(employerId, {
      title,
      description,
      location,
      industry,
      salary,
      salary_min: salary_min ?? null,
      salary_max: salary_max ?? null,
      job_type,
      deadline,
    });

    res.status(201).json({
      message: "Job listing created successfully",
      job,
    });
  } catch (error) {
    console.error("Post job error:", error.message);
    res.status(500).json({ message: "Server error creating job listing" });
  }
};

// PUT /api/jobs/:id
export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, location, industry, salary, salary_min, salary_max, job_type, deadline } = req.body;

    const job = await findJobById(id);
    if (!job) {
      return res.status(404).json({ message: "Job listing not found" });
    }

    if (job.employer_id !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to update this job listing" });
    }

    if (job_type && !["full-time", "part-time", "contract"].includes(job_type)) {
      return res.status(400).json({ message: "Job type must be full-time, part-time or contract" });
    }

    const resolvedMin = salary_min !== undefined ? salary_min : job.salary_min;
    const resolvedMax = salary_max !== undefined ? salary_max : job.salary_max;

    if (resolvedMin != null && resolvedMax != null && resolvedMin > resolvedMax) {
      return res.status(400).json({ message: "salary_min cannot be greater than salary_max" });
    }

    const updatedJob = await updateJobById(id, {
      title: title || job.title,
      description: description || job.description,
      location: location || job.location,
      industry: industry || job.industry,
      salary: salary !== undefined ? salary : job.salary,
      salary_min: resolvedMin,
      salary_max: resolvedMax,
      job_type: job_type || job.job_type,
      deadline: deadline || job.deadline,
    });

    res.status(200).json({
      message: "Job listing updated successfully",
      job: updatedJob,
    });
  } catch (error) {
    console.error("Update job error:", error.message);
    res.status(500).json({ message: "Server error updating job listing" });
  }
};

// DELETE /api/jobs/:id
export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await findJobById(id);
    if (!job) {
      return res.status(404).json({ message: "Job listing not found" });
    }

    if (job.employer_id !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to delete this job listing" });
    }

    await deleteJobById(id);

    res.status(200).json({ message: "Job listing deleted successfully" });
  } catch (error) {
    console.error("Delete job error:", error.message);
    res.status(500).json({ message: "Server error deleting job listing" });
  }
};

// GET /api/jobs
export const getJobs = async (req, res) => {
  try {
    const {
      title,
      keyword,
      location,
      industry,
      job_type,
      min_salary,
      max_salary,
      posted_after,
      posted_before,
      posted_on,
    } = req.query;
    const { page, limit, offset } = parsePagination(req.query);

    if (min_salary !== undefined && max_salary !== undefined && Number(min_salary) > Number(max_salary)) {
      return res.status(400).json({ message: "min_salary cannot be greater than max_salary" });
    }

    if (posted_after && posted_before && posted_after > posted_before) {
      return res.status(400).json({ message: "posted_after cannot be after posted_before" });
    }

    const hasFilters =
      title ||
      keyword ||
      location ||
      industry ||
      job_type ||
      min_salary !== undefined ||
      max_salary !== undefined ||
      posted_after ||
      posted_before ||
      posted_on;

    const { rows, total } = hasFilters
      ? await searchJobs(
          {
            title,
            keyword,
            location,
            industry,
            job_type,
            min_salary: min_salary !== undefined ? Number(min_salary) : undefined,
            max_salary: max_salary !== undefined ? Number(max_salary) : undefined,
            posted_after,
            posted_before,
            posted_on,
          },
          { limit, offset }
        )
      : await findAllJobs({ limit, offset });

    res.status(200).json({
      message: "Job listings retrieved successfully",
      pagination: buildPagination(total, page, limit),
      jobs: rows,
    });
  } catch (error) {
    console.error("Get jobs error:", error.message);
    res.status(500).json({ message: "Server error getting job listings" });
  }
};

// GET /api/jobs/search
export const searchJobsList = async (req, res) => {
  try {
    const { title, location, min_salary, max_salary, posted_after, posted_before, posted_on } = req.query;
    const { page, limit, offset } = parsePagination(req.query);

    const { rows, total } = await searchJobs(
      {
        title,
        location,
        min_salary: min_salary !== undefined ? Number(min_salary) : undefined,
        max_salary: max_salary !== undefined ? Number(max_salary) : undefined,
        posted_after,
        posted_before,
        posted_on,
      },
      { limit, offset }
    );

    res.status(200).json({
      message: "Job search completed successfully",
      pagination: buildPagination(total, page, limit),
      jobs: rows,
    });
  } catch (error) {
    console.error("Search jobs error:", error.message);
    res.status(500).json({ message: "Server error searching job listings" });
  }
};

// GET /api/jobs/:id
export const getJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await findJobById(id);
    if (!job) {
      return res.status(404).json({ message: "Job listing not found" });
    }

    res.status(200).json({ job });
  } catch (error) {
    console.error("Get job error:", error.message);
    res.status(500).json({ message: "Server error getting job listing" });
  }
};
