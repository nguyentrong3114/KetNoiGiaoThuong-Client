import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import ProductShowcase from "../../components/Company/ProductShowcase";
import ProductDetails from "../../components/Company/ProductDetails";
import ReviewSection from "../../components/Company/ReviewSection";

const ProductDetailPage = () => {
  const { slug, id } = useParams();
  const navigate = useNavigate();

  // Không còn productMock
  const product = null;

  // Tạm thời chưa có API
  const addToCart = () => {
    alert("Tính năng giỏ hàng sẽ hoạt động sau khi kết nối API");
  };

  const buyNow = () => {
    alert("Tính năng mua ngay sẽ hoạt động sau khi kết nối API");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 🔙 Nút quay lại */}
      <div className="container mx-auto px-4 pt-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 
                     font-medium mb-4 transition"
        >
          <ArrowLeft size={20} />
          Quay lại
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 mt-6">
          {/* Ảnh */}
          <div className="lg:col-span-1">
            <ProductShowcase productId={id} />
          </div>

          {/* Chi tiết */}
          <div className="lg:col-span-2 space-y-8">
            <ProductDetails productId={id} slug={slug} />

            {/* Nút */}
            <div className="flex flex-wrap gap-4 mt-4">
              <button
                onClick={addToCart}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold 
                           px-6 py-3 rounded-xl shadow transition"
              >
                🛒 Thêm vào giỏ hàng
              </button>

              <button
                onClick={buyNow}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold 
                           px-6 py-3 rounded-xl shadow transition"
              >
                ⚡ Mua ngay
              </button>
            </div>

            {/* Đánh giá */}
            <ReviewSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
