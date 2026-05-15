import "dotenv/config";
import express from "express";
import authRoutes from "./app/auth/auth.routes.js";
import userRoutes from "./app/users/users.routes.js";
import jobRoutes from "./app/jobs/jobs.routes.js";
import applicationRoutes from "./app/applications/applications.routes.js";
import { notFound, errorHandler } from "./app/core/errorHandler.js";

const app = express();
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);

app.get("/", (req, res) => {
  res.send("API running");
});

// Error handling — must be after all routes
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});