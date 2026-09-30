const Doctor = require("../models/doctor.model");
const Patient = require("../models/patient.model");
const asyncHandler = require("../utils/asyncHandler");

const TZ = process.env.APP_TIMEZONE || "Asia/Dhaka";
const DAY = 24 * 60 * 60 * 1000;

// "2026-09-30" in the app's timezone
const dayKey = (date) =>
    new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(date);

// Daily counts for a model; $match on createdAt uses the createdAt index
const dailyCounts = (Model, since) =>
    Model.aggregate([
        { $match: { createdAt: { $gte: since } } },
        {
            $group: {
                _id: {
                    $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: TZ },
                },
                count: { $sum: 1 },
            },
        },
    ]);

// Mongo skips empty days; charts need every day
const fillDays = (rows, days) => {
    const map = new Map(rows.map((r) => [r._id, r.count]));
    const out = [];
    for (let i = days - 1; i >= 0; i--) {
        const key = dayKey(new Date(Date.now() - i * DAY));
        out.push({ date: key, count: map.get(key) || 0 });
    }
    return out;
};

const countBetween = (Model, from, to) => {
    const createdAt = { $gte: from };
    if (to) createdAt.$lt = to;
    return Model.countDocuments({ createdAt });
};

// % change vs previous period; null when there is nothing to compare to
const pctChange = (current, previous) =>
    previous === 0 ? null : Math.round(((current - previous) / previous) * 100);

const AGE_LABELS = {
    0: "0-17",
    18: "18-35",
    36: "36-50",
    51: "51-65",
    66: "66+",
};

// GET /api/dashboard/stats?days=30
const getStats = asyncHandler(async (req, res) => {
    const days = Math.min(Math.max(parseInt(req.query.days) || 30, 7), 90);
    const now = Date.now();
    const periodStart = new Date(now - days * DAY);
    const prevStart = new Date(now - 2 * days * DAY);
    // One extra day back so the first chart day is complete
    const seriesSince = new Date(now - (days + 1) * DAY);

    const [
        totalDoctors,
        totalPatients,
        newDoctors,
        prevDoctors,
        newPatients,
        prevPatients,
        patientsPerDoctor,
        distributions,
        doctorsBySpecialization,
        patientDaily,
        doctorDaily,
        recentPatients,
    ] = await Promise.all([
        Doctor.estimatedDocumentCount(),
        Patient.estimatedDocumentCount(),
        countBetween(Doctor, periodStart),
        countBetween(Doctor, prevStart, periodStart),
        countBetween(Patient, periodStart),
        countBetween(Patient, prevStart, periodStart),

        Patient.aggregate([
            { $group: { _id: "$doctor", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 8 },
            {
                $lookup: {
                    from: "doctors",
                    localField: "_id",
                    foreignField: "_id",
                    as: "doctor",
                },
            },
            { $unwind: "$doctor" },
            {
                $project: {
                    _id: 0,
                    doctorId: "$_id",
                    name: "$doctor.name",
                    specialization: "$doctor.specialization",
                    count: 1,
                },
            },
        ]),

        Patient.aggregate([
            {
                $facet: {
                    byCondition: [
                        { $group: { _id: "$condition", count: { $sum: 1 } } },
                        { $sort: { count: -1 } },
                        { $limit: 6 },
                        { $project: { _id: 0, label: "$_id", count: 1 } },
                    ],
                    byGender: [
                        { $group: { _id: "$gender", count: { $sum: 1 } } },
                        { $project: { _id: 0, label: "$_id", count: 1 } },
                    ],
                    byAgeGroup: [
                        {
                            $bucket: {
                                groupBy: "$age",
                                boundaries: [0, 18, 36, 51, 66, 151],
                                default: "Unknown",
                                output: { count: { $sum: 1 } },
                            },
                        },
                    ],
                },
            },
        ]),

        Doctor.aggregate([
            { $group: { _id: "$specialization", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 6 },
            { $project: { _id: 0, label: "$_id", count: 1 } },
        ]),

        dailyCounts(Patient, seriesSince),
        dailyCounts(Doctor, seriesSince),

        Patient.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("doctor", "name")
            .lean(),
    ]);

    const { byCondition, byGender, byAgeGroup } = distributions[0];

    // $bucket omits empty buckets; charts want all of them
    const ageCounts = new Map(byAgeGroup.map((b) => [b._id, b.count]));
    const patientsByAgeGroup = Object.entries(AGE_LABELS).map(([start, label]) => ({
        label,
        count: ageCounts.get(Number(start)) || 0,
    }));

    res.json({
        success: true,
        data: {
            range: { days },
            totals: {
                doctors: totalDoctors,
                patients: totalPatients,
                newDoctors,
                newPatients,
                doctorsChange: pctChange(newDoctors, prevDoctors),
                patientsChange: pctChange(newPatients, prevPatients),
                avgPatientsPerDoctor: totalDoctors
                    ? Number((totalPatients / totalDoctors).toFixed(1))
                    : 0,
            },
            patientsPerDoctor,
            patientsOverTime: fillDays(patientDaily, days),
            doctorsOverTime: fillDays(doctorDaily, days),
            patientsByCondition: byCondition,
            patientsByGender: byGender,
            patientsByAgeGroup,
            doctorsBySpecialization,
            recentPatients,
        },
    });
});

module.exports = { getStats };