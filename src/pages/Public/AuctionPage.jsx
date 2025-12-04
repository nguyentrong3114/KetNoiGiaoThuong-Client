import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import CountdownTimer from "../../components/Auction/CountdownTimer";
import BidModal from "../../components/Auction/BidModal";
import ReviewForm from "../../components/Auction/ReviewForm";

const AuctionPage = () => {
  const { id } = useParams();

  // ❗ Chưa fetch API → để trống
  const product = null;

  // Modal đặt giá
  const [isBidOpen, setIsBidOpen] = useState(false);

  // Khi chưa có API → show placeholder
  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500">
        <p className="text-lg">Chưa có dữ liệu đấu giá.</p>
      </div>
    );
  }

  // Khi đã có API → hiển thị như cũ
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h2 className="text-3xl font-extrabold">{product.title}</h2>
        <p className="text-sm text-gray-500 mt-1">Chi tiết sản phẩm và giao diện đặt giá</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* LEFT IMAGE */}
        <div className="bg-white rounded-lg overflow-hidden shadow-sm">
          <img src={product.image} alt={product.title} className="w-full h-[520px] object-cover" />
        </div>

        {/* RIGHT INFO */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold">{product.title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {product.condition} · {product.seller}
                </p>
              </div>

              <div className="text-right">
                <div className="text-xs text-gray-400">Kết thúc</div>
                <CountdownTimer targetDate={product.endsAt} />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 items-center">
              <div>
                <div className="text-sm text-gray-400">Giá hiện tại</div>
                <div className="text-3xl font-extrabold text-indigo-600">
                  ₫{product.currentBid.toLocaleString("vi-VN")}
                </div>

                {product.highestBidder && (
                  <p className="text-xs mt-1 text-gray-500">
                    Người dẫn đầu: <strong>{product.highestBidder}</strong>
                  </p>
                )}
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setIsBidOpen(true)}
                  className="px-5 py-3 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700"
                >
                  Đặt giá ngay
                </button>
                <button className="px-5 py-3 border border-gray-200 rounded-md hover:bg-gray-50">
                  Yêu thích
                </button>
              </div>
            </div>

            <div className="mt-6 text-sm text-gray-700">
              <h4 className="font-medium mb-2">Mô tả</h4>
              <p className="leading-relaxed">{product.description}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h4 className="text-lg font-semibold mb-4">Đánh giá người dùng</h4>
            <ReviewForm onSubmit={(p) => console.log("Review:", p)} />
          </div>
        </div>
      </div>

      {/* MODAL BIDDING */}
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
