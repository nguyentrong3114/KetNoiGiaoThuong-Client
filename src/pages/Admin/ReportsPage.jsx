import React from "react";
import AdminHeader from "./components/AdminHeader";
import "./ReportsPage.css";

const ReportsPage = () => {
  return (
    <>
      {/* Header */}
      <AdminHeader title="Báo cáo" subtitle="" />

      {/* Cards tổng quan */}
      <div className="stats-grid">
        <div className="stat-card">
          <div>
            <div className="stat-label">Chờ xử lý</div>
            <div className="stat-number">0</div>
          </div>
          <div className="badge" style={{ backgroundColor: "#FEF3C7" }}>
            <span style={{ color: "#92400E", fontSize: "14px", fontWeight: "600" }}>—</span>
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Đang xử lý</div>
            <div className="stat-number">0</div>
          </div>
          <div className="badge" style={{ backgroundColor: "#DBEAFE" }}>
            <span style={{ color: "#1E40AF", fontSize: "14px", fontWeight: "600" }}>—</span>
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Đã giải quyết</div>
            <div className="stat-number">0</div>
          </div>
          <div className="badge" style={{ backgroundColor: "#D1FAE5" }}>
            <span style={{ color: "#065F46", fontSize: "14px", fontWeight: "600" }}>—</span>
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-label">Tổng số báo cáo</div>
            <div className="stat-number">0</div>
          </div>
          <div className="icon-wrapper" style={{ backgroundColor: "#F3F4F6" }}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6B7280"
              strokeWidth="2"
            >
              <path d="M9 12h6M9 16h6M9 8h6M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Quản lý báo cáo */}
      <div className="management-card">
        <div className="management-header">
          <div className="title-row">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#374151"
              strokeWidth="2"
            >
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            <h3 className="management-title">Quản lý báo cáo</h3>
          </div>
        </div>

        {/* Search + Filters */}
        <div className="filters-row">
          <div className="search-box">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9CA3AF"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input type="text" placeholder="Tìm kiếm báo cáo..." className="search-input" />
          </div>

          <select className="select">
            <option>Tất cả trạng thái</option>
          </select>

          <select className="select">
            <option>Tất cả danh mục</option>
          </select>

          <select className="select">
            <option>Tất cả mức ưu tiên</option>
          </select>
        </div>

        {/* Bảng */}
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr className="table-header-row">
                <th className="table-header" style={{ width: "35%" }}>
                  Báo cáo
                </th>
                <th className="table-header" style={{ width: "15%" }}>
                  Danh mục
                </th>
                <th className="table-header" style={{ width: "15%" }}>
                  Trạng thái
                </th>
                <th className="table-header" style={{ width: "12%" }}>
                  Ưu tiên
                </th>
                <th className="table-header" style={{ width: "23%" }}>
                  Vị trí
                </th>
              </tr>
            </thead>

            <tbody>
              {/* KHÔNG CÓ DỮ LIỆU */}
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  Chưa có dữ liệu báo cáo.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination">
          <button className="pagination-btn">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6B7280"
              strokeWidth="2"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div className="pagination-bar">
            <div className="pagination-progress"></div>
          </div>

          <button className="pagination-btn">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6B7280"
              strokeWidth="2"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

export default ReportsPage;
