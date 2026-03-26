import axios from "./axios.customize";

const fetchAllHospitalAPI = (current = 1, pageSize = 5) => {
    const URL_BACKEND = `/api/v1/hospitals?current=${current}&pageSize=${pageSize}`
    return axios.get(URL_BACKEND);
}

const createNewHospitalAPI = (name , city, introduction, logo , address , rating ) => {
    const URL_BACKEND = "/api/v1/hospitals"
    const data = {
        name: name ,
        city: city , 
        introduction: introduction ,
        logo: logo ,
        address: address , 
        rating: rating
    }
    return axios.post(URL_BACKEND,data);
}

const deleteHospitalAPI = (id) => {
    const URL_BACKEND = `/api/v1/hospitals/${id}`;
    return axios.delete(URL_BACKEND);
}

const updateHospitalAPI = (id ,name , city, introduction , address , rating) => {
    const URL_BACKEND = "/api/v1/hospitals"
    const data = {
        id: id ,
        name: name ,
        city: city , 
        introduction: introduction ,
        address: address , 
        rating: rating
    }
    return axios.put(URL_BACKEND,data);
}

const updateHospitalAvatarAPI = (file , folder) => {
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

const updateHospitalLogoAPI = (id, logo) => {
    const URL_BACKEND = "/api/v1/hospitals/logo"

    const params = new URLSearchParams()

    params.append("hospitalId", id)
    params.append("logo", logo)

    return axios.put(URL_BACKEND, params)
}
export {fetchAllHospitalAPI , createNewHospitalAPI , deleteHospitalAPI , updateHospitalAPI , updateHospitalAvatarAPI , updateHospitalLogoAPI} ;