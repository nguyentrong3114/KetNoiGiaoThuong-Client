import React from "react";

const PaymentMethod = () => {
  const methods = []; // ⭐ Không có dữ liệu thanh toán → đợi API

  return (
    <div className="bg-white p-6 rounded shadow space-y-4">
      <h2 className="text-lg font-semibold">Thanh toán</h2>
      <p className="text-sm text-gray-500">Giao dịch sẽ được bảo mật</p>

      {/* Không có dữ liệu */}
      {methods.length === 0 && (
        <p className="text-gray-500 text-sm">Chưa có phương thức thanh toán nào.</p>
      )}
    </div>
  );
};

export default PaymentMethod;
