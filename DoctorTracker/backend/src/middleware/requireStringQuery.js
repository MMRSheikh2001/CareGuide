

const ApiError = require("../utils/ApiError");

const requireStringQuery = (req, res, next) => {
  for (const [key, value] of Object.entries(req.query)) {
    if (typeof value !== "string") {
      return next(new ApiError(400, `Invalid query parameter: ${key}`));
    }
  }
  next();
};

module.exports = requireStringQuery;