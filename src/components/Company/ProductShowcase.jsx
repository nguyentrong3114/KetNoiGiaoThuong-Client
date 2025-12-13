"use client";

import { useState } from "react";

const ProductShowcase = ({ product, images }) => {
  const [currentImage, setCurrentImage] = useState(0);

  // Lấy images từ product hoặc prop
  const productImages = images || product?.images || [];

  // Nếu không có hình → hiển thị placeholder
  if (!productImages.length) {
    return (
      <div className="bg-gray-200 rounded-2xl aspect-square flex items-center justify-center">
        <p className="text-gray-500">Chưa có hình ảnh</p>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  return (
    <div className="px-0 mx-0 my-0 py-0">
      {/* Hình lớn */}
      <div className="relative bg-gradient-to-br from-pink-200 via-pink-100 to-purple-200 rounded-2xl overflow-hidden mb-6">
        <div className="aspect-square flex items-center justify-center">
          <img src={productImages[currentImage]} alt="Sản phẩm" className="w-full h-full object-cover" />
        </div>

        {/* Nút điều hướng */}
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg transition"
        >
          <svg
            className="w-6 h-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-3 shadow-lg transition"
        >
          <svg
            className="w-6 h-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Thumbnail */}
      <div className="flex gap-3 overflow-x-auto">
        {productImages.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentImage(idx)}
            className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition 
              ${idx === currentImage ? "border-blue-600" : "border-gray-200 hover:border-gray-300"}`}
          >
            <img src={img} alt={`Ảnh ${idx + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductShowcase;
