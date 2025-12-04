import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, CheckCircle, PlusCircle } from "lucide-react";

const AuctionList = () => {
  const [auctions, setAuctions] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
    setAuctions([]);
  }, []);

  const now = Date.now();
  const filteredAuctions = auctions.filter((item) => {
    const end = new Date(item.endsAt).getTime();
    if (filter === "active") return end > now;
    if (filter === "ended") return end <= now;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Danh sách đấu giá</h2>

        <Link
          to="/auction/create"
          className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white 
          rounded-xl shadow hover:opacity-95 transition flex items-center gap-2"
        >
          <PlusCircle size={18} />
          Đăng sản phẩm đấu giá
        </Link>
      </div>

      {/* FILTER */}
      <div className="flex gap-3 mb-8">
        {[
          { key: "all", label: "Tất cả" },
          { key: "active", label: "Đang diễn ra" },
          { key: "ended", label: "Đã kết thúc" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`
              px-5 py-2.5 rounded-xl border text-sm font-medium transition flex items-center gap-2
              ${
                filter === key
                  ? key === "active"
                    ? "bg-green-600 text-white shadow"
                    : key === "ended"
                      ? "bg-red-600 text-white shadow"
                      : "bg-indigo-600 text-white shadow"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }
            `}
          >
            {key === "active" && <Clock size={16} />}
            {key === "ended" && <CheckCircle size={16} />}
            {label}
          </button>
        ))}
      </div>

      {/* LOADING */}
      {loading && <p className="text-center text-gray-500 text-sm italic">Đang tải dữ liệu...</p>}

      {/* GRID AUCTION LIST */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
        {!loading &&
          filteredAuctions.map((item) => {
            const isEnded = new Date(item.endsAt).getTime() <= now;

            return (
              <Link
                key={item.id}
                to={`/auction/${item.id}`}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl 
                transition-all duration-300 hover:-translate-y-1 relative"
              >
                {/* Badge trạng thái */}
                {!isEnded ? (
                  <div
                    className="absolute top-3 left-3 bg-green-600 text-white text-xs 
                  font-semibold px-3 py-1 rounded-full animate-pulse shadow"
                  >
                    Đang diễn ra
                  </div>
                ) : (
                  <div
                    className="absolute inset-0 bg-black/50 text-white flex items-center 
                  justify-center rounded-2xl font-semibold text-sm backdrop-blur-sm"
                  >
                    Đã kết thúc
                  </div>
                )}

                {/* IMAGE */}
                <div className="h-48 w-full overflow-hidden rounded-t-2xl">
                  <img
                    src={item.image}
                    alt={item.title}
                    className={`w-full h-full object-cover transition-transform duration-300 
                    ${!isEnded ? "hover:scale-110" : "opacity-60"}`}
                  />
                </div>

                {/* CONTENT */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">{item.title}</h3>

                  <p className="text-indigo-600 font-bold mt-2 text-base">
                    ₫{item.price.toLocaleString("vi-VN")}
                  </p>
                </div>
              </Link>
            );
          })}
      </div>

      {/* EMPTY */}
      {!loading && filteredAuctions.length === 0 && (
        <p className="text-center text-gray-500 mt-10 italic">Chưa có dữ liệu đấu giá.</p>
      )}
    </div>
  );
};

export default AuctionList;
