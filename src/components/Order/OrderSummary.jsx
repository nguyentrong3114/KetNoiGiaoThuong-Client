import React from "react";
import { Link } from "react-router-dom";

const OrderSummary = ({ totalItems, deliveryFee, subtotal }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Tóm tắt đơn hàng</h2>

      <div className="flex justify-between text-gray-700">
        <span>Tổng tiền hàng</span>
        <span>${totalItems.toFixed(2)}</span>
      </div>

      <div className="flex justify-between text-gray-700">
        <span>Phí vận chuyển</span>
        <span>${deliveryFee.toFixed(2)}</span>
      </div>

      <div className="flex justify-between font-bold text-gray-900 border-t pt-3">
        <span>Tạm tính</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>

      {/* NÚT THANH TOÁN — CHUYỂN TRANG */}
      <Link
        to="/checkout"
        className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center font-semibold py-3 rounded-full transition"
      >
        Tiến hành thanh toán ${subtotal.toFixed(2)}
      </Link>
    </div>
  );
};

export default OrderSummary;
