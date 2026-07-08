export const errorHandler = (err, req, res, next) => {
  // 1. Log the error internally for developers to debug
  console.error(`[Error Handler Caught]: ${err.stack || err.message}`);

  // 2. Set the status code (default to 500 Internal Server Error if not explicitly specified)
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // 3. Send a clean, standardized JSON response to the client
  res.status(statusCode).json({
    success: false,
    error: message,
    // Security layer: Never leak detailed stack traces to public clients in production
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};