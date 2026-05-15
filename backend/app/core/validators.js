import { body, validationResult } from "express-validator";

// Middleware to check validation results
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

// ─── Auth Validators ──────────────────────────────────────────

export const registerValidator = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),

  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please provide a valid email"),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),

  body("role")
    .notEmpty().withMessage("Role is required")
    .isIn(["jobseeker", "employer", "admin"]).withMessage("Role must be jobseeker, employer or admin"),

  validate,
];

export const loginValidator = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please provide a valid email"),

  body("password")
    .notEmpty().withMessage("Password is required"),

  validate,
];

export const forgotPasswordValidator = [
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Please provide a valid email"),

  validate,
];

export const resetPasswordValidator = [
  body("token")
    .notEmpty().withMessage("Token is required"),

  body("newPassword")
    .notEmpty().withMessage("New password is required")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),

  validate,
];

// ─── User Validators ──────────────────────────────────────────

export const updateMeValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),

  body("email")
    .optional()
    .trim()
    .isEmail().withMessage("Please provide a valid email"),

  validate,
];

export const changePasswordValidator = [
  body("currentPassword")
    .notEmpty().withMessage("Current password is required"),

  body("newPassword")
    .notEmpty().withMessage("New password is required")
    .isLength({ min: 8 }).withMessage("New password must be at least 8 characters"),

  validate,
];

// ─── Job Validators ───────────────────────────────────────────

export const postJobValidator = [
  body("title")
    .trim()
    .notEmpty().withMessage("Job title is required"),

  body("description")
    .trim()
    .notEmpty().withMessage("Job description is required"),

  body("location")
    .trim()
    .notEmpty().withMessage("Location is required"),

  body("industry")
    .trim()
    .notEmpty().withMessage("Industry is required"),

  body("job_type")
    .notEmpty().withMessage("Job type is required")
    .isIn(["full-time", "part-time", "contract"]).withMessage("Job type must be full-time, part-time or contract"),

  body("deadline")
    .optional()
    .isDate().withMessage("Deadline must be a valid date"),

  validate,
];

export const updateJobValidator = [
  body("title")
    .optional()
    .trim()
    .notEmpty().withMessage("Job title cannot be empty"),

  body("description")
    .optional()
    .trim()
    .notEmpty().withMessage("Job description cannot be empty"),

  body("location")
    .optional()
    .trim()
    .notEmpty().withMessage("Location cannot be empty"),

  body("industry")
    .optional()
    .trim()
    .notEmpty().withMessage("Industry cannot be empty"),

  body("job_type")
    .optional()
    .isIn(["full-time", "part-time", "contract"]).withMessage("Job type must be full-time, part-time or contract"),

  body("deadline")
    .optional()
    .isDate().withMessage("Deadline must be a valid date"),

  validate,
];

// ─── Application Validators ───────────────────────────────────

export const applyForJobValidator = [
  body("cover_letter")
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage("Cover letter must not exceed 1000 characters"),

  validate,
];

export const updateStatusValidator = [
  body("status")
    .notEmpty().withMessage("Status is required")
    .isIn(["pending", "accepted", "rejected"]).withMessage("Status must be pending, accepted or rejected"),

  validate,
];