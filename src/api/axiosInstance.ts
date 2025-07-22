import loginStore from "@/store/page";
import axios from "axios";
const axiosInstance = axios.create({
  baseURL: "https://smab.pythonanywhere.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      loginStore.reset()
      window.location.href = "/login"; 
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
