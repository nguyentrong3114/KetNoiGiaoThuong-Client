import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, Copy, Clock } from "lucide-react";
import { subscriptionApi } from "../../services/apiClient";

const SubscriptionCheckoutPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const planId = searchParams.get("plan");
  const duration = parseInt(searchParams.get("duration") || "1");

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [copied, setCopied] = useState("");

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const response = await subscriptionApi.getPlans();
      const allPlans = response?.data || [];
      const plan = allPlans.find(p => p.id === parseInt(planId));
      setSelectedPlan(plan);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatMoney = (amount) => new Intl.NumberFormat("vi-VN").format(amount || 0);

  const getDiscount = (months) => {
    if (months === 3) return 10;
    if (months === 6) return 15;
    if (months === 12) return 20;
    return 0;
  };

  const calculatePrice = () => {
    if (!selectedPlan) return { base: 0, discount: 0, final: 0 };
    const base = parseFloat(selectedPlan.price) * duration;
    const discountPercent = getDiscount(duration);
    const discountAmount = base * discountPercent / 100;
    return { base, discount: discountAmount, final: base - discountAmount };
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const response = await subscriptionApi.subscribe({
        plan_id: parseInt(planId),
        payment_method: "bank_transfer",
        duration_months: duration,
      });
      setSubscription(response?.data);
    } catch (err) {
      alert(err.message || "Có lỗi xảy ra");
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmTransfer = async () => {
    try {
      await subscriptionApi.confirmTransfer(subscription.id);
      alert("Đã xác nhận! Vui lòng chờ admin duyệt.");
      navigate("/subscription");
    } catch (err) {
      alert(err.message || "Có lỗi xảy ra");
    }
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(""), 2000);
  };

  const prices = calculatePrice();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!selectedPlan) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-500">Không tìm thấy gói đăng ký</p>
        <Link to="/pricing" className="text-blue-600 hover:underline">Quay lại trang giá</Link>
      </div>
    );
  }

  // Show payment info after subscription created
  if (subscription) {
    const paymentInfo = subscription.payment_url;
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-6">
            <Clock className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">Chờ thanh toán</h2>
            <p className="text-gray-500">Vui lòng chuyển khoản theo thông tin bên dưới</p>
          </div>

          {/* QR Code */}
          {paymentInfo?.qr_url && (
            <div className="text-center mb-6">
              <img src={paymentInfo.qr_url} alt="QR Code" className="mx-auto w-64 h-64 border rounded-xl" />
            </div>
          )}

          {/* Bank Info */}
          <div className="bg-gray-50 rounded-xl p-6 space-y-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Ngân hàng</span>
              <span className="font-semibold">{paymentInfo?.bank_name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Số tài khoản</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-semibold">{paymentInfo?.account_number}</span>
                <button onClick={() => copyToClipboard(paymentInfo?.account_number, "account")} className="text-blue-600">
                  <Copy size={16} />
                </button>
                {copied === "account" && <span className="text-green-500 text-xs">Đã copy!</span>}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Chủ tài khoản</span>
              <span className="font-semibold">{paymentInfo?.account_holder}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Số tiền</span>
              <span className="font-bold text-blue-600 text-lg">₫{formatMoney(paymentInfo?.amount)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Nội dung CK</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-semibold text-red-600">{paymentInfo?.transfer_content}</span>
                <button onClick={() => copyToClipboard(paymentInfo?.transfer_content, "content")} className="text-blue-600">
                  <Copy size={16} />
                </button>
                {copied === "content" && <span className="text-green-500 text-xs">Đã copy!</span>}
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <p className="text-yellow-800 text-sm">
              ⚠️ Vui lòng ghi đúng nội dung chuyển khoản để được xử lý nhanh chóng
            </p>
          </div>

          <button
            onClick={handleConfirmTransfer}
            className="w-full py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition"
          >
            ✓ Tôi đã chuyển khoản
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link to="/pricing" className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6">
        <ArrowLeft size={20} /> Quay lại
      </Link>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Xác nhận đăng ký</h1>

        {/* Plan Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow">
              <span className="text-2xl">{selectedPlan.badge === "pro" ? "⚡" : selectedPlan.badge === "enterprise" ? "👑" : "⭐"}</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{selectedPlan.name}</h3>
              <p className="text-gray-600">{duration} tháng</p>
            </div>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-gray-600">
            <span>Giá gốc ({duration} tháng)</span>
            <span>₫{formatMoney(prices.base)}</span>
          </div>
          {prices.discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Giảm giá ({getDiscount(duration)}%)</span>
              <span>-₫{formatMoney(prices.discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-xl font-bold pt-3 border-t">
            <span>Tổng thanh toán</span>
            <span className="text-blue-600">₫{formatMoney(prices.final)}</span>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <p className="font-semibold mb-2">Quyền lợi nhận được:</p>
          <ul className="space-y-1 text-sm text-gray-600">
            <li>✓ Chiết khấu chỉ {selectedPlan.commission_rate}% mỗi đơn hàng</li>
            {selectedPlan.search_boost > 0 && <li>✓ Ưu tiên tìm kiếm +{selectedPlan.search_boost}</li>}
            {selectedPlan.free_promotions > 0 && <li>✓ {selectedPlan.free_promotions} quảng cáo miễn phí/tháng</li>}
            {selectedPlan.badge && <li>✓ Badge {selectedPlan.badge.toUpperCase()}</li>}
          </ul>
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:bg-gray-400 transition"
        >
          {submitting ? "Đang xử lý..." : "Tiếp tục thanh toán"}
        </button>
      </div>
    </div>
  );
};

export default SubscriptionCheckoutPage;
