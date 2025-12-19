import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Package,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  Star,
  AlertTriangle,
  RefreshCw,
  ChevronRight,
  MapPin,
  MessageCircle,
  CreditCard,
  Phone,
  User,
  FileText,
} from "lucide-react";
import { orderApi, reviewApi } from "../../services/apiClient";

const MyOrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [processing, setProcessing] = useState(null);

  // Review modal
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewOrder, setReviewOrder] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: 5, content: "" });

  // Refund modal
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundOrder, setRefundOrder] = useState(null);
  const [refundReason, setRefundReason] = useState("");

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
        orderApi.getMyPurchases(params),
        orderApi.getStats(),
      ]);

      setOrders(ordersRes?.data || []);
      setStats(statsRes?.data || null);
    } catch (err) {
      console.error("Error loading orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatMoney = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount || 0);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statusConfig = {
    pending: {
      label: "Chờ thanh toán",
      color: "bg-yellow-100 text-yellow-700",
      icon: <Clock size={16} />,
    },
    confirmed: {
      label: "Đã xác nhận",
      color: "bg-blue-100 text-blue-700",
      icon: <CheckCircle size={16} />,
    },
    processing: {
      label: "Đang xử lý",
      color: "bg-indigo-100 text-indigo-700",
      icon: <Package size={16} />,
    },
    shipping: {
      label: "Đang giao hàng",
      color: "bg-purple-100 text-purple-700",
      icon: <Truck size={16} />,
    },
    delivered: {
      label: "Đã giao hàng",
      color: "bg-green-100 text-green-700",
      icon: <CheckCircle size={16} />,
    },
    completed: {
      label: "Hoàn thành",
      color: "bg-green-100 text-green-700",
      icon: <CheckCircle size={16} />,
    },
    cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-700", icon: <XCircle size={16} /> },
    refunded: {
      label: "Đã hoàn tiền",
      color: "bg-orange-100 text-orange-700",
      icon: <RefreshCw size={16} />,
    },
  };

  const getStatus = (status) => statusConfig[status] || statusConfig.pending;

  const filterTabs = [
    { id: "all", label: "Tất cả", count: stats?.purchases?.total },
    { id: "pending", label: "Chờ thanh toán", count: stats?.purchases?.pending },
    { id: "confirmed", label: "Đã xác nhận", count: stats?.purchases?.confirmed },
    { id: "shipping", label: "Đang giao", count: stats?.purchases?.shipping },
    { id: "delivered", label: "Đã giao", count: stats?.purchases?.delivered },
    { id: "completed", label: "Hoàn thành", count: stats?.purchases?.completed },
    { id: "cancelled", label: "Đã hủy", count: stats?.purchases?.cancelled },
  ];

  // Thanh toán đơn hàng
  const handlePayOrder = async (orderId) => {
    if (!confirm("Xác nhận thanh toán đơn hàng này bằng ví?")) return;

    setProcessing(orderId);
    try {
      const res = await orderApi.pay(orderId);
      alert("Thanh toán thành công!");
      loadData();
      setSelectedOrder(null);
    } catch (err) {
      if (err.message.includes("không đủ")) {
        if (confirm("Số dư ví không đủ. Bạn có muốn nạp tiền?")) {
          navigate("/wallet/deposit");
        }
      } else {
        alert(err.message || "Thanh toán thất bại");
      }
    } finally {
      setProcessing(null);
    }
  };

  // Hủy đơn hàng
  const handleCancelOrder = async (orderId) => {
    const reason = prompt("Nhập lý do hủy đơn:");
    if (!reason) return;

    setProcessing(orderId);
    try {
      await orderApi.cancel(orderId, reason);
      alert("Đã hủy đơn hàng!");
      loadData();
      setSelectedOrder(null);
    } catch (err) {
      alert(err.message || "Hủy đơn thất bại");
    } finally {
      setProcessing(null);
    }
  };

  // Xác nhận nhận hàng
  const handleConfirmReceived = async (orderId) => {
    if (!confirm("Xác nhận bạn đã nhận được hàng?")) return;

    setProcessing(orderId);
    try {
      await orderApi.confirmReceived(orderId);
      alert("Đã xác nhận nhận hàng!");
      loadData();
      setSelectedOrder(null);
    } catch (err) {
      alert(err.message || "Xác nhận thất bại");
    } finally {
      setProcessing(null);
    }
  };

  // Mở modal đánh giá
  const openReviewModal = (order) => {
    setReviewOrder(order);
    setReviewData({ rating: 5, content: "" });
    setShowReviewModal(true);
  };

  // Gửi đánh giá
  const handleSubmitReview = async () => {
    if (!reviewData.content.trim()) {
      alert("Vui lòng nhập nội dung đánh giá (tối thiểu 10 ký tự)");
      return;
    }
    if (reviewData.content.trim().length < 10) {
      alert("Nội dung đánh giá phải có ít nhất 10 ký tự");
      return;
    }

    setProcessing(reviewOrder.id);
    try {
      // BE yêu cầu: order_id, rating, comment (không phải content)
      await reviewApi.create({
        order_id: reviewOrder.id,
        rating: reviewData.rating,
        comment: reviewData.content.trim(),
      });
      alert("Đánh giá thành công!");
      setShowReviewModal(false);
      loadData();
    } catch (err) {
      alert(err.message || "Đánh giá thất bại");
    } finally {
      setProcessing(null);
    }
  };

  // Mở modal hoàn tiền
  const openRefundModal = (order) => {
    setRefundOrder(order);
    setRefundReason("");
    setShowRefundModal(true);
  };

  // Gửi yêu cầu hoàn tiền
  const handleSubmitRefund = async () => {
    if (!refundReason.trim()) {
      alert("Vui lòng nhập lý do hoàn tiền");
      return;
    }

    setProcessing(refundOrder.id);
    try {
      await orderApi.requestRefund(refundOrder.id, refundReason);
      alert("Đã gửi yêu cầu hoàn tiền. Vui lòng chờ admin xử lý.");
      setShowRefundModal(false);
      loadData();
    } catch (err) {
      alert(err.message || "Gửi yêu cầu thất bại");
    } finally {
      setProcessing(null);
    }
  };

  // Xem chi tiết đơn hàng
  const viewOrderDetail = async (orderId) => {
    try {
      const res = await orderApi.getById(orderId);
      setSelectedOrder(res?.data || res);
    } catch (err) {
      alert(err.message || "Không thể tải chi tiết đơn hàng");
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
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Mã đơn: {selectedOrder.order_number || selectedOrder.id}
            </p>
          </div>

          {/* Order Status */}
          <div className="p-6 border-b">
            <div className="flex items-center gap-2 mb-4">
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${status.color}`}
              >
                {status.icon} {status.label}
              </span>
              {selectedOrder.payment_status === "paid" && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                  <CreditCard size={14} /> Đã thanh toán
                </span>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="p-6 border-b">
            <h3 className="font-semibold text-gray-800 mb-4">Sản phẩm</h3>
            <div className="flex gap-4">
              <img
                src={listing?.images?.[0] || listing?.image || "/default-avatar.jpg"}
                alt={listing?.title}
                className="w-20 h-20 object-cover rounded-lg"
                onError={(e) => (e.target.src = "/default-avatar.jpg")}
              />
              <div className="flex-1">
                <p className="font-medium text-gray-800">{listing?.title || "Sản phẩm"}</p>
                <p className="text-sm text-gray-500">x{selectedOrder.quantity || 1}</p>
                <p className="text-indigo-600 font-semibold">
                  ₫{formatMoney(selectedOrder.unit_price)}
                </p>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          {selectedOrder.shipping_address && (
            <div className="p-6 border-b">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <MapPin size={18} /> Địa chỉ giao hàng
              </h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p className="font-medium text-gray-800">{selectedOrder.shipping_address.name}</p>
                <p>{selectedOrder.shipping_address.phone}</p>
                <p>
                  {selectedOrder.shipping_address.address},{" "}
                  {selectedOrder.shipping_address.district}, {selectedOrder.shipping_address.city}
                </p>
              </div>
              {selectedOrder.tracking_number && (
                <p className="mt-3 text-sm">
                  <span className="text-gray-500">Mã vận đơn:</span>{" "}
                  <span className="font-mono font-semibold text-indigo-600">
                    {selectedOrder.tracking_number}
                  </span>
                </p>
              )}
            </div>
          )}

          {/* Seller Contact (after payment) */}
          {selectedOrder.seller_contact && selectedOrder.payment_status === "paid" && (
            <div className="p-6 border-b bg-blue-50">
              <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <User size={18} /> Thông tin người bán
              </h3>
              <div className="text-sm space-y-1">
                <p>
                  <span className="text-gray-600">Tên:</span> {selectedOrder.seller_contact.name}
                </p>
                <p>
                  <span className="text-gray-600">SĐT:</span> {selectedOrder.seller_contact.phone}
                </p>
                <p>
                  <span className="text-gray-600">Email:</span> {selectedOrder.seller_contact.email}
                </p>
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
              {selectedOrder.shipping_fee > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Phí vận chuyển</span>
                  <span>₫{formatMoney(selectedOrder.shipping_fee)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Tổng thanh toán</span>
                <span className="text-indigo-600">
                  ₫{formatMoney(selectedOrder.final_amount || selectedOrder.total_amount)}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 flex flex-wrap gap-3">
            {/* Thanh toán */}
            {selectedOrder.status === "pending" && selectedOrder.payment_status !== "paid" && (
              <button
                onClick={() => handlePayOrder(selectedOrder.id)}
                disabled={processing === selectedOrder.id}
                className="flex-1 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-medium rounded-lg flex items-center justify-center gap-2"
              >
                <CreditCard size={18} /> Thanh toán
              </button>
            )}

            {/* Hủy đơn */}
            {["pending", "confirmed"].includes(selectedOrder.status) && (
              <button
                onClick={() => handleCancelOrder(selectedOrder.id)}
                disabled={processing === selectedOrder.id}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-medium rounded-lg"
              >
                Hủy đơn
              </button>
            )}

            {/* Xác nhận nhận hàng */}
            {["shipping", "delivered"].includes(selectedOrder.status) && (
              <button
                onClick={() => handleConfirmReceived(selectedOrder.id)}
                disabled={processing === selectedOrder.id}
                className="flex-1 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-medium rounded-lg flex items-center justify-center gap-2"
              >
                <CheckCircle size={18} /> Đã nhận hàng
              </button>
            )}

            {/* Đánh giá */}
            {selectedOrder.status === "completed" && !selectedOrder.is_reviewed && (
              <button
                onClick={() => openReviewModal(selectedOrder)}
                className="flex-1 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg flex items-center justify-center gap-2"
              >
                <Star size={18} /> Đánh giá
              </button>
            )}

            {/* Hoàn tiền */}
            {["delivered", "completed"].includes(selectedOrder.status) &&
              !selectedOrder.refund_requested_at && (
                <button
                  onClick={() => openRefundModal(selectedOrder)}
                  className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 font-medium rounded-lg flex items-center gap-2"
                >
                  <AlertTriangle size={18} /> Yêu cầu hoàn tiền
                </button>
              )}

            {/* Liên hệ seller */}
            {selectedOrder.seller && (
              <Link
                to={`/chat?user=${selectedOrder.seller.id}`}
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

  // Render Review Modal
  const renderReviewModal = () => {
    if (!showReviewModal || !reviewOrder) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Đánh giá sản phẩm</h3>

          {/* Product Info */}
          <div className="flex gap-3 mb-4 pb-4 border-b">
            <img
              src={reviewOrder.listing?.images?.[0] || "/default-avatar.jpg"}
              alt=""
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div>
              <p className="font-medium text-gray-800">{reviewOrder.listing?.title}</p>
              <p className="text-sm text-gray-500">Mã đơn: {reviewOrder.order_number}</p>
            </div>
          </div>

          {/* Rating */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Đánh giá</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setReviewData({ ...reviewData, rating: star })}
                  className="text-2xl"
                >
                  {star <= reviewData.rating ? "⭐" : "☆"}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nội dung đánh giá
            </label>
            <textarea
              value={reviewData.content}
              onChange={(e) => setReviewData({ ...reviewData, content: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              rows={4}
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowReviewModal(false)}
              className="flex-1 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmitReview}
              disabled={processing === reviewOrder.id}
              className="flex-1 py-2 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-white font-medium rounded-lg"
            >
              {processing === reviewOrder.id ? "Đang gửi..." : "Gửi đánh giá"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render Refund Modal
  const renderRefundModal = () => {
    if (!showRefundModal || !refundOrder) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Yêu cầu hoàn tiền</h3>

          {/* Product Info */}
          <div className="flex gap-3 mb-4 pb-4 border-b">
            <img
              src={refundOrder.listing?.images?.[0] || "/default-avatar.jpg"}
              alt=""
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div>
              <p className="font-medium text-gray-800">{refundOrder.listing?.title}</p>
              <p className="text-sm text-gray-500">
                Số tiền: ₫{formatMoney(refundOrder.final_amount)}
              </p>
            </div>
          </div>

          {/* Reason */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lý do hoàn tiền *
            </label>
            <textarea
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
              rows={4}
              placeholder="Mô tả lý do bạn muốn hoàn tiền..."
            />
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 text-sm text-yellow-700">
            <AlertTriangle size={16} className="inline mr-2" />
            Yêu cầu hoàn tiền sẽ được admin xem xét trong vòng 24-48h.
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowRefundModal(false)}
              className="flex-1 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmitRefund}
              disabled={processing === refundOrder.id}
              className="flex-1 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-medium rounded-lg"
            >
              {processing === refundOrder.id ? "Đang gửi..." : "Gửi yêu cầu"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">📦 Đơn hàng của bạn</h1>

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
                {tab.count > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs bg-gray-200 rounded-full">
                    {tab.count}
                  </span>
                )}
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
            <p className="text-gray-500 text-lg mb-4">Chưa có đơn hàng nào</p>
            <Link to="/products" className="text-indigo-600 hover:underline font-medium">
              ← Tiếp tục mua sắm
            </Link>
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
                        Mã đơn:{" "}
                        <span className="font-mono font-semibold text-gray-800">
                          {order.order_number || order.id}
                        </span>
                      </span>
                      <span className="text-sm text-gray-500">{formatDate(order.created_at)}</span>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.color}`}
                    >
                      {status.icon} {status.label}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <img
                        src={listing?.images?.[0] || listing?.image || "/default-avatar.jpg"}
                        alt={listing?.title}
                        className="w-20 h-20 object-cover rounded-lg"
                        onError={(e) => (e.target.src = "/default-avatar.jpg")}
                      />

                      {/* Product Info */}
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800 line-clamp-2">
                          {listing?.title || "Sản phẩm"}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">x{order.quantity || 1}</p>
                        {order.shop && (
                          <p className="text-sm text-gray-500">Shop: {order.shop.name}</p>
                        )}
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          ₫{formatMoney(order.final_amount || order.total_amount)}
                        </p>
                        {order.payment_status === "paid" && (
                          <span className="text-xs text-green-600">✓ Đã thanh toán</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="px-4 py-3 bg-gray-50 border-t flex items-center justify-between">
                    <div className="flex gap-2">
                      {/* Thanh toán */}
                      {order.status === "pending" && order.payment_status !== "paid" && (
                        <button
                          onClick={() => handlePayOrder(order.id)}
                          disabled={processing === order.id}
                          className="px-3 py-1.5 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white text-sm font-medium rounded-lg"
                        >
                          Thanh toán
                        </button>
                      )}

                      {/* Xác nhận nhận hàng */}
                      {["shipping", "delivered"].includes(order.status) && (
                        <button
                          onClick={() => handleConfirmReceived(order.id)}
                          disabled={processing === order.id}
                          className="px-3 py-1.5 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white text-sm font-medium rounded-lg"
                        >
                          Đã nhận hàng
                        </button>
                      )}

                      {/* Đánh giá */}
                      {order.status === "completed" && !order.is_reviewed && (
                        <button
                          onClick={() => openReviewModal(order)}
                          className="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium rounded-lg flex items-center gap-1"
                        >
                          <Star size={14} /> Đánh giá
                        </button>
                      )}

                      {/* Hoàn tiền */}
                      {["delivered", "completed"].includes(order.status) &&
                        !order.refund_requested_at && (
                          <button
                            onClick={() => openRefundModal(order)}
                            className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-600 text-sm font-medium rounded-lg flex items-center gap-1"
                          >
                            <AlertTriangle size={14} /> Hoàn tiền
                          </button>
                        )}

                      {/* Hủy đơn */}
                      {order.status === "pending" && (
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          disabled={processing === order.id}
                          className="px-3 py-1.5 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white text-sm font-medium rounded-lg"
                        >
                          Hủy đơn
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() => viewOrderDetail(order.id)}
                      className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                    >
                      Xem chi tiết <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
          <p className="font-medium mb-2">💡 Lưu ý:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Bạn có thể hủy đơn hàng khi đơn đang ở trạng thái "Chờ thanh toán"</li>
            <li>Sau khi nhận hàng, vui lòng xác nhận và đánh giá sản phẩm</li>
            <li>Nếu có vấn đề với đơn hàng, hãy yêu cầu hoàn tiền trong vòng 7 ngày</li>
          </ul>
        </div>
      </div>

      {/* Modals */}
      {renderOrderDetail()}
      {renderReviewModal()}
      {renderRefundModal()}
    </div>
  );
};

export default MyOrdersPage;
