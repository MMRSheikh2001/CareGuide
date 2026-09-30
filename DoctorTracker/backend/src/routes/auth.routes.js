const express = require("express");
const { body } = require("express-validator");
const rateLimit = require("express-rate-limit");
const { login, logout, getMe } = require("../controller/auth.controller");
const { protect } = require("../middleware/auth");
const validate = require("../middleware/validate");

const router = express.Router();

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { success: false, message: "Too many login attempts. Try again later." },
});

router.post(
    "/login",
    loginLimiter,
    [
        body("email").isEmail().withMessage("Valid email is required").normalizeEmail(),
        body("password").notEmpty().withMessage("Password is required"),
    ],
    validate,
    login
);

router.post("/logout", logout);
router.get("/me", protect, getMe);

module.exports = router;