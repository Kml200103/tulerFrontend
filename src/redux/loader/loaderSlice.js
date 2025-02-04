// store/loaderSlice.js
import { createSlice } from "@reduxjs/toolkit";

const loaderSlice = createSlice({
  name: "loader",
  initialState: {
    isLoading: false,
  },
  reducers: {
    show: (state) => {
      state.isLoading = true;
    },
    hide: (state) => {
      state.isLoading = false;
    },
  },
});

export const { show, hide } = loaderSlice.actions;
export default loaderSlice.reducer;
