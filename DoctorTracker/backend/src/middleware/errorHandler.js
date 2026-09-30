const notFound = (req, res, next) => {
    res
        .status(404)
        .json({ success: false, message: `Route not found: ${req.originalUrl}` });
};

const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Server error";

    if (err.code === 11000) {
        statusCode = 409;
        const field = Object.keys(err.keyValue || {})[0];
        message = `${field} already exists`;
    } else if (err.name === "CastError") {
        statusCode = 400;
        message = `Invalid ${err.path}`;
    } else if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors).map((e) => e.message).join(", ");
    }

    if (statusCode === 500) console.error(err);

    res.status(statusCode).json({ success: false, message });
};

module.exports = { notFound, errorHandler };