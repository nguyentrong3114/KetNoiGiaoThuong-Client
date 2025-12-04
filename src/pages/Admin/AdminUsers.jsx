import React from "react";
import AdminHeader from "./components/AdminHeader";
import "./AdminUsers.css";

const AdminUsers = () => {
  // ❗ Không nhận demo nữa — BE trả về /admin/users
  const invoices = [];

  return (
    <>
      <AdminHeader title="Người dùng" subtitle="Danh sách người dùng và hoạt động gần đây." />

      <div className="table-card">
        <div className="table-header">
          <h2 className="table-title">Hóa đơn hàng tháng</h2>
          <button className="btn-menu">
            <i className="bi bi-three-dots-vertical"></i>
          </button>
        </div>

        <div className="table-wrapper">
          {invoices.length === 0 ? (
            <p className="text-gray-500 p-4">Chưa có dữ liệu người dùng.</p>
          ) : (
            <table className="invoice-table">
              <thead>
                <tr>
                  <th>Hồ sơ</th>
                  <th>Loại hoạt động</th>
                  <th>Chủ sở hữu</th>
                  <th>Nhiệm vụ</th>
                  <th>Ngân sách</th>
                  <th>Mức ưu tiên</th>
                  <th>Thời gian</th>
                  <th>Trạng thái</th>
                  <th>Hạn cuối</th>
                  <th>Tập tin</th>
                </tr>
              </thead>

              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td>
                      <img src={invoice.profile} alt="" className="profile-img" />
                    </td>
                    <td>{invoice.activityType}</td>
                    <td>{invoice.owner}</td>
                    <td>{invoice.task}</td>
                    <td>{invoice.budget}</td>
                    <td>{invoice.priority}</td>
                    <td>{invoice.period}</td>
                    <td>{invoice.status}</td>
                    <td>{invoice.deadline}</td>
                    <td>{invoice.attachment && "PDF"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer phân trang */}
        <div className="table-footer">
          <div className="pagination">
            <button className="pagination-btn">
              <i className="bi bi-chevron-left"></i>
            </button>

            <div className="pagination-scrollbar">
              <div className="scrollbar-track">
                <div className="scrollbar-thumb"></div>
              </div>
            </div>

            <button className="pagination-btn">
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminUsers;
