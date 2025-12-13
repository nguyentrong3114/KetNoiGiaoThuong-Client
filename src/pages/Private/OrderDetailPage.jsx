import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Package, Clock, Truck, CheckCircle, XCircle, Star, AlertTriangle,
  ArrowLeft, MapPin, MessageCircle, CreditCard, User, RefreshCw
} from "lucide-react";
import { orderApi, reviewApi } from "../../services/apiClient";

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  // Review modal
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, content: "" });

  // Refund modal
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundReason, setRefundReason] = useState("");

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await orderApi.getById(id);
      setOrder(res?.data || res);
    } catch (err) {
      console.error("Error loading order:", err);
      if (err.message?.includes("404") || err.message?.includes("không tìm thấy")) {
        setError("Đơn hàng không tồn tại");
      } else if (err.message?.includes("403") || err.message?.includes("quyền")) {
        setError("Bạn không có quyền xem đơn hàng này");
      } else {
        setError(err.message || "Không thể tải đơn hàng");
      }
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
    shipping: { label: "Đang giao hàng", color: "bg-purple-100 text-purple-700", icon: <Truck size={16} /> },
    delivered: { label: "Đã giao hàng", color: "bg-green-100 text-green-700", icon: <CheckCircle size={16} /> },
    completed: { label: "Hoàn thành", color: "bg-green-100 text-green-700", icon: <CheckCircle size={16} /> },
    cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-700", icon: <XCircle size={16} /> },
    refunded: { label: "Đã hoàn tiền", color: "bg-orange-100 text-orange-700", icon: <RefreshCw size={16} /> },
  };

  const getStatus = (status) => statusConfig[status] || statusConfig.pending;


  // Thanh toán đơn hàng
  const handlePayOrder = async () => {
    if (!confirm("Xác nhận thanh toán đơn hàng này bằng ví?")) return;
    setProcessing(true);
    try {
      await orderApi.pay(id);
      alert("Thanh toán thành công!");
      loadOrder();
    } catch (err) {
      if (err.message.includes("không đủ")) {
        if (confirm("Số dư ví không đủ. Bạn có muốn nạp tiền?")) {
          navigate("/wallet/deposit");
        }
      } else {
        alert(err.message || "Thanh toán thất bại");
      }
    } finally {
      setProcessing(false);
    }
  };

  // Hủy đơn hàng
  const handleCancelOrder = async () => {
    const reason = prompt("Nhập lý do hủy đơn:");
    if (!reason) return;
    setProcessing(true);
    try {
      await orderApi.cancel(id, reason);
      alert("Đã hủy đơn hàng!");
      loadOrder();
    } catch (err) {
      alert(err.message || "Hủy đơn thất bại");
    } finally {
      setProcessing(false);
    }
  };

  // Xác nhận nhận hàng
  const handleConfirmReceived = async () => {
    if (!confirm("Xác nhận bạn đã nhận được hàng?")) return;
    setProcessing(true);
    try {
      await orderApi.confirmReceived(id);
      alert("Đã xác nhận nhận hàng!");
      loadOrder();
    } catch (err) {
      alert(err.message || "Xác nhận thất bại");
    } finally {
      setProcessing(false);
    }
  };

  // Gửi đánh giá
  const handleSubmitReview = async () => {
    if (!reviewData.content.trim() || reviewData.content.trim().length < 10) {
      alert("Nội dung đánh giá phải có ít nhất 10 ký tự");
      return;
    }
    setProcessing(true);
    try {
      await reviewApi.create({
        order_id: order.id,
        rating: reviewData.rating,
        comment: reviewData.content.trim(),
      });
      alert("Đánh giá thành công!");
      setShowReviewModal(false);
      loadOrder();
    } catch (err) {
      alert(err.message || "Đánh giá thất bại");
    } finally {
      setProcessing(false);
    }
  };

  // Gửi yêu cầu hoàn tiền
  const handleSubmitRefund = async () => {
    if (!refundReason.trim()) {
      alert("Vui lòng nhập lý do hoàn tiền");
      return;
    }
    setProcessing(true);
    try {
      await orderApi.requestRefund(order.id, refundReason);
      alert("Đã gửi yêu cầu hoàn tiền. Vui lòng chờ admin xử lý.");
      setShowRefundModal(false);
      loadOrder();
    } catch (err) {
      alert(err.message || "Gửi yêu cầu thất bại");
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">{error}</h2>
        <button onClick={() => navigate(-1)} className="text-indigo-600 hover:underline">
          ← Quay lại
        </button>
      </div>
    );
  }

  if (!order) return null;

  const status = getStatus(order.status);
  const listing = order.listing;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
        <ArrowLeft size={20} /> Quay lại
      </button>

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Chi tiết đơn hàng</h1>
            <p className="text-gray-500">Mã đơn: {order.order_number || order.id}</p>
          </div>
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
            {status.icon} {status.label}
          </span>
        </div>
        {order.payment_status === "paid" && (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
            <CreditCard size={14} /> Đã thanh toán
          </span>
        )}
      </div>


      {/* Product Info */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h3 className="font-semibold text-gray-800 mb-4">Sản phẩm</h3>
        <div className="flex gap-4">
          <img
            src={listing?.images?.[0] || listing?.image || "/default-avatar.jpg"}
            alt={listing?.title}
            className="w-24 h-24 object-cover rounded-lg"
            onError={(e) => (e.target.src = "/default-avatar.jpg")}
          />
          <div className="flex-1">
            <Link to={`/listings/${listing?.id}`} className="font-medium text-gray-800 hover:text-indigo-600">
              {listing?.title || "Sản phẩm"}
            </Link>
            <p className="text-sm text-gray-500 mt-1">Số lượng: {order.quantity || 1}</p>
            <p className="text-indigo-600 font-semibold mt-1">₫{formatMoney(order.unit_price)}</p>
          </div>
        </div>
      </div>

      {/* Shipping Info */}
      {order.shipping_address && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <MapPin size={18} /> Địa chỉ giao hàng
          </h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p className="font-medium text-gray-800">{order.shipping_address.name}</p>
            <p>{order.shipping_address.phone}</p>
            <p>{order.shipping_address.address}, {order.shipping_address.district}, {order.shipping_address.city}</p>
          </div>
          {order.tracking_number && (
            <p className="mt-3 text-sm">
              <span className="text-gray-500">Mã vận đơn:</span>{" "}
              <span className="font-mono font-semibold text-indigo-600">{order.tracking_number}</span>
            </p>
          )}
        </div>
      )}

      {/* Seller Contact */}
      {order.seller_contact && order.payment_status === "paid" && (
        <div className="bg-blue-50 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
            <User size={18} /> Thông tin người bán
          </h3>
          <div className="text-sm space-y-1">
            <p><span className="text-gray-600">Tên:</span> {order.seller_contact.name}</p>
            <p><span className="text-gray-600">SĐT:</span> {order.seller_contact.phone}</p>
            <p><span className="text-gray-600">Email:</span> {order.seller_contact.email}</p>
          </div>
        </div>
      )}

      {/* Payment Summary */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h3 className="font-semibold text-gray-800 mb-4">Thanh toán</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Tổng tiền hàng</span>
            <span>₫{formatMoney(order.total_amount)}</span>
          </div>
          {order.shipping_fee > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Phí vận chuyển</span>
              <span>₫{formatMoney(order.shipping_fee)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg pt-2 border-t">
            <span>Tổng thanh toán</span>
            <span className="text-indigo-600">₫{formatMoney(order.final_amount || order.total_amount)}</span>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-3">Ngày đặt: {formatDate(order.created_at)}</p>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-wrap gap-3">
          {order.status === "pending" && order.payment_status !== "paid" && (
            <button onClick={handlePayOrder} disabled={processing}
              className="flex-1 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-medium rounded-lg flex items-center justify-center gap-2">
              <CreditCard size={18} /> Thanh toán
            </button>
          )}
          {["pending", "confirmed"].includes(order.status) && (
            <button onClick={handleCancelOrder} disabled={processing}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-medium rounded-lg">
              Hủy đơn
            </button>
          )}
          {["shipping", "delivered"].includes(order.status) && (
            <button onClick={handleConfirmReceived} disabled={processing}
              className="flex-1 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-medium rounded-lg flex items-center justify-center gap-2">
              <CheckCircle size={18} /> Đã nhận hàng
            </button>
          )}
          {order.status === "completed" && !order.is_reviewed && (
            <button onClick={() => setShowReviewModal(true)}
              className="flex-1 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg flex items-center justify-center gap-2">
              <Star size={18} /> Đánh giá
            </button>
          )}
          {["delivered", "completed"].includes(order.status) && !order.refund_requested_at && (
            <button onClick={() => setShowRefundModal(true)}
              className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 font-medium rounded-lg flex items-center gap-2">
              <AlertTriangle size={18} /> Yêu cầu hoàn tiền
            </button>
          )}
          {order.seller && (
            <Link to={`/chat?user=${order.seller.id}`}
              className="px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-600 font-medium rounded-lg flex items-center gap-2">
              <MessageCircle size={18} /> Liên hệ
            </Link>
          )}
        </div>
      </div>


      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Đánh giá sản phẩm</h3>
            <div className="flex gap-3 mb-4 pb-4 border-b">
              <img src={listing?.images?.[0] || "/default-avatar.jpg"} alt="" className="w-16 h-16 object-cover rounded-lg" />
              <div>
                <p className="font-medium text-gray-800">{listing?.title}</p>
                <p className="text-sm text-gray-500">Mã đơn: {order.order_number}</p>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Đánh giá</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => setReviewData({ ...reviewData, rating: star })} className="text-2xl">
                    {star <= reviewData.rating ? "⭐" : "☆"}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Nội dung đánh giá</label>
              <textarea value={reviewData.content} onChange={(e) => setReviewData({ ...reviewData, content: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" rows={4}
                placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..." />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowReviewModal(false)} className="flex-1 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50">Hủy</button>
              <button onClick={handleSubmitReview} disabled={processing}
                className="flex-1 py-2 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-white font-medium rounded-lg">
                {processing ? "Đang gửi..." : "Gửi đánh giá"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Refund Modal */}
      {showRefundModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Yêu cầu hoàn tiền</h3>
            <div className="flex gap-3 mb-4 pb-4 border-b">
              <img src={listing?.images?.[0] || "/default-avatar.jpg"} alt="" className="w-16 h-16 object-cover rounded-lg" />
              <div>
                <p className="font-medium text-gray-800">{listing?.title}</p>
                <p className="text-sm text-gray-500">Số tiền: ₫{formatMoney(order.final_amount)}</p>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Lý do hoàn tiền *</label>
              <textarea value={refundReason} onChange={(e) => setRefundReason(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500" rows={4}
                placeholder="Mô tả lý do bạn muốn hoàn tiền..." />
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 text-sm text-yellow-700">
              <AlertTriangle size={16} className="inline mr-2" />
              Yêu cầu hoàn tiền sẽ được admin xem xét trong vòng 24-48h.
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowRefundModal(false)} className="flex-1 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50">Hủy</button>
              <button onClick={handleSubmitRefund} disabled={processing}
                className="flex-1 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-medium rounded-lg">
                {processing ? "Đang gửi..." : "Gửi yêu cầu"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetailPage;
