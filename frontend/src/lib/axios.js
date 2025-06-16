import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "https://flary.onrender.com/api",
    withCredentials: true,
})