import axios from "axios";

const BASE_URL = "https://lms-gw0x.onrender.com/api/v1";

const axiosInstance = axios.create();

axiosInstance.defaults.baseURL = BASE_URL;
axiosInstance.defaults.withCredentials = true;
//we can search for other axios instance defaults on axios documentation like timeout, headers, etc.

export default axiosInstance;
