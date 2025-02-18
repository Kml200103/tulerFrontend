import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./auth/authSlice";
import loaderReducer from "./loader/loaderSlice";
import searchReducer from "./search/searchSlice";
import { BaseService } from "./reduxQuery";

import { loaderMiddleware } from "../services/middleware/loaderMiddleware";
import { setStore } from "../services/loaderApi/loaderService";

// Persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  loader: loaderReducer,
  search: searchReducer,
  [BaseService.reducerPath]: BaseService.reducer,
});

// Persist reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      BaseService.middleware,
      loaderMiddleware
    ),
});

// Set store in loaderService to avoid direct import
setStore(store);

// Persistor
export const persistor = persistStore(store);
