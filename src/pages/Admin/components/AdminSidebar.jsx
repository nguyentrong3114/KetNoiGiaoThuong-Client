import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./AdminSidebar.css";

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 🔥 Hàm đăng xuất có xác nhận
  const handleLogout = () => {
    const confirmLogout = window.confirm("Bạn có chắc chắn muốn đăng xuất không?");
    if (!confirmLogout) return;

    // Xóa token + user + refresh token
    localStorage.clear();

    // Chuyển về trang Login
    navigate("/login");

    // Force reload để Navbar trở lại chế độ chưa login
    window.location.reload();
  };

  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="logo-container">
        <img src="../src/assets/images/logo.png" alt="Logo" className="logo-image" />
      </div>

      {/* Menu */}
      <nav className="nav-menu">
        <Link
          to="/admin/dashboard"
          className={`nav-item ${location.pathname === "/admin/dashboard" ? "active" : ""}`}
        >
          <i className="bi bi-house-door"></i>
          <span className="nav-text">Trang chính</span>
        </Link>

        <Link
          to="/admin/users"
          className={`nav-item ${location.pathname === "/admin/users" ? "active" : ""}`}
        >
          <i className="bi bi-people"></i>
          <span className="nav-text">Người dùng</span>
        </Link>

        <Link
          to="/admin/posts"
          className={`nav-item ${location.pathname === "/admin/posts" ? "active" : ""}`}
        >
          <i className="bi bi-graph-up"></i>
          <span className="nav-text">Bài đăng / Quảng cáo</span>
        </Link>

        <Link
          to="/admin/transactions"
          className={`nav-item ${location.pathname === "/admin/transactions" ? "active" : ""}`}
        >
          <i className="bi bi-credit-card"></i>
          <span className="nav-text">Giao dịch</span>
        </Link>

        <Link
          to="/admin/reports"
          className={`nav-item ${location.pathname === "/admin/reports" ? "active" : ""}`}
        >
          <i className="bi bi-bar-chart"></i>
          <span className="nav-text">Báo cáo</span>
        </Link>
      </nav>

      {/* Bottom Menu */}
      <div className="nav-bottom">
        <button onClick={handleLogout} className="nav-item nav-button">
          <i className="bi bi-box-arrow-right"></i>
          <span className="nav-text">Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
