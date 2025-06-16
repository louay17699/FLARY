const instance = axios.create({
  baseURL: "https://flary.onrender.com/api",
  withCredentials: true,
});

// Interceptor to handle token from both cookie and localStorage
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor to handle 401 errors and retry
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Try to refresh token or get new one
        const token = localStorage.getItem("authToken");
        if (token) {
          return instance(originalRequest);
        }
      } catch (e) {
        console.log("Refresh token failed", e);
      }
    }
    return Promise.reject(error);
  }
);

export default instance;