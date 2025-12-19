import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { notificationApi } from "../../services/apiClient";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user?.role === "admin";

  // Fetch notifications từ API
  // Response: { data: [...], meta: {...}, summary: { total_notifications, unread_count } }
  const fetchNotifications = async () => {
    if (!token) return;
    
    try {
      const response = await notificationApi.getAll({ per_page: 20 });
      console.log("📬 Notifications response:", response);
      
      if (response?.data) {
        setNotifications(response.data);
        // Sử dụng unread_count từ summary của backend
        setUnreadCount(response.summary?.unread_count || 0);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    // Polling mỗi 30 giây
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [token]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // MAPPING THEO HƯỚNG DẪN BE:
  // | Type       | action_url (từ API)  | FE Route              |
  // |------------|----------------------|-----------------------|
  // | order      | /orders/{id}         | /orders/:id           |
  // | listing    | /listings/{id}       | /listings/:id         |
  // | shop       | /shops/{id}          | /shops/:shopId        |
  // | promotion  | /promotion/{id}      | /promotion/:id        |
  // | wallet     | /wallet              | /wallet               |
  // | auction    | /auctions/{id}       | /auction/:id          |
  // | system     | null                 | /notifications        |
  const handleNotificationClick = async (notification) => {
    // Mark as read
    if (!notification.is_read) {
      try {
        await notificationApi.markAsRead(notification.id);
        setUnreadCount((prev) => Math.max(0, prev - 1));
        setNotifications((prev) =>
          prev.map((n) => (n.id === notification.id ? { ...n, is_read: true } : n))
        );
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    }

    setIsOpen(false);

    // Parse data nếu cần
    let parsedData = {};
    try {
      parsedData = typeof notification.data === "string" 
        ? JSON.parse(notification.data) 
        : (notification.data || {});
    } catch (e) {
      parsedData = {};
    }

    const type = notification.type;
    const title = notification.title || "";

    // Admin navigation
    if (isAdmin) {
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
    if (notification.action_url) {
      let targetUrl = notification.action_url;
      
      // Chuyển đổi auction: BE trả /auctions/{id}, FE dùng /auction/{id}
      if (targetUrl.startsWith("/auctions/")) {
        targetUrl = targetUrl.replace("/auctions/", "/auction/");
      }
      
      console.log("📍 Navigating to:", targetUrl);
      navigate(targetUrl);
      return;
    }

    // Fallback: Tạo URL từ type và data
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
      default:
        navigate("/notifications");
        break;
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  // Icon dựa trên type và action từ notification.data
  const getIcon = (notification) => {
    const type = notification.type;
    const action = notification.data?.action;
    
    if (action === "comment") return "💬";
    if (action === "like") return "❤️";
    if (type === "order") return "📦";
    if (type === "listing") return "📝";
    if (type === "review") return "⭐";
    if (type === "system") return "🔔";
    // Wallet notifications
    if (type === "wallet") return "💰";
    if (type === "deposit") return "💵";
    if (type === "withdraw") return "💸";
    if (type === "auction_payment") return "🏷️";
    if (type === "auction") return "🔨";
    return "🔔";
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return "Vừa xong";
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    return date.toLocaleDateString("vi-VN");
  };

  if (!token) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        
        {/* Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>


      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b">
            <h3 className="font-semibold text-gray-800">Thông báo</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-blue-600 hover:underline"
              >
                Đánh dấu tất cả đã đọc
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <span className="text-3xl">🔔</span>
                <p className="mt-2 text-sm">Chưa có thông báo nào</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`flex gap-3 p-4 border-b cursor-pointer hover:bg-gray-50 transition ${
                    !notification.is_read ? "bg-blue-50" : ""
                  }`}
                >
                  {/* Icon */}
                  <div className="flex-shrink-0 text-2xl">
                    {getIcon(notification)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!notification.is_read ? "font-semibold" : ""} text-gray-900`}>
                      {notification.title}
                    </p>
                    <p className="text-xs text-gray-600 line-clamp-2 mt-0.5">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatTime(notification.created_at)}
                    </p>
                  </div>

                  {/* Unread dot */}
                  {!notification.is_read && (
                    <div className="flex-shrink-0">
                      <span className="w-2 h-2 bg-blue-500 rounded-full block"></span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 bg-gray-50 border-t text-center">
              <button
                onClick={() => {
                  navigate("/notifications");
                  setIsOpen(false);
                }}
                className="text-sm text-blue-600 hover:underline"
              >
                Xem tất cả thông báo
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
