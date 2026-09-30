

const Doctor = require("../models/doctor.model");
const Patient = require("../models/patient.model");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const escapeRegex = require("../utils/escapeRegex");

// POST /api/doctors
const createDoctor = asyncHandler(async (req, res) => {
    const { name, specialization, hospital, phone, email } = req.body;
    const doctor = await Doctor.create({ name, specialization, hospital, phone, email });
    res.status(201).json({ success: true, data: doctor });
});

// GET /api/doctors?search=&specialization=&hospital=&from=&to=&page=&limit=
const getDoctors = asyncHandler(async (req, res) => {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 50);
    const { search, specialization, hospital, from, to } = req.query;

    const filter = {};

    if (search?.trim()) {
        const rx = new RegExp(escapeRegex(search.trim()), "i");
        filter.$or = [{ name: rx }, { specialization: rx }, { hospital: rx }];
    }
    if (specialization) filter.specialization = specialization;
    if (hospital) filter.hospital = hospital;

    if (from || to) {
        filter.createdAt = {};
        if (from) filter.createdAt.$gte = new Date(from);
        if (to) {
            const end = new Date(to);
            end.setUTCHours(23, 59, 59, 999);
            filter.createdAt.$lte = end;
        }
    }

    const [doctors, total] = await Promise.all([
        Doctor.find(filter)
            .sort({ createdAt: -1, _id: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean(),
        Doctor.countDocuments(filter),
    ]);

    // One grouped query for the whole page, not one query per doctor
    const counts = await Patient.aggregate([
        { $match: { doctor: { $in: doctors.map((d) => d._id) } } },
        { $group: { _id: "$doctor", count: { $sum: 1 } } },
    ]);
    const countMap = new Map(counts.map((c) => [String(c._id), c.count]));

    const data = doctors.map((d) => ({
        ...d,
        patientCount: countMap.get(String(d._id)) || 0,
    }));

    res.json({
        success: true,
        data,
        meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
});

// GET /api/doctors/filter-options
const getFilterOptions = asyncHandler(async (req, res) => {
    const [specializations, hospitals] = await Promise.all([
        Doctor.distinct("specialization"),
        Doctor.distinct("hospital"),
    ]);
    res.json({
        success: true,
        data: { specializations: specializations.sort(), hospitals: hospitals.sort() },
    });
});

// GET /api/doctors/:id
const getDoctorById = asyncHandler(async (req, res) => {
    const doctor = await Doctor.findById(req.params.id).lean();
    if (!doctor) throw new ApiError(404, "Doctor not found");

    const patientCount = await Patient.countDocuments({ doctor: doctor._id });
    res.json({ success: true, data: { ...doctor, patientCount } });
});

module.exports = { createDoctor, getDoctors, getFilterOptions, getDoctorById };