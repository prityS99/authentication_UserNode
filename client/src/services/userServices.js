import axios from "axios"

const  API = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api/v1"
})


export const getUsers = () => API.get("/users");
export const login = (data) => API.post("/login", data);
export const register = (id, data) => API.post("/register", data)
export const updateProfileImage = (id) => API.put(`/users/update-profile-image/${id}`);
export const  blog = (id) => API.get('/blog', data)

