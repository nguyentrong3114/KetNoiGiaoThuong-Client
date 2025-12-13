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

  // Build query ?key=value (loại bỏ undefined values)
  const cleanParams = {};
  if (params) {
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        cleanParams[key] = params[key];
      }
    });
  }
  
  const queryString =
    Object.keys(cleanParams).length ? `?${new URLSearchParams(cleanParams).toString()}` : "";

  // Fetch (CHẶN COOKIE → KHÔNG CÒN CSRF!)
  const fullUrl = API_BASE_URL + path + queryString;
  console.log(`🌐 API Request: ${method} ${fullUrl}`);
  
  const res = await fetch(fullUrl, {
    method,
    headers: finalHeaders,
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : null,
    credentials: "omit",
  });

  console.log(`📡 API Response Status: ${res.status} ${res.statusText}`);
  
  const data = await res.json().catch(() => ({}));
  console.log(`📦 API Response Data:`, data);

  // Xử lý lỗi 403 Forbidden - User bị banned hoặc inactive
  if (res.status === 403) {
    const errorCode = data.error_code || data.errorCode;
    if (errorCode === 'USER_BANNED' || errorCode === 'USER_INACTIVE') {
      console.error("🚫 Tài khoản bị khóa hoặc vô hiệu hóa!");
      const message = data.message || "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ admin để được hỗ trợ.";
      alert(message);
      // Xóa token và user
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Redirect về trang login
      window.location.href = "/login";
      throw new Error(message);
    }
  }

  // Xử lý lỗi 401 Unauthorized - Token hết hạn hoặc không hợp lệ
  if (res.status === 401) {
    console.error("🔒 Token hết hạn hoặc không hợp lệ! Cần đăng nhập lại.");
    // Xóa token và user cũ
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Redirect về trang login
    window.location.href = "/login";
    throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
  }

  if (!res.ok) {
    // Tạo error object với response data để component có thể xử lý
    const error = new Error(data.message || "Có lỗi xảy ra khi gọi API");
    error.response = {
      status: res.status,
      statusText: res.statusText,
      data: data
    };
    throw error;
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
  me: () => apiRequest("/user"),
  
  // Password Reset
  forgotPassword: (payload) => apiRequest("/auth/forgot-password", { method: "POST", body: payload }),
  resetPassword: (payload) => apiRequest("/auth/reset-password", { method: "POST", body: payload }),
  
  // Email Verification - Backend yêu cầu field 'otp_code'
  verifyEmail: (payload) => {
    const body = {
      email: payload.email,
      otp_code: payload.otp || payload.otp_code,
    };
    console.log("🔑 Verify Email Body:", body);
    return apiRequest("/auth/verify-email", { method: "POST", body });
  },
  resendVerificationOtp: (payload) => apiRequest("/auth/resend-verification-otp", { method: "POST", body: payload }),
};

/* ============================================================
   PROFILE / IDENTITY (CORRECT MATCH WITH BACKEND)
============================================================ */
export const profileApi = {
  getProfile: () => apiRequest("/identity/profile"),
  createEmptyProfile: () => apiRequest("/identity/profile", { method: "PUT", body: {} }),
  updateProfile: (payload) => apiRequest("/identity/profile", { method: "PUT", body: payload }),
  
  // Identity Verification
  getVerifyHistory: () => apiRequest("/identity/verify-history"),
  submitVerifyRequest: (payload) => apiRequest("/identity/verify-request", { method: "POST", body: payload }),
  uploadAvatar: async (file) => {
    const token = localStorage.getItem("token");
    
    console.log("🔍 Upload Avatar Debug:");
    console.log("- File:", file);
    console.log("- File name:", file.name);
    console.log("- File type:", file.type);
    console.log("- File size:", file.size, "bytes", `(${(file.size / 1024).toFixed(2)} KB)`);
    console.log("- Token:", token ? "✓ Có" : "✗ Không có");
    
    // Validation: Max 2MB (backend limit)
    if (file.size > 2 * 1024 * 1024) {
      throw new Error("Kích thước ảnh không được vượt quá 2MB!");
    }
    
    // Validation: Must be image
    if (!file.type.startsWith('image/')) {
      throw new Error("File phải là ảnh!");
    }
    
    // Convert file to Base64
    console.log("📦 Converting to Base64...");
    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    
    console.log("✅ Base64 conversion complete");
    console.log("- Base64 length:", base64.length);
    console.log("- Base64 prefix:", base64.substring(0, 50) + "...");
    
    // Use Base64 endpoint (easier for frontend, no multipart issues)
    const endpoint = `${API_BASE_URL}/user/avatar/base64`;
    console.log(`🚀 Uploading to: ${endpoint}`);
    
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        avatar_base64: base64
      }),
    });
    
    console.log("📡 Response status:", response.status);
    
    const data = await response.json().catch(() => ({}));
    console.log("📦 Response data:", data);
    
    if (!response.ok) {
      console.error("❌ Upload failed:", data);
      throw new Error(data.message || data.error || "Upload avatar failed");
    }
    
    console.log("✅ Upload success!");
    return data;
  },
};

/* ============================================================
   LISTINGS (MATCHING BACKEND API)
============================================================ */
export const listingApi = {
  // GET /listings - Danh sách tin đăng (public, có filter)
  // Query params: page, limit, search, category, shop_id, type, status
  getAll: (params = {}) => apiRequest("/listings", { params }),
  
  // GET /listings/{id} - Chi tiết tin đăng (tăng views_count)
  getById: async (id) => {
    const response = await apiRequest(`/listings/${id}`);
    // Backend trả về { data: {...} }
    return response?.data || response;
  },
  
  // POST /listings - Tạo tin đăng mới (chỉ seller)
  // Required: title, price_cents
  // Optional: slug, description, category, type (sell/buy/service), currency, stock_qty, 
  //           shop_id, images (array URLs), location_text, latitude, longitude, 
  //           meta (JSON), status (draft/published/archived), is_active, is_public
  create: (payload) => apiRequest("/listings", { method: "POST", body: payload }),
  
  // POST /listings - Tạo tin đăng với Idempotency Key (tránh duplicate khi double submit)
  createWithIdempotency: async (payload, idempotencyKey) => {
    const token = localStorage.getItem("token");
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
    
    const response = await fetch(`${API_BASE_URL}/listings`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-Idempotency-Key": idempotencyKey, // Backend sẽ check key này để tránh duplicate
      },
      body: JSON.stringify(payload),
    });
    
    const data = await response.json();
    
    // Xử lý lỗi validation 422
    if (response.status === 422) {
      if (data.errors) {
        const errorMessages = Object.values(data.errors).flat().join(". ");
        throw new Error(errorMessages);
      }
      throw new Error(data.message || "Validation failed");
    }
    
    if (!response.ok) {
      throw new Error(data.message || "Tạo bài đăng thất bại");
    }
    
    return data;
  },
  
  // PUT /listings/{id} - Cập nhật tin đăng (chỉ owner)
  update: (id, payload) => apiRequest(`/listings/${id}`, { method: "PUT", body: payload }),
  
  // DELETE /listings/{id} - Xóa tin đăng (chỉ owner)
  delete: (id) => apiRequest(`/listings/${id}`, { method: "DELETE" }),
  
  // POST /listings/{id}/comments - Gửi bình luận
  postComment: (id, content) => apiRequest(`/listings/${id}/comments`, { 
    method: "POST", 
    body: { content } 
  }),
  
  // POST /listings/{id}/comments - Gửi reply (phản hồi comment)
  postReply: (id, content, parentId) => apiRequest(`/listings/${id}/comments`, { 
    method: "POST", 
    body: { content, parent_id: parentId } 
  }),
  
  // GET /listings/{id}/comments - Lấy danh sách bình luận (có nested replies)
  getComments: (id, page = 1) => apiRequest(`/listings/${id}/comments`, { params: { page } }),
  
  // GET /listings/my - Lấy sản phẩm của seller (có stats + recent_comments)
  getMyListings: (params = {}) => apiRequest("/listings/my", { params }),
  
  // POST /listings/{id}/like - Like sản phẩm
  like: (id) => apiRequest(`/listings/${id}/like`, { method: "POST" }),
  
  // DELETE /listings/{id}/like - Unlike sản phẩm
  unlike: (id) => apiRequest(`/listings/${id}/like`, { method: "DELETE" }),
  
  // POST /listings/{id}/images - Upload nhiều ảnh (file)
  // QUAN TRỌNG: Field name phải là "images[]" (có dấu ngoặc vuông)
  // KHÔNG set Content-Type header - để browser tự set multipart/form-data với boundary
  uploadImages: async (id, files) => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    
    // Thêm nhiều file vào FormData với field name "images[]"
    files.forEach((file, index) => {
      formData.append("images[]", file);
      console.log(`📎 Added file ${index + 1}: ${file.name} (${file.type}, ${(file.size / 1024).toFixed(1)}KB)`);
    });
    
    console.log(`📤 Uploading ${files.length} images to listing ${id}`);
    
    // Debug: Log FormData entries
    for (let pair of formData.entries()) {
      console.log(`📦 FormData: ${pair[0]} = ${pair[1].name || pair[1]}`);
    }
    
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
    
    const response = await fetch(`${API_BASE_URL}/listings/${id}/images`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
        // KHÔNG set Content-Type! Browser sẽ tự set multipart/form-data với boundary
      },
      body: formData,
    });
    
    console.log(`📡 Upload response status: ${response.status}`);
    
    const data = await response.json();
    console.log(`📦 Upload response data:`, data);
    
    if (!response.ok) {
      // Xử lý lỗi chi tiết
      if (response.status === 422 && data.errors) {
        const errorMessages = Object.values(data.errors).flat().join(". ");
        throw new Error(errorMessages);
      }
      throw new Error(data.message || "Upload ảnh thất bại");
    }
    
    return data;
  },
  
  // DELETE /listings/{id}/images/{imageId} - Xóa một ảnh
  deleteImage: (listingId, imageId) => 
    apiRequest(`/listings/${listingId}/images/${imageId}`, { method: "DELETE" }),
  
  // PUT /listings/{id}/images/reorder - Sắp xếp lại thứ tự ảnh
  reorderImages: (id, imageIds) => 
    apiRequest(`/listings/${id}/images/reorder`, { method: "PUT", body: { image_ids: imageIds } }),
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
   DISCOVERY API (TÌM KIẾM CÔNG TY + SẢN PHẨM + QUẢNG CÁO)
============================================================ */
export const discoveryApi = {
  // GET /discovery/search-all - Tìm kiếm tổng hợp (công ty + sản phẩm)
  // Params: query (required), type (all/shops/listings), per_page
  searchAll: (params = {}) => apiRequest("/discovery/search-all", { params }),
  
  // GET /discovery/shops - Danh sách công ty
  // Params: query, verified, sort (latest/rating/products), page, per_page
  getShops: (params = {}) => apiRequest("/discovery/shops", { params }),
  
  // GET /discovery/search - Tìm sản phẩm (có thể filter theo shop_id)
  // Params: query, shop_id, category, sort, page, per_page
  // Response có thêm: has_top_search_promo, promo_position, promotion_id, promotion_type
  // Listings có promotion top_search active sẽ được ưu tiên lên TOP
  searchListings: (params = {}) => apiRequest("/discovery/search", { params }),
  
  // GET /discovery/featured - Lấy danh sách tin nổi bật (quảng cáo)
  // Params: type (featured/homepage_banner/category_banner/all), category, limit (max 50, default 10)
  // Response: { data: [...listings with promotion info], total }
  getFeatured: (params = {}) => apiRequest("/discovery/featured", { params }),
  
  // POST /discovery/promotions/{id}/click - Track click cho quảng cáo
  // Gọi khi user click vào listing có promotion_id
  trackPromotionClick: (promotionId) => apiRequest(`/discovery/promotions/${promotionId}/click`, { method: "POST" }),
};

/* ============================================================
   REVIEWS (MATCHING BACKEND API)
   - Đánh giá sản phẩm sau khi mua hàng (order completed)
   - Rating tự động cập nhật lên Listing và Shop
============================================================ */
export const reviewApi = {
  // GET /reviews - Danh sách đánh giá (public)
  // Params: listing_id, shop_id, rating, verified, with_images, sort_by, sort_order, per_page
  getAll: (params = {}) => apiRequest("/reviews", { params }),
  
  // GET /reviews/summary - Thống kê rating
  // Params: listing_id hoặc shop_id
  getSummary: (params = {}) => apiRequest("/reviews/summary", { params }),
  
  // GET /reviews/my-reviews - Đánh giá của tôi
  getMyReviews: () => apiRequest("/reviews/my-reviews"),
  
  // GET /reviews/{id} - Chi tiết đánh giá
  getById: (id) => apiRequest(`/reviews/${id}`),
  
  // POST /reviews - Tạo đánh giá (buyer, order phải completed)
  // Required: order_id, rating (1-5), comment (min 10 chars)
  // Optional: images (array URLs hoặc FormData)
  create: (payload) => apiRequest("/reviews", { method: "POST", body: payload }),
  
  // PUT /reviews/{id} - Cập nhật đánh giá (chỉ owner)
  update: (id, payload) => apiRequest(`/reviews/${id}`, { method: "PUT", body: payload }),
  
  // DELETE /reviews/{id} - Xóa đánh giá
  delete: (id) => apiRequest(`/reviews/${id}`, { method: "DELETE" }),
  
  // POST /reviews/{id}/helpful - Đánh dấu hữu ích
  markHelpful: (id) => apiRequest(`/reviews/${id}/helpful`, { method: "POST" }),
  
  // DELETE /reviews/{id}/helpful - Bỏ đánh dấu hữu ích
  unmarkHelpful: (id) => apiRequest(`/reviews/${id}/helpful`, { method: "DELETE" }),
  
  // POST /reviews/{id}/reply - Seller phản hồi đánh giá
  reply: (id, replyContent) => apiRequest(`/reviews/${id}/reply`, { method: "POST", body: { reply: replyContent } }),
};

/* ============================================================
   ORDERS (MATCHING BACKEND API)
   - Hỗ trợ sản phẩm vật lý (physical) và số (digital)
   - Thanh toán bằng ví
   - Xác nhận nhận hàng, hoàn tiền
============================================================ */
export const orderApi = {
  // GET /orders - Tất cả đơn hàng (mua + bán)
  getAll: (params = {}) => apiRequest("/orders", { params }),
  
  // GET /orders/my-purchases - Đơn hàng đã mua (buyer)
  getMyPurchases: (params = {}) => apiRequest("/orders/my-purchases", { params }),
  
  // GET /orders/my-sales - Đơn hàng đã bán (seller)
  getMySales: (params = {}) => apiRequest("/orders/my-sales", { params }),
  
  // GET /orders/stats - Thống kê đơn hàng
  getStats: () => apiRequest("/orders/stats"),
  
  // GET /orders/{id} - Chi tiết đơn hàng
  getById: (id) => apiRequest(`/orders/${id}`),
  
  // POST /orders/preview - Xem trước thông tin checkout (không tạo đơn)
  // Required: listing_id, quantity
  // Response: { listing, shop, pricing, wallet_balance, can_checkout, ... }
  preview: (listingId, quantity = 1) => apiRequest("/orders/preview", { 
    method: "POST", 
    body: { listing_id: listingId, quantity } 
  }),
  
  // POST /orders - Tạo đơn hàng (checkout)
  // Required: listing_id, quantity
  // Optional: shipping_address (cho sản phẩm vật lý), note
  create: (payload) => apiRequest("/orders", { method: "POST", body: payload }),
  
  // POST /orders/{id}/pay - Thanh toán bằng ví
  pay: (id) => apiRequest(`/orders/${id}/pay`, { method: "POST" }),
  
  // PUT /orders/{id} - Cập nhật trạng thái (seller)
  // Body: { status, tracking_number }
  update: (id, payload) => apiRequest(`/orders/${id}`, { method: "PUT", body: payload }),
  
  // DELETE /orders/{id} - Hủy đơn hàng
  // Body: { cancel_reason }
  cancel: (id, reason) => apiRequest(`/orders/${id}`, { method: "DELETE", body: { cancel_reason: reason } }),
  
  // PUT /orders/{id}/shipping - Cập nhật thông tin vận chuyển (seller)
  // Body: { shipping_carrier, tracking_number, shipper_name, shipper_phone, estimated_delivery_at, shipping_note }
  // Carriers: ghn, ghtk, viettel_post, jt_express, ninja_van, best_express, shopee_express, grab_express, lalamove, self, other
  updateShipping: (id, payload) => apiRequest(`/orders/${id}/shipping`, { method: "PUT", body: payload }),
  
  // POST /orders/{id}/mark-delivered - Đánh dấu đã giao hàng (seller)
  // Body: { proof_images (optional), note (optional) }
  markDelivered: (id, payload = {}) => apiRequest(`/orders/${id}/mark-delivered`, { method: "POST", body: payload }),
  
  // POST /orders/{id}/confirm-received - Xác nhận đã nhận hàng (buyer)
  // Body: { images (required, min 1), note (optional), condition: good/damaged/missing_items/wrong_item }
  confirmReceived: (id, payload) => apiRequest(`/orders/${id}/confirm-received`, { method: "POST", body: payload }),
  
  // GET /orders/{id}/tracking - Lấy thông tin tracking và lịch sử vận chuyển
  getTracking: (id) => apiRequest(`/orders/${id}/tracking`),
  
  // POST /orders/{id}/request-refund - Yêu cầu hoàn tiền (buyer)
  // Body: { reason, evidence_images }
  requestRefund: (id, reason, evidenceImages = []) => apiRequest(`/orders/${id}/request-refund`, { 
    method: "POST", 
    body: { reason, evidence_images: evidenceImages } 
  }),
};

/* ============================================================
   ADMIN ORDERS (MATCHING BACKEND API)
============================================================ */
export const adminOrderApi = {
  // GET /admin/orders - Danh sách đơn hàng (admin)
  getAll: (params = {}) => apiRequest("/admin/orders", { params }),
  
  // POST /admin/orders/{id}/process-refund - Xử lý hoàn tiền
  // Body: { action: 'approve'|'reject', admin_note }
  processRefund: (id, action, adminNote = "") => apiRequest(`/admin/orders/${id}/process-refund`, { 
    method: "POST", 
    body: { action, admin_note: adminNote } 
  }),
};

/* ============================================================
   CHAT (MATCHING BACKEND API)
============================================================ */
export const chatApi = {
  // GET /chat/conversations - Danh sách cuộc trò chuyện
  // Query params: page, per_page, unread_only
  getConversations: (params = {}) => apiRequest("/chat/conversations", { params }),
  
  // GET /chat/messages/{user_id} - Tin nhắn với một user
  // Query params: page, per_page, listing_id
  getMessages: (userId, params = {}) => apiRequest(`/chat/messages/${userId}`, { params }),
  
  // POST /chat/messages - Gửi tin nhắn
  // Required: to_user_id, body
  // Optional: listing_id
  sendMessage: (payload) => {
    // Backend yêu cầu: to_user_id (không phải receiver_id), body (không phải message)
    const requestBody = {
      to_user_id: payload.to_user_id || payload.receiver_id, // Hỗ trợ cả 2 tên
      body: payload.body || payload.message, // Hỗ trợ cả 2 tên
    };
    
    // Chỉ thêm listing_id nếu có giá trị
    if (payload.listing_id) {
      requestBody.listing_id = payload.listing_id;
    }
    
    console.log("📤 Chat API - sendMessage payload:", requestBody);
    return apiRequest("/chat/messages", { method: "POST", body: requestBody });
  },
  
  // PUT /chat/messages/{user_id}/read - Đánh dấu đã đọc
  markRead: (userId) => apiRequest(`/chat/messages/${userId}/read`, { method: "PUT" }),
};

/* ============================================================
   FAQ (BACKEND ROUTE IS /faqs – FIXED)
============================================================ */
export const faqApi = {
  getFaqs: () => apiRequest("/faqs"),
};

/* ============================================================
   PROMOTION (QUẢNG CÁO SẢN PHẨM - SELLER)
   - Seller tạo yêu cầu quảng cáo cho listing
   - Types: featured, top_search, homepage_banner, category_banner
   - Thanh toán bằng ví hoặc chuyển khoản
============================================================ */
export const promotionApi = {
  // GET /promotion/active - Danh sách quảng cáo đang hoạt động
  active: () => apiRequest("/promotion/active"),
  
  // GET /promotion - Danh sách quảng cáo của seller
  // Params: status (pending/active/paused/completed/cancelled), type, per_page
  getAll: (params = {}) => apiRequest("/promotion", { params }),
  
  // GET /promotion/{id} - Chi tiết quảng cáo
  getById: (id) => apiRequest(`/promotion/${id}`),
  
  // POST /promotion - Tạo yêu cầu quảng cáo mới
  // Required: listing_id, type (featured/top_search/homepage_banner/category_banner)
  // Optional: duration_days (7/14/30), budget, featured_position (1-10)
  create: (payload) => apiRequest("/promotion", { method: "POST", body: payload }),
  
  // PUT /promotion/{id} - Cập nhật quảng cáo (chỉ khi pending)
  update: (id, payload) => apiRequest(`/promotion/${id}`, { method: "PUT", body: payload }),
  
  // DELETE /promotion/{id} - Hủy quảng cáo
  cancel: (id) => apiRequest(`/promotion/${id}`, { method: "DELETE" }),
  
  // POST /promotion/{id}/pause - Tạm dừng quảng cáo
  pause: (id) => apiRequest(`/promotion/${id}/pause`, { method: "POST" }),
  
  // POST /promotion/{id}/resume - Tiếp tục quảng cáo
  resume: (id) => apiRequest(`/promotion/${id}/resume`, { method: "POST" }),
  
  // GET /promotion/pricing - Bảng giá quảng cáo
  getPricing: () => apiRequest("/promotion/pricing"),
  
  // GET /promotion/stats - Thống kê quảng cáo của seller
  getStats: () => apiRequest("/promotion/stats"),
};

/* ============================================================
   ADMIN (MATCHING BACKEND)
============================================================ */
/* ============================================================
   NOTIFICATIONS (MATCHING BACKEND)
   Response format:
   {
     data: [...notifications],
     meta: { current_page, per_page, total, last_page },
     summary: { total_notifications, unread_count }
   }
============================================================ */
export const notificationApi = {
  // GET /notifications - Lấy danh sách thông báo
  // Params: unread_only (boolean), type (string), per_page (int, default 20, max 100)
  getAll: (params = {}) => apiRequest("/notifications", { params }),
  
  // GET /notifications/{id} - Chi tiết 1 thông báo
  getById: (id) => apiRequest(`/notifications/${id}`),
  
  // PUT /notifications/{id}/read - Đánh dấu đã đọc
  markAsRead: (id) => apiRequest(`/notifications/${id}/read`, { method: "PUT" }),
  
  // PUT /notifications/read-all - Đánh dấu tất cả đã đọc
  markAllAsRead: () => apiRequest("/notifications/read-all", { method: "PUT" }),
};

/* ============================================================
   AUCTIONS (MATCHING BACKEND API)
   - Seller tạo đấu giá → status: pending
   - Admin duyệt → status: upcoming/active
   - Chỉ đấu giá đã duyệt mới hiển thị công khai
============================================================ */
export const auctionApi = {
  // GET /auctions - Danh sách đấu giá (public)
  // Query params: status (active/upcoming/ended/cancelled), sort (ending_soon/most_bids/highest_price/newest),
  //               min_price, max_price, category_id, shop_id, per_page
  getAll: (params = {}) => apiRequest("/auctions", { params }),
  
  // GET /auctions/{id} - Chi tiết đấu giá
  getById: (id) => apiRequest(`/auctions/${id}`),
  
  // POST /auctions - Tạo đấu giá mới (chỉ seller)
  // Required: listing_id, starting_price, bid_increment, start_time, end_time
  // Optional: reserve_price, auto_extend, extend_minutes, max_bids_per_user
  create: (payload) => apiRequest("/auctions", { method: "POST", body: payload }),
  
  // PUT /auctions/{id} - Cập nhật đấu giá (chỉ owner, chưa có bid)
  update: (id, payload) => apiRequest(`/auctions/${id}`, { method: "PUT", body: payload }),
  
  // DELETE /auctions/{id} - Xóa đấu giá (chỉ owner, chưa có bid)
  delete: (id) => apiRequest(`/auctions/${id}`, { method: "DELETE" }),
  
  // POST /auctions/{id}/bids - Đặt giá
  // Required: amount (VND, không phải cents)
  placeBid: (id, amount) => apiRequest(`/auctions/${id}/bids`, { method: "POST", body: { amount } }),
  
  // GET /auctions/{id}/bids - Lịch sử đặt giá
  getBids: (id, params = {}) => apiRequest(`/auctions/${id}/bids`, { params }),
  
  // GET /auctions/my-bids - Đấu giá tôi tham gia
  // Query params: status (active/ended), is_winning (true/false), per_page
  getMyBids: (params = {}) => apiRequest("/auctions/my-bids", { params }),
  
  // GET /auctions/my - Đấu giá của tôi (seller)
  getMyAuctions: (params = {}) => apiRequest("/auctions/my", { params }),
};

/* ============================================================
   ADMIN API (MATCHING BACKEND)
   - Tất cả API yêu cầu role: admin
============================================================ */
export const adminApi = {
  // Dashboard - Tổng quan
  getDashboard: () => apiRequest("/admin/dashboard"),
  
  // ===== USERS =====
  getUsers: (params = {}) => apiRequest("/admin/users", { params }),
  getUserDetail: (id) => apiRequest(`/admin/users/${id}`),
  updateUserStatus: (id, status) => apiRequest(`/admin/users/${id}/status`, { method: "PUT", body: { status } }),
  
  // ===== LISTINGS =====
  getListings: (params = {}) => apiRequest("/admin/listings", { params }),
  updateListingStatus: (id, data) => apiRequest(`/admin/listings/${id}/status`, { method: "PUT", body: data }),
  approveListing: (id) => apiRequest(`/admin/listings/${id}/approve`, { method: "PUT" }),
  
  // ===== ORDERS (MỚI) =====
  getOrders: (params = {}) => apiRequest("/admin/orders", { params }),
  getOrderStats: () => apiRequest("/admin/orders/stats"),
  processRefund: (id, action, adminNote = "") => apiRequest(`/admin/orders/${id}/process-refund`, { 
    method: "POST", 
    body: { action, admin_note: adminNote } 
  }),
  
  // ===== PROMOTIONS =====
  getPromotions: (params = {}) => apiRequest("/admin/promotions", { params }),
  getPromotionStats: () => apiRequest("/admin/promotions/stats"),
  approvePromotion: (id) => apiRequest(`/admin/promotions/${id}/approve`, { method: "PUT" }),
  rejectPromotion: (id, reason = "") => apiRequest(`/admin/promotions/${id}/reject`, { method: "PUT", body: { reason } }),
  
  // ===== TRANSACTIONS =====
  getTransactions: (params = {}) => apiRequest("/admin/transactions", { params }),
  getTransactionStats: () => apiRequest("/admin/transactions/stats"),
  
  // ===== REPORTS =====
  getReports: (params = {}) => apiRequest("/admin/reports", { params }),
  getReportStats: () => apiRequest("/admin/reports/stats"),
  resolveReport: (id, data) => apiRequest(`/admin/reports/${id}/resolve`, { method: "PUT", body: data }),
  
  // ===== AUCTIONS =====
  getAuctions: (params = {}) => apiRequest("/admin/auctions", { params }),
  getAuctionStats: () => apiRequest("/admin/auctions/stats"),
  getAuctionPayments: (params = {}) => apiRequest("/admin/auction-payments", { params }),
  confirmAuctionBankTransfer: (id, note = "") => apiRequest(`/admin/auction-payment/${id}/confirm-bank`, { 
    method: "PUT", 
    body: { note } 
  }),
  rejectAuctionBankTransfer: (id, reason = "") => apiRequest(`/admin/auction-payment/${id}/reject-bank`, { 
    method: "PUT", 
    body: { reason } 
  }),
  
  // ===== SHOPS =====
  getShops: (params = {}) => apiRequest("/admin/shops", { params }),
  verifyShop: (id) => apiRequest(`/admin/shops/${id}/verify`, { method: "PUT" }),
  
  // ===== REVENUE (MỚI) =====
  getRevenue: (params = {}) => apiRequest("/admin/revenue", { params }),
  getRevenueStats: () => apiRequest("/admin/revenue/stats"),
  
  // ===== SUBSCRIPTIONS (MỚI) =====
  getSubscriptions: (params = {}) => apiRequest("/admin/subscriptions", { params }),
  getSubscriptionStats: () => apiRequest("/admin/subscriptions/stats"),
  approveSubscription: (id, adminNote = "") => apiRequest(`/admin/subscriptions/${id}/approve`, { 
    method: "PUT", 
    body: { admin_note: adminNote } 
  }),
  rejectSubscription: (id, adminNote = "") => apiRequest(`/admin/subscriptions/${id}/reject`, { 
    method: "PUT", 
    body: { admin_note: adminNote } 
  }),
  
  // ===== IDENTITY VERIFICATION =====
  getVerifyRequests: (params = {}) => apiRequest("/identity/verify-requests", { params }),
  getVerifyRequestDetail: (id) => apiRequest(`/identity/verify-requests/${id}`),
  approveVerifyRequest: (id, payload) => apiRequest(`/identity/verify-request/${id}/approve`, { method: "PUT", body: payload }),
  rejectVerifyRequest: (id, payload) => apiRequest(`/identity/verify-request/${id}/reject`, { method: "PUT", body: payload }),
};

/* ============================================================
   WALLET (MATCHING BACKEND API)
   - Ví điện tử cho user
   - Nạp/rút tiền với QR code VietQR
   - Thanh toán đấu giá
============================================================ */
export const walletApi = {
  // GET /wallet - Lấy thông tin ví
  getWallet: () => apiRequest("/wallet"),
  
  // GET /wallet/transactions - Lịch sử giao dịch
  // Params: type (deposit/withdraw/payment/receive/auction_win/auction_receive), from_date, to_date, per_page
  getTransactions: (params = {}) => apiRequest("/wallet/transactions", { params }),
  
  // POST /wallet/deposit - Tạo yêu cầu nạp tiền (nhận QR code VietQR)
  // Required: amount (min 10000), payment_method (bank_transfer)
  // Response: { deposit_request, payment_info: { qr_url, bank_name, account_number, transfer_content, ... }, instructions }
  deposit: (payload) => apiRequest("/wallet/deposit", { method: "POST", body: payload }),
  
  // POST /wallet/deposit/{id}/confirm - Xác nhận đã chuyển tiền
  // Chuyển status từ pending -> processing
  confirmDeposit: (depositId) => apiRequest(`/wallet/deposit/${depositId}/confirm`, { method: "POST" }),
  
  // GET /wallet/deposit/{id}/status - Kiểm tra trạng thái (polling)
  // Response: { deposit_request: { status, status_label, ... } }
  checkDepositStatus: (depositId) => apiRequest(`/wallet/deposit/${depositId}/status`),
  
  // POST /wallet/withdraw - Rút tiền
  // Required: amount (min 50000), bank_name, bank_account, account_holder
  // Optional: note
  withdraw: (payload) => apiRequest("/wallet/withdraw", { method: "POST", body: payload }),
  
  // POST /wallet/withdraw/calculate-fee - Tính phí rút tiền trước
  // Required: amount
  // Response: { amount, fees: { service_fee, vat_fee, total_fee }, actual_receive, fee_breakdown }
  calculateWithdrawFee: (amount) => apiRequest("/wallet/withdraw/calculate-fee", { method: "POST", body: { amount } }),
  
  // GET /wallet/deposit-requests - Danh sách yêu cầu nạp tiền
  getDepositRequests: (params = {}) => apiRequest("/wallet/deposit-requests", { params }),
  
  // GET /wallet/withdraw-requests - Danh sách yêu cầu rút tiền
  getWithdrawRequests: (params = {}) => apiRequest("/wallet/withdraw-requests", { params }),
  
  // GET /wallet/auction-payments - Danh sách thanh toán đấu giá
  // Params: status (pending/paid/transferred/expired), role (buyer/seller)
  getAuctionPayments: (params = {}) => apiRequest("/wallet/auction-payments", { params }),
  
  // GET /wallet/auction-payment/{id} - Chi tiết thanh toán đấu giá
  // Response: { payment, auction, listing, winner, seller, can_pay, payment_methods, shipping_info (if paid) }
  getAuctionPaymentDetail: (id) => apiRequest(`/wallet/auction-payment/${id}`),
  
  // POST /wallet/auction-payment/{id} - Thanh toán bằng ví
  // Required: shipping_name, shipping_phone, shipping_address
  // Optional: shipping_note
  payAuctionByWallet: (id, shippingInfo) => apiRequest(`/wallet/auction-payment/${id}`, { 
    method: "POST", 
    body: shippingInfo 
  }),
  
  // POST /wallet/auction-payment/{id}/bank-transfer - Thanh toán bằng chuyển khoản
  // Required: shipping_name, shipping_phone, shipping_address
  // Optional: shipping_note
  // Response: { payment, bank_info: { qr_url, bank_name, account_number, transfer_content, ... } }
  payAuctionByBankTransfer: (id, shippingInfo) => apiRequest(`/wallet/auction-payment/${id}/bank-transfer`, { 
    method: "POST", 
    body: shippingInfo 
  }),
};

/* ============================================================
   ADMIN WALLET (MATCHING BACKEND API)
   - Admin duyệt nạp/rút tiền
============================================================ */
export const adminWalletApi = {
  // ===== DEPOSITS =====
  getDeposits: (params = {}) => apiRequest("/admin/wallet/deposits", { params }),
  approveDeposit: (id, payload = {}) => apiRequest(`/admin/wallet/deposit/${id}/approve`, { method: "PUT", body: payload }),
  rejectDeposit: (id, payload = {}) => apiRequest(`/admin/wallet/deposit/${id}/reject`, { method: "PUT", body: payload }),
  
  // ===== WITHDRAWS =====
  getWithdraws: (params = {}) => apiRequest("/admin/wallet/withdraws", { params }),
  processWithdraw: (id) => apiRequest(`/admin/wallet/withdraw/${id}/process`, { method: "PUT" }),
  rejectWithdraw: (id, payload = {}) => apiRequest(`/admin/wallet/withdraw/${id}/reject`, { method: "PUT", body: payload }),
  
  // ===== AUCTION PAYMENTS =====
  // PUT /admin/auction-payment/{id}/confirm-bank - Xác nhận chuyển khoản đấu giá
  confirmAuctionBankTransfer: (id, note = "") => apiRequest(`/admin/auction-payment/${id}/confirm-bank`, { 
    method: "PUT", 
    body: { note } 
  }),
  
  // PUT /admin/auction-payment/{id}/reject-bank - Từ chối chuyển khoản đấu giá
  rejectAuctionBankTransfer: (id, reason = "") => apiRequest(`/admin/auction-payment/${id}/reject-bank`, { 
    method: "PUT", 
    body: { reason } 
  }),
};


/* ============================================================
   SUBSCRIPTION API (GÓI ĐĂNG KÝ CHO SELLER)
   - Xem danh sách gói
   - Đăng ký gói
   - Xác nhận chuyển khoản
   - Xem gói hiện tại
============================================================ */
export const subscriptionApi = {
  // GET /subscriptions/plans - Danh sách gói (public)
  getPlans: () => apiRequest("/subscriptions/plans"),
  
  // GET /subscriptions/current - Gói hiện tại của user
  getCurrent: () => apiRequest("/subscriptions/current"),
  
  // GET /subscriptions/history - Lịch sử đăng ký
  getHistory: (params = {}) => apiRequest("/subscriptions/history", { params }),
  
  // POST /subscriptions - Đăng ký gói mới
  // Required: plan_id, payment_method (bank_transfer/wallet), duration_months (1/3/6/12)
  subscribe: (payload) => apiRequest("/subscriptions", { method: "POST", body: payload }),
  
  // POST /subscriptions/{id}/confirm-transfer - Xác nhận đã chuyển khoản
  // Optional: payment_proof (URL ảnh chứng từ)
  confirmTransfer: (id, paymentProof = null) => apiRequest(`/subscriptions/${id}/confirm-transfer`, { 
    method: "POST", 
    body: paymentProof ? { payment_proof: paymentProof } : {} 
  }),
  
  // DELETE /subscriptions/{id}/cancel - Hủy gói
  cancel: (id) => apiRequest(`/subscriptions/${id}/cancel`, { method: "DELETE" }),
};

/* ============================================================
   ADMIN SUBSCRIPTION API
============================================================ */
export const adminSubscriptionApi = {
  // GET /admin/subscriptions - Danh sách đăng ký
  // Params: status (pending/processing/active/rejected), per_page
  getAll: (params = {}) => apiRequest("/admin/subscriptions", { params }),
  
  // GET /admin/subscriptions/stats - Thống kê
  getStats: () => apiRequest("/admin/subscriptions/stats"),
  
  // PUT /admin/subscriptions/{id}/approve - Duyệt đăng ký
  approve: (id, adminNote = "") => apiRequest(`/admin/subscriptions/${id}/approve`, { 
    method: "PUT", 
    body: { admin_note: adminNote } 
  }),
  
  // PUT /admin/subscriptions/{id}/reject - Từ chối đăng ký
  reject: (id, adminNote = "") => apiRequest(`/admin/subscriptions/${id}/reject`, { 
    method: "PUT", 
    body: { admin_note: adminNote } 
  }),
};
