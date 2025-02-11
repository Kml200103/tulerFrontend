import apiClient from "../loaderApi/loaderApi";

// POST request utility function
export const post = async (endpoint, params, headers = {}) => {
  try {
    const response = await apiClient.post(endpoint, params, { headers });
    return { isSuccess: true, receiveObj: response.data };
  } catch (error) {
    console.error("API call error:", error);
    return {
      isSuccess: false,
      receiveObj: error.response?.data || error.message,
    };
  }
};

// GET request utility function
export const get = async (endpoint, params = {}, headers = {}) => {
  try {
    const response = await apiClient.get(endpoint, {
      params,
      headers,
    });
    return { isSuccess: true, receiveObj: response.data };
  } catch (error) {
    console.error("API call error:", error);
    return {
      isSuccess: false,
      receiveObj: error.response?.data || error.message,
    };
  }
};

// DELETE request utility function
export const del = async (endpoint, params = {}, headers = {}) => {
  try {
    const response = await apiClient.delete(endpoint, {
      data: params,
      headers,
    });
    return { isSuccess: true, receiveObj: response.data };
  } catch (error) {
    console.error("API call error:", error);
    return {
      isSuccess: false,
      receiveObj: error.response?.data || error.message,
    };
  }
};

// PUT request utility function
export const put = async (endpoint, params, headers = {}) => {
  try {
    const response = await apiClient.put(endpoint, params, { headers });
    return { isSuccess: true, receiveObj: response.data };
  } catch (error) {
    console.error("API call error:", error);
    return {
      isSuccess: false,
      receiveObj: error.response?.data || error.message,
    };
  }
};
