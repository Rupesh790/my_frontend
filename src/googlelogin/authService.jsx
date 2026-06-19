import { removeToken, saveToken } from "./tokenService";

const GOOGLELOGIN_API = import.meta.env.VITE_GOOGLELOGIN;
const BLACKLIST_API = import.meta.env.VITE_BLACKLIST;
const REFRESHTOKEN_API = import.meta.env.VITE_REFRESHTOKEN;

export async function googleLogin(accessToken) {
  const response = await fetch(GOOGLELOGIN_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ access_token: accessToken }),
  });

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error(`Google login failed (${response.status})`);
  }

  if (!response.ok) {
    const message =
      data.detail ||
      data.non_field_errors?.[0] ||
      data.message ||
      `Google login failed (${response.status})`;
    throw new Error(message);
  }

  if (data.refresh) {
    saveToken(data);
  }

  return data;
}

export async function logoutUser(refreshTokenValue) {
  try {
    await fetch(BLACKLIST_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshTokenValue }),
    });
  } finally {
    removeToken();
  }
}

export async function refreshToken(token) {
  const response = await fetch(REFRESHTOKEN_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: token.refresh }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Token refresh failed");
  }

  return data;
}
