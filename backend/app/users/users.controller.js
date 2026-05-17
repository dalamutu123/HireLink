import bcrypt from "bcrypt";
import {
  findUserById,
  findUserByEmail,
  updateUserById,
  updateUserPassword,
  deleteUserById,
  getAllUsers,
  getJobseekerProfile,
  updateJobseekerProfile,
  getEmployerProfile,
  updateEmployerProfile,
} from "./users.model.js";
import { parsePagination, buildPagination } from "../core/pagination.js";

// GET /api/users/me
export const getMe = async (req, res) => {
  try {
    const userId = req.user.id;
    let profile;

    if (req.user.role === "jobseeker") {
      profile = await getJobseekerProfile(userId);
    } else if (req.user.role === "employer") {
      profile = await getEmployerProfile(userId);
    } else {
      profile = await findUserById(userId);
    }

    if (!profile) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user: profile });
  } catch (error) {
    console.error("Get me error:", error.message);
    res.status(500).json({ message: "Server error getting profile" });
  }
};

// PUT /api/users/me
export const updateMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, ...profileFields } = req.body;

    if (name || email) {
      await updateUserById(
        userId,
        name || req.user.name,
        email || req.user.email
      );
    }

    let updatedProfile;
    if (req.user.role === "jobseeker") {
      updatedProfile = await updateJobseekerProfile(userId, profileFields);
    } else if (req.user.role === "employer") {
      updatedProfile = await updateEmployerProfile(userId, profileFields);
    }

    res.status(200).json({
      message: "Profile updated successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Update me error:", error.message);
    res.status(500).json({ message: "Server error updating profile" });
  }
};

// DELETE /api/users/me
export const deleteMe = async (req, res) => {
  try {
    const userId = req.user.id;
    await deleteUserById(userId);
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Delete me error:", error.message);
    res.status(500).json({ message: "Server error deleting account" });
  }
};

// PUT /api/users/me/password
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current password and new password are required" });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: "New password must be at least 8 characters" });
    }

    const user = await findUserByEmail(req.user.email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({ message: "New password must be different from current password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await updateUserPassword(userId, hashedPassword);

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error.message);
    console.error("Full error stack:", error.stack);
    res.status(500).json({ message: "Server error changing password" });
  }
};

// GET /api/users
export const getUsers = async (req, res) => {
  try {
    const { page, limit, offset } = parsePagination(req.query);
    const { rows, total } = await getAllUsers({ limit, offset });

    res.status(200).json({
      message: "All users retrieved successfully",
      pagination: buildPagination(total, page, limit),
      users: rows,
    });
  } catch (error) {
    console.error("Get all users error:", error.message);
    res.status(500).json({ message: "Server error getting users" });
  }
};

// DELETE /api/users/:id
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await findUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ message: "You cannot delete your own account this way" });
    }

    await deleteUserById(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error.message);
    res.status(500).json({ message: "Server error deleting user" });
  }
};

// GET /api/users/:id
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await findUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let profile;
    if (user.role === "jobseeker") {
      profile = await getJobseekerProfile(id);
    } else if (user.role === "employer") {
      profile = await getEmployerProfile(id);
    } else {
      return res.status(403).json({ message: "This profile is not publicly available" });
    }

    res.status(200).json({ user: profile });
  } catch (error) {
    console.error("Get user by id error:", error.message);
    res.status(500).json({ message: "Server error getting user" });
  }
};