import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://flary.onrender.com/api",
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});