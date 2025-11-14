import React from "react";

const BillingAddress = () => {
    return (
        <div className="bg-white p-6 rounded shadow space-y-4">
            <h2 className="text-lg font-semibold">Địa chỉ thanh toán</h2>
            <label className="flex items-center gap-2">
                <input type="radio" name="billing" defaultChecked />
                Giống địa chỉ giao hàng
            </label>
            <label className="flex items-center gap-2">
                <input type="radio" name="billing" />
                Sử dụng địa chỉ khác
            </label>
            <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" />
                Lưu thông tin cho lần sau
            </label>
        </div>
    );
};

export default BillingAddress;
