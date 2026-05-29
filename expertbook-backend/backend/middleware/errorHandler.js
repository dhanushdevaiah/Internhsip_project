/**
 * Global Error Handler Middleware
 *
 * Catches all errors passed via next(err) and sends a
 * structured JSON response. Separates operational errors
 * from unexpected programmer errors.
 */

const errorHandler = (err, req, res, next) => {
  // Default to 500 if no statusCode was set on the error
  const statusCode = err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === "production";

  // Log full error in development; minimal info in production
  if (!isProduction) {
    console.error("❌ Error:", err);
  } else {
    console.error(`❌ ${statusCode} - ${err.message} - ${req.originalUrl}`);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: Object.values(err.errors).map((e) => e.message),
    });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "Duplicate field value. Please use a different value.",
    });
  }

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: `Invalid ID: ${err.value}`,
    });
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    // Stack trace only in development
    ...(isProduction ? {} : { stack: err.stack }),
  });
};

module.exports = errorHandler;
