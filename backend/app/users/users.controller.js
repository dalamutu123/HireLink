import {
  findUserById,
  updateUserById,
  deleteUserById,
  getAllUsers,
  getJobseekerProfile,
  updateJobseekerProfile,
  getEmployerProfile,
  updateEmployerProfile,
} from "./users.model.js";

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

    // Update base user info if provided
    if (name || email) {
      await updateUserById(
        userId,
        name || req.user.name,
        email || req.user.email
      );
    }

    // Update profile based on role
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

// GET /api/users
export const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json({
      message: "All users retrieved successfully",
      count: users.length,
      users,
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

    // Check if user exists
    const user = await findUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent admin from deleting themselves
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

    // Find user first to check they exist and get their role
    const user = await findUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch the appropriate profile based on role
    let profile;
    if (user.role === "jobseeker") {
      profile = await getJobseekerProfile(id);
    } else if (user.role === "employer") {
      profile = await getEmployerProfile(id);
    } else {
      // Admin users have no public profile
      return res.status(403).json({ message: "This profile is not publicly available" });
    }

    res.status(200).json({ user: profile });
  } catch (error) {
    console.error("Get user by id error:", error.message);
    res.status(500).json({ message: "Server error getting user" });
  }
};