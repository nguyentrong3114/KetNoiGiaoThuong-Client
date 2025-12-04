import React, { useMemo } from "react";
import OrderItem from "../../components/Order/OrderItem";
import OrderSummary from "../../components/Order/OrderSummary";

const OrderPage = () => {
  // ============================================
  // ❌ XOÁ DEMO ITEMS → ĐỂ TRỐNG
  // ============================================
  const items = useMemo(() => [], []);

  // ============================================
  // ❌ XOÁ DEMO TÍNH TOÁN
  // 👉 THAY BẰNG GIÁ TRỊ 0
  // ============================================
  const totalItems = 0;
  const deliveryFee = 0;
  const subtotal = 0;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT: Danh sách sản phẩm */}
        <div className="md:col-span-2 space-y-4">
          {items.length === 0 && (
            <p className="text-gray-600 text-sm italic text-center py-6">Giỏ hàng trống.</p>
          )}

          {items.map((item) => (
            <OrderItem key={item.id} item={item} />
          ))}
        </div>

        {/* RIGHT: Tóm tắt */}
        <div className="space-y-4">
          <OrderSummary totalItems={totalItems} deliveryFee={deliveryFee} subtotal={subtotal} />
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
