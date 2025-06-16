const instance = axios.create({
  baseURL: "https://flary.onrender.com/api",
  withCredentials: true,
});

// Add token from localStorage if exists
const token = localStorage.getItem("authToken");
if (token) {
  instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export default instance;