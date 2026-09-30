

const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000, // 1 day, keep in sync with JWT_EXPIRES_IN
};

const signToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    });

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
        throw new ApiError(401, "Invalid email or password");
    }

    const token = signToken(user._id);
    res.cookie("token", token, cookieOptions);

    res.json({
        success: true,
        data: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
});

// POST /api/auth/logout
const logout = (req, res) => {
    res.clearCookie("token", { ...cookieOptions, maxAge: undefined });
    res.json({ success: true, message: "Logged out" });
};

// GET /api/auth/me
const getMe = (req, res) => {
    const { _id, name, email, role } = req.user;
    res.json({ success: true, data: { id: _id, name, email, role } });
};

module.exports = { login, logout, getMe };