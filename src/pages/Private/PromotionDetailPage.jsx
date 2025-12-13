import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, TrendingUp, DollarSign, Eye, MousePointer, Calendar, XCircle } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

const PromotionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [promotion, setPromotion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPromotion();
  }, [id]);

  const loadPromotion = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      // LƯU Ý: Route là /promotion (không có 's')
      const res = await fetch(`${API_BASE_URL}/promotion/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      
      if (!res.ok) {
        if (res.status === 404) throw new Error("Không tìm thấy chiến dịch quảng cáo");
        if (res.status === 403) throw new Error("Bạn không có quyền xem chiến dịch này");
        throw new Error("Không thể tải thông tin chiến dịch");
      }
      
      const data = await res.json();
      setPromotion(data);
    } catch (err) {
      console.error("Error loading promotion:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatMoney = (amount) => new Intl.NumberFormat("vi-VN").format(amount || 0);

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit", month: "2-digit", year: "numeric",
    });
  };

  const statusConfig = {
    pending: { label: "Chờ duyệt", color: "bg-yellow-100 text-yellow-700" },
    active: { label: "Đang chạy", color: "bg-green-100 text-green-700" },
    paused: { label: "Tạm dừng", color: "bg-gray-100 text-gray-700" },
    completed: { label: "Hoàn thành", color: "bg-blue-100 text-blue-700" },
    rejected: { label: "Bị từ chối", color: "bg-red-100 text-red-700" },
  };

  const typeLabels = {
    featured: "Nổi bật",
    banner: "Banner",
    sponsored: "Tài trợ",
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

  if (!promotion) return null;

  const status = statusConfig[promotion.status] || statusConfig.pending;
  const budgetPercent = promotion.budget > 0 ? Math.min(100, (promotion.spent / promotion.budget) * 100) : 0;

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
            <h1 className="text-2xl font-bold text-gray-900">Chiến dịch quảng cáo #{promotion.id}</h1>
            <p className="text-gray-500">Loại: {typeLabels[promotion.type] || promotion.type}</p>
          </div>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
            {status.label}
          </span>
        </div>
      </div>

      {/* Budget & Spending */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <DollarSign size={18} /> Ngân sách & Chi tiêu
        </h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500">Ngân sách</p>
            <p className="text-xl font-bold text-gray-900">₫{formatMoney(promotion.budget)}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500">Đã chi</p>
            <p className="text-xl font-bold text-indigo-600">₫{formatMoney(promotion.spent)}</p>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div className="bg-indigo-600 h-3 rounded-full transition-all" style={{ width: `${budgetPercent}%` }}></div>
        </div>
        <p className="text-sm text-gray-500 mt-2">{budgetPercent.toFixed(1)}% ngân sách đã sử dụng</p>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp size={18} /> Thống kê hiệu quả
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Eye className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{promotion.impressions || 0}</p>
            <p className="text-sm text-gray-500">Lượt hiển thị</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <MousePointer className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{promotion.clicks || 0}</p>
            <p className="text-sm text-gray-500">Lượt click</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <TrendingUp className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {promotion.impressions > 0 ? ((promotion.clicks / promotion.impressions) * 100).toFixed(2) : 0}%
            </p>
            <p className="text-sm text-gray-500">CTR</p>
          </div>
        </div>
      </div>

      {/* Duration */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Calendar size={18} /> Thời gian chạy
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Ngày bắt đầu</p>
            <p className="font-medium text-gray-900">{formatDate(promotion.start_date)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Ngày kết thúc</p>
            <p className="font-medium text-gray-900">{formatDate(promotion.end_date)}</p>
          </div>
        </div>
      </div>

      {/* Listing Info */}
      {promotion.listing && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Sản phẩm quảng cáo</h3>
          <div className="flex gap-4">
            <img
              src={promotion.listing.images?.[0] || "/default-avatar.jpg"}
              alt={promotion.listing.title}
              className="w-20 h-20 object-cover rounded-lg"
              onError={(e) => (e.target.src = "/default-avatar.jpg")}
            />
            <div>
              <Link to={`/listings/${promotion.listing.id}`} className="font-medium text-gray-800 hover:text-indigo-600">
                {promotion.listing.title}
              </Link>
              <p className="text-sm text-gray-500 mt-1">
                Giá: ₫{formatMoney(promotion.listing.price_cents / 100)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromotionDetailPage;
