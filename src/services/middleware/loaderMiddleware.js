import { hide, show } from "../../redux/loader/loaderSlice";

// redux/middleware/loaderMiddleware.js


export const loaderMiddleware = (storeAPI) => (next) => (action) => {
  if (action.type.endsWith("/pending")) {
    storeAPI.dispatch(show());
  }
  if (action.type.endsWith("/fulfilled") || action.type.endsWith("/rejected")) {
    storeAPI.dispatch(hide());
  }
  return next(action);
};
