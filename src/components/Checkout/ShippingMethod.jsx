import React from "react";

const ShippingMethod = () => {
    return (
        <div className="bg-white p-6 rounded shadow space-y-4">
            <h2 className="text-lg font-semibold">Phương thức giao hàng</h2>
            <label className="flex justify-between items-center border p-3 rounded">
                <span>Giao hàng tiêu chuẩn (3–7 ngày)</span>
                <span>$9.95</span>
            </label>
            <label className="flex justify-between items-center border p-3 rounded">
                <span>Giao hàng nhanh (1–4 ngày)</span>
                <span>$16.95</span>
            </label>
            <a href="#" className="text-blue-600 text-sm">Tìm hiểu thêm về giao hàng</a>
        </div>
    );
};

export default ShippingMethod;
