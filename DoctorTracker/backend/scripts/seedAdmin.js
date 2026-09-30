require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../src/models/user.model");

(async () => {
    await mongoose.connect(process.env.MONGO_URI);
    const email = "admin@example.com";
    const exists = await User.findOne({ email });
    if (exists) {
        console.log("Admin already exists");
    } else {
        await User.create({ name: "Admin", email, password: "Admin@12345" });
        console.log("Admin created:", email);
    }
    await mongoose.disconnect();
})();