/* ============================================================
   📌 PROMOTION MANAGE PAGE - Quản lý quảng cáo sản phẩm (Seller)
============================================================ */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { promotionApi, listingApi, walletApi } from "../../services/apiClient";

const PROMOTION_TYPES = [
  { value: "top_search", label: "🔝 Đẩy lên top tìm kiếm", desc: "Sản phẩm hiển thị đầu tiên khi tìm kiếm", price: 50000 },
  { value: "featured", label: "⭐ Tin nổi bật", desc: "Hiển thị trong mục 'Sản phẩm nổi bật'", price: 100000 },
  { value: "homepage_banner", label: "🏠 Banner trang chủ", desc: "Hiển thị banner lớn trên trang chủ", price: 200000 },
  { value: "category_banner", label: "📂 Banner danh mục", desc: "Hiển thị banner trong danh mục", price: 150000 },
];

const DURATION_OPTIONS = [
  { value: 7, label: "7 ngày", discount: 0 },
  { value: 14, label: "14 ngày", discount: 10 },
  { value: 30, label: "30 ngày", discount: 20 },
];

const STATUS_LABELS = {
  pending: { label: "Chờ duyệt", color: "bg-yellow-100 text-yellow-700" },
  active: { label: "Đang chạy", color: "bg-green-100 text-green-700" },
  paused: { label: "Tạm dừng", color: "bg-gray-100 text-gray-700" },
  completed: { label: "Hoàn thành", color: "bg-blue-100 text-blue-700" },
  cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-700" },
};

const PromotionManagePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("list"); // list | create
  const [promotions, setPromotions] = useState([]);
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [walletBalance, setWalletBalance] = useState(0);
  
  // Form state
  const [selectedListing, setSelectedListing] = useState(null);
  const [promoType, setPromoType] = useState("top_search");
  const [duration, setDuration] = useState(7);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch promotions
      try {
        const promoRes = await promotionApi.getAll();
        console.log("📢 Promotions response:", promoRes);
        setPromotions(promoRes.data || promoRes || []);
      } catch (e) {
        console.error("Error fetching promotions:", e);
      }
      
      // Fetch my listings - giống DashboardCompany
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("⚠️ No token found");
          setMyListings([]);
        } else {
          console.log("📦 Fetching my listings...");
          const listingsRes = await listingApi.getMyListings();
          console.log("📦 My listings response:", listingsRes);
          
          // Xử lý response giống DashboardCompany
          if (listingsRes?.data) {
            // Không filter theo status - lấy tất cả sản phẩm của seller
            setMyListings(listingsRes.data);
            console.log("📦 Set listings:", listingsRes.data.length, "items");
          } else if (Array.isArray(listingsRes)) {
            setMyListings(listingsRes);
          } else {
            setMyListings([]);
          }
        }
      } catch (e) {
        console.error("Error fetching my listings:", e);
        setMyListings([]);
      }
      
      // Fetch wallet balance - giống WalletPage
      try {
        const walletRes = await walletApi.getWallet();
        console.log("💰 Wallet response:", walletRes);
        
        // Xử lý nhiều format response giống WalletPage
        const walletData = walletRes?.data?.wallet || walletRes?.wallet || walletRes?.data || walletRes;
        const balance = walletData?.balance || 0;
        console.log("💰 Wallet balance:", balance);
        setWalletBalance(balance);
      } catch (e) {
        console.error("Error fetching wallet:", e);
        setWalletBalance(0);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Tính giá
  const calculatePrice = () => {
    const typeInfo = PROMOTION_TYPES.find(t => t.value === promoType);
    const durationInfo = DURATION_OPTIONS.find(d => d.value === duration);
    if (!typeInfo || !durationInfo) return 0;
    
    const basePrice = typeInfo.price * duration;
    const discount = basePrice * (durationInfo.discount / 100);
    return basePrice - discount;
  };

  // Tạo quảng cáo
  const handleCreatePromotion = async () => {
    if (!selectedListing) {
      setMessage({ type: "error", text: "Vui lòng chọn sản phẩm cần quảng cáo" });
      return;
    }

    const totalPrice = calculatePrice();
    if (walletBalance < totalPrice) {
      setMessage({ 
        type: "error", 
        text: `Số dư ví không đủ. Cần ${totalPrice.toLocaleString("vi-VN")}đ, hiện có ${walletBalance.toLocaleString("vi-VN")}đ` 
      });
      return;
    }

    setSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      await promotionApi.create({
        listing_id: selectedListing.id,
        type: promoType,
        duration_days: duration,
        budget: totalPrice,
      });
      
      setMessage({ type: "success", text: "✅ Tạo quảng cáo thành công! Đang chờ admin duyệt." });
      setSelectedListing(null);
      setActiveTab("list");
      fetchData();
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Có lỗi xảy ra" });
    } finally {
      setSubmitting(false);
    }
  };

  // Hủy quảng cáo
  const handleCancel = async (id) => {
    if (!confirm("Bạn có chắc muốn hủy quảng cáo này?")) return;
    
    try {
      await promotionApi.cancel(id);
      setMessage({ type: "success", text: "Đã hủy quảng cáo" });
      fetchData();
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    }
  };

  // Tạm dừng/Tiếp tục
  const handleTogglePause = async (promo) => {
    try {
      if (promo.status === "active") {
        await promotionApi.pause(promo.id);
      } else if (promo.status === "paused") {
        await promotionApi.resume(promo.id);
      }
      fetchData();
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    }
  };

  const totalPrice = calculatePrice();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <button onClick={() => navigate(-1)} className="text-blue-600 hover:text-blue-800 mb-2 flex items-center gap-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Quay lại
            </button>
            <h1 className="text-2xl font-bold text-gray-900">📢 Quảng cáo sản phẩm</h1>
            <p className="text-gray-600">Đẩy sản phẩm lên top để tăng doanh số</p>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-gray-500">Số dư ví</p>
            <p className="text-xl font-bold text-green-600">{walletBalance.toLocaleString("vi-VN")}đ</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("list")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === "list" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            📋 Danh sách quảng cáo
          </button>
          <button
            onClick={() => setActiveTab("create")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === "create" ? "bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            ➕ Tạo quảng cáo mới
          </button>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`mb-4 p-4 rounded-lg ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
            {message.text}
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-xl p-12 text-center">
            <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-4 text-gray-500">Đang tải...</p>
          </div>
        ) : activeTab === "list" ? (
          /* ===== DANH SÁCH QUẢNG CÁO ===== */
          <div className="bg-white rounded-xl shadow-sm">
            {promotions.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-6xl mb-4">📢</div>
                <h3 className="text-lg font-semibold text-gray-800">Chưa có quảng cáo nào</h3>
                <p className="text-gray-500 mb-4">Tạo quảng cáo để đẩy sản phẩm lên top</p>
                <button
                  onClick={() => setActiveTab("create")}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Tạo quảng cáo đầu tiên
                </button>
              </div>
            ) : (
              <div className="divide-y">
                {promotions.map((promo) => (
                  <div key={promo.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-start gap-4">
                      {/* Listing Image */}
                      <img
                        src={promo.listing?.images?.[0] || "https://via.placeholder.com/80"}
                        alt=""
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      
                      {/* Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${STATUS_LABELS[promo.status]?.color}`}>
                            {STATUS_LABELS[promo.status]?.label}
                          </span>
                          <span className="text-xs text-gray-500">
                            {PROMOTION_TYPES.find(t => t.value === promo.type)?.label}
                          </span>
                        </div>
                        
                        <h3 className="font-semibold text-gray-900 line-clamp-1">
                          {promo.listing?.title || `Listing #${promo.listing_id}`}
                        </h3>
                        
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span>👁 {promo.impressions || 0} lượt xem</span>
                          <span>👆 {promo.clicks || 0} click</span>
                          <span>📊 CTR: {promo.ctr || 0}%</span>
                        </div>
                        
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                          <span>Bắt đầu: {promo.start_date ? new Date(promo.start_date).toLocaleDateString("vi-VN") : "—"}</span>
                          <span>•</span>
                          <span>Kết thúc: {promo.end_date ? new Date(promo.end_date).toLocaleDateString("vi-VN") : "—"}</span>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        {promo.status === "active" && (
                          <button
                            onClick={() => handleTogglePause(promo)}
                            className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                          >
                            ⏸ Tạm dừng
                          </button>
                        )}
                        {promo.status === "paused" && (
                          <button
                            onClick={() => handleTogglePause(promo)}
                            className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200"
                          >
                            ▶ Tiếp tục
                          </button>
                        )}
                        {(promo.status === "pending" || promo.status === "active" || promo.status === "paused") && (
                          <button
                            onClick={() => handleCancel(promo.id)}
                            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                          >
                            ✕ Hủy
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* ===== TẠO QUẢNG CÁO MỚI ===== */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Chọn sản phẩm */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">1️⃣ Chọn sản phẩm cần quảng cáo</h3>
                
                {myListings.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>Bạn chưa có sản phẩm nào đang bán</p>
                    <button
                      onClick={() => navigate("/dashboard/company")}
                      className="mt-2 text-blue-600 hover:underline"
                    >
                      Đăng sản phẩm ngay
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                    {myListings.map((listing) => (
                      <div
                        key={listing.id}
                        onClick={() => setSelectedListing(listing)}
                        className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition ${
                          selectedListing?.id === listing.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <img
                          src={listing.images?.[0] || "https://via.placeholder.com/60"}
                          alt=""
                          className="w-14 h-14 rounded object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{listing.title}</p>
                          <p className="text-sm text-blue-600">
                            {listing.price_cents ? `${(listing.price_cents / 100).toLocaleString("vi-VN")}đ` : "Liên hệ"}
                          </p>
                        </div>
                        {selectedListing?.id === listing.id && (
                          <span className="text-blue-600">✓</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Chọn loại quảng cáo */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">2️⃣ Chọn loại quảng cáo</h3>
                
                <div className="space-y-3">
                  {PROMOTION_TYPES.map((type) => (
                    <div
                      key={type.value}
                      onClick={() => setPromoType(type.value)}
                      className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition ${
                        promoType === type.value
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div>
                        <p className="font-medium text-gray-900">{type.label}</p>
                        <p className="text-sm text-gray-500">{type.desc}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-600">{type.price.toLocaleString("vi-VN")}đ</p>
                        <p className="text-xs text-gray-400">/ngày</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chọn thời gian */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">3️⃣ Chọn thời gian chạy</h3>
                
                <div className="flex gap-3">
                  {DURATION_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setDuration(opt.value)}
                      className={`flex-1 p-4 rounded-lg border-2 transition ${
                        duration === opt.value
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <p className="font-bold text-lg">{opt.label}</p>
                      {opt.discount > 0 && (
                        <p className="text-sm text-green-600">Giảm {opt.discount}%</p>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-sm sticky top-6">
                <h3 className="font-semibold text-gray-900 mb-4">📋 Tóm tắt đơn hàng</h3>
                
                {selectedListing ? (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-900 truncate">{selectedListing.title}</p>
                    <p className="text-sm text-gray-500">ID: #{selectedListing.id}</p>
                  </div>
                ) : (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg text-gray-400 text-center">
                    Chưa chọn sản phẩm
                  </div>
                )}
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Loại quảng cáo:</span>
                    <span className="font-medium">{PROMOTION_TYPES.find(t => t.value === promoType)?.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Thời gian:</span>
                    <span className="font-medium">{duration} ngày</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Đơn giá:</span>
                    <span>{PROMOTION_TYPES.find(t => t.value === promoType)?.price.toLocaleString("vi-VN")}đ/ngày</span>
                  </div>
                  {DURATION_OPTIONS.find(d => d.value === duration)?.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Giảm giá:</span>
                      <span>-{DURATION_OPTIONS.find(d => d.value === duration)?.discount}%</span>
                    </div>
                  )}
                </div>
                
                <hr className="my-4" />
                
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold text-gray-900">Tổng cộng:</span>
                  <span className="text-2xl font-bold text-blue-600">{totalPrice.toLocaleString("vi-VN")}đ</span>
                </div>
                
                {walletBalance < totalPrice && (
                  <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                    ⚠️ Số dư ví không đủ. 
                    <button 
                      onClick={() => navigate("/wallet/deposit")}
                      className="underline ml-1"
                    >
                      Nạp tiền ngay
                    </button>
                  </div>
                )}
                
                <button
                  onClick={handleCreatePromotion}
                  disabled={!selectedListing || submitting || walletBalance < totalPrice}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                >
                  {submitting ? "⏳ Đang xử lý..." : "🚀 Tạo quảng cáo"}
                </button>
                
                <p className="text-xs text-gray-400 text-center mt-3">
                  Quảng cáo sẽ được admin duyệt trong 24h
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromotionManagePage;
