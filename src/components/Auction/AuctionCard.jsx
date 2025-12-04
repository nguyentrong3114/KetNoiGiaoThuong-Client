import React, { useState } from "react";
import CountdownTimer from "./CountdownTimer";
import BidModal from "./BidModal";

const AuctionCard = ({ product }) => {
  const [open, setOpen] = useState(false);

  // ❗ Không có dữ liệu
  if (!product) {
    return (
      <div className="p-4 border rounded-lg bg-gray-50 text-center text-gray-500">
        Chưa có dữ liệu đấu giá.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition transform hover:-translate-y-1">
      <div className="relative h-56 w-full bg-gray-100">
        <img
          src={product.image || "https://via.placeholder.com/600x400"}
          alt={product.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute left-3 top-3 bg-white px-3 py-1 rounded-lg text-sm font-medium shadow-sm border text-indigo-600">
          ₫{product.currentBid?.toLocaleString("vi-VN") || 0}
        </div>
        <div className="absolute right-3 top-3">
          <CountdownTimer targetDate={product.endsAt} />
        </div>
      </div>

      <div className="p-4 flex flex-col gap-3">
        <h3 className="text-lg font-semibold leading-tight truncate">{product.title}</h3>

        <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>

        <div className="mt-2 flex gap-3">
          <button
            onClick={() => setOpen(true)}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-md shadow-sm hover:opacity-95"
          >
            Đặt giá
          </button>
          <button className="flex-1 border border-gray-200 px-4 py-2 rounded-md text-sm hover:bg-gray-50">
            Xem chi tiết
          </button>
        </div>
      </div>

      <BidModal open={open} product={product} onClose={() => setOpen(false)} />
    </div>
  );
};

export default AuctionCard;
