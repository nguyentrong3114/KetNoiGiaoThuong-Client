import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Clock,
  CheckCircle,
  PlusCircle,
  TrendingUp,
  Users,
  Gavel,
  Filter,
  ArrowUpDown,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { auctionApi } from "../../services/apiClient";

const AuctionList = () => {
  /* ============================
     GIỮ NGUYÊN LOGIC CỦA BẠN
  ============================ */
  const [auctions, setAuctions] = useState([]);
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("ending_soon");
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchAuctions();
  }, [filter, sort]);

  const fetchAuctions = async () => {
    setLoading(true);
    try {
      const params = {
        status: filter === "all" ? undefined : filter,
        sort: sort,
        per_page: 20,
      };
      const response = await auctionApi.getAll(params);
      if (response?.data) {
        setAuctions(response.data);
      }
    } catch (error) {
      console.error("Error fetching auctions:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (cents) => {
    if (!cents) return "0";
    return (cents / 100).toLocaleString("vi-VN");
  };

  /* ============================
     NÂNG CẤP VISUAL HELPER
  ============================ */
  const getStatusBadge = (status) => {
    // Nâng cấp màu sắc cho hiện đại hơn (pastel + strong text)
    const styles = {
      active: {
        bg: "bg-emerald-500",
        text: "Đang diễn ra",
        icon: <Clock size={12} className="animate-pulse" />,
        className: "shadow-emerald-200",
      },
      upcoming: {
        bg: "bg-blue-500",
        text: "Sắp diễn ra",
        icon: <Calendar size={12} />,
        className: "shadow-blue-200",
      },
      ended: {
        bg: "bg-slate-500",
        text: "Đã kết thúc",
        icon: <CheckCircle size={12} />,
        className: "shadow-slate-200",
      },
      cancelled: {
        bg: "bg-red-500",
        text: "Đã hủy",
        icon: <AlertCircle size={12} />,
        className: "shadow-red-200",
      },
      pending: {
        bg: "bg-amber-500",
        text: "Chờ duyệt",
        icon: <Clock size={12} />,
        className: "shadow-amber-200",
      },
    };
    return styles[status] || styles.active;
  };

  /* ============================
        GIAO DIỆN MỚI
  ============================ */
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 md:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-indigo-600 rounded-lg text-white shadow-lg shadow-indigo-200">
                <Gavel size={24} />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Sàn Đấu Giá</h2>
            </div>
            <p className="text-slate-500 text-sm md:text-base ml-1">
              Cơ hội sở hữu sản phẩm độc đáo với mức giá do bạn quyết định.
            </p>
          </div>

          {user?.role === "seller" && (
            <Link
              to="/auction/create"
              className="group flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all duration-300 hover:-translate-y-0.5"
            >
              <PlusCircle
                size={20}
                className="group-hover:rotate-90 transition-transform duration-300"
              />
              Tạo phiên đấu giá
            </Link>
          )}
        </div>

        {/* CONTROLS BAR (FILTER & SORT) */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Filter Tabs */}
          <div className="flex overflow-x-auto pb-2 md:pb-0 w-full md:w-auto gap-2 no-scrollbar">
            {[
              { key: "all", label: "Tất cả" },
              { key: "active", label: "Đang diễn ra" },
              { key: "upcoming", label: "Sắp diễn ra" },
              { key: "ended", label: "Đã kết thúc" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 border
                    ${
                      filter === key
                        ? "bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm"
                        : "bg-transparent border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                    }`}
              >
                {label}
                {filter === key && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="relative min-w-[200px]">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <ArrowUpDown size={16} />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-white border border-slate-200 rounded-xl text-sm text-slate-700 font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer appearance-none"
            >
              <option value="ending_soon">⏳ Sắp kết thúc</option>
              <option value="most_bids">🔥 Nhiều lượt đặt</option>
              <option value="highest_price">💰 Giá cao nhất</option>
              <option value="newest">🆕 Mới nhất</option>
            </select>
          </div>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm animate-pulse"
              >
                <div className="h-48 bg-slate-200 rounded-xl mb-4"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-3"></div>
                <div className="flex justify-between mt-4">
                  <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                  <div className="h-6 bg-slate-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* AUCTION GRID */}
        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {auctions.map((auction) => {
              const status = getStatusBadge(auction.status);
              const isEnded = auction.status === "ended" || auction.status === "cancelled";

              return (
                <Link
                  key={auction.id}
                  to={`/auction/${auction.id}`}
                  className="group bg-white rounded-3xl border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] hover:border-indigo-100 transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col"
                >
                  {/* Image Container */}
                  <div className="relative h-56 overflow-hidden bg-slate-100">
                    <img
                      src={auction.listing?.images?.[0] || "/default-avatar.jpg"}
                      alt={auction.listing?.title}
                      className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${isEnded ? "grayscale-[50%]" : ""}`}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
                      }}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>

                    {/* Status Badge */}
                    <div
                      className={`absolute top-3 left-3 flex items-center gap-1.5 pl-2 pr-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg backdrop-blur-md ${status.bg.replace("bg-", "bg-opacity-90 bg-")}`}
                    >
                      {status.icon}
                      {status.text}
                    </div>

                    {/* Timer (Floating) */}
                    {auction.status === "active" && auction.time_remaining && (
                      <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur text-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg border border-white/50">
                        <Clock size={14} className="text-red-500" />
                        <span className="tabular-nums">{auction.time_remaining}</span>
                      </div>
                    )}

                    {/* Ended Overlay */}
                    {isEnded && (
                      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="bg-white/90 text-slate-900 font-bold px-4 py-2 rounded-full shadow-xl text-sm uppercase tracking-wide">
                          {status.text}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content Body */}
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-bold text-slate-800 text-lg leading-snug line-clamp-2 mb-4 group-hover:text-indigo-600 transition-colors">
                      {auction.listing?.title || "Sản phẩm đấu giá"}
                    </h3>

                    {/* Price Info Grid */}
                    <div className="bg-slate-50 rounded-xl p-3 mb-4 border border-slate-100">
                      <div className="flex justify-between items-end mb-1">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Giá hiện tại
                        </span>
                        <span className="text-xs text-slate-400 line-through">
                          ₫{formatPrice(auction.starting_price_cents)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-extrabold text-indigo-600">
                          ₫{formatPrice(auction.current_price_cents)}
                        </span>
                        {auction.has_reached_reserve && (
                          <div className="group/tooltip relative">
                            <CheckCircle size={16} className="text-emerald-500 cursor-help" />
                            <span className="absolute bottom-full right-0 mb-2 w-max px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity">
                              Đã đạt giá sàn
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer Stats & Button */}
                    <div className="mt-auto flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium bg-white border border-slate-200 px-2 py-1 rounded-md">
                        <Users size={14} className="text-indigo-500" />
                        {auction.total_bids || 0} lượt đặt
                      </div>

                      {auction.status === "active" ? (
                        <button className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-1.5 group/btn">
                          Tham gia
                          <TrendingUp
                            size={16}
                            className="group-hover/btn:translate-x-0.5 transition-transform"
                          />
                        </button>
                      ) : (
                        <span className="text-xs font-medium text-slate-400">
                          Xem chi tiết &rarr;
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && auctions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-slate-300">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6 text-indigo-500">
              <Gavel size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Chưa tìm thấy phiên đấu giá</h3>
            <p className="text-slate-500 mb-8 text-center max-w-md">
              {filter === "active"
                ? "Hiện tại không có phiên đấu giá nào đang diễn ra. Hãy quay lại sau nhé!"
                : "Thử thay đổi bộ lọc hoặc tìm kiếm trạng thái khác."}
            </p>
            {user?.role === "seller" && (
              <Link
                to="/auction/create"
                className="inline-flex items-center gap-2 px-8 py-3 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition shadow-lg shadow-slate-200"
              >
                <PlusCircle size={20} />
                Tạo phiên đấu giá mới
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Ẩn scrollbar ngang cho thanh filter trên mobile */}
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default AuctionList;
