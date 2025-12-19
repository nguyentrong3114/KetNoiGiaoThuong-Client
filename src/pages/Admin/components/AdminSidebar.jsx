import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  ArrowDownCircle,
  ArrowUpCircle,
  Gavel,
  Package,
  Crown,
  BarChart3,
  ArrowLeft,
  LogOut,
} from "lucide-react";

import "./AdminSidebar.css";

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 🔥 Hàm đăng xuất
  const handleLogout = () => {
    const confirmLogout = window.confirm("Bạn có chắc chắn muốn đăng xuất không?");
    if (!confirmLogout) return;

    localStorage.clear();
    navigate("/login");
    window.location.reload();
  };

  /* ============================
     CẤU HÌNH MENU
  ============================ */
  const menuItems = [
    { path: "/admin/dashboard", label: "Trang chính", icon: LayoutDashboard },
    { path: "/admin/users", label: "Người dùng", icon: Users },
    { path: "/admin/posts", label: "Bài đăng / Quảng cáo", icon: FileText },
    { path: "/admin/transactions", label: "Giao dịch", icon: CreditCard },
    { path: "/admin/wallet-deposits", label: "Duyệt nạp tiền", icon: ArrowDownCircle },
    { path: "/admin/wallet-withdraws", label: "Duyệt rút tiền", icon: ArrowUpCircle },
    { path: "/admin/auction-payments", label: "TT Đấu giá", icon: Gavel },
    { path: "/admin/orders", label: "Đơn hàng", icon: Package },
    { path: "/admin/subscriptions", label: "Gói đăng ký", icon: Crown },
    { path: "/admin/reports", label: "Báo cáo", icon: BarChart3 },
  ];

  return (
    <div className="sidebar">
      {/* 1. LOGO AREA */}
      <div className="logo-container">
        {/* Fallback nếu ảnh lỗi thì hiện khung trắng */}
        <div style={{ background: "rgba(255,255,255,0.2)", padding: "10px", borderRadius: "10px" }}>
          <img
            // Đã đổi đường dẫn để trỏ vào file trong thư mục public
            src="/logo.png"
            alt="Logo"
            className="logo-image"
            onError={(e) => (e.target.style.display = "none")}
          />
        </div>
      </div>

      {/* 2. MENU ITEMS */}
      <nav className="nav-menu">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link key={item.path} to={item.path} className={`nav-item ${isActive ? "active" : ""}`}>
              {/* Icon size 20px để khớp với CSS font-size: 20px cũ */}
              <Icon size={20} />
              <span className="nav-text">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* 3. BOTTOM MENU */}
      <div className="nav-bottom">
        <Link to="/" className="nav-item">
          <ArrowLeft size={20} />
          <span className="nav-text">Về trang chủ</span>
        </Link>

        {/* Dùng div hoặc button nhưng style giống nav-item */}
        <div onClick={handleLogout} className="nav-item" style={{ cursor: "pointer" }}>
          <LogOut size={20} />
          <span className="nav-text">Đăng xuất</span>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
