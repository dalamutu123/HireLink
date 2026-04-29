import express from "express";
import authRoutes from "./app/auth/auth.routes.js";
import userRoutes from "./app/users/users.routes.js";

const app = express();
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("API running");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});