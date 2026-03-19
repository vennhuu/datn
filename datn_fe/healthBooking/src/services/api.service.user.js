import axios from "./axios.customize";

const createUserAPI = (name , email, password, gender , birthday , address , mobile , about) => {
    const URL_BACKEND = "/api/v1/users"
    const data = {
        name: name ,
        email: email ,
        password: password,
        gender: gender,
        birthday: birthday ,
        address: address ,
        mobile : mobile ,
        about: about
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

export {createUserAPI , updateUserAPI , fetchAllUserAPI , deleteUserAPI}