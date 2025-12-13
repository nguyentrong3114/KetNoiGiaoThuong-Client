import React, { useState, useEffect } from "react";
import { Search, Filter, MoreVertical, Eye, Ban, CheckCircle, XCircle } from "lucide-react";
import AdminHeader from "./components/AdminHeader";
import { adminApi } from "../../services/apiClient";
import "./AdminUsers.css";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ role: "", status: "", search: "" });
  const [pagination, setPagination] = useState({ page: 1, total: 0, perPage: 20 });
  const [selectedUser, setSelectedUser] = useState(null);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    loadUsers();
  }, [filters, pagination.page]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        per_page: pagination.perPage,
      };
      if (filters.role) params.role = filters.role;
      if (filters.status) params.status = filters.status;
      if (filters.search) params.search = filters.search;

      const response = await adminApi.getUsers(params);
      
      // Handle different response formats
      const data = response?.data?.data || response?.data || [];
      const meta = response?.meta || response?.data?.meta || {};
      
      setUsers(Array.isArray(data) ? data : []);
      setPagination(prev => ({
        ...prev,
        total: meta.total || data.length,
      }));
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    if (!confirm(`Bạn có chắc muốn ${newStatus === "banned" ? "khóa" : "cập nhật"} người dùng này?`)) return;

    setProcessing(userId);
    try {
      await adminApi.updateUserStatus(userId, newStatus);
      alert("Cập nhật thành công!");
      loadUsers();
    } catch (error) {
      alert(error.message || "Có lỗi xảy ra");
    } finally {
      setProcessing(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("vi-VN");
  };

  const formatMoney = (amount) => new Intl.NumberFormat("vi-VN").format(amount || 0);

  const getRoleBadge = (role) => {
    const styles = {
      admin: { bg: "bg-red-100 text-red-700", label: "Admin" },
      seller: { bg: "bg-blue-100 text-blue-700", label: "Seller" },
      buyer: { bg: "bg-green-100 text-green-700", label: "Buyer" },
    };
    return styles[role] || styles.buyer;
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: { bg: "bg-green-100 text-green-700", label: "Hoạt động" },
      inactive: { bg: "bg-gray-100 text-gray-700", label: "Không hoạt động" },
      banned: { bg: "bg-red-100 text-red-700", label: "Đã khóa" },
    };
    return styles[status] || styles.inactive;
  };

  return (
    <div className="p-6">
      <AdminHeader title="Quản lý người dùng" subtitle={`Tổng: ${pagination.total} người dùng`} />

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Tìm theo tên, email..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <select
            value={filters.role}
            onChange={(e) => setFilters({ ...filters, role: e.target.value })}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Tất cả vai trò</option>
            <option value="admin">Admin</option>
            <option value="seller">Seller</option>
            <option value="buyer">Buyer</option>
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
            <option value="banned">Đã khóa</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <p>Không tìm thấy người dùng nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Người dùng</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Vai trò</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Số dư ví</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Trạng thái</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Ngày tạo</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => {
                  const role = getRoleBadge(user.role);
                  const status = getStatusBadge(user.status);

                  return (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 text-sm text-gray-500">#{user.id}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatar_url || "/default-avatar.jpg"}
                            alt={user.full_name}
                            className="w-10 h-10 rounded-full object-cover"
                            onError={(e) => { e.target.src = "/default-avatar.jpg"; }}
                          />
                          <div>
                            <p className="font-medium text-gray-800">{user.full_name || "N/A"}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${role.bg}`}>
                          {role.label}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className="font-medium text-gray-800">
                          ₫{formatMoney(user.wallet?.balance)}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${status.bg}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        {user.email_verified_at ? (
                          <CheckCircle className="inline text-green-500" size={18} />
                        ) : (
                          <XCircle className="inline text-gray-400" size={18} />
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">{formatDate(user.created_at)}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                            title="Xem chi tiết"
                          >
                            <Eye size={18} />
                          </button>
                          {user.role !== "admin" && user.status !== "banned" && (
                            <button
                              onClick={() => handleStatusChange(user.id, "banned")}
                              disabled={processing === user.id}
                              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Khóa tài khoản"
                            >
                              <Ban size={18} />
                            </button>
                          )}
                          {user.status === "banned" && (
                            <button
                              onClick={() => handleStatusChange(user.id, "active")}
                              disabled={processing === user.id}
                              className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
                              title="Mở khóa"
                            >
                              <CheckCircle size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-4 mb-6">
              <img
                src={selectedUser.avatar_url || "/default-avatar.jpg"}
                alt={selectedUser.full_name}
                className="w-16 h-16 rounded-full object-cover"
                onError={(e) => { e.target.src = "/default-avatar.jpg"; }}
              />
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedUser.full_name}</h3>
                <p className="text-gray-500">{selectedUser.email}</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">ID</span>
                <span className="font-medium">#{selectedUser.id}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Số điện thoại</span>
                <span className="font-medium">{selectedUser.phone || "—"}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Vai trò</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleBadge(selectedUser.role).bg}`}>
                  {getRoleBadge(selectedUser.role).label}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Trạng thái</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(selectedUser.status).bg}`}>
                  {getStatusBadge(selectedUser.status).label}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Số dư ví</span>
                <span className="font-bold text-green-600">₫{formatMoney(selectedUser.wallet?.balance)}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Email xác minh</span>
                <span>{selectedUser.email_verified_at ? "✓ Đã xác minh" : "✗ Chưa"}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Ngày tạo</span>
                <span>{formatDate(selectedUser.created_at)}</span>
              </div>
              {selectedUser.shop && (
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Shop</span>
                  <span className="font-medium">{selectedUser.shop.name}</span>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedUser(null)}
                className="flex-1 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
              >
                Đóng
              </button>
              {selectedUser.role !== "admin" && (
                <button
                  onClick={() => {
                    const newStatus = selectedUser.status === "banned" ? "active" : "banned";
                    handleStatusChange(selectedUser.id, newStatus);
                    setSelectedUser(null);
                  }}
                  className={`flex-1 py-2 font-medium rounded-lg ${
                    selectedUser.status === "banned"
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "bg-red-500 hover:bg-red-600 text-white"
                  }`}
                >
                  {selectedUser.status === "banned" ? "Mở khóa" : "Khóa tài khoản"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
