import axios from "./axios.customize";

const getReviewsByDoctorAPI = (doctorId) =>
    axios.get(`/api/v1/reviews/doctor/${doctorId}`);

const createReviewAPI = (data) =>
    axios.post("/api/v1/reviews", data);

const deleteReviewAPI = (reviewId) =>
    axios.delete(`/api/v1/reviews/${reviewId}`);

export { getReviewsByDoctorAPI, createReviewAPI , deleteReviewAPI };