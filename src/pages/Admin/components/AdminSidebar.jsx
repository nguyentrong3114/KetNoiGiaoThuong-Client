import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./AdminSidebar.css";

const AdminSidebar = () => {
  const location = useLocation();

  return (
    <div className="sidebar">
      <div className="logo-container">
        <img src="/images/logo.png" alt="GoPro Logo" className="logo-image" />
      </div>
      <nav className="nav-menu">
        <Link to="/admin/dashboard" className={`nav-item ${location.pathname === '/admin/dashboard' ? 'active' : ''}`}>
          <i className="bi bi-house-door"></i>
          <span className="nav-text">Dashboard</span>
        </Link>
        <Link to="/admin/users" className={`nav-item ${location.pathname === '/admin/users' ? 'active' : ''}`}>
          <i className="bi bi-people"></i>
          <span className="nav-text">Users</span>
        </Link>
        <div className="nav-item">
          <i className="bi bi-graph-up"></i>
          <span className="nav-text">Posts / Ads</span>
        </div>
        <div className="nav-item">
          <i className="bi bi-credit-card"></i>
          <span className="nav-text">Transactions</span>
        </div>
        <div className="nav-item">
          <i className="bi bi-bar-chart"></i>
          <span className="nav-text">Reports</span>
        </div>
      </nav>
      <div className="nav-bottom">
        <div className="nav-item">
          <i className="bi bi-gear"></i>
          <span className="nav-text">Setting</span>
        </div>
        <div className="nav-item">
          <i className="bi bi-box-arrow-right"></i>
          <span className="nav-text">Logout</span>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
