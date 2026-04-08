import axios from "./axios.customize";

const getReviewsByDoctorAPI = (doctorId) =>
    axios.get(`/api/v1/reviews/doctor/${doctorId}`);

const createReviewAPI = (data) =>
    axios.post("/api/v1/reviews", data);

export { getReviewsByDoctorAPI, createReviewAPI };