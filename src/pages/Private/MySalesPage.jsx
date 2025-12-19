import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  RefreshCw,
  ChevronRight,
  MapPin,
  MessageCircle,
  Phone,
  User,
} from "lucide-react";
import { orderApi } from "../../services/apiClient";

const MySalesPage = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    loadData();
  }, [filter]);

  const loadData = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter !== "all") {
        params.status = filter;
      }

      const [ordersRes, statsRes] = await Promise.all([
        orderApi.getMySales(params),
        orderApi.getStats(),
      ]);

      setOrders(ordersRes?.data || []);
      setStats(statsRes?.data || null);
    } catch (err) {
      console.error("Error loading sales:", err);
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
    pending: { label: "Chờ thanh toán", color: "bg-yellow-100 text-yellow-700", icon: <Clock size={16} /> },
    confirmed: { label: "Đã xác nhận", color: "bg-blue-100 text-blue-700", icon: <CheckCircle size={16} /> },
    processing: { label: "Đang xử lý", color: "bg-indigo-100 text-indigo-700", icon: <Package size={16} /> },
    shipping: { label: "Đang giao", color: "bg-purple-100 text-purple-700", icon: <Truck size={16} /> },
    delivered: { label: "Đã giao", color: "bg-green-100 text-green-700", icon: <CheckCircle size={16} /> },
    completed: { label: "Hoàn thành", color: "bg-green-100 text-green-700", icon: <CheckCircle size={16} /> },
    cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-700", icon: <XCircle size={16} /> },
    refunded: { label: "Đã hoàn tiền", color: "bg-orange-100 text-orange-700", icon: <RefreshCw size={16} /> },
  };

  const getStatus = (status) => statusConfig[status] || statusConfig.pending;

  const filterTabs = [
    { id: "all", label: "Tất cả", count: stats?.sales?.total },
    { id: "confirmed", label: "Cần xử lý", count: stats?.sales?.confirmed },
    { id: "shipping", label: "Đang giao", count: stats?.sales?.shipping },
    { id: "completed", label: "Hoàn thành", count: stats?.sales?.completed },
    { id: "cancelled", label: "Đã hủy", count: stats?.sales?.cancelled },
  ];

  // Cập nhật trạng thái đơn hàng
  const handleUpdateStatus = async (orderId, newStatus, trackingNumber = null) => {
    setProcessing(orderId);
    try {
      const payload = { status: newStatus };
      if (trackingNumber) payload.tracking_number = trackingNumber;
      
      await orderApi.update(orderId, payload);
      alert("Cập nhật thành công!");
      loadData();
      setSelectedOrder(null);
    } catch (err) {
      alert(err.message || "Cập nhật thất bại");
    } finally {
      setProcessing(null);
    }
  };

  // Xác nhận đơn hàng
  const handleConfirmOrder = (orderId) => {
    if (!confirm("Xác nhận đơn hàng này?")) return;
    handleUpdateStatus(orderId, "confirmed");
  };

  // Bắt đầu giao hàng
  const handleStartShipping = (orderId) => {
    const tracking = prompt("Nhập mã vận đơn (nếu có):");
    handleUpdateStatus(orderId, "shipping", tracking || null);
  };

  // Đánh dấu đã giao
  const handleMarkDelivered = (orderId) => {
    if (!confirm("Xác nhận đã giao hàng cho khách?")) return;
    handleUpdateStatus(orderId, "delivered");
  };

  // Xem chi tiết
  const viewOrderDetail = async (orderId) => {
    try {
      const res = await orderApi.getById(orderId);
      setSelectedOrder(res?.data || res);
    } catch (err) {
      alert(err.message || "Không thể tải chi tiết");
    }
  };

  // Render Order Detail Modal
  const renderOrderDetail = () => {
    if (!selectedOrder) return null;

    const status = getStatus(selectedOrder.status);
    const listing = selectedOrder.listing;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Chi tiết đơn hàng</h2>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
            </div>
            <p className="text-sm text-gray-500 mt-1">Mã đơn: {selectedOrder.order_number}</p>
          </div>

          {/* Status */}
          <div className="p-6 border-b">
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
              {status.icon} {status.label}
            </span>
          </div>

          {/* Product */}
          <div className="p-6 border-b">
            <h3 className="font-semibold text-gray-800 mb-4">Sản phẩm</h3>
            <div className="flex gap-4">
              <img
                src={listing?.images?.[0] || "/default-avatar.jpg"}
                alt={listing?.title}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-800">{listing?.title}</p>
                <p className="text-sm text-gray-500">x{selectedOrder.quantity}</p>
                <p className="text-indigo-600 font-semibold">₫{formatMoney(selectedOrder.unit_price)}</p>
              </div>
            </div>
          </div>

          {/* Buyer Info */}
          <div className="p-6 border-b bg-blue-50">
            <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
              <User size={18} /> Thông tin người mua
            </h3>
            <div className="text-sm space-y-1">
              <p><span className="text-gray-600">Tên:</span> {selectedOrder.buyer?.full_name}</p>
              <p><span className="text-gray-600">Email:</span> {selectedOrder.buyer?.email}</p>
              {selectedOrder.buyer?.phone && (
                <p><span className="text-gray-600">SĐT:</span> {selectedOrder.buyer?.phone}</p>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          {selectedOrder.shipping_address && (
            <div className="p-6 border-b">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <MapPin size={18} /> Địa chỉ giao hàng
              </h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p className="font-medium text-gray-800">{selectedOrder.shipping_address.name}</p>
                <p className="flex items-center gap-1"><Phone size={14} /> {selectedOrder.shipping_address.phone}</p>
                <p>{selectedOrder.shipping_address.address}, {selectedOrder.shipping_address.district}, {selectedOrder.shipping_address.city}</p>
              </div>
            </div>
          )}

          {/* Payment Summary */}
          <div className="p-6 border-b">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Tổng tiền hàng</span>
                <span>₫{formatMoney(selectedOrder.total_amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phí sàn (5%)</span>
                <span className="text-red-600">-₫{formatMoney(selectedOrder.platform_fee)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t text-green-600">
                <span>Bạn nhận được</span>
                <span>₫{formatMoney(selectedOrder.seller_receive)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 flex flex-wrap gap-3">
            {selectedOrder.status === "confirmed" && (
              <button
                onClick={() => handleStartShipping(selectedOrder.id)}
                disabled={processing === selectedOrder.id}
                className="flex-1 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white font-medium rounded-lg flex items-center justify-center gap-2"
              >
                <Truck size={18} /> Bắt đầu giao hàng
              </button>
            )}

            {selectedOrder.status === "shipping" && (
              <button
                onClick={() => handleMarkDelivered(selectedOrder.id)}
                disabled={processing === selectedOrder.id}
                className="flex-1 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-medium rounded-lg flex items-center justify-center gap-2"
              >
                <CheckCircle size={18} /> Đã giao hàng
              </button>
            )}

            {selectedOrder.buyer && (
              <Link
                to={`/chat?user=${selectedOrder.buyer.id}`}
                className="px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-600 font-medium rounded-lg flex items-center gap-2"
              >
                <MessageCircle size={18} /> Liên hệ
              </Link>
            )}

            <button
              onClick={() => setSelectedOrder(null)}
              className="px-6 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">🏪 Đơn hàng cần xử lý</h1>
          {stats?.sales?.total_revenue > 0 && (
            <div className="bg-green-50 px-4 py-2 rounded-lg">
              <span className="text-sm text-green-600">Tổng doanh thu: </span>
              <span className="font-bold text-green-700">₫{formatMoney(stats.sales.total_revenue)}</span>
            </div>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6 overflow-x-auto">
          <div className="flex">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`flex-1 min-w-[100px] px-4 py-3 text-sm font-medium transition border-b-2 whitespace-nowrap ${
                  filter === tab.id
                    ? "border-indigo-600 text-indigo-600 bg-indigo-50"
                    : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {tab.label}
                {tab.count > 0 && <span className="ml-1 px-1.5 py-0.5 text-xs bg-gray-200 rounded-full">{tab.count}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Chưa có đơn hàng nào</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const status = getStatus(order.status);
              const listing = order.listing;

              return (
                <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  {/* Header */}
                  <div className="px-4 py-3 bg-gray-50 border-b flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500">
                        Mã: <span className="font-mono font-semibold text-gray-800">{order.order_number}</span>
                      </span>
                      <span className="text-sm text-gray-500">{formatDate(order.created_at)}</span>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                      {status.icon} {status.label}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex gap-4">
                      <img
                        src={listing?.images?.[0] || "/default-avatar.jpg"}
                        alt={listing?.title}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800">{listing?.title}</h3>
                        <p className="text-sm text-gray-500">x{order.quantity}</p>
                        <p className="text-sm text-gray-500">Người mua: {order.buyer?.full_name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">₫{formatMoney(order.seller_receive)}</p>
                        <p className="text-xs text-gray-500">Bạn nhận</p>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-4 py-3 bg-gray-50 border-t flex items-center justify-between">
                    <div className="flex gap-2">
                      {order.status === "confirmed" && (
                        <button
                          onClick={() => handleStartShipping(order.id)}
                          disabled={processing === order.id}
                          className="px-3 py-1.5 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white text-sm font-medium rounded-lg"
                        >
                          Giao hàng
                        </button>
                      )}
                      {order.status === "shipping" && (
                        <button
                          onClick={() => handleMarkDelivered(order.id)}
                          disabled={processing === order.id}
                          className="px-3 py-1.5 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white text-sm font-medium rounded-lg"
                        >
                          Đã giao
                        </button>
                      )}
                    </div>
                    <button
                      onClick={() => viewOrderDetail(order.id)}
                      className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                    >
                      Chi tiết <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {renderOrderDetail()}
    </div>
  );
};

export default MySalesPage;
