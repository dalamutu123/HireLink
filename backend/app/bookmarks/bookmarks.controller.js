import {
  saveBookmark,
  getBookmarks,
  findBookmark,
  deleteBookmark,
} from "./bookmarks.model.js";
import { findJobById } from "../jobs/jobs.model.js";

// GET /api/bookmarks
export const getSavedJobs = async (req, res) => {
  try {
    const userId = req.user.id;

    const bookmarks = await getBookmarks(userId);

    if (!bookmarks || bookmarks.length === 0) {
      return res.status(200).json({ 
        message: "You have no saved jobs",
        count: 0,
        bookmarks: []
      });
    }

    res.status(200).json({
      message: "Saved jobs retrieved successfully",
      count: bookmarks.length,
      bookmarks,
    });
  } catch (error) {
    console.error("Get bookmarks error:", error.message);
    res.status(500).json({ message: "Server error getting saved jobs" });
  }
};

// POST /api/bookmarks
export const saveJob = async (req, res) => {
  try {
    const userId = req.user.id;
    const { jobId } = req.body;

    // Validate jobId
    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required" });
    }

    // Check if job exists
    const job = await findJobById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job listing not found" });
    }

    // Check if already bookmarked
    const existingBookmark = await findBookmark(userId, jobId);
    if (existingBookmark) {
      return res.status(409).json({ message: "Job already saved" });
    }

    const bookmark = await saveBookmark(userId, jobId);

    res.status(201).json({
      message: "Job saved successfully",
      bookmark,
    });
  } catch (error) {
    console.error("Save job error:", error.message);
    res.status(500).json({ message: "Server error saving job" });
  }
};

// DELETE /api/bookmarks
export const unsaveJob = async (req, res) => {
  try {
    const userId = req.user.id;
    const { jobId } = req.body;

    // Validate jobId
    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required" });
    }

    // Check if bookmark exists
    const existingBookmark = await findBookmark(userId, jobId);
    if (!existingBookmark) {
      return res.status(404).json({ message: "Saved job not found" });
    }

    await deleteBookmark(userId, jobId);

    res.status(200).json({ message: "Job unsaved successfully" });
  } catch (error) {
    console.error("Unsave job error:", error.message);
    res.status(500).json({ message: "Server error unsaving job" });
  }
};