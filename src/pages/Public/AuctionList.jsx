import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const defaultAuctions = [
  {
    id: 1,
    title: "Đồng hồ cổ điển",
    price: 500000,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    endsAt: new Date(Date.now() + 86400000).toISOString(), // còn 1 ngày
  },
  {
    id: 2,
    title: "Giày thể thao limited",
    price: 1500000,
    image:
      "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80",
    endsAt: new Date(Date.now() - 86400000).toISOString(), // đã kết thúc
  },
];

const AuctionList = () => {
  const [auctions, setAuctions] = useState(defaultAuctions);
  const [filter, setFilter] = useState("all"); // all | active | ended

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("auctions"));

      if (stored && Array.isArray(stored)) {
        const formatted = stored.map((p) => ({
          id: p.id,
          title: p.title,
          price: p.currentBid ?? p.price,
          image: p.image,
          endsAt: p.endsAt,
        }));

        setAuctions(formatted);
      }
    } catch (err) {
      console.error("Parse error:", err);
    }
  }, []);

  // ⭐ Lọc sản phẩm theo trạng thái
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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-extrabold">Danh sách đấu giá</h2>

        <Link
          to="/auction/create"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
        >
          + Đăng sản phẩm đấu giá
        </Link>
      </div>

      {/* ⭐ BỘ LỌC */}
      <div className="flex gap-3 mb-8">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg border ${
            filter === "all"
              ? "bg-indigo-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          Tất cả
        </button>

        <button
          onClick={() => setFilter("active")}
          className={`px-4 py-2 rounded-lg border ${
            filter === "active"
              ? "bg-green-600 text-white"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          Đang diễn ra
        </button>

        <button
          onClick={() => setFilter("ended")}
          className={`px-4 py-2 rounded-lg border ${
            filter === "ended" ? "bg-red-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          Đã kết thúc
        </button>
      </div>

      {/* GRID LIST */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredAuctions.map((item) => {
          const isEnded = new Date(item.endsAt).getTime() <= now;

          return (
            <Link
              key={item.id}
              to={`/auction/${item.id}`}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative"
            >
              {/* Overlay khi hết hạn */}
              {isEnded && (
                <div className="absolute inset-0 bg-black/50 text-white flex items-center justify-center rounded-xl text-sm font-semibold">
                  Đã kết thúc
                </div>
              )}

              <img
                src={item.image}
                alt={item.title}
                className={`h-36 w-full object-cover rounded-t-xl ${isEnded ? "opacity-60" : ""}`}
              />

              <div className="p-4">
                <h3 className="font-semibold text-gray-800 text-sm line-clamp-2">{item.title}</h3>

                <p className="text-indigo-600 font-bold mt-2 text-base">
                  ₫{item.price.toLocaleString("vi-VN")}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default AuctionList;
