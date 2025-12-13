import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";
import { auctionApi, listingApi } from "../../services/apiClient";

const CreateAuctionPage = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingListings, setFetchingListings] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    listing_id: "",
    starting_price: "",
    reserve_price: "",
    bid_increment: "500000",
    start_time: "",
    end_time: "",
    auto_extend: true,
    extend_minutes: 5,
  });

  // Fetch seller's listings
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await listingApi.getMyListings();
        setListings(response?.data || []);
      } catch (err) {
        console.error("Error fetching listings:", err);
      } finally {
        setFetchingListings(false);
      }
    };
    fetchListings();
  }, []);

  // Set default times
  useEffect(() => {
    const now = new Date();
    const start = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now
    const end = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

    setFormData((prev) => ({
      ...prev,
      start_time: start.toISOString().slice(0, 16),
      end_time: end.toISOString().slice(0, 16),
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Convert datetime-local value to ISO format for API
  const formatDateTimeForAPI = (dateTimeLocal) => {
    if (!dateTimeLocal) return null;
    // datetime-local format: "2025-12-06T15:41"
    // API expects: "2025-12-06T15:41:00" or "2025-12-06 15:41:00"
    const date = new Date(dateTimeLocal);
    // Format: YYYY-MM-DD HH:mm:ss
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = "00";
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate times
      const startDate = new Date(formData.start_time);
      const endDate = new Date(formData.end_time);
      const now = new Date();

      if (startDate <= now) {
        setError("Thời gian bắt đầu phải sau thời điểm hiện tại");
        setLoading(false);
        return;
      }

      if (endDate <= startDate) {
        setError("Thời gian kết thúc phải sau thời gian bắt đầu");
        setLoading(false);
        return;
      }

      const payload = {
        listing_id: parseInt(formData.listing_id),
        starting_price: parseFloat(formData.starting_price),
        bid_increment: parseFloat(formData.bid_increment),
        start_time: formatDateTimeForAPI(formData.start_time),
        end_time: formatDateTimeForAPI(formData.end_time),
        auto_extend: formData.auto_extend,
        extend_minutes: parseInt(formData.extend_minutes),
      };

      if (formData.reserve_price) {
        payload.reserve_price = parseFloat(formData.reserve_price);
      }

      console.log("📤 Creating auction with payload:", payload);

      await auctionApi.create(payload);
      setSuccess(true);

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate("/auctions");
      }, 2000);
    } catch (err) {
      console.error("❌ Create auction error:", err);
      setError(err.message || "Có lỗi xảy ra khi tạo đấu giá");
    } finally {
      setLoading(false);
    }
  };

  const selectedListing = listings.find((l) => l.id === parseInt(formData.listing_id));

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="bg-green-50 rounded-2xl p-10">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-green-700 mb-2">Tạo đấu giá thành công!</h2>
          <p className="text-gray-600 mb-4">
            Phiên đấu giá của bạn đang chờ Admin duyệt. Bạn sẽ nhận được thông báo khi được phê duyệt.
          </p>
          <p className="text-sm text-gray-500">Đang chuyển hướng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-6">
        <ArrowLeft size={20} />
        Quay lại
      </button>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Tạo Phiên Đấu Giá Mới</h1>
        <p className="text-gray-500 mb-6">Phiên đấu giá sẽ được Admin xét duyệt trước khi công khai</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Select Product */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Sản phẩm đấu giá *</label>
            {fetchingListings ? (
              <p className="text-gray-500">Đang tải danh sách sản phẩm...</p>
            ) : listings.length === 0 ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="text-yellow-800">Bạn chưa có sản phẩm nào. Vui lòng tạo sản phẩm trước.</p>
                <button
                  type="button"
                  onClick={() => navigate("/dashboard/company/post")}
                  className="mt-2 text-indigo-600 font-medium hover:underline"
                >
                  → Tạo sản phẩm mới
                </button>
              </div>
            ) : (
              <select
                name="listing_id"
                value={formData.listing_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">-- Chọn sản phẩm --</option>
                {listings.map((listing) => (
                  <option key={listing.id} value={listing.id}>
                    {listing.title} - ₫{(listing.price_cents / 100).toLocaleString("vi-VN")}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Selected Product Preview */}
          {selectedListing && (
            <div className="flex gap-4 p-4 bg-gray-50 rounded-xl">
              <img
                src={selectedListing.images?.[0] || "/default-avatar.jpg"}
                alt={selectedListing.title}
                className="w-20 h-20 object-cover rounded-lg"
                onError={(e) => { e.target.src = "/default-avatar.jpg"; }}
              />
              <div>
                <h4 className="font-semibold text-gray-800">{selectedListing.title}</h4>
                <p className="text-sm text-gray-500">Giá gốc: ₫{(selectedListing.price_cents / 100).toLocaleString("vi-VN")}</p>
              </div>
            </div>
          )}

          {/* Price Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Giá khởi điểm (VND) *</label>
              <input
                type="number"
                name="starting_price"
                value={formData.starting_price}
                onChange={handleChange}
                required
                min="0"
                step="1000"
                placeholder="VD: 10000000"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Giá dự trữ (VND)</label>
              <input
                type="number"
                name="reserve_price"
                value={formData.reserve_price}
                onChange={handleChange}
                min="0"
                step="1000"
                placeholder="Giá tối thiểu để bán (tùy chọn)"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-xs text-gray-500 mt-1">Nếu giá cao nhất không đạt, bạn có thể từ chối bán</p>
            </div>
          </div>

          {/* Bid Increment */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Bước giá (VND) *</label>
            <select
              name="bid_increment"
              value={formData.bid_increment}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="50000">50,000 VND</option>
              <option value="100000">100,000 VND</option>
              <option value="200000">200,000 VND</option>
              <option value="500000">500,000 VND</option>
              <option value="1000000">1,000,000 VND</option>
              <option value="2000000">2,000,000 VND</option>
              <option value="5000000">5,000,000 VND</option>
            </select>
          </div>

          {/* Time Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Thời gian bắt đầu *</label>
              <input
                type="datetime-local"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Thời gian kết thúc *</label>
              <input
                type="datetime-local"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Auto Extend */}
          <div className="bg-blue-50 rounded-xl p-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="auto_extend"
                checked={formData.auto_extend}
                onChange={handleChange}
                className="w-5 h-5 text-indigo-600 rounded"
              />
              <div>
                <span className="font-medium text-gray-800">Tự động gia hạn</span>
                <p className="text-sm text-gray-500">Gia hạn thêm thời gian khi có bid trong phút cuối</p>
              </div>
            </label>

            {formData.auto_extend && (
              <div className="mt-3 ml-8">
                <label className="text-sm text-gray-600">Gia hạn thêm: </label>
                <select
                  name="extend_minutes"
                  value={formData.extend_minutes}
                  onChange={handleChange}
                  className="ml-2 px-3 py-1 border rounded-lg"
                >
                  <option value="3">3 phút</option>
                  <option value="5">5 phút</option>
                  <option value="10">10 phút</option>
                </select>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || listings.length === 0}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-bold rounded-xl transition text-lg"
          >
            {loading ? "Đang tạo..." : "TẠO PHIÊN ĐẤU GIÁ"}
          </button>

          <p className="text-center text-sm text-gray-500">
            Sau khi tạo, phiên đấu giá sẽ được Admin xét duyệt trước khi công khai
          </p>
        </form>
      </div>
    </div>
  );
};

export default CreateAuctionPage;
