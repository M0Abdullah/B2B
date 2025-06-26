import loginStore from "@/store/page";
import axios from "axios";
const axiosInstance = axios.create({
  baseURL: "https://smab.pythonanywhere.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a response interceptor to catch 401 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear tokens (optional)
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      loginStore.reset()
      // Redirect to login page
      window.location.href = "/login"; 
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
