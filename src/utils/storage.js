export const setLocalStorage = (key, obj) => {
  localStorage.setItem(key, JSON.stringify(obj));
};

export const getLocalStorage = (key) => {
  const value = localStorage.getItem(key);

  return value ? JSON.parse(value) : null;
};

export const deleteLocalStorage = (key) => {
  localStorage.removeItem(key);
};

export const setSessionStorage = (key, obj) => {
  sessionStorage.setItem(key, JSON.stringify(obj));
};

export const getSessionStorage = (key) => {
  const value = sessionStorage.getItem(key);

  return value ? JSON.parse(value) : null;
};

export const deleteSessionStorage = (key) => {
  sessionStorage.removeItem(key);
};
