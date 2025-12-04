import React from "react";

const ShippingMethod = () => {
  const methods = []; // ⭐ Không có dữ liệu → chờ API

  return (
    <div className="bg-white p-6 rounded shadow space-y-4">
      <h2 className="text-lg font-semibold">Phương thức giao hàng</h2>

      {/* Không có dữ liệu */}
      {methods.length === 0 && (
        <p className="text-gray-500 text-sm">Chưa có phương thức giao hàng.</p>
      )}
    </div>
  );
};

export default ShippingMethod;
