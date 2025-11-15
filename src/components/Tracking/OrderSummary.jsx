import React from "react";

const formatCurrency = (value) => {
  return value.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};

const OrderSummary = ({ summary }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border space-y-3">
      <h2 className="text-lg font-semibold text-gray-900">Tổng kết đơn hàng</h2>

      <div className="text-sm text-gray-700 space-y-2">
        <div className="flex justify-between">
          <span>Giảm giá</span>
          <span className="text-red-600">- {formatCurrency(summary.discount)}</span>
        </div>

        <div className="flex justify-between">
          <span>Giảm thêm (20%)</span>
          <span className="text-red-600">- {formatCurrency(summary.extraDiscount)}</span>
        </div>

        <div className="flex justify-between">
          <span>Phí giao hàng</span>
          <span>{summary.delivery === 0 ? "Miễn phí" : formatCurrency(summary.delivery)}</span>
        </div>

        <div className="flex justify-between">
          <span>Thuế</span>
          <span className="text-blue-600">+ {formatCurrency(summary.tax)}</span>
        </div>

        <div className="border-t pt-3 flex justify-between font-bold text-base text-gray-900">
          <span>Tổng cộng</span>
          <span className="text-green-700">{formatCurrency(summary.total)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
