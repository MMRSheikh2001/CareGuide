const express = require("express");
const { body, param, query } = require("express-validator");
const {
    createDoctor,
    getDoctors,
    getFilterOptions,
    getDoctorById,
} = require("../controller/doctor.controller");
const { protect } = require("../middleware/auth");
const validate = require("../middleware/validate");

const router = express.Router();

// Every doctor route requires a logged-in user
router.use(protect);

router.get(
    "/",
    [
        query("page").optional().isInt({ min: 1 }).withMessage("page must be 1 or more"),
        query("limit").optional().isInt({ min: 1, max: 50 }).withMessage("limit must be 1-50"),
        query("from").optional().isISO8601().withMessage("from must be a valid date"),
        query("to").optional().isISO8601().withMessage("to must be a valid date"),
    ],
    validate,
    getDoctors
);

// Must be declared before "/:id", or "filter-options" is treated as an id
router.get("/filter-options", getFilterOptions);

router.get(
    "/:id",
    [param("id").isMongoId().withMessage("Invalid doctor id")],
    validate,
    getDoctorById
);

router.post(
    "/",
    [
        body("name").trim().notEmpty().withMessage("Name is required"),
        body("specialization").trim().notEmpty().withMessage("Specialization is required"),
        body("hospital").trim().notEmpty().withMessage("Hospital is required"),
        body("phone")
            .trim()
            .matches(/^[+\d][\d\s\-()]{6,19}$/)
            .withMessage("Valid phone number is required"),
        body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
    ],
    validate,
    createDoctor
);

module.exports = router;