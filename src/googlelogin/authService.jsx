import {
  saveToken,
  removeToken,
} from "./tokenService";

const GOOGLELOGIN_API = import.meta.env.VITE_GOOGLELOGIN;

const BLACKLIST_API = import.meta.env.VITE_BLACKLIST;

const REFRESHTOKEN_API = import.meta.env.VITE_REFRESHTOKEN;

export const googleLogin = async (
  accessToken
) => {
  const response = await fetch(
    GOOGLELOGIN_API,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        access_token: accessToken,
      }),
    }
  );

  const data = await response.json();

  if (data.refresh) {
    saveToken(data);
  }

  return data;
};

export const logoutUser = async (
  refreshToken
) => {
  await fetch(BLACKLIST_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refresh: refreshToken,
    }),
  });

  removeToken();
};

export const refreshToken = async (
  token
) => {
  const response = await fetch(
    REFRESHTOKEN_API,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh: token.refresh,
      }),
    }
  );

  return await response.json();
};