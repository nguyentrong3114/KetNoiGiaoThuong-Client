import React, { useMemo } from "react";
import OrderItem from "../../components/Order/OrderItem";
import OrderSummary from "../../components/Order/OrderSummary";

const OrderPage = () => {
  const items = useMemo(
    () => [
      {
        id: 1,
        name: "Nho Xanh Không Hạt 1.5 - 2 lb",
        image: "🍇",
        price: 90.99,
        quantity: 1,
        unitPrice: 25.98,
      },
      {
        id: 2,
        name: "Anh Đào Tươi Cao Cấp 1 lb",
        image: "🍒",
        price: 90.99,
        quantity: 1,
        unitPrice: 25.98,
      },
    ],
    []
  );

  const totalItems = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const deliveryFee = 5.78;
  const subtotal = totalItems + deliveryFee;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      {/* NỘI DUNG GIỎ HÀNG */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT: Danh sách sản phẩm */}
        <div className="md:col-span-2 space-y-4">
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
