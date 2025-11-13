import React from "react";
import AdminHeader from "./components/AdminHeader";
import "./AdminUsers.css";


const AdminUsers = () => {
  const invoices = [
    {
      id: 1,
      profile: "https://ui-avatars.com/api/?name=Tom+Smith&background=E8F5E9&color=4CAF50",
      activityType: "Product",
      owner: "Tom Smith",
      task: "Client data test",
      budget: "$125000",
      priority: "High",
      period: "Oct",
      status: "completed",
      deadline: "25/10/2020",
      attachment: true,
    },
    {
      id: 2,
      profile: "https://ui-avatars.com/api/?name=Tom+Smith&background=E3F2FD&color=2196F3",
      activityType: "Product",
      owner: "Tom Smith",
      task: "Client data test",
      budget: "$125000",
      priority: "High",
      period: "Oct",
      status: "completed",
      deadline: "25/10/2020",
      attachment: true,
    },
    {
      id: 3,
      profile: "https://ui-avatars.com/api/?name=Tom+Smith&background=FFF3E0&color=FF9800",
      activityType: "Product",
      owner: "Tom Smith",
      task: "Client data test",
      budget: "$125000",
      priority: "High",
      period: "Oct",
      status: "completed",
      deadline: "25/10/2020",
      attachment: true,
    },
    {
      id: 4,
      profile: "https://ui-avatars.com/api/?name=Tom+Smith&background=FCE4EC&color=E91E63",
      activityType: "Product",
      owner: "Tom Smith",
      task: "Client data test",
      budget: "$125000",
      priority: "High",
      period: "Oct",
      status: "cancelled",
      deadline: "25/10/2020",
      attachment: true,
    },
    {
      id: 5,
      profile: "https://ui-avatars.com/api/?name=Tom+Smith&background=F3E5F5&color=9C27B0",
      activityType: "Product",
      owner: "Tom Smith",
      task: "Client data test",
      budget: "$125000",
      priority: "High",
      period: "Oct",
      status: "cancelled",
      deadline: "25/10/2020",
      attachment: true,
    },
  ];

  return (
    <>
      <AdminHeader title="Users" subtitle="" />

        <div className="table-card">
          <div className="table-header">
            <h2 className="table-title">Monthly Invoices</h2>
            <button className="btn-menu">
              <i className="bi bi-three-dots-vertical"></i>
            </button>
          </div>

          <div className="table-wrapper">
            <table className="invoice-table">
              <thead>
                <tr>
                  <th>Profile</th>
                  <th>Activity Type</th>
                  <th>Owner</th>
                  <th>Task</th>
                  <th>Budget</th>
                  <th>Priority</th>
                  <th>Period</th>
                  <th>Status</th>
                  <th>Deadline</th>
                  <th>Attachment</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td>
                      <img
                        src={invoice.profile}
                        alt={invoice.owner}
                        className="profile-img"
                      />
                    </td>
                    <td className="text-dark">{invoice.activityType}</td>
                    <td className="text-dark">{invoice.owner}</td>
                    <td className="text-muted">{invoice.task}</td>
                    <td className="text-dark">{invoice.budget}</td>
                    <td className="text-dark">{invoice.priority}</td>
                    <td className="text-dark">{invoice.period}</td>
                    <td>
                      <span
                        className={`status-badge ${
                          invoice.status === "completed"
                            ? "status-completed"
                            : "status-cancelled"
                        }`}
                      >
                        {invoice.status === "completed" ? (
                          <i className="bi bi-check"></i>
                        ) : (
                          <i className="bi bi-x"></i>
                        )}
                      </span>
                    </td>
                    <td className="text-dark">{invoice.deadline}</td>
                    <td>
                      {invoice.attachment && (
                        <span className="attachment-badge">PDF</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
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
