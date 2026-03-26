import axios from "./axios.customize";


const fetchAllDoctorAPI = (current = 1, pageSize = 5) => {
    const URL_BACKEND = `/api/v1/doctors?current=${current}&pageSize=${pageSize}`
    return axios.get(URL_BACKEND);
}

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
export { fetchAllDoctorAPI , createNewDoctorAPI , updateDoctorAPI , deleteDoctorAPI , updateDoctorAvatarAPI} ;