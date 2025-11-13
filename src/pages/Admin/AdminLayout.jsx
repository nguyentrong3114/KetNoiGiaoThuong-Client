import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./components/AdminSidebar";

const AdminLayout = () => {
  return (
    <div className="dashboard-container">
      <AdminSidebar />
      <div className="main-content">
        <Outlet />
      </div>
      <style>{`
        .dashboard-container {
          display: flex;
          min-height: 100vh;
          background: #f8f9fa;
        }
        .main-content {
          flex: 1;
          padding: 0;
          background: #ffffff;
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
