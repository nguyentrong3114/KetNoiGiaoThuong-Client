/* ============================================================
   API CLIENT – FINAL VERSION FOR LOGIN & REGISTER
============================================================ */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

/* ============================================================
   CORE REQUEST HANDLER
============================================================ */
async function apiRequest(path, { method = "GET", headers = {}, params = {}, body } = {}) {
  const token = localStorage.getItem("access_token");

  const finalHeaders = {
    Accept: "application/json",
    ...headers,
  };

  // Nếu body JSON → add Content-Type
  if (!(body instanceof FormData)) {
    finalHeaders["Content-Type"] = "application/json";
  }

  // Gắn Bearer Token nếu có
  if (token) {
    finalHeaders["Authorization"] = `Bearer ${token}`;
  }

  // Build query string
  const queryString =
    params && Object.keys(params).length ? `?${new URLSearchParams(params).toString()}` : "";

  const res = await fetch(API_BASE_URL + path + queryString, {
    method,
    headers: finalHeaders,
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : null,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Lỗi khi gọi API");
  }

  return data; // BE trả về {status, message, data: {...}}
}

/* ============================================================
   AUTH (LOGIN / REGISTER)
============================================================ */
export const authApi = {
  login: (payload) => apiRequest("/auth/login", { method: "POST", body: payload }),
  register: (payload) => apiRequest("/auth/register", { method: "POST", body: payload }),
  logout: () => apiRequest("/auth/logout", { method: "POST" }),
  me: () => apiRequest("/auth/me"),
};
