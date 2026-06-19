import { createContext } from "react";
import { getToken } from "../googlelogin/tokenService";

export const AuthContext = createContext(null);

function getInitialLoading() {
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  if (hashParams.get("access_token")) return true;
  return Boolean(getToken()?.access);
}

export function getAuthInitialState() {
  return {
    user: null,
    isLoading: getInitialLoading(),
    error: null,
  };
}
