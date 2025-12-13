import { useState, useEffect } from "react";
import {
  Package,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  RefreshCw,
  Search,
  Eye,
  AlertTriangle,
} from "lucide-react";
import { adminOrderApi } from "../../services/apiClient";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    loadOrders();
  }, [filter]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter !== "all") {
        if (filter === "refund_pending") {
          params.refund_status = "pending";
        } else {
          params.status = filter;
        }
      }
      const res = await adminOrderApi.getAll(params);
      setOrders(res?.data || []);
    } catch (err) {
      console.error("Error loading orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatMoney = (amount) => new Intl.NumberFormat("vi-VN").format(amount || 0);

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  const statusConfig = {
    pending: { label: "Chờ thanh toán", color: "bg-yellow-100 text-yellow-700", icon: <Clock size={14} /> },
    confirmed: { label: "Đã xác nhận", color: "bg-blue-100 text-blue-700", icon: <CheckCircle size={14} /> },
    processing: { label: "Đang xử lý", color: "bg-indigo-100 text-indigo-700", icon: <Package size={14} /> },
    shipping: { label: "Đang giao", color: "bg-purple-100 text-purple-700", icon: <Truck size={14} /> },
    delivered: { label: "Đã giao", color: "bg-green-100 text-green-700", icon: <CheckCircle size={14} /> },
    completed: { label: "Hoàn thành", color: "bg-green-100 text-green-700", icon: <CheckCircle size={14} /> },
    cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-700", icon: <XCircle size={14} /> },
    refunded: { label: "Đã hoàn tiền", color: "bg-orange-100 text-orange-700", icon: <RefreshCw size={14} /> },
  };

  const getStatus = (status) => statusConfig[status] || statusConfig.pending;

  // Xử lý hoàn tiền
  const handleProcessRefund = async (orderId, action) => {
    const note = prompt(action === "approve" ? "Ghi chú (tùy chọn):" : "Lý do từ chối:");
    if (action === "reject" && !note) return;

    setProcessing(orderId);
    try {
      await adminOrderApi.processRefund(orderId, action, note || "");
      alert(action === "approve" ? "Đã duyệt hoàn tiền!" : "Đã từ chối hoàn tiền!");
      loadOrders();
      setSelectedOrder(null);
    } catch (err) {
      alert(err.message || "Xử lý thất bại");
    } finally {
      setProcessing(null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      o.order_number?.toLowerCase().includes(s) ||
      o.buyer?.full_name?.toLowerCase().includes(s) ||
      o.seller?.full_name?.toLowerCase().includes(s)
    );
  });

  // Đếm đơn cần xử lý hoàn tiền
  const refundPendingCount = orders.filter((o) => o.refund_requested_at && !o.refund_processed_at).length;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h1>
          <p className="text-gray-500">Xem và xử lý các đơn hàng, yêu cầu hoàn tiền</p>
        </div>
        <button
          onClick={loadOrders}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          Làm mới
        </button>
      </div>

      {/* Alert for refund requests */}
      {refundPendingCount > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <AlertTriangle className="text-orange-600" size={24} />
          <div>
            <p className="font-semibold text-orange-800">Có {refundPendingCount} yêu cầu hoàn tiền đang chờ xử lý</p>
            <button
              onClick={() => setFilter("refund_pending")}
              className="text-sm text-orange-600 hover:underline"
            >
              Xem ngay →
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex gap-2 flex-wrap">
          {[
            { id: "all", label: "Tất cả" },
            { id: "refund_pending", label: "Chờ hoàn tiền", highlight: refundPendingCount > 0 },
            { id: "pending", label: "Chờ TT" },
            { id: "shipping", label: "Đang giao" },
            { id: "completed", label: "Hoàn thành" },
            { id: "cancelled", label: "Đã hủy" },
            { id: "refunded", label: "Đã hoàn tiền" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === f.id
                  ? f.highlight
                    ? "bg-orange-500 text-white"
                    : "bg-indigo-600 text-white"
                  : f.highlight
                  ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
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
            placeholder="Tìm theo mã, tên..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-12 text-center">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Không có đơn hàng nào</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Mã đơn</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Người mua</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Người bán</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Số tiền</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Trạng thái</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Ngày tạo</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order) => {
                const status = getStatus(order.status);
                const hasRefundRequest = order.refund_requested_at && !order.refund_processed_at;

                return (
                  <tr key={order.id} className={`hover:bg-gray-50 ${hasRefundRequest ? "bg-orange-50" : ""}`}>
                    <td className="px-4 py-4">
                      <span className="font-mono text-sm font-semibold text-indigo-600">{order.order_number}</span>
                      {hasRefundRequest && (
                        <span className="ml-2 px-2 py-0.5 text-xs bg-orange-500 text-white rounded-full">Hoàn tiền</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-medium text-gray-800">{order.buyer?.full_name || "N/A"}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-medium text-gray-800">{order.seller?.full_name || "N/A"}</p>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className="font-bold text-green-600">₫{formatMoney(order.final_amount)}</span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${status.color}`}>
                        {status.icon} {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">{formatDate(order.created_at)}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                          title="Xem chi tiết"
                        >
                          <Eye size={18} />
                        </button>
                        {hasRefundRequest && (
                          <>
                            <button
                              onClick={() => handleProcessRefund(order.id, "approve")}
                              disabled={processing === order.id}
                              className="px-3 py-1.5 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white text-sm font-medium rounded-lg"
                            >
                              Duyệt
                            </button>
                            <button
                              onClick={() => handleProcessRefund(order.id, "reject")}
                              disabled={processing === order.id}
                              className="px-3 py-1.5 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white text-sm font-medium rounded-lg"
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
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Chi tiết đơn hàng</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>

            <div className="space-y-4">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Mã đơn:</span>
                  <span className="ml-2 font-mono font-semibold">{selectedOrder.order_number}</span>
                </div>
                <div>
                  <span className="text-gray-500">Trạng thái:</span>
                  <span className={`ml-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${getStatus(selectedOrder.status).color}`}>
                    {getStatus(selectedOrder.status).label}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Người mua:</span>
                  <span className="ml-2 font-medium">{selectedOrder.buyer?.full_name}</span>
                </div>
                <div>
                  <span className="text-gray-500">Người bán:</span>
                  <span className="ml-2 font-medium">{selectedOrder.seller?.full_name}</span>
                </div>
              </div>

              {/* Product */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">Sản phẩm</h4>
                <div className="flex gap-3">
                  <img
                    src={selectedOrder.listing?.images?.[0] || "/default-avatar.jpg"}
                    alt=""
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium">{selectedOrder.listing?.title}</p>
                    <p className="text-sm text-gray-500">x{selectedOrder.quantity}</p>
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">Thanh toán</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Tổng tiền hàng:</span>
                    <span>₫{formatMoney(selectedOrder.total_amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phí sàn (5%):</span>
                    <span className="text-red-600">-₫{formatMoney(selectedOrder.platform_fee)}</span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t">
                    <span>Seller nhận:</span>
                    <span className="text-green-600">₫{formatMoney(selectedOrder.seller_receive)}</span>
                  </div>
                </div>
              </div>

              {/* Refund Request */}
              {selectedOrder.refund_requested_at && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
                    <AlertTriangle size={18} /> Yêu cầu hoàn tiền
                  </h4>
                  <p className="text-sm text-gray-700 mb-2">
                    <span className="font-medium">Lý do:</span> {selectedOrder.refund_reason || "Không có"}
                  </p>
                  <p className="text-xs text-gray-500">
                    Yêu cầu lúc: {formatDate(selectedOrder.refund_requested_at)}
                  </p>
                  
                  {!selectedOrder.refund_processed_at && (
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleProcessRefund(selectedOrder.id, "approve")}
                        disabled={processing === selectedOrder.id}
                        className="flex-1 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-medium rounded-lg"
                      >
                        ✅ Duyệt hoàn tiền
                      </button>
                      <button
                        onClick={() => handleProcessRefund(selectedOrder.id, "reject")}
                        disabled={processing === selectedOrder.id}
                        className="flex-1 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-medium rounded-lg"
                      >
                        ❌ Từ chối
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full mt-6 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
