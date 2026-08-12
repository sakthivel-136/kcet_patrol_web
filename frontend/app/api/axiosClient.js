import axios from "axios";
import { getApiUrl } from "../utils/apiUrl";

/* ================= CONFIG ================= */

const BASE_URL = getApiUrl();

/* ================= CLIENT ================= */

const axiosClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ================= REQUEST INTERCEPTOR ================= */

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ================= RESPONSE INTERCEPTOR ================= */

axiosClient.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized - redirecting to login");

      localStorage.removeItem("access_token");

      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
