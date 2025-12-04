"use client";

import { useNavigate } from "react-router-dom";

const ProductDetails = ({ productId, slug }) => {
  const navigate = useNavigate();

  // ❗ Sau này sẽ fetch API để lấy chi tiết sản phẩm
  const product = null;

  // Nếu chưa có dữ liệu → hiển thị placeholder
  if (!product) {
    return <div className="text-gray-500">Chưa có dữ liệu.</div>;
  }

  // ⭐ Thêm vào giỏ hàng
  const handleAddToCart = () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart.push({
      ...product,
      quantity: 1,
      slug,
    });

    localStorage.setItem("cart", JSON.stringify(cart));
    navigate("/cart");
  };

  // ⭐ Thanh toán ngay
  const handleBuyNow = () => {
    localStorage.setItem(
      "checkoutItem",
      JSON.stringify({
        ...product,
        quantity: 1,
        slug,
      })
    );

    navigate("/checkout");
  };

  return (
    <div className="w-full">
      <h3 className="text-2xl font-semibold text-gray-900 mb-2">{product.name}</h3>
      <p className="text-gray-600 mb-6">{product.priceLabel}</p>

      {/* Bảng thông tin */}
      <div className="mb-8">
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="py-3 font-medium text-gray-600">Kích thước</td>
              <td className="py-3 text-gray-900">{product.size}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-3 font-medium text-gray-600">Chất liệu</td>
              <td className="py-3 text-gray-900">{product.material}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-3 font-medium text-gray-600">Phong cách</td>
              <td className="py-3 text-gray-900">{product.style}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-3 font-medium text-gray-600">Hoạ tiết</td>
              <td className="py-3 text-gray-900">{product.pattern}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-3 font-medium text-gray-600">Form dáng</td>
              <td className="py-3 text-gray-900">{product.fit}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-3 font-medium text-gray-600">Đóng/mở</td>
              <td className="py-3 text-gray-900">{product.closure}</td>
            </tr>
            <tr>
              <td className="py-3 font-medium text-gray-600">Kích thước</td>
              <td className="py-3 text-gray-900">{product.dimensions}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Mô tả */}
      <p className="text-sm text-gray-600 mb-8">
        Sản phẩm được thiết kế theo phong cách hiện đại, chất liệu bền đẹp và thoải mái.
      </p>

      {/* ⭐ BUTTON ACTIONS */}
      <div className="flex gap-4 mt-8">
        <button
          onClick={handleAddToCart}
          className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          🛒 Thêm vào giỏ hàng
        </button>

        <button
          onClick={handleBuyNow}
          className="flex-1 border-2 border-red-500 text-red-500 py-3 rounded-lg font-semibold hover:bg-red-50 transition"
        >
          ⚡ Thanh toán ngay
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
