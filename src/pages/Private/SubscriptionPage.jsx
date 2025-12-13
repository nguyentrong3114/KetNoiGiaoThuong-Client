import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Crown, Zap, Star, ArrowRight } from "lucide-react";
import { subscriptionApi } from "../../services/apiClient";

const SubscriptionPage = () => {
  const [current, setCurrent] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Gọi API lấy gói hiện tại
      let currentData = null;
      try {
        const currentRes = await subscriptionApi.getCurrent();
        // API trả về trực tiếp object subscription (không có wrapper data)
        // Response: { id, plan, status, days_remaining, ... }
        console.log("📦 Current subscription response:", currentRes);
        currentData = currentRes;
      } catch (err) {
        // 404 = chưa có gói active → dùng Free
        console.log("ℹ️ No active subscription (Free plan)");
      }
      setCurrent(currentData);

      // Gọi API lấy lịch sử
      try {
        const historyRes = await subscriptionApi.getHistory();
        // Response: { data: [...], meta: {...} }
        console.log("📦 History response:", historyRes);
        setHistory(historyRes?.data || []);
      } catch (err) {
        console.log("ℹ️ No subscription history");
        setHistory([]);
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatMoney = (amount) => new Intl.NumberFormat("vi-VN").format(amount || 0);
  const formatDate = (date) => new Date(date).toLocaleDateString("vi-VN");

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

  const getBadgeIcon = (badgeOrSlug) => {
    const badge = badgeOrSlug?.toLowerCase();
    if (badge === "enterprise") return <Crown className="text-yellow-500" size={24} />;
    if (badge === "pro") return <Zap className="text-purple-500" size={24} />;
    if (badge === "basic") return <Star className="text-blue-500" size={24} />;
    return null;
  };

  // Lấy badge từ plan (có thể là plan.badge hoặc plan.slug)
  const getPlanBadge = (plan) => plan?.badge || plan?.slug;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Gói đăng ký của tôi</h1>
        <Link
          to="/pricing"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          Nâng cấp <ArrowRight size={18} />
        </Link>
      </div>

      {/* Current Subscription */}
      {current && current.status === "active" ? (
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-6 text-white mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
              {getBadgeIcon(getPlanBadge(current.plan))}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{current.plan?.name}</h2>
              <p className="text-purple-200">Gói hiện tại</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-sm text-purple-200">Còn lại</p>
              <p className="text-2xl font-bold">{current.days_remaining} ngày</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-purple-200 text-sm">Tin đăng</p>
              <p className="text-xl font-bold">{current.usage?.listings_used || 0}/{current.plan?.features?.max_listings || "∞"}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-purple-200 text-sm">Ảnh/tin</p>
              <p className="text-xl font-bold">{current.plan?.features?.max_images_per_listing || 5}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-purple-200 text-sm">Tin nổi bật</p>
              <p className="text-xl font-bold">{current.usage?.featured_listings_used || 0}/{current.plan?.features?.featured_listings || 0}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-purple-200 text-sm">Hết hạn</p>
              <p className="text-xl font-bold">{formatDate(current.end_date)}</p>
            </div>
          </div>

          {/* Quyền lợi */}
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="flex flex-wrap gap-3">
              {current.plan?.features?.priority_support && (
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm">✓ Hỗ trợ ưu tiên</span>
              )}
              {current.plan?.features?.analytics && (
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm">✓ Báo cáo thống kê</span>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center mb-8">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="text-gray-400" size={32} />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Bạn đang dùng gói Free</h3>
          <p className="text-gray-500 mb-4">Nâng cấp để giảm chiết khấu và tăng hiển thị sản phẩm</p>
          <Link
            to="/pricing"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700"
          >
            Xem các gói <ArrowRight size={18} />
          </Link>
        </div>
      )}

      {/* Subscription History */}
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-4">Lịch sử đăng ký</h3>
        
        {history.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Chưa có lịch sử đăng ký</p>
        ) : (
          <div className="space-y-4">
            {history.map((sub) => (
              <div key={sub.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                    {getBadgeIcon(getPlanBadge(sub.plan)) || <Star className="text-gray-400" size={20} />}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{sub.plan?.name}</p>
                    <p className="text-sm text-gray-500">
                      {formatDate(sub.start_date)} - {formatDate(sub.end_date)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">₫{formatMoney(sub.final_amount)}</p>
                  {getStatusBadge(sub.status)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionPage;
