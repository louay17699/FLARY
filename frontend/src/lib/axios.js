import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://flary.onrender.com/api", // Must match your backend
  withCredentials: true, // Crucial for sending cookies
});