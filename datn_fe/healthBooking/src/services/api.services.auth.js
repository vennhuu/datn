import axios from "./axios.customize";

const registerUserAPI = (fullName, email, password, gender, phoneNumber, birthday, address, avatar) => {
    const URL_BACKEND = "/api/v1/register"
    const data = {
        name: fullName,
        email: email,
        password: password,
        gender: gender,
        mobile: phoneNumber,
        birthday: birthday,
        address: address,
        avatar: avatar
    }
    return axios.post(URL_BACKEND, data);
}

const loginUserAPI = (email, password) => {
    const URL_BACKEND = "/api/v1/login"
    const data = {
        username: email,
        password: password,
    }
    return axios.post(URL_BACKEND, data);
}

const logoutAPI = () => {
    return axios.post("/api/v1/auth/logout");
}

const sendVerificationCodeAPI = (email) => {
    return axios.post(`/api/v1/auth/send-code?email=${email}`);
}

const verifyCodeAPI = (email, code) => {
    return axios.post(`/api/v1/auth/verify-code?email=${email}&code=${code}`);
}

const forgotPasswordAPI = (email) => {
    return axios.post(`/api/v1/auth/forgot-password?email=${email}`);
}

const resetPasswordAPI = (email, code, newPassword) => {
    return axios.post(`/api/v1/auth/reset-password?email=${email}&code=${code}&newPassword=${newPassword}`);
}

export { registerUserAPI, loginUserAPI, logoutAPI, 
         sendVerificationCodeAPI, verifyCodeAPI,
         forgotPasswordAPI, resetPasswordAPI };