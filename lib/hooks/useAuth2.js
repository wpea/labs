import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { requestOptions } from "../api";

export const useAuth2 = ({ middleware, redirectIfAuthenticated } = {}) => {
  const router = useRouter();
  const [token, setToken] = useState(null);
  // const [tokenr, setTokenr] = useState(null);

  useEffect(() => {
    if (middleware === "auth") {
      // check if token exists
      if (!localStorage.getItem("token")) return router.push("/login");
      const t = localStorage.getItem("token");
      setToken(t);
    }
  }, []);

  // useEffect(() => {
  //   const tokenString = localStorage.getItem("token");
  //   const userToken = JSON.parse(tokenString);
  //   return userToken;
  // }, [])

  const { user } = () => {};

  const login = () => {};

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("data");

    // delete data from db
    // fetch(
    //   "http://127.0.0.1:8000/api/labs/logout",
    //   requestOptions(data, "POST")
    // );

    //redirect to login page
    router.push("/login");
  };

  return { token, user, login, logout };
};

export const getToken = () => {
  const tokenString = localStorage.getItem("token");
  const userToken = JSON.parse(tokenString);
  return userToken;
};
