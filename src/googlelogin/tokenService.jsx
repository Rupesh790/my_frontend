export const getToken = () => {
  return JSON.parse(localStorage.getItem("auth_token"));
};

export const saveToken = (token) => {
  localStorage.setItem(
    "auth_token",
    JSON.stringify(token)
  );
};

export const removeToken = () => {
  localStorage.removeItem("auth_token");
};