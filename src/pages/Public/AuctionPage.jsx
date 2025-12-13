import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  Share2,
  Clock,
  User,
  Tag,
  ShieldCheck,
  Gavel,
  AlertCircle,
} from "lucide-react";

// Giả sử các component con này vẫn nằm đúng vị trí của bạn
import CountdownTimer from "../../components/Auction/CountdownTimer";
import BidModal from "../../components/Auction/BidModal";
import ReviewForm from "../../components/Auction/ReviewForm";

const AuctionPage = () => {
  /* ============================
     GIỮ NGUYÊN LOGIC CỦA BẠN
  ============================ */
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBidOpen, setIsBidOpen] = useState(false);

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        // Lưu ý: Đảm bảo biến môi trường VITE_API_BASE_URL đã được cấu hình đúng
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auctions/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            Accept: "application/json",
          },
        });
        const data = await response.json();
        if (data?.data) {
          setProduct(data.data);
        }
      } catch (error) {
        console.error("Error fetching auction:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAuction();
  }, [id]);

  /* ============================
        UI NÂNG CẤP
  ============================ */

  // Loading State đẹp hơn
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Đang tải thông tin đấu giá...</p>
        </div>
      </div>
    );
  }

  // Not Found State đẹp hơn
  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-sm max-w-md w-full border border-slate-100">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">Không tìm thấy phiên đấu giá</h3>
          <p className="text-slate-500 mb-6">
            Có thể phiên đấu giá đã kết thúc hoặc đường dẫn không tồn tại.
          </p>
          <Link
            to="/auctions"
            className="inline-flex items-center justify-center px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition"
          >
            Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 md:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* BACK NAVIGATION */}
        <div className="mb-6">
          <Link
            to="/auctions"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-medium transition-colors"
          >
            <ArrowLeft size={18} />
            Quay lại danh sách
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ================= LEFT COLUMN: IMAGES (Chiếm 7/12) ================= */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 relative group">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-[400px] md:h-[550px] object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/800x600?text=No+Image";
                }}
              />
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-green-400" />
                Đã kiểm duyệt
              </div>
            </div>

            {/* Description Box */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100">
              <h4 className="text-lg font-bold text-slate-900 mb-4 border-l-4 border-indigo-600 pl-3">
                Mô tả sản phẩm
              </h4>
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
                {product.description || "Chưa có mô tả chi tiết cho sản phẩm này."}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100">
              <h4 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                Đánh giá người dùng
              </h4>
              <ReviewForm onSubmit={(p) => console.log("Review:", p)} />
            </div>
          </div>

          {/* ================= RIGHT COLUMN: INFO & BIDDING (Chiếm 5/12) ================= */}
          <div className="lg:col-span-5 space-y-6 sticky top-6">
            {/* Main Info Card */}
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg shadow-slate-200/50 border border-slate-100">
              {/* Category & Share */}
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase">
                  <Tag size={12} />
                  {product.condition || "Đã sử dụng"}
                </span>
                <button className="text-slate-400 hover:text-indigo-600 transition-colors p-2 hover:bg-slate-50 rounded-full">
                  <Share2 size={20} />
                </button>
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight mb-4">
                {product.title}
              </h1>

              {/* Seller Info */}
              <div className="flex items-center gap-3 pb-6 border-b border-slate-100 mb-6">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Người bán</p>
                  <p className="text-sm font-bold text-slate-800">{product.seller || "Ẩn danh"}</p>
                </div>
              </div>

              {/* Countdown & Price Section */}
              <div className="space-y-6">
                {/* Timer Box */}
                <div className="flex items-center justify-between bg-red-50 rounded-xl p-4 border border-red-100">
                  <div className="flex items-center gap-2 text-red-600">
                    <Clock size={20} className="animate-pulse" />
                    <span className="text-sm font-bold uppercase">Kết thúc trong</span>
                  </div>
                  <div className="text-red-700 font-mono font-bold text-lg">
                    <CountdownTimer targetDate={product.endsAt} />
                  </div>
                </div>

                {/* Current Price Box */}
                <div>
                  <p className="text-sm text-slate-500 font-medium mb-1">Giá thầu hiện tại</p>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-extrabold text-indigo-600 tracking-tight">
                      ₫{Number(product.currentBid).toLocaleString("vi-VN")}
                    </span>
                  </div>

                  {product.highestBidder && (
                    <div className="mt-2 flex items-center gap-2 text-sm bg-green-50 text-green-700 px-3 py-1.5 rounded-lg inline-flex">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                      Người dẫn đầu: <strong>{product.highestBidder}</strong>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-5 gap-3 pt-2">
                  <button
                    onClick={() => setIsBidOpen(true)}
                    className="col-span-4 bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 px-6 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <Gavel size={20} />
                    Đặt giá ngay
                  </button>
                  <button className="col-span-1 border border-slate-200 hover:border-pink-200 hover:bg-pink-50 text-slate-400 hover:text-pink-500 rounded-xl flex items-center justify-center transition-all group">
                    <Heart size={22} className="group-hover:fill-pink-500 transition-colors" />
                  </button>
                </div>

                <p className="text-xs text-center text-slate-400">
                  Bằng việc đặt giá, bạn đồng ý với{" "}
                  <a href="#" className="underline hover:text-indigo-600">
                    điều khoản đấu giá
                  </a>{" "}
                  của chúng tôi.
                </p>
              </div>
            </div>

            {/* Trust Badges (Optional Decoration) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-3">
                <ShieldCheck size={24} className="text-indigo-600" />
                <div>
                  <p className="text-xs font-bold text-slate-800">Bảo vệ người mua</p>
                  <p className="text-[10px] text-slate-500">Hoàn tiền nếu lỗi</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-3">
                <Tag size={24} className="text-indigo-600" />
                <div>
                  <p className="text-xs font-bold text-slate-800">Giá tốt nhất</p>
                  <p className="text-[10px] text-slate-500">Cạnh tranh công bằng</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL BIDDING - Giữ nguyên logic truyền props */}
      <BidModal
        open={isBidOpen}
        onClose={() => setIsBidOpen(false)}
        product={product}
        onBidSuccess={() => {}}
      />
    </div>
  );
};

export default AuctionPage;
