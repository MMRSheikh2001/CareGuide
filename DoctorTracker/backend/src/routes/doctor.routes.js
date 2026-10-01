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

const {
    getDoctorPatients,
    addPatientToDoctor,
    removePatientFromDoctor,
} = require("../controller/patient.controller");

const router = express.Router();


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

const patientCreateRules = [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("age").isInt({ min: 0, max: 150 }).withMessage("Age must be 0-150"),
    body("gender").isIn(["male", "female", "other"]).withMessage("Invalid gender"),
    body("phone")
        .optional({ values: "falsy" })
        .trim()
        .matches(/^[+\d][\d\s\-()]{6,19}$/)
        .withMessage("Valid phone number is required"),
    body("condition").trim().notEmpty().withMessage("Condition is required"),
];

router.get(
    "/:id/patients",
    [
        param("id").isMongoId().withMessage("Invalid doctor id"),
        query("page").optional().isInt({ min: 1 }),
        query("limit").optional().isInt({ min: 1, max: 50 }),
    ],
    validate,
    getDoctorPatients
);

router.post(
    "/:id/patients",
    [param("id").isMongoId().withMessage("Invalid doctor id"), ...patientCreateRules],
    validate,
    addPatientToDoctor
);

router.delete(
    "/:doctorId/patients/:patientId",
    [
        param("doctorId").isMongoId().withMessage("Invalid doctor id"),
        param("patientId").isMongoId().withMessage("Invalid patient id"),
    ],
    validate,
    removePatientFromDoctor
);

module.exports = router;