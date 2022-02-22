import { requestOptions } from "../api";

const getToken = () => {
  const tokenString = localStorage.getItem("token");
  const userToken = JSON.parse(tokenString);
  return userToken;
};

const saveToken = (userToken, userData) => {
  localStorage.setItem("token", JSON.stringify(userToken));
  localStorage.setItem("data", JSON.stringify(userData));
};

const logOut = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("data");
  fetch("http://127.0.0.1:8000/api/labs/logout", requestOptions(data, "POST"));
};

async function loginAuth(data) {
  return fetch(
    "http://127.0.0.1:8000/api/labs/login",
    requestOptions(data, "POST")
  ).then((response) => response.json());
}

export { getToken, saveToken, loginAuth, logOut };
