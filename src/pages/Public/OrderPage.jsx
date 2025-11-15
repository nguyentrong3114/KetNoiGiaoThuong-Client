import React, { useMemo } from "react";
import OrderItem from "../../components/Order/OrderItem";
import OrderSummary from "../../components/Order/OrderSummary";

const OrderPage = () => {
  const items = useMemo(() => [
    {
      id: 1,
      name: "Sweet Green Seedless Grapes 1.5-2 lb",
      image: "🍇",
      price: 90.99,
      quantity: 1,
      unitPrice: 25.98,
    },
    {
      id: 2,
      name: "Sweet Green Seedless Grapes 1.5-2 lb",
      image: "🍒",
      price: 90.99,
      quantity: 1,
      unitPrice: 25.98,
    },
  ], []);

  const totalItems = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const deliveryFee = 5.78;
  const subtotal = totalItems + deliveryFee;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">Trang Đơn Hàng</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {items.map((item) => (
            <OrderItem key={item.id} item={item} />
          ))}
        </div>
        <OrderSummary totalItems={totalItems} deliveryFee={deliveryFee} subtotal={subtotal} />
      </div>
    </div>
  );
};

export default OrderPage;
