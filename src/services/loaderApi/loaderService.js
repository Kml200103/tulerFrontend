import { show,hide } from "../../redux/loader/loaderSlice";


let storeInstance = null;

export const setStore = (store) => {
  storeInstance = store;
};

export const showLoader = () => {
  if (storeInstance) {
    storeInstance.dispatch(show());
  }
};

export const hideLoader = () => {
  if (storeInstance) {
    storeInstance.dispatch(hide());
  }
};
