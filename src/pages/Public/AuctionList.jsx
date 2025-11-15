import React from "react";
import { Link } from "react-router-dom";

const sampleAuctions = [
  {
    id: 1,
    title: "Đồng hồ cổ điển",
    price: 500000,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
  },
  {
    id: 2,
    title: "Giày thể thao limited",
    price: 1500000,
    image:
      "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80",
  },
];

const AuctionList = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-extrabold mb-8">Danh sách đấu giá</h2>

      {/* ⭐ Card gọn & cân đối */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {sampleAuctions.map((item) => (
          <Link
            key={item.id}
            to={`/auction/${item.id}`}
            className="bg-white rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            {/* Hình nhỏ hơn – không chiếm quá nhiều chiều cao */}
            <img
              src={item.image}
              alt={item.title}
              className="h-36 w-full object-cover rounded-t-xl"
            />

            <div className="p-4">
              <h3 className="font-semibold text-gray-800 text-sm line-clamp-2">{item.title}</h3>

              <p className="text-indigo-600 font-bold mt-2 text-base">
                ₫{item.price.toLocaleString("vi-VN")}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AuctionList;
