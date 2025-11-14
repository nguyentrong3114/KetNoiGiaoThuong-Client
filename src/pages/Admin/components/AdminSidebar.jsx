import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./AdminSidebar.css";

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 🔥 Hàm logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="logo-container">
        <img src="../src/assets/images/logo.png" alt="GoPro Logo" className="logo-image" />
      </div>

      {/* Menu */}
      <nav className="nav-menu">
        <Link
          to="/admin/dashboard"
          className={`nav-item ${location.pathname === "/admin/dashboard" ? "active" : ""}`}
        >
          <i className="bi bi-house-door"></i>
          <span className="nav-text">Dashboard</span>
        </Link>

        <Link
          to="/admin/users"
          className={`nav-item ${location.pathname === "/admin/users" ? "active" : ""}`}
        >
          <i className="bi bi-people"></i>
          <span className="nav-text">Users</span>
        </Link>

        <Link
          to="/admin/posts"
          className={`nav-item ${location.pathname === "/admin/posts" ? "active" : ""}`}
        >
          <i className="bi bi-graph-up"></i>
          <span className="nav-text">Posts / Ads</span>
        </Link>

        <Link
          to="/admin/transactions"
          className={`nav-item ${location.pathname === "/admin/transactions" ? "active" : ""}`}
        >
          <i className="bi bi-credit-card"></i>
          <span className="nav-text">Transactions</span>
        </Link>

        <Link
          to="/admin/reports"
          className={`nav-item ${location.pathname === "/admin/reports" ? "active" : ""}`}
        >
          <i className="bi bi-bar-chart"></i>
          <span className="nav-text">Reports</span>
        </Link>
      </nav>

      {/* Bottom Menu */}
      <div className="nav-bottom">
        {/* Setting */}
        <Link to="/admin/settings" className="nav-item">
          <i className="bi bi-gear"></i>
          <span className="nav-text">Setting</span>
        </Link>

        {/* Logout */}
        <button onClick={handleLogout} className="nav-item nav-button">
          <i className="bi bi-box-arrow-right"></i>
          <span className="nav-text">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
