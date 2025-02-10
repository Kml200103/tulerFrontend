import { createApi } from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";
import apiClient from "../services/loaderApi/loaderApi";

const mutex = new Mutex();

const axiosBaseQuery = async ({ url, method, data, params, headers }) => {
  await mutex.waitForUnlock();

  try {
    const result = await apiClient({
      url,
      method,
      data,
      params,
      headers,
      withCredentials: true, // Include cookies if needed
    });

    return { data: result.data };
  } catch (error) {
    if (error.response?.data?.message === "You are not logged in") {
      if (!mutex.isLocked()) {
        const release = await mutex.acquire();
        try {
          // Attempt to refresh token
          const refreshResult = await apiClient.get("auth/refresh");

          if (refreshResult.data) {
            // Retry the initial query
            return axiosBaseQuery({ url, method, data, params, headers });
          } else {
            window.location.href = "/login";
          }
        } finally {
          release();
        }
      } else {
        await mutex.waitForUnlock();
        return axiosBaseQuery({ url, method, data, params, headers });
      }
    }
    return { error: { status: error.response?.status, data: error.response?.data } };
  }
};

export const BaseService = createApi({
  reducerPath: "baseService",
  baseQuery: axiosBaseQuery,
  endpoints: () => ({}),
});

