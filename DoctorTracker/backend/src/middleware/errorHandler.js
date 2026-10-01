const notFound = (req, res, next) => {
    res
        .status(404)
        .json({ success: false, message: `Route not found: ${req.originalUrl}` });
};

const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || err.status || 500;
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
    } else if (err.type === "entity.parse.failed") {
        statusCode = 400;
        message = "Invalid JSON body";
    } else if (err.type === "entity.too.large") {
        statusCode = 413;
        message = "Request body too large";
    }

    if (statusCode >= 500) {
        console.error(err);
        if (process.env.NODE_ENV === "production") message = "Server error";
    }

    res.status(statusCode).json({ success: false, message });
};

module.exports = { notFound, errorHandler };