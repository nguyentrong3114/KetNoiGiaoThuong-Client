import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OrderPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  // Đọc giỏ hàng từ localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Error parsing cart:", e);
        setCartItems([]);
      }
    }
  }, []);

  // Cập nhật localStorage khi giỏ hàng thay đổi
  const updateCart = (newCart) => {
    setCartItems(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  // Xóa sản phẩm khỏi giỏ
  const removeItem = (index) => {
    const newCart = cartItems.filter((_, i) => i !== index);
    updateCart(newCart);
  };

  // Thay đổi số lượng
  const updateQuantity = (index, newQty) => {
    if (newQty < 1) return;
    const newCart = [...cartItems];
    newCart[index].quantity = newQty;
    updateCart(newCart);
  };

  // Format giá (BE giờ trả về cả price và price_cents)
  const formatPrice = (price) => {
    if (!price && price !== 0) return "0";
    return Number(price).toLocaleString("vi-VN");
  };

  // Tính tổng - ưu tiên price (đã chia 100), fallback price_cents / 100
  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.price || (item.price_cents ? item.price_cents / 100 : 0);
    return sum + price * (item.quantity || 1);
  }, 0);
  const deliveryFee = cartItems.length > 0 ? 22000 : 0; // Phí ship cố định 22k theo BE
  const total = subtotal + deliveryFee;

  // Tiến hành thanh toán - Chỉ hỗ trợ 1 sản phẩm tại một thời điểm
  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    
    // Lấy sản phẩm đầu tiên để checkout
    const firstItem = cartItems[0];
    
    // Navigate đến CheckoutPage với listing data
    // BE giờ trả về cả price (đã chia 100) và price_cents
    navigate("/checkout", {
      state: {
        listing: {
          id: firstItem.id,
          title: firstItem.title,
          price_cents: firstItem.price_cents,
          price: firstItem.price || (firstItem.price_cents ? firstItem.price_cents / 100 : 0),
          images: firstItem.images,
          type: firstItem.type,
          shop: firstItem.shop,
          shop_id: firstItem.shop_id,
        },
        quantity: firstItem.quantity || 1,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">🛒 Giỏ hàng của bạn</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* LEFT: Danh sách sản phẩm */}
          <div className="md:col-span-2 space-y-4">
            {cartItems.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center">
                <p className="text-gray-500 text-lg mb-4">Giỏ hàng trống</p>
                <button
                  onClick={() => navigate("/products")}
                  className="text-blue-600 hover:underline font-medium"
                >
                  ← Tiếp tục mua sắm
                </button>
              </div>
            ) : (
              cartItems.map((item, index) => (
                <div key={index} className="bg-white rounded-xl p-4 shadow-sm flex gap-4">
                  {/* Ảnh sản phẩm */}
                  <img
                    src={item.images?.[0] || item.image || "https://via.placeholder.com/100"}
                    alt={item.title || item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  
                  {/* Thông tin */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.title || item.name}</h3>
                    <p className="text-blue-600 font-bold">₫{formatPrice(item.price || (item.price_cents ? item.price_cents / 100 : 0))}</p>
                    
                    {/* Số lượng */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(index, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(index, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  {/* Xóa */}
                  <button
                    onClick={() => removeItem(index)}
                    className="text-red-500 hover:text-red-700 font-medium"
                  >
                    Xóa
                  </button>
                </div>
              ))
            )}
          </div>

          {/* RIGHT: Tóm tắt đơn hàng */}
          <div className="bg-white rounded-xl p-6 shadow-sm h-fit">
            <h2 className="font-bold text-lg text-gray-900 mb-4">Tóm tắt đơn hàng</h2>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Tổng tiền hàng</span>
                <span>₫{subtotal.toLocaleString("vi-VN")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phí vận chuyển</span>
                <span>₫{deliveryFee.toLocaleString("vi-VN")}</span>
              </div>
              <hr />
              <div className="flex justify-between font-bold text-lg">
                <span>Tạm tính</span>
                <span>₫{total.toLocaleString("vi-VN")}</span>
              </div>
            </div>
            
            <button
              onClick={handleCheckout}
              disabled={cartItems.length === 0}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Tiến hành thanh toán ₫{total.toLocaleString("vi-VN")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
