import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import CountdownTimer from "../../components/Auction/CountdownTimer";
import BidModal from "../../components/Auction/BidModal";
import ReviewForm from "../../components/Auction/ReviewForm";

// =============================
//   SAMPLE DATA (fallback)
// =============================
const sampleProducts = [
  {
    id: 1,
    title: "Đồng hồ cổ điển",
    description:
      "Đồng hồ chất lượng, đấu giá mở hôm nay. Mặt số bằng pha lê, dây da cổ điển, bảo hành 6 tháng.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    currentBid: 500000,
    highestBidder: null,
    endsAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    seller: "Người bán ABC",
    condition: "Like new",
  },
  {
    id: 2,
    title: "Giày thể thao Limited Edition",
    description: "Phiên bản giới hạn, còn rất mới. Được săn đón bởi sneakerhead.",
    image:
      "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80",
    currentBid: 1200000,
    highestBidder: null,
    endsAt: new Date(Date.now() + 1000 * 60 * 60 * 12).toISOString(),
    seller: "Shop XYZ",
    condition: "99%",
  },
];

const AuctionPage = () => {
  const { id } = useParams();

  // =============================
  //   Lấy danh sách từ localStorage
  //   (nếu không có thì lấy sample)
  // =============================
  const storedAuctions = JSON.parse(localStorage.getItem("auctions") || "[]");
  const allProducts = storedAuctions.length > 0 ? storedAuctions : sampleProducts;

  const [product, setProduct] = useState(allProducts.find((item) => item.id === Number(id)));

  const [isBidOpen, setIsBidOpen] = useState(false);

  // Save updated auction list to localStorage
  const updateLocalStorage = (updatedProduct) => {
    let list = [...allProducts];
    const idx = list.findIndex((i) => i.id === updatedProduct.id);
    if (idx !== -1) {
      list[idx] = updatedProduct;
      localStorage.setItem("auctions", JSON.stringify(list));
    }
  };

  // =============================
  //   callback khi đặt giá thành công
  // =============================
  const handleBidSuccess = (updated) => {
    setProduct(updated); // cập nhật UI
    updateLocalStorage(updated);
  };

  const handleReview = (payload) => {
    console.log("Review submitted:", payload);
  };

  // =============================
  //   Nếu không tìm thấy ID
  // =============================
  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-600">
        <h2 className="text-3xl font-bold">Không tìm thấy sản phẩm đấu giá</h2>
        <p className="mt-3">ID: {id}</p>
      </div>
    );
  }

  // =============================
  //        UI HIỂN THỊ
  // =============================
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
            <ReviewForm onSubmit={handleReview} />
          </div>
        </div>
      </div>

      {/* MODAL ĐẶT GIÁ */}
      <BidModal
        open={isBidOpen}
        onClose={() => setIsBidOpen(false)}
        product={product}
        onBidSuccess={handleBidSuccess}
      />
    </div>
  );
};

export default AuctionPage;
