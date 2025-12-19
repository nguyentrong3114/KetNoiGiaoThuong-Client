import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { chatApi } from "../../services/apiClient";

const ChatWithShop = ({ product }) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Kiểm tra user đã login chưa
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  // Lấy ID người bán từ product
  // API có thể trả về: user_id, seller_id, shop.user_id, hoặc owner.id
  const sellerId = product?.user_id || product?.seller_id || product?.shop?.user_id || product?.owner?.id;
  // Ưu tiên full_name, fallback về name
  const sellerName = product?.shop?.name || product?.seller?.full_name || product?.seller?.name || product?.owner?.full_name || product?.owner?.name || "Người bán";

  // Debug log
  useEffect(() => {
    console.log("🔍 ChatWithShop - Product:", product);
    console.log("🔍 ChatWithShop - Seller ID:", sellerId);
    console.log("🔍 ChatWithShop - Current User:", user);
  }, [product, sellerId, user]);

  // Nếu chưa login
  if (!user || !token) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-gray-700 mb-3">
          💬 Bạn cần đăng nhập để nhắn tin với cửa hàng
        </p>
        <button
          onClick={() => navigate("/login")}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Đăng nhập ngay
        </button>
      </div>
    );
  }

  // Nếu không tìm được seller ID
  if (!sellerId) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-700">
          ⚠️ Không thể xác định người bán. Vui lòng thử lại sau.
        </p>
      </div>
    );
  }

  // Nếu là chính chủ sản phẩm
  if (user.id === sellerId) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-sm text-gray-600">
          📝 Đây là sản phẩm của bạn
        </p>
      </div>
    );
  }

  const handleSendMessage = async () => {
    if (!message.trim()) {
      setError("Vui lòng nhập tin nhắn!");
      return;
    }

    if (!sellerId) {
      setError("Không thể xác định người bán!");
      return;
    }

    setSending(true);
    setError("");
    setSuccess(false);

    try {
      // Sử dụng đúng field names theo BE: to_user_id, body
      const payload = {
        to_user_id: sellerId, // ID người bán
        body: message.trim(),
        listing_id: product.id, // ID sản phẩm (optional)
      };

      console.log("📤 Sending message to seller:", payload);
      const response = await chatApi.sendMessage(payload);
      console.log("✅ Message sent:", response);
      
      setSuccess(true);
      setMessage("");
      
      // Redirect đến trang chat sau 1.5 giây
      setTimeout(() => {
        navigate(`/chat?user_id=${sellerId}`);
      }, 1500);
    } catch (err) {
      console.error("❌ Send message error:", err);
      setError(err.message || "Không thể gửi tin nhắn. Vui lòng thử lại!");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <div>
          <h3 className="font-bold text-gray-900">💬 Nhắn tin với cửa hàng</h3>
          <p className="text-sm text-gray-600 flex items-center gap-1">
            {sellerName}
            {product?.shop?.is_verified && (
              <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">✓</span>
            )}
          </p>
        </div>
      </div>

      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700 font-medium">
            ✅ Đã gửi tin nhắn! Đang chuyển đến trang chat...
          </p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="space-y-3">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Nhập tin nhắn của bạn..."
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          disabled={sending || success}
        />

        <button
          onClick={handleSendMessage}
          disabled={sending || success || !message.trim()}
          className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 font-medium"
        >
          {sending ? "Đang gửi..." : success ? "✓ Đã gửi" : "📤 Gửi tin nhắn"}
        </button>

        <p className="text-xs text-gray-500 text-center">
          Hoặc{" "}
          <button
            onClick={() => navigate("/chat")}
            className="text-blue-600 hover:underline font-medium"
          >
            mở trang chat
          </button>
        </p>
      </div>
    </div>
  );
};

export default ChatWithShop;
