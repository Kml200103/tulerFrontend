import axios from "axios";
import { apiUrl } from "../../utils/constants";
import { hideLoader, showLoader } from "./loaderService";

const apiClient = axios.create({
  baseURL: apiUrl,
});

let requestCount = 0;

// Request interceptor to show loader
const requestHandler = (request) => {
  if (requestCount === 0) {
    showLoader();
  }
  requestCount++;
  return request;
};

// Response interceptor to hide loader on success
const responseHandler = (response) => {
  requestCount--;
  if (requestCount === 0) {
    hideLoader();
  }
  return response;
};

// Response interceptor to hide loader on error
const errorHandler = (error) => {
  requestCount--;
  if (requestCount === 0) {
    hideLoader();
  }
  return Promise.reject(error);
};

// Register interceptors
apiClient.interceptors.request.use(requestHandler);
apiClient.interceptors.response.use(responseHandler, errorHandler);

export default apiClient;
