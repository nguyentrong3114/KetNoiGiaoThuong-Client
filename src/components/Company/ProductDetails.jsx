"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProductDetails = ({ productId, slug, product }) => {
  const navigate = useNavigate();
  const [addedToCart, setAddedToCart] = useState(false);

  // Nếu chưa có dữ liệu → hiển thị placeholder
  if (!product) {
    return <div className="text-gray-500">Chưa có dữ liệu.</div>;
  }

  // Format giá (BE giờ trả về cả price và price_cents)
  // price = giá đã chia 100, price_cents = giá gốc trong DB
  const formatPrice = (price) => {
    if (!price && price !== 0) return "Liên hệ";
    return `₫${Number(price).toLocaleString("vi-VN")}`;
  };
  
  // Lấy giá hiển thị: ưu tiên price (đã chia 100), fallback price_cents / 100
  const displayPrice = product.price || (product.price_cents ? product.price_cents / 100 : 0);

  // ⭐ Thêm vào giỏ hàng
  const handleAddToCart = () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Kiểm tra sản phẩm đã có trong giỏ chưa
    const existingIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingIndex >= 0) {
      // Nếu đã có, tăng số lượng
      cart[existingIndex].quantity += 1;
    } else {
      // Nếu chưa có, thêm mới
      cart.push({
        ...product,
        quantity: 1,
        slug,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    
    // Hiển thị thông báo thành công
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  // ⭐ Thanh toán ngay - Navigate đến CheckoutPage với listing data
  const handleBuyNow = () => {
    // Truyền listing data qua state để CheckoutPage có thể gọi API preview
    // BE giờ trả về cả price (đã chia 100) và price_cents (giá gốc)
    const listingData = {
      id: product.id,
      title: product.title,
      price_cents: product.price_cents,
      price: product.price || displayPrice, // Dùng price từ BE hoặc displayPrice đã tính
      images: product.images,
      type: product.type,
      shop: product.shop,
      shop_id: product.shop_id,
    };
    
    console.log("🛒 Navigating to checkout:", listingData);
    
    navigate("/checkout", {
      state: {
        listing: listingData,
        quantity: 1,
      },
    });
  };

  return (
    <div className="w-full">
      {/* Header với badges */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">{product.title}</h3>
          <div className="flex items-center gap-2 mb-3">
            {product.category && (
              <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                {product.category}
              </span>
            )}
            {product.type && (
              <span className={`text-xs px-3 py-1 rounded-full ${
                product.type === 'sell' ? 'bg-blue-100 text-blue-700' :
                product.type === 'buy' ? 'bg-green-100 text-green-700' :
                'bg-purple-100 text-purple-700'
              }`}>
                {product.type === 'sell' ? '🛒 Bán hàng' : product.type === 'buy' ? '🛍️ Mua hàng' : '⚙️ Dịch vụ'}
              </span>
            )}
            {product.status === 'published' && (
              <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                ✓ Đang bán
              </span>
            )}
          </div>
        </div>
      </div>
      
      <p className="text-blue-600 font-bold text-3xl mb-6">{formatPrice(displayPrice)}</p>

      {/* Bảng thông tin */}
      <div className="mb-8">
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="py-3 font-medium text-gray-600 w-1/3">ID Tin đăng</td>
              <td className="py-3 text-gray-900">#{product.id}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-3 font-medium text-gray-600">Danh mục</td>
              <td className="py-3 text-gray-900">{product.category || "—"}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-3 font-medium text-gray-600">Loại tin</td>
              <td className="py-3 text-gray-900">
                {product.type === 'sell' ? 'Bán hàng' : 
                 product.type === 'buy' ? 'Mua hàng' : 
                 product.type === 'service' ? 'Dịch vụ' : '—'}
              </td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-3 font-medium text-gray-600">Số lượng tồn kho</td>
              <td className="py-3 text-gray-900">{product.stock_qty || 0} sản phẩm</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="py-3 font-medium text-gray-600">Vị trí</td>
              <td className="py-3 text-gray-900">📍 {product.location_text || "—"}</td>
            </tr>
            {product.rating && (
              <tr className="border-b border-gray-200">
                <td className="py-3 font-medium text-gray-600">Đánh giá</td>
                <td className="py-3 text-gray-900">⭐ {product.rating} ({product.total_reviews || 0} đánh giá)</td>
              </tr>
            )}
            {product.shop && (
              <tr className="border-b border-gray-200">
                <td className="py-3 font-medium text-gray-600">Cửa hàng</td>
                <td className="py-3 text-gray-900">
                  <a 
                    href={`/shops/${product.shop.slug || product.shop.id}`}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    {product.shop.name}
                  </a>
                  {product.shop.is_verified && (
                    <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      ✓ Đã xác thực
                    </span>
                  )}
                </td>
              </tr>
            )}
            <tr className="border-b border-gray-200">
              <td className="py-3 font-medium text-gray-600">Tiền tệ</td>
              <td className="py-3 text-gray-900">{product.currency || 'VND'}</td>
            </tr>
            <tr>
              <td className="py-3 font-medium text-gray-600">Trạng thái</td>
              <td className="py-3 text-gray-900">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  product.status === 'published' ? 'bg-green-100 text-green-700' : 
                  product.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {product.status === 'published' ? '✓ Đang bán' : 
                   product.status === 'draft' ? '📝 Nháp' : 
                   '📦 Đã lưu trữ'}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Mô tả */}
      <div className="mb-8">
        <h4 className="font-semibold text-gray-900 mb-2">Mô tả sản phẩm</h4>
        <p className="text-sm text-gray-600 whitespace-pre-line">
          {product.description || "Chưa có mô tả."}
        </p>
      </div>

      {/* ⭐ BUTTON ACTIONS */}
      <div className="flex gap-4 mt-8">
        <button
          onClick={handleAddToCart}
          className={`flex-1 py-3 rounded-lg font-semibold transition ${
            addedToCart 
              ? "bg-green-600 text-white" 
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {addedToCart ? "✓ Đã thêm vào giỏ hàng!" : "🛒 Thêm vào giỏ hàng"}
        </button>

        <button
          onClick={handleBuyNow}
          className="flex-1 border-2 border-red-500 text-red-500 py-3 rounded-lg font-semibold hover:bg-red-50 transition"
        >
          ⚡ Thanh toán ngay
        </button>
      </div>

      {/* Thông báo thêm giỏ hàng thành công */}
      {addedToCart && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
          <span className="text-green-700 font-medium">✓ Sản phẩm đã được thêm vào giỏ hàng!</span>
          <button
            onClick={() => navigate("/cart")}
            className="text-green-700 hover:text-green-900 font-semibold underline"
          >
            Xem giỏ hàng →
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
