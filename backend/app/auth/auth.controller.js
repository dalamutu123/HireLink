import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import {
  createUser,
  findUserByEmail,
  saveResetToken,
  findResetToken,
  deleteResetToken,
  updateUserPassword,
  createJobseekerProfile,
  createEmployerProfile,
} from "../users/users.model.js";
import { sendPasswordResetEmail } from "../core/email.js";

// Generate JWT token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate role
    if (!["jobseeker", "employer", "admin"].includes(role)) {
      return res.status(400).json({ message: "Role must be jobseeker, employer or admin" });
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user to database
    const newUser = await createUser(name, email, hashedPassword, role);

    // Automatically create an empty profile based on role
    if (role === "jobseeker") {
      await createJobseekerProfile(newUser.id);
    } else if (role === "employer") {
      await createEmployerProfile(newUser.id);
    }

    // Generate token
    const token = generateToken(newUser.id, newUser.role);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: newUser,
    });
  } catch (error) {
    console.error("Register error:", error.message);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate fields
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Check if user exists
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate token
    const token = generateToken(user.id, user.role);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Server error during login" });
  }
};

// POST /api/auth/logout
export const logoutUser = (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
};

// POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check if user exists
    const user = await findUserByEmail(email);

    // We return success even if user doesn't exist to prevent
    // exposing which emails are registered in the system
    if (!user) {
      return res.status(200).json({
        message: "If an account with that email exists, a reset link has been sent",
      });
    }

    // Generate a secure random token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Set expiry to 15 minutes from now
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // Save token to database
    await saveResetToken(user.id, resetToken, expiresAt);

    // Build reset link
    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    // Send email
    await sendPasswordResetEmail(user.email, resetLink);

    res.status(200).json({
      message: "If an account with that email exists, a reset link has been sent",
    });
  } catch (error) {
    console.error("Forgot password error:", error.message);
    res.status(500).json({ message: "Server error sending reset email" });
  }
};

// POST /api/auth/reset-password
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Validate fields
    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token and new password are required" });
    }

    // Validate new password length
    if (newPassword.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    // Find token in database
    const resetToken = await findResetToken(token);
    if (!resetToken) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    // Check if token has expired
    if (new Date() > new Date(resetToken.expires_at)) {
      await deleteResetToken(token);
      return res.status(400).json({ message: "Reset token has expired, please request a new one" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await updateUserPassword(resetToken.user_id, hashedPassword);

    // Delete token so it can't be used again
    await deleteResetToken(token);

    res.status(200).json({ message: "Password reset successfully, you can now log in" });
  } catch (error) {
    console.error("Reset password error:", error.message);
    res.status(500).json({ message: "Server error resetting password" });
  }
};