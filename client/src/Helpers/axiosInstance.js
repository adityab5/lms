import axios from "axios";

const BASE_URL = "http://localhost:5014/api/v1";

const axiosInstance = axios.create();

axiosInstance.defaults.baseURL = BASE_URL;
axiosInstance.defaults.withCredentials = true;
//we can search for other axios instance defaults on axios documentation like timeout, headers, etc.

export default axiosInstance;
