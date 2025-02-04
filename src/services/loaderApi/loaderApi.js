// services/axiosConfig.js
import axios from "axios";

import store from "../../redux/store";
import { show, hide } from "../../redux/loader/loaderSlice";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Your API base URL
});

let requestCount = 0;

// Request interceptor to show loader
const requestHandler = (request) => {
  if (requestCount === 0) {
    store.dispatch(show());
  }
  requestCount++;
  return request;
};

// Response interceptor to hide loader on success
const responseHandler = (response) => {
  requestCount--;
  if (requestCount === 0) {
    store.dispatch(hide()); // Hide loader when all requests are completed
  }
  return response;
};

// Response interceptor to hide loader on error
const errorHandler = (error) => {
  requestCount--;
  if (requestCount === 0) {
    store.dispatch(hide()); // Hide loader on error
  }
  return Promise.reject(error);
};

// Register interceptors
apiClient.interceptors.request.use(requestHandler);
apiClient.interceptors.response.use(responseHandler, errorHandler);

export default apiClient;
