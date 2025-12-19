import { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  Search,
  RefreshCw,
  Eye,
  Gavel,
  Package,
  User,
  Phone,
  MapPin,
} from "lucide-react";
import { adminApi, adminWalletApi } from "../../services/apiClient";

const AdminAuctionPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [filter, setFilter] = useState("waiting_confirmation");
  const [search, setSearch] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);

  useEffect(() => {
    loadPayments();
  }, [filter]);

  const loadPayments = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter !== "all") {
        params.status = filter;
      }
      const response = await adminApi.getAuctionPayments(params);
      setPayments(response?.data || []);
    } catch (err) {
      console.error("Error loading auction payments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (id) => {
    const note = prompt("Ghi chú xác nhận (tùy chọn):");
    if (note === null) return; // User cancelled

    setProcessing(id);
    try {
      await adminWalletApi.confirmAuctionBankTransfer(id, note);
      alert("✅ Đã xác nhận thanh toán!");
      loadPayments();
      setSelectedPayment(null);
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
      await adminWalletApi.rejectAuctionBankTransfer(id, reason);
      alert("❌ Đã từ chối thanh toán!");
      loadPayments();
      setSelectedPayment(null);
    } catch (err) {
      alert(err.message || "Có lỗi xảy ra");
    } finally {
      setProcessing(null);
    }
  };

  const formatMoney = (amount) => new Intl.NumberFormat("vi-VN").format(amount || 0);

  const getStatusBadge = (status) => {
    const styles = {
      pending: { bg: "bg-yellow-100 text-yellow-700", icon: <Clock size={14} />, text: "Chờ thanh toán" },
      waiting_confirmation: { bg: "bg-orange-100 text-orange-700", icon: <Clock size={14} />, text: "Chờ xác nhận CK" },
      paid: { bg: "bg-blue-100 text-blue-700", icon: <CheckCircle size={14} />, text: "Đã thanh toán" },
      transferred: { bg: "bg-green-100 text-green-700", icon: <CheckCircle size={14} />, text: "Đã chuyển seller" },
      expired: { bg: "bg-red-100 text-red-700", icon: <XCircle size={14} />, text: "Hết hạn" },
      cancelled: { bg: "bg-gray-100 text-gray-500", icon: <XCircle size={14} />, text: "Đã hủy" },
    };
    return styles[status] || styles.pending;
  };

  const filteredPayments = payments.filter((p) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      p.payment_code?.toLowerCase().includes(searchLower) ||
      p.winner?.full_name?.toLowerCase().includes(searchLower) ||
      p.seller?.full_name?.toLowerCase().includes(searchLower) ||
      p.auction?.listing?.title?.toLowerCase().includes(searchLower)
    );
  });

  // Count waiting for confirmation
  const waitingCount = payments.filter((p) => p.status === "waiting_confirmation").length;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Thanh toán đấu giá</h1>
          <p className="text-gray-500">Quản lý và xác nhận thanh toán chuyển khoản đấu giá</p>
        </div>
        <button
          onClick={loadPayments}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          Làm mới
        </button>
      </div>

      {/* Stats */}
      {!loading && waitingCount > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <Clock className="text-orange-600" size={24} />
            <div>
              <p className="font-semibold text-orange-800">
                Có {waitingCount} thanh toán chờ xác nhận chuyển khoản
              </p>
              <p className="text-sm text-orange-600">
                Vui lòng kiểm tra và xác nhận các giao dịch
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex gap-2 flex-wrap">
          {[
            { id: "waiting_confirmation", label: "Chờ xác nhận" },
            { id: "pending", label: "Chờ thanh toán" },
            { id: "paid", label: "Đã thanh toán" },
            { id: "transferred", label: "Đã chuyển seller" },
            { id: "expired", label: "Hết hạn" },
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
            placeholder="Tìm theo mã, tên, sản phẩm..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        </div>
      ) : filteredPayments.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-12 text-center">
          <Gavel className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Không có thanh toán nào</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Mã TT</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Sản phẩm</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Người thắng</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Người bán</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Số tiền</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Trạng thái</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPayments.map((payment) => {
                const status = getStatusBadge(payment.status);
                const canProcess = payment.status === "waiting_confirmation";

                return (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <span className="font-mono text-sm font-semibold text-indigo-600">
                        {payment.payment_code}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={payment.auction?.listing?.images?.[0] || "/default-avatar.jpg"}
                          alt=""
                          className="w-10 h-10 object-cover rounded"
                          onError={(e) => (e.target.src = "/default-avatar.jpg")}
                        />
                        <span className="font-medium text-gray-800 line-clamp-1 max-w-[150px]">
                          {payment.auction?.listing?.title || "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-medium text-gray-800">{payment.winner?.full_name || "N/A"}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-medium text-gray-800">{payment.seller?.full_name || "N/A"}</p>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className="font-bold text-green-600">₫{formatMoney(payment.amount)}</span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${status.bg}`}>
                        {status.icon} {status.text}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedPayment(payment)}
                          className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                          title="Xem chi tiết"
                        >
                          <Eye size={18} />
                        </button>
                        {canProcess && (
                          <>
                            <button
                              onClick={() => handleConfirm(payment.id)}
                              disabled={processing === payment.id}
                              className="px-3 py-1.5 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white text-sm font-medium rounded-lg transition"
                            >
                              {processing === payment.id ? "..." : "Xác nhận"}
                            </button>
                            <button
                              onClick={() => handleReject(payment.id)}
                              disabled={processing === payment.id}
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
      {selectedPayment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Chi tiết thanh toán đấu giá</h3>

            {/* Product Info */}
            <div className="flex gap-3 mb-4 pb-4 border-b">
              <img
                src={selectedPayment.auction?.listing?.images?.[0] || "/default-avatar.jpg"}
                alt=""
                className="w-16 h-16 object-cover rounded-lg"
                onError={(e) => (e.target.src = "/default-avatar.jpg")}
              />
              <div>
                <h4 className="font-medium text-gray-800">
                  {selectedPayment.auction?.listing?.title || "Sản phẩm đấu giá"}
                </h4>
                <p className="text-xl font-bold text-indigo-600">₫{formatMoney(selectedPayment.amount)}</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Mã thanh toán</span>
                <span className="font-mono font-semibold">{selectedPayment.payment_code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Trạng thái</span>
                <span
                  className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${getStatusBadge(selectedPayment.status).bg}`}
                >
                  {getStatusBadge(selectedPayment.status).text}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phí sàn (5%)</span>
                <span className="text-red-600">-₫{formatMoney(selectedPayment.platform_fee)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Seller nhận</span>
                <span className="font-bold text-green-600">₫{formatMoney(selectedPayment.seller_receive)}</span>
              </div>
            </div>

            {/* Winner Info */}
            <div className="bg-blue-50 rounded-xl p-4 mb-4">
              <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                <User size={16} /> Người thắng
              </h4>
              <div className="space-y-1 text-sm">
                <p>{selectedPayment.winner?.full_name || "N/A"}</p>
                <p className="text-gray-600">{selectedPayment.winner?.email}</p>
              </div>
            </div>

            {/* Seller Info */}
            <div className="bg-green-50 rounded-xl p-4 mb-4">
              <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                <User size={16} /> Người bán
              </h4>
              <div className="space-y-1 text-sm">
                <p>{selectedPayment.seller?.full_name || "N/A"}</p>
                <p className="text-gray-600">{selectedPayment.seller?.email}</p>
              </div>
            </div>

            {/* Shipping Info */}
            {selectedPayment.shipping_info && (
              <div className="bg-yellow-50 rounded-xl p-4 mb-4">
                <h4 className="font-medium text-yellow-800 mb-2 flex items-center gap-2">
                  <Package size={16} /> Thông tin giao hàng
                </h4>
                <div className="space-y-2 text-sm">
                  <p className="flex items-center gap-2">
                    <User size={14} className="text-gray-500" />
                    {selectedPayment.shipping_info.shipping_name}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone size={14} className="text-gray-500" />
                    {selectedPayment.shipping_info.shipping_phone}
                  </p>
                  <p className="flex items-start gap-2">
                    <MapPin size={14} className="text-gray-500 mt-0.5" />
                    {selectedPayment.shipping_info.shipping_address}
                  </p>
                  {selectedPayment.shipping_info.shipping_note && (
                    <p className="text-gray-600 italic">Ghi chú: {selectedPayment.shipping_info.shipping_note}</p>
                  )}
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div className="text-sm text-gray-500 space-y-1 mb-6">
              <p>Tạo: {new Date(selectedPayment.created_at).toLocaleString("vi-VN")}</p>
              {selectedPayment.paid_at && <p>Thanh toán: {new Date(selectedPayment.paid_at).toLocaleString("vi-VN")}</p>}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedPayment(null)}
                className="flex-1 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
              >
                Đóng
              </button>
              {selectedPayment.status === "waiting_confirmation" && (
                <>
                  <button
                    onClick={() => handleConfirm(selectedPayment.id)}
                    disabled={processing === selectedPayment.id}
                    className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg"
                  >
                    ✅ Xác nhận
                  </button>
                  <button
                    onClick={() => handleReject(selectedPayment.id)}
                    disabled={processing === selectedPayment.id}
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

export default AdminAuctionPayments;
