const Patient = require("../models/patient.model");
const Doctor = require("../models/doctor.model");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const { getPagination, buildMeta, buildDateRange, escapeRegex } = require("../utils/queryHelpers");

const ensureDoctorExists = async (id) => {
    const exists = await Doctor.exists({ _id: id });
    if (!exists) throw new ApiError(404, "Doctor not found");
};


const buildPatientFilter = (q, base = {}) => {
    const filter = { ...base };

    if (q.search?.trim()) {
        const rx = new RegExp(escapeRegex(q.search.trim()), "i");
        filter.$or = [{ name: rx }, { condition: rx }, { phone: rx }];
    }
    if (q.condition) filter.condition = q.condition;
    if (q.gender) filter.gender = q.gender;
    if (q.doctor) filter.doctor = q.doctor;

    const range = buildDateRange(q.from, q.to);
    if (range) filter.createdAt = range;

    return filter;
};

const runPagedQuery = async (filter, query, populateDoctor) => {
    const { page, limit, skip } = getPagination(query);

    let find = Patient.find(filter)
        .sort({ createdAt: -1, _id: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
    if (populateDoctor) find = find.populate("doctor", "name specialization hospital");

    const [data, total] = await Promise.all([find, Patient.countDocuments(filter)]);
    return { data, meta: buildMeta(total, page, limit) };
};



const getDoctorPatients = asyncHandler(async (req, res) => {
    await ensureDoctorExists(req.params.id);
    const filter = buildPatientFilter(req.query, { doctor: req.params.id });
    const result = await runPagedQuery(filter, req.query, false);
    res.json({ success: true, ...result });
});




const addPatientToDoctor = asyncHandler(async (req, res) => {
    await ensureDoctorExists(req.params.id);
    const { name, age, gender, phone, condition } = req.body;
    const patient = await Patient.create({
        name, age, gender, phone, condition,
        doctor: req.params.id,
    });
    res.status(201).json({ success: true, data: patient });
});



const removePatientFromDoctor = asyncHandler(async (req, res) => {
    const { doctorId, patientId } = req.params;

    const patient = await Patient.findOneAndDelete({ _id: patientId, doctor: doctorId });
    if (!patient) throw new ApiError(404, "Patient not found for this doctor");
    res.json({ success: true, message: "Patient deleted" });
});





const getPatients = asyncHandler(async (req, res) => {
    const filter = buildPatientFilter(req.query);
    const result = await runPagedQuery(filter, req.query, true);
    res.json({ success: true, ...result });
});


const getPatientFilterOptions = asyncHandler(async (req, res) => {
    const conditions = await Patient.distinct("condition");
    res.json({ success: true, data: { conditions: conditions.sort() } });
});


const getPatientById = asyncHandler(async (req, res) => {
    const patient = await Patient.findById(req.params.id)
        .populate("doctor", "name specialization hospital")
        .lean();
    if (!patient) throw new ApiError(404, "Patient not found");
    res.json({ success: true, data: patient });
});


const updatePatient = asyncHandler(async (req, res) => {

    const allowed = ["name", "age", "gender", "phone", "condition", "doctor"];
    const updates = {};
    for (const key of allowed) {
        if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    if (updates.doctor) await ensureDoctorExists(updates.doctor);

    const patient = await Patient.findByIdAndUpdate(req.params.id, updates, {
        new: true,
        runValidators: true,
    }).populate("doctor", "name specialization hospital");

    if (!patient) throw new ApiError(404, "Patient not found");
    res.json({ success: true, data: patient });
});


const deletePatient = asyncHandler(async (req, res) => {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) throw new ApiError(404, "Patient not found");
    res.json({ success: true, message: "Patient deleted" });
});

module.exports = {
    getDoctorPatients,
    addPatientToDoctor,
    removePatientFromDoctor,
    getPatients,
    getPatientFilterOptions,
    getPatientById,
    updatePatient,
    deletePatient,
};