// src/redux/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, // Contains user info when logged in
  isLoggedIn: false, // Authentication status
  token: null, // JWT or access token
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
