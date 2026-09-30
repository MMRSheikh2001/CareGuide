

const express = require("express");
const { query } = require("express-validator");
const { getStats } = require("../controller/dashboard.controller");
const { protect } = require("../middleware/auth");
const validate = require("../middleware/validate");

const router = express.Router();
router.use(protect);

router.get(
    "/stats",
    [query("days").optional().isInt({ min: 7, max: 90 }).withMessage("days must be 7-90")],
    validate,
    getStats
);

module.exports = router;