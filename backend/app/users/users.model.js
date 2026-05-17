import pool from "../core/db.js";

// ─── User Queries ───────────────────────────────────────────

// Save a new user to the database
export const createUser = async (name, email, hashedPassword, role) => {
  const result = await pool.query(
    `INSERT INTO users (name, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role, created_at`,
    [name, email, hashedPassword, role]
  );
  return result.rows[0];
};

// Find a user by email
export const findUserByEmail = async (email) => {
  const result = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );
  return result.rows[0];
};

// Find a user by id
export const findUserById = async (id) => {
  const result = await pool.query(
    `SELECT id, name, email, role, created_at FROM users WHERE id = $1`,
    [id]
  );
  return result.rows[0];
};

// Get all users (admin only, paginated)
export const getAllUsers = async ({ limit, offset }) => {
  const countResult = await pool.query(`SELECT COUNT(*)::int AS total FROM users`);
  const total = countResult.rows[0].total;

  const result = await pool.query(
    `SELECT id, name, email, role, created_at
     FROM users
     ORDER BY created_at DESC
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );

  return { rows: result.rows, total };
};

// Update user name or email
export const updateUserById = async (id, name, email) => {
  const result = await pool.query(
    `UPDATE users SET name = $1, email = $2
     WHERE id = $3
     RETURNING id, name, email, role, created_at`,
    [name, email, id]
  );
  return result.rows[0];
};

// Delete a user by id
export const deleteUserById = async (id) => {
  await pool.query(`DELETE FROM users WHERE id = $1`, [id]);
};

// ─── Jobseeker Profile Queries ───────────────────────────────

// Create a jobseeker profile
export const createJobseekerProfile = async (userId) => {
  const result = await pool.query(
    `INSERT INTO jobseeker_profiles (user_id)
     VALUES ($1)
     RETURNING *`,
    [userId]
  );
  return result.rows[0];
};

// Get jobseeker profile by user id
export const getJobseekerProfile = async (userId) => {
  const result = await pool.query(
    `SELECT u.id, u.name, u.email, u.role, u.created_at,
            jp.bio, jp.skills, jp.experience, jp.resume_url, jp.location
     FROM users u
     LEFT JOIN jobseeker_profiles jp ON u.id = jp.user_id
     WHERE u.id = $1`,
    [userId]
  );
  return result.rows[0];
};

// Update jobseeker profile
export const updateJobseekerProfile = async (userId, fields) => {
  const { bio, skills, experience, resume_url, location } = fields;
  const result = await pool.query(
    `UPDATE jobseeker_profiles
     SET bio = $1, skills = $2, experience = $3,
         resume_url = $4, location = $5, updated_at = CURRENT_TIMESTAMP
     WHERE user_id = $6
     RETURNING *`,
    [bio, skills, experience, resume_url, location, userId]
  );
  return result.rows[0];
};

// ─── Employer Profile Queries ─────────────────────────────────

// Create an employer profile
export const createEmployerProfile = async (userId) => {
  const result = await pool.query(
    `INSERT INTO employer_profiles (user_id)
     VALUES ($1)
     RETURNING *`,
    [userId]
  );
  return result.rows[0];
};

// Get employer profile by user id
export const getEmployerProfile = async (userId) => {
  const result = await pool.query(
    `SELECT u.id, u.name, u.email, u.role, u.created_at,
            ep.company_name, ep.company_description,
            ep.industry, ep.website, ep.location
     FROM users u
     LEFT JOIN employer_profiles ep ON u.id = ep.user_id
     WHERE u.id = $1`,
    [userId]
  );
  return result.rows[0];
};

// Update employer profile
export const updateEmployerProfile = async (userId, fields) => {
  const { company_name, company_description, industry, website, location } = fields;
  const result = await pool.query(
    `UPDATE employer_profiles
     SET company_name = $1, company_description = $2, industry = $3,
         website = $4, location = $5, updated_at = CURRENT_TIMESTAMP
     WHERE user_id = $6
     RETURNING *`,
    [company_name, company_description, industry, website, location, userId]
  );
  return result.rows[0];
};

// ─── Password Queries ─────────────────────────────────────────

// Update a user's password
export const updateUserPassword = async (id, hashedPassword) => {
  const result = await pool.query(
    `UPDATE users SET password = $1 WHERE id = $2
     RETURNING id, name, email, role, created_at`,
    [hashedPassword, id]
  );
  return result.rows[0];
};

// ─── Password Reset Token Queries ────────────────────────────

// Save a reset token
export const saveResetToken = async (userId, token, expiresAt) => {
  // Delete any existing token for this user first
  await pool.query(
    `DELETE FROM password_reset_tokens WHERE user_id = $1`,
    [userId]
  );

  const result = await pool.query(
    `INSERT INTO password_reset_tokens (user_id, token, expires_at)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [userId, token, expiresAt]
  );
  return result.rows[0];
};

// Find a reset token
export const findResetToken = async (token) => {
  const result = await pool.query(
    `SELECT * FROM password_reset_tokens WHERE token = $1`,
    [token]
  );
  return result.rows[0];
};

// Delete a reset token after it has been used
export const deleteResetToken = async (token) => {
  await pool.query(
    `DELETE FROM password_reset_tokens WHERE token = $1`,
    [token]
  );
};