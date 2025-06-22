import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://smab.pythonanywhere.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
