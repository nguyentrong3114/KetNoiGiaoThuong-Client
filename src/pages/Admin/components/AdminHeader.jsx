import React from "react";
import "./AdminHeader.css";

const AdminHeader = () => {
  return (
    <div className="header">
      <div className="header-left">
        <h1 className="header-title">Dashboard</h1>
        <p className="header-subtitle">Welcome back! Here's what's happening today.</p>
      </div>
      <div className="header-right">
        <div className="header-search">
          <i className="bi bi-search"></i>
          <input type="text" placeholder="Search..." />
        </div>
        <button className="header-notification">
          <i className="bi bi-bell"></i>
          <span className="notification-badge">3</span>
        </button>
        <div className="header-profile">
          <img
            src="https://ui-avatars.com/api/?name=Admin&background=3498DB&color=fff"
            alt="Admin"
          />
          <span>Admin</span>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
