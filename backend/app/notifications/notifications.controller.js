import {
  findNotificationsByUser,
  findAllActiveNotificationsByUser,
  markNotificationAsRead as markAsReadModel,
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

// PATCH /api/notifications/:id/read
export const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await markAsReadModel(id, req.user.id);
    
    if (!notification) {
      return res.status(404).json({ message: "Notification not found or unauthorized" });
    }

    res.status(200).json({ message: "Notification marked as read", notification });
  } catch (error) {
    console.error("Mark notification as read error:", error.message);
    res.status(500).json({ message: "Server error marking notification as read" });
  }
};
