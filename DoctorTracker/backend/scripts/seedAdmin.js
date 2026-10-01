require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../src/models/user.model");

const { ADMIN_NAME = "Admin", ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

(async () => {
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
        console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD in .env first");
        process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);

    const email = ADMIN_EMAIL.toLowerCase().trim();
    const user = await User.findOne({ email });
    if (user) {
        user.password = ADMIN_PASSWORD; // hashed by the pre-save hook
        await user.save();
        console.log("Admin password updated:", email);
    } else {
        await User.create({ name: ADMIN_NAME, email, password: ADMIN_PASSWORD });
        console.log("Admin created:", email);
    }

    await mongoose.disconnect();
})();