/* ============================================================
   API CLIENT – FINAL PRODUCTION VERSION (MATCH BACKEND)
============================================================ */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

/* ============================================================
   CORE REQUEST HANDLER (NO CSRF – JWT ONLY)
============================================================ */
async function apiRequest(path, { method = "GET", headers = {}, params = {}, body } = {}) {
  const token = localStorage.getItem("token");

  const finalHeaders = {
    Accept: "application/json",
    ...headers,
  };

  // Nếu là JSON thì set Content-Type
  if (!(body instanceof FormData)) {
    finalHeaders["Content-Type"] = "application/json";
  }

  // Gắn Bearer Token nếu có
  if (token) {
    finalHeaders["Authorization"] = `Bearer ${token}`;
  }

  // Build query ?key=value
  const queryString =
    params && Object.keys(params).length ? `?${new URLSearchParams(params).toString()}` : "";

  // Fetch (CHẶN COOKIE → KHÔNG CÒN CSRF!)
  const res = await fetch(API_BASE_URL + path + queryString, {
    method,
    headers: finalHeaders,
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : null,
    credentials: "omit",
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Có lỗi xảy ra khi gọi API");
  }

  return data;
}

/* ============================================================
   AUTH API
============================================================ */
export const authApi = {
  login: (payload) => apiRequest("/auth/login", { method: "POST", body: payload }),
  register: (payload) => apiRequest("/auth/register", { method: "POST", body: payload }),
  logout: () => apiRequest("/auth/logout", { method: "POST" }),
  me: () => apiRequest("/auth/me"),
};

/* ============================================================
   PROFILE / IDENTITY (CORRECT MATCH WITH BACKEND)
============================================================ */
export const profileApi = {
  getProfile: () => apiRequest("/identity/profile"),
  createEmptyProfile: () => apiRequest("/identity/profile", { method: "PUT", body: {} }),
};

/* ============================================================
   LISTINGS (MATCHING BACKEND)
============================================================ */
export const listingApi = {
  getAll: (params = {}) => apiRequest("/listings", { params }),
  getById: (id) => apiRequest(`/listings/${id}`),
  create: (payload) => apiRequest("/listings", { method: "POST", body: payload }),
  update: (id, payload) => apiRequest(`/listings/${id}`, { method: "PUT", body: payload }),
  delete: (id) => apiRequest(`/listings/${id}`, { method: "DELETE" }),
};

/* ============================================================
   CATEGORIES (MATCHING BACKEND)
============================================================ */
export const categoryApi = {
  getAll: () => apiRequest("/categories"),
  simpleList: () => apiRequest("/categories/simple-list"),
};

/* ============================================================
   SHOPS (BACKEND KHÔNG CÓ stores — FE SAI!)
============================================================ */
export const shopApi = {
  getAll: () => apiRequest("/shops"),
  getById: (id) => apiRequest(`/shops/${id}`),
  create: (payload) => apiRequest("/shops", { method: "POST", body: payload }),
  update: (id, payload) => apiRequest(`/shops/${id}`, { method: "PUT", body: payload }),
};

/* ============================================================
   REVIEWS (CORRECTED!)
============================================================ */
export const reviewApi = {
  getAll: () => apiRequest("/reviews"), // GET
  getById: (id) => apiRequest(`/reviews/${id}`), // GET
  create: (payload) => apiRequest("/reviews", { method: "POST", body: payload }), // POST
  update: (id, payload) => apiRequest(`/reviews/${id}`, { method: "PUT", body: payload }),
};

/* ============================================================
   ORDERS (BACKEND DOES NOT HAVE /orders/me → REMOVED)
============================================================ */
export const orderApi = {
  getAll: () => apiRequest("/orders"),
  getById: (id) => apiRequest(`/orders/${id}`),
  create: (payload) => apiRequest("/orders", { method: "POST", body: payload }),
};

/* ============================================================
   CHAT (FIXED TO MATCH BACKEND)
============================================================ */
export const chatApi = {
  getConversations: () => apiRequest("/chat/conversations"),
  getMessages: (userId) => apiRequest(`/chat/messages/${userId}`),
  sendMessage: (payload) => apiRequest("/chat/messages", { method: "POST", body: payload }),
  markRead: (userId) => apiRequest(`/chat/messages/${userId}/read`, { method: "PUT" }),
};

/* ============================================================
   FAQ (BACKEND ROUTE IS /faqs – FIXED)
============================================================ */
export const faqApi = {
  getFaqs: () => apiRequest("/faqs"),
};

/* ============================================================
   PROMOTION (MATCHING BACKEND)
============================================================ */
export const promotionApi = {
  active: () => apiRequest("/promotion/active"),
  create: (payload) => apiRequest("/promotion", { method: "POST", body: payload }),
};

/* ============================================================
   ADMIN (MATCHING BACKEND)
============================================================ */
export const adminApi = {
  getUsers: (params) => apiRequest("/admin/users", { params }),
  approveListing: (id) => apiRequest(`/admin/listings/${id}/approve`, { method: "PUT" }),
};
