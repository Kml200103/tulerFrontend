import { createSlice } from "@reduxjs/toolkit";



const initialState = {
  user: null,

  isLoggedIn: false,

};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;

      state.isLoggedIn = true;


      // localStorage.setItem("token", action.payload.token);
      // localStorage.setItem("user", JSON.stringify(action.payload.user));
      // localStorage.setItem("userId", action.payload.user.id);
    },
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      localStorage.removeItem("userToken");
     
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
