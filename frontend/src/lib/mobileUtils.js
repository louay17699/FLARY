import { axiosInstance } from '../lib/axios';

export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

export const setupMobileAuth = () => {
  if (isMobile()) {
    // Mobile-specific auth setup
    const token = localStorage.getItem("authToken");
    if (token) {
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }
};