// src/redux/store.js
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import loaderReducer from "./loader/loaderSlice";
import { BaseService } from "./reduxQuery";


const appReducer = combineReducers({
  [BaseService.reducerPath]: BaseService.reducer,
  auth: authReducer,
  loader: loaderReducer,
})
const allMiddlewares = [
  BaseService.middleware
]
const store = configureStore({
  reducer: appReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(...allMiddlewares)
});

export default store;
