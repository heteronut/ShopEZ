function notFound(req, res, next) {
  const err = new Error("Route not found: " + req.originalUrl);
  err.statusCode = 404;
  next(err);
}

// Express error middleware: always answers with a message and a status code
// so the React UI can show the server error instead of failing silently.
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  let status = err.statusCode || res.statusCode;
  if (!status || status === 200) status = 500;
  if (err.name === "ValidationError") status = 400;
  if (err.code === 11000) {
    status = 400;
    const field = Object.keys(err.keyValue || {})[0] || "field";
    return res.status(status).json({ message: "Duplicate value for " + field });
  }
  res.status(status).json({ message: err.message || "Server error" });
}

module.exports = { notFound, errorHandler };
