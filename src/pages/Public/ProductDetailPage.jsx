import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import ProductShowcase from "../../components/Company/ProductShowcase";
import ProductDetails from "../../components/Company/ProductDetails";
import ReviewSection from "../../components/Company/ReviewSection";

const ProductDetailPage = () => {
  const { slug, id } = useParams();
  const navigate = useNavigate();

  // Giả lập product để thêm giỏ hàng
  // (sau này bạn thay bằng API hoặc truyền props từ ProductDetails)
  const productMock = {
    id: id,
    name: `Sản phẩm #${id}`,
    price: 300000,
    qty: 1,
    slug: slug,
    image: "https://images.unsplash.com/photo-1520975928319-24f0d71e1e45?q=80&w=800",
  };

  // ⭐ Thêm vào giỏ hàng
  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Kiểm tra đã tồn tại trong giỏ chưa
    const existing = cart.find((item) => item.id === productMock.id);

    if (existing) {
      existing.qty += 1;
    } else {
      cart.push(productMock);
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Đã thêm sản phẩm vào giỏ hàng!");
  };

  // ⭐ Mua ngay → chuyển sang CHECKOUT
  const buyNow = () => {
    localStorage.setItem("checkout_item", JSON.stringify(productMock));
    navigate("/checkout"); // 🔥 chuyển đến trang thanh toán
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
          {/* --- Cột trái – Ảnh sản phẩm --- */}
          <div className="lg:col-span-1">
            <ProductShowcase productId={id} />
          </div>

          {/* --- Cột phải – Chi tiết + nút mua hàng --- */}
          <div className="lg:col-span-2 space-y-8">
            {/* Chi tiết */}
            <ProductDetails productId={id} slug={slug} />

            {/* --- Nút hành động --- */}
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
