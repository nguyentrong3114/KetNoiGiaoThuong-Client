import { useState, useEffect } from "react";
import { Crown, Zap, Star, Search, Check, X, Eye } from "lucide-react";
import { adminSubscriptionApi } from "../../services/apiClient";

const AdminSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [search, setSearch] = useState("");
  const [selectedSub, setSelectedSub] = useState(null);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    loadSubscriptions();
  }, [filter]);

  const loadSubscriptions = async () => {
    setLoading(true);
    try {
      const response = await adminSubscriptionApi.getAll({ status: filter === "all" ? undefined : filter });
      setSubscriptions(response?.data || []);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatMoney = (amount) => new Intl.NumberFormat("vi-VN").format(amount || 0);
  const formatDate = (date) => date ? new Date(date).toLocaleDateString("vi-VN") : "-";

  const getStatusBadge = (status) => {
    const styles = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Chờ thanh toán" },
      processing: { bg: "bg-blue-100", text: "text-blue-700", label: "Chờ duyệt" },
      active: { bg: "bg-green-100", text: "text-green-700", label: "Đang hoạt động" },
      expired: { bg: "bg-gray-100", text: "text-gray-700", label: "Hết hạn" },
      cancelled: { bg: "bg-red-100", text: "text-red-700", label: "Đã hủy" },
      rejected: { bg: "bg-red-100", text: "text-red-700", label: "Bị từ chối" },
    };
    const style = styles[status] || styles.pending;
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>{style.label}</span>;
  };

  const getBadgeIcon = (badge) => {
    if (badge === "enterprise") return <Crown className="text-yellow-500" size={18} />;
    if (badge === "pro") return <Zap className="text-purple-500" size={18} />;
    if (badge === "basic") return <Star className="text-blue-500" size={18} />;
    return null;
  };


  const handleApprove = async (id) => {
    if (!window.confirm("Xác nhận duyệt gói đăng ký này?")) return;
    setProcessing(id);
    try {
      await adminSubscriptionApi.approve(id);
      alert("Đã duyệt thành công!");
      loadSubscriptions();
      setSelectedSub(null);
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
      await adminSubscriptionApi.reject(id, reason);
      alert("Đã từ chối!");
      loadSubscriptions();
      setSelectedSub(null);
    } catch (err) {
      alert(err.message || "Có lỗi xảy ra");
    } finally {
      setProcessing(null);
    }
  };

  const filteredSubs = subscriptions.filter(sub => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      sub.user?.full_name?.toLowerCase().includes(searchLower) ||
      sub.user?.email?.toLowerCase().includes(searchLower) ||
      sub.plan?.name?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Quản lý gói đăng ký</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex gap-2">
          {[
            { value: "all", label: "Tất cả" },
            { value: "pending", label: "Chờ TT" },
            { value: "processing", label: "Chờ duyệt" },
            { value: "active", label: "Hoạt động" },
            { value: "expired", label: "Hết hạn" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === opt.value ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Tìm theo tên, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>


      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
        </div>
      ) : filteredSubs.length === 0 ? (
        <div className="text-center py-12 text-gray-500">Không có dữ liệu</div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">ID</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Người dùng</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Gói</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Thời hạn</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Số tiền</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Trạng thái</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Ngày tạo</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredSubs.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">#{sub.id}</td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900">{sub.user?.full_name || "N/A"}</p>
                      <p className="text-xs text-gray-500">{sub.user?.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {getBadgeIcon(sub.plan?.badge)}
                      <span className="font-medium">{sub.plan?.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {sub.duration_months} tháng
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                    ₫{formatMoney(sub.final_amount)}
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(sub.status)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{formatDate(sub.created_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setSelectedSub(sub)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Xem chi tiết"
                      >
                        <Eye size={18} />
                      </button>
                      {sub.status === "processing" && (
                        <>
                          <button
                            onClick={() => handleApprove(sub.id)}
                            disabled={processing === sub.id}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg disabled:opacity-50"
                            title="Duyệt"
                          >
                            <Check size={18} />
                          </button>
                          <button
                            onClick={() => handleReject(sub.id)}
                            disabled={processing === sub.id}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                            title="Từ chối"
                          >
                            <X size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}


      {/* Detail Modal */}
      {selectedSub && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-lg font-bold">Chi tiết đăng ký #{selectedSub.id}</h3>
              <button onClick={() => setSelectedSub(null)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* User Info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-500 mb-1">Người dùng</p>
                <p className="font-semibold">{selectedSub.user?.full_name}</p>
                <p className="text-sm text-gray-600">{selectedSub.user?.email}</p>
              </div>

              {/* Plan Info */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  {getBadgeIcon(selectedSub.plan?.badge)}
                  <div>
                    <p className="font-bold text-lg">{selectedSub.plan?.name}</p>
                    <p className="text-sm text-gray-600">{selectedSub.duration_months} tháng</p>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Giá gốc</span>
                  <span>₫{formatMoney(selectedSub.base_amount)}</span>
                </div>
                {selectedSub.discount_amount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá</span>
                    <span>-₫{formatMoney(selectedSub.discount_amount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Tổng thanh toán</span>
                  <span className="text-blue-600">₫{formatMoney(selectedSub.final_amount)}</span>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Ngày tạo</p>
                  <p className="font-medium">{formatDate(selectedSub.created_at)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Ngày bắt đầu</p>
                  <p className="font-medium">{formatDate(selectedSub.start_date)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Ngày kết thúc</p>
                  <p className="font-medium">{formatDate(selectedSub.end_date)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Trạng thái</p>
                  {getStatusBadge(selectedSub.status)}
                </div>
              </div>

              {/* Reject reason */}
              {selectedSub.reject_reason && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-sm text-red-600 font-medium">Lý do từ chối:</p>
                  <p className="text-red-700">{selectedSub.reject_reason}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            {selectedSub.status === "processing" && (
              <div className="p-6 border-t flex gap-3">
                <button
                  onClick={() => handleApprove(selectedSub.id)}
                  disabled={processing === selectedSub.id}
                  className="flex-1 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50"
                >
                  ✓ Duyệt
                </button>
                <button
                  onClick={() => handleReject(selectedSub.id)}
                  disabled={processing === selectedSub.id}
                  className="flex-1 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 disabled:opacity-50"
                >
                  ✗ Từ chối
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSubscriptions;
