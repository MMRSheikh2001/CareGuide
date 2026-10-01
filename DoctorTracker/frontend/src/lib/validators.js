const PHONE = /^[+\d][\d\s\-()]{6,19}$/;
const EMAIL = /^\S+@\S+\.\S+$/;

export function validateDoctor(v) {
    const e = {};
    if (!v.name.trim()) e.name = "Name is required";
    if (!v.specialization.trim()) e.specialization = "Specialization is required";
    if (!v.hospital.trim()) e.hospital = "Hospital is required";
    if (!PHONE.test(v.phone.trim())) e.phone = "Enter a valid phone number";
    if (!EMAIL.test(v.email.trim())) e.email = "Enter a valid email";
    return e;
}

export function validatePatient(v) {
    const e = {};
    if (!v.name.trim()) e.name = "Name is required";
    const age = Number(v.age);
    if (v.age === "" || !Number.isInteger(age) || age < 0 || age > 150) {
        e.age = "Age must be a whole number from 0 to 150";
    }
    if (!v.gender) e.gender = "Select a gender";
    if (!v.condition.trim()) e.condition = "Condition is required";
    if (v.phone.trim() && !PHONE.test(v.phone.trim())) e.phone = "Enter a valid phone number";
    return e;
}