import axios from "axios";
import Cookies from "js-cookie";
const axiosClient = axios.create({
  baseURL: "",
  headers: {
    "Content-Type": "application/json",
    "X-API-Key": "1df9f9e0",
  },
});
// Add a request interceptor
axiosClient.interceptors.request.use(
  function (config) {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosClient.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
  },
  function (error) {
    if (error.response.status === 401) {
      Cookies.remove("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
