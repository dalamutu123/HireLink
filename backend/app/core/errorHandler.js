// Handle 404 - Route not found
export const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Global error handler
export const errorHandler = (err, req, res, next) => {
  // Sometimes an error is thrown with a 200 status code
  // In that case we default to 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Handle PostgreSQL specific errors
  if (err.code === "23505") {
    return res.status(409).json({
      message: "A record with that value already exists",
      field: err.detail,
    });
  }

  if (err.code === "23503") {
    return res.status(400).json({
      message: "Referenced record does not exist",
      field: err.detail,
    });
  }

  if (err.code === "22P02") {
    return res.status(400).json({
      message: "Invalid id format provided",
    });
  }

  // Handle JWT specific errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      message: "Invalid token",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      message: "Token has expired, please log in again",
    });
  }

  // Generic error response
  res.status(statusCode).json({
    message: err.message || "Something went wrong",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};