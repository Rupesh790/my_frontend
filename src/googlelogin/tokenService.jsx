export function getToken() {
  const raw = localStorage.getItem("auth_token");
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem("auth_token");
    return null;
  }
}

export function saveToken(token) {
  localStorage.setItem("auth_token", JSON.stringify(token));
}

export function removeToken() {
  localStorage.removeItem("auth_token");
}

export function isAuthenticated() {
  const token = getToken();
  return Boolean(token?.access);
}
