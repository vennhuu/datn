import axios from "./axios.customize";

const createUserAPI = (name , email, password, gender , birthday , address , mobile , about , avatar) => {
    const URL_BACKEND = "/api/v1/users"
    const data = {
        name: name ,
        email: email ,
        password: password,
        gender: gender || null,
        birthday: birthday ,
        address: address ,
        mobile : mobile ,
        about: about , 
        avatar: avatar
    }
    return axios.post(URL_BACKEND,data);
}

const updateUserAPI = (id, name , email, password, gender , birthday , address , mobile , about) => {
    const URL_BACKEND = "/api/v1/users"
    const data = {
        id: id ,
        name: name ,
        email: email ,
        password: password,
        gender: gender,
        birthday: birthday ,
        address: address ,
        mobile : mobile ,
        about: about
    }
    return axios.put(URL_BACKEND,data);
}

const fetchAllUserAPI = (current = 1, pageSize = 5) => {
    const URL_BACKEND = `/api/v1/users?current=${current}&pageSize=${pageSize}`
    return axios.get(URL_BACKEND);
}

const deleteUserAPI = (id) => {
    const URL_BACKEND = `/api/v1/users/${id}`;
    return axios.delete(URL_BACKEND);
}

const updateUserAvatarAPI = (file , folder) => {
    const URL_BACKEND = "/api/v1/files"

    const bodyFormData = new FormData()

    bodyFormData.append("file", file)
    bodyFormData.append("folder", folder)

    return axios.post(URL_BACKEND, bodyFormData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
}

const updateUploadUserAvatarAPI = (id, avatar) => {
    const URL_BACKEND = "/api/v1/users/avatar"

    const params = new URLSearchParams()

    params.append("userId", id)
    params.append("avatar", avatar)

    return axios.put(URL_BACKEND, params)
}

const fetchUserByIdAPI = (id) => {
    return axios.get(`/api/v1/users/${id}`);
}

export { createUserAPI, updateUserAPI, fetchAllUserAPI, deleteUserAPI, 
         updateUserAvatarAPI, updateUploadUserAvatarAPI, fetchUserByIdAPI }