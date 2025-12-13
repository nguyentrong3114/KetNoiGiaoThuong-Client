import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Check, CheckCheck, Trash2, RefreshCw, Filter } from "lucide-react";
import { notificationApi } from "../../services/apiClient";

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ total_notifications: 0, unread_count: 0 });
  const [filter, setFilter] = useState("all"); // all, unread

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    loadNotifications();
  }, [filter]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const params = { per_page: 50 };
      if (filter === "unread") {
        params.unread_only = true;
      }

      console.log("📬 Loading notifications with params:", params);
      const response = await notificationApi.getAll(params);
      console.log("📬 Notifications response:", response);

      setNotifications(response?.data || []);
      setSummary(response?.summary || { total_notifications: 0, unread_count: 0 });
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
      setSummary((prev) => ({ ...prev, unread_count: Math.max(0, prev.unread_count - 1) }));
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setSummary((prev) => ({ ...prev, unread_count: 0 }));
    } catch (error) {
      console.error("Error:", error);
    }
  };


  // Icon theo type
  const getIcon = (type) => {
    const icons = {
      wallet: "💰",
      deposit: "💵",
      withdraw: "💸",
      order: "📦",
      listing: "📝",
      auction: "🔨",
      auction_payment: "🏷️",
      review: "⭐",
      chat: "💬",
      system: "🔔",
    };
    return icons[type] || "🔔";
  };

  // Format time
  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = (now - date) / 1000; // seconds

    if (diff < 60) return "Vừa xong";
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} ngày trước`;
    return date.toLocaleDateString("vi-VN");
  };

  // Navigate based on notification type
  // MAPPING THEO HƯỚNG DẪN BE:
  // | Type       | action_url (từ API)  | FE Route              |
  // |------------|----------------------|-----------------------|
  // | order      | /orders/{id}         | /orders/:id           |
  // | listing    | /listings/{id}       | /listings/:id         |
  // | shop       | /shops/{id}          | /shops/:id            |
  // | promotion  | /promotion/{id}      | /promotion/:id        |
  // | wallet     | /wallet              | /wallet               |
  // | auction    | /auctions/{id}       | /auction/:id          |
  // | system     | null                 | /notifications        |
  const handleNotificationClick = async (notif) => {
    // Mark as read first
    if (!notif.is_read) {
      await handleMarkAsRead(notif.id);
    }

    // Parse data nếu cần
    let parsedData = {};
    try {
      parsedData = typeof notif.data === "string" ? JSON.parse(notif.data) : (notif.data || {});
    } catch (e) {
      parsedData = {};
    }

    // Admin navigation
    if (isAdmin) {
      const type = notif.type;
      const title = notif.title || "";
      
      if (type === "wallet") {
        if (title.includes("nạp tiền") || title.includes("nap tien") || parsedData.deposit_request_id) {
          navigate("/admin/wallet-deposits");
        } else if (title.includes("rút tiền") || title.includes("rut tien") || parsedData.withdraw_request_id) {
          navigate("/admin/wallet-withdraws");
        } else {
          navigate("/admin/wallet-deposits");
        }
      } else if (type === "listing") {
        navigate("/admin/posts");
      } else if (type === "order") {
        navigate("/admin/orders");
      } else if (type === "verification") {
        navigate("/admin/users");
      } else if (type === "shop") {
        navigate("/admin/users");
      } else if (type === "auction" || type === "auction_payment") {
        navigate("/admin/auction-payments");
      } else {
        navigate("/admin/dashboard");
      }
      return;
    }

    // User navigation - ƯU TIÊN action_url từ BE
    if (notif.action_url) {
      // Chuyển đổi action_url từ BE sang FE route
      let targetUrl = notif.action_url;
      
      // Xử lý auction: BE trả /auctions/{id}, FE dùng /auction/{id}
      if (targetUrl.startsWith("/auctions/")) {
        targetUrl = targetUrl.replace("/auctions/", "/auction/");
      }
      
      // Xử lý shops: BE trả /shops/{id}, FE dùng /shops/:shopId
      // Route đã đúng, không cần chuyển đổi
      
      console.log("📍 Navigating to:", targetUrl);
      navigate(targetUrl);
      return;
    }

    // Fallback: Tạo URL từ type và data
    const type = notif.type;
    switch (type) {
      case "order":
        if (parsedData.order_id) {
          navigate(`/orders/${parsedData.order_id}`);
        } else {
          navigate("/my-orders");
        }
        break;
      case "listing":
        if (parsedData.listing_id) {
          navigate(`/listings/${parsedData.listing_id}`);
        } else {
          navigate("/dashboard/company");
        }
        break;
      case "shop":
        if (parsedData.shop_id) {
          navigate(`/shops/${parsedData.shop_id}`);
        } else {
          navigate("/dashboard/company");
        }
        break;
      case "promotion":
        if (parsedData.promotion_id) {
          navigate(`/promotion/${parsedData.promotion_id}`);
        } else {
          navigate("/dashboard/company");
        }
        break;
      case "wallet":
      case "deposit":
      case "withdraw":
        navigate("/wallet");
        break;
      case "auction":
        if (parsedData.auction_id) {
          navigate(`/auction/${parsedData.auction_id}`);
        } else {
          navigate("/auctions");
        }
        break;
      case "auction_payment":
        navigate("/wallet/auction-payments");
        break;
      case "chat":
      case "message":
        if (parsedData.user_id) {
          navigate(`/chat?user=${parsedData.user_id}`);
        } else {
          navigate("/chat");
        }
        break;
      case "review":
        if (parsedData.review_id) {
          navigate(`/reviews/${parsedData.review_id}`);
        } else {
          navigate("/my-orders");
        }
        break;
      default:
        // Stay on notifications page
        break;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Bell className="text-indigo-600" size={28} />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Thông báo</h1>
            <p className="text-gray-500 text-sm">
              {summary.unread_count > 0
                ? `Bạn có ${summary.unread_count} thông báo chưa đọc`
                : "Tất cả thông báo đã được đọc"}
            </p>
          </div>
        </div>
        <button
          onClick={loadNotifications}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
          title="Làm mới"
        >
          <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Filters & Actions */}
      <div className="flex items-center justify-between mb-6 bg-white rounded-xl p-4 shadow-sm">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === "all" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Tất cả ({summary.total_notifications})
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === "unread" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Chưa đọc ({summary.unread_count})
          </button>
        </div>

        {summary.unread_count > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
          >
            <CheckCheck size={18} />
            Đánh dấu tất cả đã đọc
          </button>
        )}
      </div>


      {/* Notification List */}
      {notifications.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-sm">
          <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            {filter === "unread" ? "Không có thông báo chưa đọc" : "Chưa có thông báo nào"}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden divide-y divide-gray-100">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleNotificationClick(notif)}
              className={`flex items-start gap-4 p-4 cursor-pointer transition hover:bg-gray-50 ${
                !notif.is_read ? "bg-blue-50" : ""
              }`}
            >
              {/* Icon */}
              <div className="flex-shrink-0 text-3xl">{getIcon(notif.type)}</div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className={`text-base ${!notif.is_read ? "font-semibold" : "font-medium"} text-gray-900`}>
                    {notif.title}
                  </h3>
                  {!notif.is_read && <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></span>}
                </div>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{notif.message}</p>
                <p className="text-xs text-gray-400 mt-2">{formatTime(notif.created_at)}</p>
              </div>

              {/* Actions */}
              <div className="flex-shrink-0 flex items-center gap-2">
                {!notif.is_read && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkAsRead(notif.id);
                    }}
                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
                    title="Đánh dấu đã đọc"
                  >
                    <Check size={18} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
