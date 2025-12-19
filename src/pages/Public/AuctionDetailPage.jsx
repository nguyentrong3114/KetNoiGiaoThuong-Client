import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Clock, Users, TrendingUp, ArrowLeft, AlertCircle } from "lucide-react";
import { auctionApi } from "../../services/apiClient";

const AuctionDetailPage = () => {
  const { id } = useParams();
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState("");
  const [bidding, setBidding] = useState(false);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  const fetchAuction = useCallback(async () => {
    try {
      const response = await auctionApi.getById(id);
      const data = response?.data || response;
      console.log("📦 Auction data:", data);
      console.log("📊 Price info:", {
        current_price_cents: data?.current_price_cents,
        bid_increment_cents: data?.bid_increment_cents,
        starting_price_cents: data?.starting_price_cents,
        minimum_bid: data?.minimum_bid,
      });
      setAuction(data);
      
      // Tính minimum bid (VND)
      // Backend lưu cents, FE hiển thị VND (chia 100)
      // Khi đặt giá, gửi VND (backend sẽ nhân 100)
      let minBidVND = 0;
      
      if (data?.minimum_bid) {
        // Nếu API trả về minimum_bid (đã là VND)
        minBidVND = Math.ceil(data.minimum_bid);
      } else if (data?.current_price_cents !== undefined && data?.bid_increment_cents !== undefined) {
        // Tính từ cents: (current + increment) / 100 = VND
        minBidVND = Math.ceil((data.current_price_cents + data.bid_increment_cents) / 100);
      } else if (data?.starting_price_cents && data?.bid_increment_cents) {
        // Nếu chưa có bid, dùng starting_price
        minBidVND = Math.ceil((data.starting_price_cents + data.bid_increment_cents) / 100);
      }
      
      console.log("💰 Calculated minimum bid (VND):", minBidVND);
      setBidAmount(minBidVND.toString());
    } catch (err) {
      console.error("Error fetching auction:", err);
      setError("Không thể tải thông tin đấu giá");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAuction();
  }, [fetchAuction]);

  // Countdown timer
  useEffect(() => {
    if (!auction || auction.status !== "active") return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const end = new Date(auction.ends_at).getTime();
      const diff = Math.max(0, Math.floor((end - now) / 1000));
      setTimeLeft(diff);

      if (diff === 0) {
        fetchAuction(); // Refresh when ended
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [auction, fetchAuction]);

  // Polling for updates
  useEffect(() => {
    if (!auction || auction.status !== "active") return;
    const interval = setInterval(fetchAuction, 10000); // Every 10 seconds
    return () => clearInterval(interval);
  }, [auction, fetchAuction]);

  const handlePlaceBid = async () => {
    if (!bidAmount || !token || bidding) return;

    setBidding(true);
    setError(null);

    try {
      // Gửi số VND nguyên (không có dấu phẩy/chấm)
      const amountVND = parseInt(bidAmount.toString().replace(/[.,\s]/g, ""), 10);
      
      if (isNaN(amountVND) || amountVND <= 0) {
        setError("Vui lòng nhập số tiền hợp lệ");
        setBidding(false);
        return;
      }

      // Kiểm tra minimum bid
      const currentPriceVND = Math.floor(auction.current_price_cents / 100);
      const bidIncrementVND = Math.floor(auction.bid_increment_cents / 100);
      const minBidVND = currentPriceVND + bidIncrementVND;
      
      if (amountVND < minBidVND) {
        setError(`Giá đặt phải >= ${minBidVND.toLocaleString("vi-VN")} VND`);
        setBidding(false);
        return;
      }

      console.log("📤 Placing bid:", {
        amountVND,
        currentPriceVND,
        bidIncrementVND,
        minBidVND,
      });
      
      const response = await auctionApi.placeBid(id, amountVND);
      console.log("✅ Bid response:", response);
      alert("Đặt giá thành công!");
      fetchAuction();
      
      // Set next minimum bid
      if (response?.data?.auction?.current_price_cents) {
        const nextMin = Math.ceil((response.data.auction.current_price_cents + auction.bid_increment_cents) / 100);
        setBidAmount(nextMin.toString());
      } else if (response?.auction?.current_price_cents) {
        const nextMin = Math.ceil((response.auction.current_price_cents + auction.bid_increment_cents) / 100);
        setBidAmount(nextMin.toString());
      }
    } catch (err) {
      console.error("❌ Bid error:", err);
      setError(err.message || "Đặt giá thất bại");
    } finally {
      setBidding(false);
    }
  };

  const formatPrice = (cents) => {
    if (!cents) return "0";
    return new Intl.NumberFormat("vi-VN").format(cents / 100);
  };

  const formatTime = (seconds) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (days > 0) return `${days} ngày ${hours} giờ ${mins} phút`;
    if (hours > 0) return `${hours} giờ ${mins} phút ${secs} giây`;
    return `${mins} phút ${secs} giây`;
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: { bg: "bg-green-500", text: "Đang diễn ra" },
      upcoming: { bg: "bg-blue-500", text: "Sắp diễn ra" },
      ended: { bg: "bg-gray-500", text: "Đã kết thúc" },
      cancelled: { bg: "bg-red-500", text: "Đã hủy" },
      pending: { bg: "bg-yellow-500", text: "Chờ duyệt" },
    };
    return styles[status] || styles.active;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Không tìm thấy phiên đấu giá</h2>
        <Link to="/auctions" className="text-indigo-600 hover:underline">← Quay lại danh sách</Link>
      </div>
    );
  }

  const status = getStatusBadge(auction.status);
  const isOwner = auction.created_by === user?.id || auction.shop?.user_id === user?.id;
  const canBid = auction.status === "active" && !isOwner && token;
  const isEndingSoon = timeLeft > 0 && timeLeft < 300; // < 5 minutes

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Back Button */}
      <Link to="/auctions" className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-6">
        <ArrowLeft size={20} />
        Quay lại danh sách
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT - Product Images */}
        <div>
          <div className="relative rounded-2xl overflow-hidden bg-gray-100">
            <img
              src={auction.listing?.images?.[0] || "/default-avatar.jpg"}
              alt={auction.listing?.title}
              className="w-full h-96 object-cover"
              onError={(e) => { e.target.src = "/default-avatar.jpg"; }}
            />
            <span className={`absolute top-4 left-4 ${status.bg} text-white px-4 py-1.5 rounded-full text-sm font-semibold`}>
              {status.text}
            </span>
          </div>

          {/* Thumbnail Gallery */}
          {auction.listing?.images?.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto">
              {auction.listing.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Ảnh ${idx + 1}`}
                  className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80"
                  onError={(e) => { e.target.src = "/default-avatar.jpg"; }}
                />
              ))}
            </div>
          )}

          {/* Product Description */}
          <div className="mt-6 bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-3">Mô tả sản phẩm</h3>
            <p className="text-gray-600 text-sm whitespace-pre-line">
              {auction.listing?.description || "Chưa có mô tả"}
            </p>
          </div>
        </div>

        {/* RIGHT - Auction Info */}
        <div>
          {/* Title & Shop */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{auction.listing?.title}</h1>
          <p className="text-gray-500 mb-4">
            Shop: <Link to={`/shop/${auction.shop?.id}`} className="text-indigo-600 hover:underline">{auction.shop?.name}</Link>
          </p>

          {/* Time Remaining */}
          {auction.status === "active" && (
            <div className={`p-4 rounded-xl mb-6 ${isEndingSoon ? "bg-red-50 border-2 border-red-200" : "bg-yellow-50"}`}>
              <div className="flex items-center gap-2 mb-2">
                <Clock className={isEndingSoon ? "text-red-500" : "text-yellow-600"} size={20} />
                <span className={`font-semibold ${isEndingSoon ? "text-red-600" : "text-yellow-700"}`}>
                  {isEndingSoon ? "🔥 Sắp kết thúc!" : "Thời gian còn lại"}
                </span>
              </div>
              <p className={`text-2xl font-bold ${isEndingSoon ? "text-red-600" : "text-gray-800"}`}>
                {formatTime(timeLeft)}
              </p>
            </div>
          )}

          {/* Price Info */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Giá hiện tại</p>
                <p className="text-3xl font-bold text-red-600">₫{formatPrice(auction.current_price_cents)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Số lượt đặt</p>
                <p className="text-3xl font-bold text-gray-800">{auction.total_bids || 0}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
              <div>
                <p className="text-xs text-gray-500">Giá khởi điểm</p>
                <p className="font-semibold">₫{formatPrice(auction.starting_price_cents)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Bước giá</p>
                <p className="font-semibold">₫{formatPrice(auction.bid_increment_cents)}</p>
              </div>
            </div>

            {auction.reserve_price_cents && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">Giá dự trữ</p>
                <p className={`font-semibold ${auction.has_reached_reserve ? "text-green-600" : "text-orange-600"}`}>
                  {auction.has_reached_reserve ? "✓ Đã đạt giá dự trữ" : "✗ Chưa đạt giá dự trữ"}
                </p>
              </div>
            )}
          </div>

          {/* Bid Form */}
          {canBid && (
            <div className="bg-blue-50 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <TrendingUp size={20} className="text-blue-600" />
                Đặt giá
              </h3>

              {error && (
                <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg mb-4 flex items-center gap-2">
                  <AlertCircle size={18} />
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₫</span>
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder="Nhập số tiền"
                    className="w-full pl-8 pr-4 py-3 border-2 border-blue-300 rounded-xl text-lg font-semibold focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  onClick={handlePlaceBid}
                  disabled={bidding}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold rounded-xl transition"
                >
                  {bidding ? "Đang xử lý..." : "ĐẶT GIÁ"}
                </button>
              </div>

              <p className="text-sm text-blue-700 mt-3">
                Giá tối thiểu: ₫{new Intl.NumberFormat("vi-VN").format(
                  auction.minimum_bid 
                    ? Math.ceil(auction.minimum_bid)
                    : Math.ceil((auction.current_price_cents + auction.bid_increment_cents) / 100)
                )}
              </p>
            </div>
          )}

          {/* Warnings */}
          {isOwner && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
              <p className="text-yellow-800">⚠️ Bạn là chủ phiên đấu giá này, không thể tự đặt giá.</p>
            </div>
          )}

          {!token && auction.status === "active" && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-red-700">
                Vui lòng <Link to="/login" className="font-semibold underline">đăng nhập</Link> để tham gia đấu giá.
              </p>
            </div>
          )}

          {/* Highest Bidder */}
          {auction.highest_bidder && (
            <div className="bg-green-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-600">Người dẫn đầu</p>
              <p className="font-semibold text-green-700">👑 {auction.highest_bidder.full_name}</p>
            </div>
          )}

          {/* Bid History */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Users size={20} />
              Lịch sử đặt giá ({auction.total_bids || 0})
            </h3>

            {auction.bids?.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {auction.bids.map((bid, idx) => (
                  <div key={bid.id} className={`flex items-center justify-between p-3 rounded-lg ${idx === 0 ? "bg-green-50" : "bg-gray-50"}`}>
                    <div className="flex items-center gap-3">
                      {idx === 0 && <span className="text-lg">👑</span>}
                      <div>
                        <p className={`font-medium ${idx === 0 ? "text-green-700" : "text-gray-700"}`}>
                          {bid.user?.full_name || "Ẩn danh"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(bid.created_at).toLocaleString("vi-VN")}
                        </p>
                      </div>
                    </div>
                    <p className={`font-bold ${idx === 0 ? "text-green-600" : "text-gray-600"}`}>
                      ₫{formatPrice(bid.amount_cents)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">Chưa có lượt đặt giá nào</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionDetailPage;
