const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const { notFound, errorHandler } = require("./middleware/errorHandler");


const authRoutes = require("./routes/auth.routes");

const doctorRoutes = require("./routes/doctor.routes");

const patientRoutes = require("./routes/patient.routes");

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));


app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);

app.use("/api/patients", patientRoutes);






app.get("/api/health", (req, res) => {
    res.json({ success: true, message: "API is running" });
});



app.use(notFound);
app.use(errorHandler);

module.exports = app;