const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
    // If already connected, reuse existing connection
    if (isConnected || mongoose.connection.readyState >= 1) {
        return;
    }

    const db = await mongoose.connect(process.env.MONGO_URI);
    isConnected = db.connections[0].readyState;
};

module.exports = connectDB;