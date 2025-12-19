import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Star, Zap, Crown, Building2 } from "lucide-react";
import { subscriptionApi } from "../../services/apiClient";

const PricingPage = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [duration, setDuration] = useState(1);
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const response = await subscriptionApi.getPlans();
      setPlans(response?.data || []);
    } catch (err) {
      console.error("Error loading plans:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatMoney = (amount) => new Intl.NumberFormat("vi-VN").format(amount || 0);

  const getIcon = (badge) => {
    switch (badge) {
      case "basic": return <Star className="text-blue-500" size={28} />;
      case "pro": return <Zap className="text-purple-500" size={28} />;
      case "enterprise": return <Crown className="text-yellow-500" size={28} />;
      default: return <Building2 className="text-gray-400" size={28} />;
    }
  };

  const getDiscount = (months) => {
    if (months === 3) return 10;
    if (months === 6) return 15;
    if (months === 12) return 20;
    return 0;
  };

  const calculatePrice = (basePrice, months) => {
    const discount = getDiscount(months);
    const total = basePrice * months;
    return total - (total * discount / 100);
  };

  const handleSubscribe = (planId) => {
    if (!user) {
      navigate("/login?redirect=/pricing");
      return;
    }
    navigate(`/subscription/checkout?plan=${planId}&duration=${duration}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Nâng cấp tài khoản</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Chọn gói phù hợp để tăng doanh số và tiết kiệm chi phí chiết khấu
        </p>
      </div>

      {/* Duration Selector */}
      <div className="flex justify-center gap-2 mb-10">
        {[
          { months: 1, label: "1 tháng" },
          { months: 3, label: "3 tháng", discount: "-10%" },
          { months: 6, label: "6 tháng", discount: "-15%" },
          { months: 12, label: "12 tháng", discount: "-20%" },
        ].map((opt) => (
          <button
            key={opt.months}
            onClick={() => setDuration(opt.months)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              duration === opt.months
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {opt.label}
            {opt.discount && (
              <span className="ml-1 text-xs bg-green-500 text-white px-1.5 py-0.5 rounded">
                {opt.discount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => {
          const finalPrice = calculatePrice(parseFloat(plan.price), duration);
          const isPopular = plan.is_popular;
          
          return (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl border-2 p-6 transition hover:shadow-lg ${
                isPopular ? "border-purple-500 shadow-lg" : "border-gray-200"
              }`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    PHỔ BIẾN NHẤT
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 mb-4">
                  {getIcon(plan.badge)}
                </div>
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
              </div>

              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900">
                  {finalPrice === 0 ? "Miễn phí" : `₫${formatMoney(finalPrice)}`}
                </div>
                {finalPrice > 0 && duration > 1 && (
                  <p className="text-sm text-gray-500">
                    ~₫{formatMoney(finalPrice / duration)}/tháng
                  </p>
                )}
              </div>

              {/* Key Benefits */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-green-500">✓</span>
                  <span>Chiết khấu chỉ <strong>{plan.commission_rate}%</strong></span>
                </div>
                {plan.search_boost > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-green-500">✓</span>
                    <span>Ưu tiên tìm kiếm +{plan.search_boost}</span>
                  </div>
                )}
                {plan.free_promotions > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-green-500">✓</span>
                    <span>{plan.free_promotions} quảng cáo miễn phí/tháng</span>
                  </div>
                )}
                {plan.badge && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-green-500">✓</span>
                    <span>Badge {plan.badge.toUpperCase()} trên profile</span>
                  </div>
                )}
              </div>

              {/* Features List */}
              {plan.benefits && (
                <div className="border-t pt-4 mb-6">
                  <p className="text-xs text-gray-500 mb-2">Quyền lợi:</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    {(Array.isArray(plan.benefits) ? plan.benefits : plan.benefits.split("\n")).slice(0, 5).map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={plan.price === "0.00" || plan.price === 0}
                className={`w-full py-3 rounded-xl font-semibold transition ${
                  plan.price === "0.00" || plan.price === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : isPopular
                    ? "bg-purple-600 text-white hover:bg-purple-700"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {plan.price === "0.00" || plan.price === 0 ? "Gói hiện tại" : "Chọn gói này"}
              </button>
            </div>
          );
        })}
      </div>

      {/* FAQ */}
      <div className="mt-16 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Câu hỏi thường gặp</h2>
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-6 border">
            <h3 className="font-semibold mb-2">Chiết khấu là gì?</h3>
            <p className="text-gray-600 text-sm">
              Chiết khấu là phí platform thu trên mỗi đơn hàng thành công. Gói Free là 10%, 
              gói Enterprise chỉ còn 3%.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 border">
            <h3 className="font-semibold mb-2">Search Boost hoạt động như thế nào?</h3>
            <p className="text-gray-600 text-sm">
              Sản phẩm của bạn sẽ được ưu tiên hiển thị cao hơn trong kết quả tìm kiếm, 
              giúp tăng khả năng tiếp cận khách hàng.
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 border">
            <h3 className="font-semibold mb-2">Tôi có thể hủy gói không?</h3>
            <p className="text-gray-600 text-sm">
              Bạn có thể hủy gói bất cứ lúc nào. Gói sẽ vẫn hoạt động đến hết thời hạn đã thanh toán.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
