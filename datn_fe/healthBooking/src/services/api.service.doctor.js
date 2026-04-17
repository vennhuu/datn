import axios from "./axios.customize";


const fetchAllDoctorAPI = (current = 1, pageSize = 10, filters = {}) => {
    let URL_BACKEND = `/api/v1/doctors?page=${current}&size=${pageSize}`;

    let filterQuery = [];

    if (filters.name) {
        filterQuery.push(`user.name~'${filters.name}'`);
    }

    if (filters.specialization) {
        filterQuery.push(`specialization:'${filters.specialization}'`);
    }

    if (filters.hospital) {
        filterQuery.push(`hospital.name~'${filters.hospital}'`);
    }

    if (filters.minPrice) {
        filterQuery.push(`price>:${filters.minPrice}`);
    }

    if (filters.maxPrice) {
        filterQuery.push(`price<:${filters.maxPrice}`);
    }

    if (filterQuery.length > 0) {
        URL_BACKEND += `&filter=${encodeURIComponent(filterQuery.join(" and "))}`;
    }

    return axios.get(URL_BACKEND);
};
const createNewDoctorAPI = (name , email, password, gender , birthday , address , mobile , about ,
        specialization , degree , hospital , experienceYears , bio , avatar) => {
    const URL_BACKEND = "/api/v1/doctors"
    const data = {
        name: name ,
        email: email ,
        password: password,
        gender: gender || null,
        birthday: birthday ,
        address: address ,
        mobile : mobile ,
        about: about , 
        specialization: specialization || null ,
        degree: degree || null,
        hospital: { id: hospital },
        experienceYears :experienceYears  ,
        bio: bio , 
        avatar: avatar
    }
    return axios.post(URL_BACKEND,data);
}

const updateDoctorAPI = (id ,name , email, gender , birthday , address , mobile , about ,
        specialization , degree , hospital , experienceYears , bio) => {
    const URL_BACKEND = "/api/v1/doctors"
    const data = {
        id: id ,
        name: name ,
        email: email ,
        gender: gender,
        birthday: birthday ,
        address: address ,
        mobile : mobile ,
        about: about ,
        specialization: specialization ,
        degree: degree ,
        hospital:hospital ,
        experienceYears :experienceYears ,
        bio: bio
    }
    return axios.put(URL_BACKEND,data);
}

const deleteDoctorAPI = (id) => {
    const URL_BACKEND = `/api/v1/doctors/${id}`;
    return axios.delete(URL_BACKEND);
}

const updateDoctorAvatarAPI = (id, avatar) => {
    const URL_BACKEND = "/api/v1/doctors/avatar"

    const params = new URLSearchParams()

    params.append("userId", id)
    params.append("avatar", avatar)

    return axios.put(URL_BACKEND, params)
}

const fetchDoctorByIdAPI = (id) => {
    return axios.get(`/api/v1/doctors/${id}`);
};

const fetchAllDoctorByHospitalIdAPI = (id) => {
    return axios.get(`/api/v1/by-hospital/${id}`);
}
// Lấy profile bác sĩ đang đăng nhập
const getDoctorProfileAPI = () => {
    return axios.get("/api/v1/doctors/profile/me");
};

// Cập nhật profile bác sĩ đang đăng nhập
const updateDoctorProfileAPI = (data) => {
    return axios.put("/api/v1/doctors/profile/me", data);
};

// Upload avatar bác sĩ (dùng lại flow cũ: upload file → lấy tên → gọi updateDoctorAvatarAPI)
const uploadDoctorAvatarAPI = async (formData) => {
    // Upload file lên storage trước
    const uploadRes = await axios.post("/api/v1/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    const avatarFileName = uploadRes?.data?.fileName || uploadRes?.fileName;

    // Lấy userId từ localStorage
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    
    // Gọi API cập nhật avatar
    await updateDoctorAvatarAPI(user.id, avatarFileName);
    
    return { data: { avatar: avatarFileName } };
};

export { 
    fetchAllDoctorAPI, createNewDoctorAPI, updateDoctorAPI, deleteDoctorAPI, 
    updateDoctorAvatarAPI, fetchDoctorByIdAPI, fetchAllDoctorByHospitalIdAPI,
    getDoctorProfileAPI, updateDoctorProfileAPI, uploadDoctorAvatarAPI // ✅ export mới
};