import {
  createJob,
  findAllJobs,
  findJobById,
  updateJobById,
  deleteJobById,
  searchJobs,
} from "./jobs.model.js";

// POST /api/jobs
export const postJob = async (req, res) => {
  try {
    const employerId = req.user.id;
    const { title, description, location, industry, salary, job_type, deadline } = req.body;

    // Validate required fields
    if (!title || !description || !location || !industry || !job_type) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    // Validate job_type
    if (!["full-time", "part-time", "contract"].includes(job_type)) {
      return res.status(400).json({ message: "Job type must be full-time, part-time or contract" });
    }

    const job = await createJob(employerId, {
      title,
      description,
      location,
      industry,
      salary,
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
    const { title, description, location, industry, salary, job_type, deadline } = req.body;

    // Check if job exists
    const job = await findJobById(id);
    if (!job) {
      return res.status(404).json({ message: "Job listing not found" });
    }

    // Check if the logged in employer owns this job
    if (job.employer_id !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to update this job listing" });
    }

    // Validate job_type if provided
    if (job_type && !["full-time", "part-time", "contract"].includes(job_type)) {
      return res.status(400).json({ message: "Job type must be full-time, part-time or contract" });
    }

    const updatedJob = await updateJobById(id, {
      title: title || job.title,
      description: description || job.description,
      location: location || job.location,
      industry: industry || job.industry,
      salary: salary || job.salary,
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

    // Check if job exists
    const job = await findJobById(id);
    if (!job) {
      return res.status(404).json({ message: "Job listing not found" });
    }

    // Check if the logged in employer owns this job
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
    const { keyword, location, industry, job_type } = req.query;

    // If any filter is provided, use search, otherwise get all jobs
    let jobs;
    if (keyword || location || industry || job_type) {
      jobs = await searchJobs({ keyword, location, industry, job_type });
    } else {
      jobs = await findAllJobs();
    }

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({ message: "No job listings found" });
    }

    res.status(200).json({
      message: "Job listings retrieved successfully",
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("Get jobs error:", error.message);
    res.status(500).json({ message: "Server error getting job listings" });
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