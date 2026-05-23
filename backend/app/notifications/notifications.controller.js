import {
  findNotificationsByUser,
  findAllActiveNotificationsByUser,
} from "./notifications.model.js";
import { parsePagination, buildPagination } from "../core/pagination.js";

// GET /api/notifications/all  |  GET /api/all_notifications
export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await findAllActiveNotificationsByUser(req.user.id);

    res.status(200).json({
      message: "All active notifications retrieved successfully",
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error("Get all notifications error:", error.message);
    res.status(500).json({ message: "Server error getting notifications" });
  }
};

// GET /api/notifications
export const getMyNotifications = async (req, res) => {
  try {
    const { page, limit, offset } = parsePagination(req.query);
    const { rows, total } = await findNotificationsByUser(req.user.id, { limit, offset });

    res.status(200).json({
      message: "Notifications retrieved successfully",
      pagination: buildPagination(total, page, limit),
      notifications: rows,
    });
  } catch (error) {
    console.error("Get notifications error:", error.message);
    res.status(500).json({ message: "Server error getting notifications" });
  }
};
