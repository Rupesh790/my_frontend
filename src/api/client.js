const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export function getApiUrl(path) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${normalized}`;
}

export async function apiFetch(path, options = {}) {
  const { headers = {}, ...rest } = options;

  const response = await fetch(getApiUrl(path), {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });

  const contentType = response.headers.get("content-type");
  const isJson = contentType?.includes("application/json");
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      typeof data === "object" && data !== null
        ? data.detail || data.message || JSON.stringify(data)
        : String(data);
    throw new Error(message || `Request failed (${response.status})`);
  }

  return data;
}

export async function apiGet(path, token) {
  return apiFetch(path, {
    method: "GET",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export async function apiPost(path, body, token) {
  return apiFetch(path, {
    method: "POST",
    body: JSON.stringify(body),
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export async function apiPut(path, body, token) {
  return apiFetch(path, {
    method: "PUT",
    body: JSON.stringify(body),
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export async function apiDelete(path, token) {
  return apiFetch(path, {
    method: "DELETE",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export function getAuthHeaders() {
  const raw = localStorage.getItem("auth_token");
  if (!raw) return {};
  try {
    const token = JSON.parse(raw);
    return token?.access ? { Authorization: `Bearer ${token.access}` } : {};
  } catch {
    return {};
  }
}

export function getAccessToken() {
  const raw = localStorage.getItem("auth_token");
  if (!raw) return null;
  try {
    return JSON.parse(raw)?.access || null;
  } catch {
    return null;
  }
}
