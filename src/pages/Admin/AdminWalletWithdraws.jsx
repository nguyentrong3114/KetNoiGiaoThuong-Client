import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Clock, Search, RefreshCw, Eye, Building2, Copy } from "lucide-react";
import { adminWalletApi } from "../../services/apiClient";

const AdminWalletWithdraws = () => {
  const [withdraws, setWithdraws] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [filter, setFilter] = useState("pending");
  const [search, setSearch] = useState("");
  const [selectedWithdraw, setSelectedWithdraw] = useState(null);
  const [copied, setCopied] = useState("");

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(""), 2000);
  };

  useEffect(() => {
    loadWithdraws();
  }, [filter]);

  const loadWithdraws = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter !== "all") params.status = filter;

      const response = await adminWalletApi.getWithdraws(params);
      setWithdraws(response?.data || []);
    } catch (err) {
      console.error("Error loading withdraws:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleProcess = async (id) => {
    if (!confirm("Xác nhận đã chuyển tiền cho người dùng?")) return;

    setProcessing(id);
    try {
      await adminWalletApi.processWithdraw(id);
      alert("✅ Đã xử lý thành công!");
      loadWithdraws();
      setSelectedWithdraw(null);
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
      await adminWalletApi.rejectWithdraw(id, { admin_note: reason });
      alert("❌ Đã từ chối yêu cầu!");
      loadWithdraws();
      setSelectedWithdraw(null);
    } catch (err) {
      alert(err.message || "Có lỗi xảy ra");
    } finally {
      setProcessing(null);
    }
  };

  const formatMoney = (amount) => new Intl.NumberFormat("vi-VN").format(amount || 0);

  const getStatusBadge = (status) => {
    const styles = {
      pending: { bg: "bg-yellow-100 text-yellow-700", icon: <Clock size={14} />, text: "Chờ xử lý" },
      processing: { bg: "bg-blue-100 text-blue-700", icon: <Clock size={14} />, text: "Đang xử lý" },
      completed: { bg: "bg-green-100 text-green-700", icon: <CheckCircle size={14} />, text: "Đã chuyển" },
      failed: { bg: "bg-red-100 text-red-700", icon: <XCircle size={14} />, text: "Từ chối" },
    };
    return styles[status] || styles.pending;
  };

  const filteredWithdraws = withdraws.filter((w) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      w.request_code?.toLowerCase().includes(searchLower) ||
      w.user?.full_name?.toLowerCase().includes(searchLower) ||
      w.bank_account?.includes(searchLower)
    );
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Duyệt yêu cầu rút tiền</h1>
          <p className="text-gray-500">Xử lý các yêu cầu rút tiền từ người dùng</p>
        </div>
        <button
          onClick={loadWithdraws}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          Làm mới
        </button>
      </div>

      {/* Stats */}
      {!loading && withdraws.length > 0 && filter === "pending" && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <Clock className="text-yellow-600" size={24} />
            <div>
              <p className="font-semibold text-yellow-800">
                Có {withdraws.length} yêu cầu rút tiền đang chờ xử lý
              </p>
              <p className="text-sm text-yellow-600">
                Tổng: ₫{formatMoney(withdraws.reduce((sum, w) => sum + parseFloat(w.actual_amount || 0), 0))} cần chuyển
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex gap-2">
          {[
            { id: "pending", label: "Chờ xử lý" },
            { id: "completed", label: "Đã chuyển" },
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
            placeholder="Tìm theo mã, tên, STK..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        </div>
      ) : filteredWithdraws.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-12 text-center">
          <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
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
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Ngân hàng</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Trạng thái</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Thời gian</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredWithdraws.map((withdraw) => {
                const status = getStatusBadge(withdraw.status);
                const canProcess = withdraw.status === "pending";

                return (
                  <tr key={withdraw.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <span className="font-mono text-sm font-semibold text-indigo-600">
                        {withdraw.request_code}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium text-gray-800">{withdraw.user?.full_name || "N/A"}</p>
                        <p className="text-sm text-gray-500">{withdraw.user?.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div>
                        <span className="font-bold text-green-600 text-lg">₫{formatMoney(withdraw.actual_amount)}</span>
                        <p className="text-xs text-gray-400">Yêu cầu: ₫{formatMoney(withdraw.amount)}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium text-gray-800">{withdraw.bank_name}</p>
                        <p className="text-sm text-gray-500">{withdraw.bank_account}</p>
                        <p className="text-xs text-gray-400">{withdraw.account_holder}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${status.bg}`}>
                        {status.icon} {status.text}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm">
                        <p className="text-gray-800">{new Date(withdraw.created_at).toLocaleDateString("vi-VN")}</p>
                        <p className="text-gray-500">{new Date(withdraw.created_at).toLocaleTimeString("vi-VN")}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedWithdraw(withdraw)}
                          className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                          title="Xem chi tiết"
                        >
                          <Eye size={18} />
                        </button>
                        {canProcess && (
                          <>
                            <button
                              onClick={() => handleProcess(withdraw.id)}
                              disabled={processing === withdraw.id}
                              className="px-3 py-1.5 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white text-sm font-medium rounded-lg transition"
                            >
                              {processing === withdraw.id ? "..." : "Đã chuyển"}
                            </button>
                            <button
                              onClick={() => handleReject(withdraw.id)}
                              disabled={processing === withdraw.id}
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
      {selectedWithdraw && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Chi tiết yêu cầu rút tiền</h3>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Mã yêu cầu</span>
                <span className="font-mono font-semibold">{selectedWithdraw.request_code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Người dùng</span>
                <span className="font-medium">{selectedWithdraw.user?.full_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email</span>
                <span>{selectedWithdraw.user?.email}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Số tiền yêu cầu rút</span>
                <span className="text-gray-600">₫{formatMoney(selectedWithdraw.amount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Phí ({selectedWithdraw.total_fee ? Math.round((selectedWithdraw.total_fee / selectedWithdraw.amount) * 100) : 11}%)</span>
                <span className="text-red-500">-₫{formatMoney(selectedWithdraw.total_fee || selectedWithdraw.fee)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-dashed">
                <span className="text-gray-700 font-medium">Số tiền cần chuyển</span>
                <span className="font-bold text-green-600 text-xl">₫{formatMoney(selectedWithdraw.actual_amount)}</span>
              </div>
              <div className="pt-3 border-t">
                <p className="text-gray-600 mb-2">Thông tin ngân hàng (chuyển tiền đến):</p>
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Ngân hàng:</span>
                    <span className="font-semibold">{selectedWithdraw.bank_name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Số TK:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold">{selectedWithdraw.bank_account}</span>
                      <button
                        onClick={() => copyToClipboard(selectedWithdraw.bank_account, "account")}
                        className="p-1 hover:bg-yellow-100 rounded"
                        title="Copy số tài khoản"
                      >
                        {copied === "account" ? <CheckCircle size={16} className="text-green-500" /> : <Copy size={16} className="text-gray-500" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Chủ TK:</span>
                    <span className="font-semibold">{selectedWithdraw.account_holder}</span>
                  </div>
                  <div className="pt-3 mt-2 border-t-2 border-yellow-300 bg-yellow-100 -mx-4 -mb-4 px-4 py-3 rounded-b-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 font-medium">Số tiền cần chuyển:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-green-600 text-2xl">₫{formatMoney(selectedWithdraw.actual_amount)}</span>
                        <button
                          onClick={() => copyToClipboard(String(selectedWithdraw.actual_amount), "amount")}
                          className="p-1.5 hover:bg-yellow-200 rounded-lg"
                          title="Copy số tiền"
                        >
                          {copied === "amount" ? <CheckCircle size={18} className="text-green-500" /> : <Copy size={18} className="text-gray-600" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Trạng thái</span>
                <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${getStatusBadge(selectedWithdraw.status).bg}`}>
                  {getStatusBadge(selectedWithdraw.status).text}
                </span>
              </div>
              {selectedWithdraw.admin_note && (
                <div className="pt-3 border-t">
                  <span className="text-gray-600 block mb-1">Ghi chú Admin</span>
                  <p className="text-gray-800 bg-gray-50 p-2 rounded">{selectedWithdraw.admin_note}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedWithdraw(null)}
                className="flex-1 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
              >
                Đóng
              </button>
              {selectedWithdraw.status === "pending" && (
                <>
                  <button
                    onClick={() => handleProcess(selectedWithdraw.id)}
                    disabled={processing === selectedWithdraw.id}
                    className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg"
                  >
                    ✅ Đã chuyển tiền
                  </button>
                  <button
                    onClick={() => handleReject(selectedWithdraw.id)}
                    disabled={processing === selectedWithdraw.id}
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

export default AdminWalletWithdraws;
