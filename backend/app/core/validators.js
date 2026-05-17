import { body, query, validationResult } from "express-validator";

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

// ─── Pagination ───────────────────────────────────────────────

export const paginationQueryValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 }).withMessage("page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage("limit must be between 1 and 100"),

  validate,
];

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

  body("salary_min")
    .optional()
    .isInt({ min: 0 }).withMessage("salary_min must be a non-negative integer"),

  body("salary_max")
    .optional()
    .isInt({ min: 0 }).withMessage("salary_max must be a non-negative integer"),

  body("salary")
    .optional()
    .trim(),

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

  body("salary_min")
    .optional()
    .isInt({ min: 0 }).withMessage("salary_min must be a non-negative integer"),

  body("salary_max")
    .optional()
    .isInt({ min: 0 }).withMessage("salary_max must be a non-negative integer"),

  body("salary")
    .optional()
    .trim(),

  validate,
];

export const searchJobsValidator = [
  query("title")
    .optional()
    .trim()
    .notEmpty().withMessage("Title cannot be empty"),

  query("location")
    .optional()
    .trim()
    .notEmpty().withMessage("Location cannot be empty"),

  query("min_salary")
    .optional()
    .isInt({ min: 0 }).withMessage("min_salary must be a non-negative integer"),

  query("max_salary")
    .optional()
    .isInt({ min: 0 }).withMessage("max_salary must be a non-negative integer"),

  query("posted_after")
    .optional()
    .isDate().withMessage("posted_after must be a valid date (YYYY-MM-DD)"),

  query("posted_before")
    .optional()
    .isDate().withMessage("posted_before must be a valid date (YYYY-MM-DD)"),

  query("posted_on")
    .optional()
    .isDate().withMessage("posted_on must be a valid date (YYYY-MM-DD)"),

  (req, res, next) => {
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

    const { title, location, min_salary, max_salary, posted_after, posted_before, posted_on } = req.query;

    if (
      !title &&
      !location &&
      min_salary === undefined &&
      max_salary === undefined &&
      !posted_after &&
      !posted_before &&
      !posted_on
    ) {
      return res.status(400).json({
        message:
          "At least one search parameter is required: title, location, min_salary, max_salary, posted_after, posted_before, or posted_on",
      });
    }

    if (min_salary !== undefined && max_salary !== undefined && Number(min_salary) > Number(max_salary)) {
      return res.status(400).json({
        message: "min_salary cannot be greater than max_salary",
      });
    }

    if (posted_after && posted_before && posted_after > posted_before) {
      return res.status(400).json({
        message: "posted_after cannot be after posted_before",
      });
    }

    next();
  },
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
    .isIn(["applied", "accepted", "rejected"]).withMessage("Status must be applied, accepted or rejected"),

  validate,
];

export const patchStatusValidator = [
  body("status")
    .notEmpty().withMessage("Status is required")
    .isIn(["accepted", "rejected"]).withMessage("Status must be accepted or rejected"),

  validate,
];