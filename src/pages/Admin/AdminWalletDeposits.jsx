import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle, XCircle, Clock, Search, RefreshCw, Eye } from "lucide-react";
import { adminWalletApi } from "../../services/apiClient";

const AdminWalletDeposits = () => {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [filter, setFilter] = useState("waiting"); // Mặc định hiện chờ duyệt (pending + processing)
  const [search, setSearch] = useState("");
  const [selectedDeposit, setSelectedDeposit] = useState(null);

  useEffect(() => {
    loadDeposits();
  }, [filter]);

  const loadDeposits = async () => {
    setLoading(true);
    try {
      const params = {};
      // "waiting" = pending + processing (cần admin xử lý)
      // "all" = không filter
      if (filter === "waiting") {
        // Không gửi status để lấy tất cả, sau đó filter ở FE
        // Hoặc gọi 2 lần API - nhưng đơn giản hơn là lấy all rồi filter
      } else if (filter !== "all") {
        params.status = filter;
      }
      
      const response = await adminWalletApi.getDeposits(params);
      let data = response?.data || [];
      
      // Nếu filter là "waiting", chỉ lấy pending và processing
      if (filter === "waiting") {
        data = data.filter(d => d.status === "pending" || d.status === "processing");
      }
      
      setDeposits(data);
    } catch (err) {
      console.error("Error loading deposits:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    if (!confirm("Xác nhận duyệt yêu cầu nạp tiền này?")) return;

    setProcessing(id);
    try {
      await adminWalletApi.approveDeposit(id, { admin_note: "Đã xác nhận chuyển khoản" });
      alert("✅ Đã duyệt thành công!");
      loadDeposits();
      setSelectedDeposit(null);
    } catch (err) {
      alert(err.message || "Có lỗi xảy ra");
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (id) => {
    const reason = prompt("Nhập lý do từ chối:");
    if (!reason) return;

    setProcessing(id);
    try {
      await adminWalletApi.rejectDeposit(id, { admin_note: reason });
      alert("❌ Đã từ chối yêu cầu!");
      loadDeposits();
      setSelectedDeposit(null);
    } catch (err) {
      alert(err.message || "Có lỗi xảy ra");
    } finally {
      setProcessing(null);
    }
  };

  const formatMoney = (amount) => new Intl.NumberFormat("vi-VN").format(amount || 0);

  const getStatusBadge = (status) => {
    const styles = {
      pending: { bg: "bg-gray-100 text-gray-700", icon: <Clock size={14} />, text: "Chờ chuyển tiền" },
      processing: { bg: "bg-yellow-100 text-yellow-700", icon: <Clock size={14} />, text: "Chờ duyệt" },
      completed: { bg: "bg-green-100 text-green-700", icon: <CheckCircle size={14} />, text: "Đã duyệt" },
      failed: { bg: "bg-red-100 text-red-700", icon: <XCircle size={14} />, text: "Từ chối" },
      cancelled: { bg: "bg-gray-100 text-gray-500", icon: <XCircle size={14} />, text: "Đã hủy" },
    };
    return styles[status] || styles.pending;
  };

  const filteredDeposits = deposits.filter((d) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      d.request_code?.toLowerCase().includes(searchLower) ||
      d.user?.full_name?.toLowerCase().includes(searchLower) ||
      d.user?.email?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Duyệt yêu cầu nạp tiền</h1>
          <p className="text-gray-500">Kiểm tra và duyệt các yêu cầu nạp tiền từ người dùng</p>
        </div>
        <button
          onClick={loadDeposits}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          Làm mới
        </button>
      </div>

      {/* Stats - Hiển thị khi có yêu cầu chờ xử lý */}
      {!loading && filter === "waiting" && deposits.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <Clock className="text-yellow-600" size={24} />
            <div>
              <p className="font-semibold text-yellow-800">
                Có {deposits.length} yêu cầu nạp tiền đang chờ xử lý
              </p>
              <p className="text-sm text-yellow-600">
                Tổng: ₫{formatMoney(deposits.reduce((sum, d) => sum + parseFloat(d.amount || 0), 0))}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex gap-2">
          {[
            { id: "waiting", label: "Chờ xử lý" },
            { id: "completed", label: "Đã duyệt" },
            { id: "failed", label: "Từ chối" },
            { id: "all", label: "Tất cả" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === f.id ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo mã, tên, email..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        </div>
      ) : filteredDeposits.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-12 text-center">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Không có yêu cầu nào</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Mã yêu cầu</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Người dùng</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Số tiền</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Trạng thái</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Thời gian</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredDeposits.map((deposit) => {
                const status = getStatusBadge(deposit.status);
                // Cho phép duyệt cả pending và processing
                const canProcess = deposit.status === "pending" || deposit.status === "processing";

                return (
                  <tr key={deposit.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <span className="font-mono text-sm font-semibold text-indigo-600">
                        {deposit.request_code}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium text-gray-800">{deposit.user?.full_name || "N/A"}</p>
                        <p className="text-sm text-gray-500">{deposit.user?.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className="font-bold text-green-600">₫{formatMoney(deposit.amount)}</span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${status.bg}`}>
                        {status.icon} {status.text}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm">
                        <p className="text-gray-800">{new Date(deposit.created_at).toLocaleDateString("vi-VN")}</p>
                        <p className="text-gray-500">{new Date(deposit.created_at).toLocaleTimeString("vi-VN")}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedDeposit(deposit)}
                          className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                          title="Xem chi tiết"
                        >
                          <Eye size={18} />
                        </button>
                        {canProcess && (
                          <>
                            <button
                              onClick={() => handleApprove(deposit.id)}
                              disabled={processing === deposit.id}
                              className="px-3 py-1.5 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white text-sm font-medium rounded-lg transition"
                            >
                              {processing === deposit.id ? "..." : "Duyệt"}
                            </button>
                            <button
                              onClick={() => handleReject(deposit.id)}
                              disabled={processing === deposit.id}
                              className="px-3 py-1.5 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white text-sm font-medium rounded-lg transition"
                            >
                              Từ chối
                            </button>
                          </>
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

      {/* Detail Modal */}
      {selectedDeposit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Chi tiết yêu cầu nạp tiền</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Mã yêu cầu</span>
                <span className="font-mono font-semibold">{selectedDeposit.request_code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Người dùng</span>
                <span className="font-medium">{selectedDeposit.user?.full_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email</span>
                <span>{selectedDeposit.user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Số tiền</span>
                <span className="font-bold text-green-600">₫{formatMoney(selectedDeposit.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Nội dung CK</span>
                <span className="font-mono text-red-600">NAP {selectedDeposit.request_code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Trạng thái</span>
                <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${getStatusBadge(selectedDeposit.status).bg}`}>
                  {getStatusBadge(selectedDeposit.status).text}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Thời gian tạo</span>
                <span>{new Date(selectedDeposit.created_at).toLocaleString("vi-VN")}</span>
              </div>
              {selectedDeposit.confirmed_at && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Xác nhận CK</span>
                  <span>{new Date(selectedDeposit.confirmed_at).toLocaleString("vi-VN")}</span>
                </div>
              )}
              {selectedDeposit.admin_note && (
                <div className="pt-3 border-t">
                  <span className="text-gray-600 block mb-1">Ghi chú Admin</span>
                  <p className="text-gray-800 bg-gray-50 p-2 rounded">{selectedDeposit.admin_note}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedDeposit(null)}
                className="flex-1 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
              >
                Đóng
              </button>
              {(selectedDeposit.status === "pending" || selectedDeposit.status === "processing") && (
                <>
                  <button
                    onClick={() => handleApprove(selectedDeposit.id)}
                    disabled={processing === selectedDeposit.id}
                    className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg"
                  >
                    ✅ Duyệt
                  </button>
                  <button
                    onClick={() => handleReject(selectedDeposit.id)}
                    disabled={processing === selectedDeposit.id}
                    className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg"
                  >
                    ❌ Từ chối
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminWalletDeposits;
