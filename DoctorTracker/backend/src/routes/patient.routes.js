const express = require("express");
const { body, param, query } = require("express-validator");
const {
    getPatients,
    getPatientFilterOptions,
    getPatientById,
    updatePatient,
    deletePatient,
} = require("../controller/patient.controller");
const { protect } = require("../middleware/auth");
const validate = require("../middleware/validate");

const router = express.Router();
router.use(protect);

const listQuery = [
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 50 }),
    query("from").optional().isISO8601().withMessage("from must be a valid date"),
    query("to").optional().isISO8601().withMessage("to must be a valid date"),
    query("gender").optional().isIn(["male", "female", "other"]),
    query("doctor").optional().isMongoId().withMessage("Invalid doctor id"),
];

// On update every field is optional, but if present it must be valid
const updateRules = [
    body("name").optional().trim().notEmpty().withMessage("Name cannot be empty"),
    body("age").optional().isInt({ min: 0, max: 150 }).withMessage("Age must be 0-150"),
    body("gender").optional().isIn(["male", "female", "other"]),
    body("phone")
        .optional({ values: "falsy" })
        .trim()
        .matches(/^[+\d][\d\s\-()]{6,19}$/)
        .withMessage("Valid phone number is required"),
    body("condition").optional().trim().notEmpty().withMessage("Condition cannot be empty"),
    body("doctor").optional().isMongoId().withMessage("Invalid doctor id"),
];

router.get("/", listQuery, validate, getPatients);
router.get("/filter-options", getPatientFilterOptions);

router
    .route("/:id")
    .all([param("id").isMongoId().withMessage("Invalid patient id")], validate)
    .get(getPatientById)
    .put(updateRules, validate, updatePatient)
    .delete(deletePatient);

module.exports = router;