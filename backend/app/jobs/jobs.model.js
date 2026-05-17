import pool from "../core/db.js";

const buildJobSearchFilters = (filters) => {
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
  } = filters;
  const titleFilter = title || keyword;

  let whereClause = "WHERE 1=1";
  const values = [];
  let count = 1;

  if (titleFilter) {
    whereClause += ` AND j.title ILIKE $${count}`;
    values.push(`%${titleFilter}%`);
    count++;
  }

  if (location) {
    whereClause += ` AND j.location ILIKE $${count}`;
    values.push(`%${location}%`);
    count++;
  }

  if (industry) {
    whereClause += ` AND j.industry ILIKE $${count}`;
    values.push(`%${industry}%`);
    count++;
  }

  if (job_type) {
    whereClause += ` AND j.job_type = $${count}`;
    values.push(job_type);
    count++;
  }

  if (min_salary != null) {
    whereClause += ` AND j.salary_min IS NOT NULL AND COALESCE(j.salary_max, j.salary_min) >= $${count}`;
    values.push(min_salary);
    count++;
  }

  if (max_salary != null) {
    whereClause += ` AND j.salary_min IS NOT NULL AND j.salary_min <= $${count}`;
    values.push(max_salary);
    count++;
  }

  if (posted_on) {
    whereClause += ` AND j.created_at >= $${count}::date AND j.created_at < ($${count}::date + interval '1 day')`;
    values.push(posted_on);
    count++;
  } else {
    if (posted_after) {
      whereClause += ` AND j.created_at >= $${count}::date`;
      values.push(posted_after);
      count++;
    }

    if (posted_before) {
      whereClause += ` AND j.created_at < ($${count}::date + interval '1 day')`;
      values.push(posted_before);
      count++;
    }
  }

  return { whereClause, values };
};

const jobSelectBase = `
  FROM jobs j
  JOIN users u ON j.employer_id = u.id
`;

// Create a new job listing
export const createJob = async (employerId, fields) => {
  const { title, description, location, industry, salary, salary_min, salary_max, job_type, deadline } = fields;
  const result = await pool.query(
    `INSERT INTO jobs (employer_id, title, description, location, industry, salary, salary_min, salary_max, job_type, deadline)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING *`,
    [employerId, title, description, location, industry, salary, salary_min, salary_max, job_type, deadline]
  );
  return result.rows[0];
};

// Get all jobs (paginated)
export const findAllJobs = async ({ limit, offset }) => {
  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS total ${jobSelectBase}`
  );
  const total = countResult.rows[0].total;

  const result = await pool.query(
    `SELECT j.*, u.name AS employer_name
     ${jobSelectBase}
     ORDER BY j.created_at DESC
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );

  return { rows: result.rows, total };
};

// Get a single job by id
export const findJobById = async (id) => {
  const result = await pool.query(
    `SELECT j.*, u.name AS employer_name
     ${jobSelectBase}
     WHERE j.id = $1`,
    [id]
  );
  return result.rows[0];
};

// Update a job listing
export const updateJobById = async (id, fields) => {
  const { title, description, location, industry, salary, salary_min, salary_max, job_type, deadline } = fields;
  const result = await pool.query(
    `UPDATE jobs
     SET title = $1, description = $2, location = $3, industry = $4,
         salary = $5, salary_min = $6, salary_max = $7, job_type = $8,
         deadline = $9, updated_at = CURRENT_TIMESTAMP
     WHERE id = $10
     RETURNING *`,
    [title, description, location, industry, salary, salary_min, salary_max, job_type, deadline, id]
  );
  return result.rows[0];
};

// Delete a job listing
export const deleteJobById = async (id) => {
  await pool.query(`DELETE FROM jobs WHERE id = $1`, [id]);
};

// Search and filter jobs (paginated)
export const searchJobs = async (filters, { limit, offset }) => {
  const { whereClause, values } = buildJobSearchFilters(filters);

  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS total ${jobSelectBase} ${whereClause}`,
    values
  );
  const total = countResult.rows[0].total;

  const limitParam = values.length + 1;
  const offsetParam = values.length + 2;

  const result = await pool.query(
    `SELECT j.*, u.name AS employer_name
     ${jobSelectBase}
     ${whereClause}
     ORDER BY j.created_at DESC
     LIMIT $${limitParam} OFFSET $${offsetParam}`,
    [...values, limit, offset]
  );

  return { rows: result.rows, total };
};
