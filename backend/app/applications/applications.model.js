import pool from "../core/db.js";

// Create a new application
export const createApplication = async (jobId, jobseekerId, coverLetter) => {
  const result = await pool.query(
    `INSERT INTO applications (job_id, jobseeker_id, cover_letter)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [jobId, jobseekerId, coverLetter]
  );
  return result.rows[0];
};

// Get a single application by job id and jobseeker id
export const findApplication = async (jobId, jobseekerId) => {
  const result = await pool.query(
    `SELECT * FROM applications
     WHERE job_id = $1 AND jobseeker_id = $2`,
    [jobId, jobseekerId]
  );
  return result.rows[0];
};

// Get application by id
export const findApplicationById = async (id) => {
  const result = await pool.query(
    `SELECT * FROM applications WHERE id = $1`,
    [id]
  );
  return result.rows[0];
};

// Get all applications by a jobseeker (paginated)
export const findApplicationsByJobseeker = async (jobseekerId, { limit, offset }) => {
  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS total FROM applications WHERE jobseeker_id = $1`,
    [jobseekerId]
  );
  const total = countResult.rows[0].total;

  const result = await pool.query(
    `SELECT a.*, j.title AS job_title, j.location, j.job_type,
            j.industry, j.salary, u.name AS employer_name
     FROM applications a
     JOIN jobs j ON a.job_id = j.id
     JOIN users u ON j.employer_id = u.id
     WHERE a.jobseeker_id = $1
     ORDER BY a.applied_at DESC
     LIMIT $2 OFFSET $3`,
    [jobseekerId, limit, offset]
  );

  return { rows: result.rows, total };
};

// Get all applications for a job (paginated, employer view)
export const findApplicationsByJob = async (jobId, { limit, offset }) => {
  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS total FROM applications WHERE job_id = $1`,
    [jobId]
  );
  const total = countResult.rows[0].total;

  const result = await pool.query(
    `SELECT a.*, u.name AS jobseeker_name, u.email AS jobseeker_email,
            jp.bio, jp.skills, jp.experience, jp.resume_url, jp.location
     FROM applications a
     JOIN users u ON a.jobseeker_id = u.id
     LEFT JOIN jobseeker_profiles jp ON a.jobseeker_id = jp.user_id
     WHERE a.job_id = $1
     ORDER BY a.applied_at DESC
     LIMIT $2 OFFSET $3`,
    [jobId, limit, offset]
  );

  return { rows: result.rows, total };
};

// Update application status
export const updateApplicationStatus = async (id, status) => {
  const result = await pool.query(
    `UPDATE applications SET status = $1
     WHERE id = $2
     RETURNING *`,
    [status, id]
  );
  return result.rows[0];
};

// Delete an application
export const deleteApplication = async (id) => {
  await pool.query(`DELETE FROM applications WHERE id = $1`, [id]);
};
