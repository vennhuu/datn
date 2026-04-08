import axios from "./axios.customize";

// Đặt lịch khám
const createAppointmentAPI = (data) => {
    return axios.post("/api/v1/appointments", data);
};

// Lấy lịch của tôi
const getMyAppointmentsAPI = () => {
    return axios.get("/api/v1/appointments/my");
};

// Hủy lịch
const cancelAppointmentAPI = (id) => {
    return axios.put(`/api/v1/appointments/${id}/cancel`);
};

// --- Doctor side ---
const getDoctorAppointmentsAPI = () =>
    axios.get("/api/v1/appointments/doctor");

const confirmAppointmentAPI = (id) =>
    axios.put(`/api/v1/appointments/${id}/confirm`);

const doneAppointmentAPI = (id) =>
    axios.put(`/api/v1/appointments/${id}/done`);

const getBookedSlotsAPI = (doctorId, date) =>
    axios.get(`/api/v1/appointments/booked-slots?doctorId=${doctorId}&date=${date}`);

const getAppointmentStatusAPI = (id) =>
    axios.get(`/api/v1/appointments/${id}/status`);

export {
    createAppointmentAPI, getMyAppointmentsAPI, cancelAppointmentAPI,
    getDoctorAppointmentsAPI, confirmAppointmentAPI, doneAppointmentAPI,
    getBookedSlotsAPI, getAppointmentStatusAPI,
};