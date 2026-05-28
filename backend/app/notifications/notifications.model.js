import pool from "../core/db.js";

const NOTIFICATION_TTL_HOURS = 24;

export const createNotification = async (userId, type, message) => {
  const expiresAt = new Date(Date.now() + NOTIFICATION_TTL_HOURS * 60 * 60 * 1000);

  const result = await pool.query(
    `INSERT INTO notifications (user_id, type, message, expires_at)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [userId, type, message, expiresAt]
  );

  return result.rows[0];
};

export const findNotificationsByUser = async (userId, { limit, offset }) => {
  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS total
     FROM notifications
     WHERE user_id = $1 AND expires_at > NOW()`,
    [userId]
  );
  const total = countResult.rows[0].total;

  const result = await pool.query(
    `SELECT id, user_id, type, message, read, expires_at, created_at
     FROM notifications
     WHERE user_id = $1 AND expires_at > NOW()
     ORDER BY created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );

  return { rows: result.rows, total };
};

// All active (non-expired) notifications for a user — max 100, expires after 24h
export const findAllActiveNotificationsByUser = async (userId) => {
  const result = await pool.query(
    `SELECT id, user_id, type, message, read, expires_at, created_at
     FROM notifications
     WHERE user_id = $1 AND expires_at > NOW()
     ORDER BY created_at DESC
     LIMIT 100`,
    [userId]
  );

  return result.rows;
};

export const markNotificationAsRead = async (id, userId) => {
  const result = await pool.query(
    `UPDATE notifications
     SET read = true
     WHERE id = $1 AND user_id = $2
     RETURNING *`,
    [id, userId]
  );
  return result.rows[0];
};
