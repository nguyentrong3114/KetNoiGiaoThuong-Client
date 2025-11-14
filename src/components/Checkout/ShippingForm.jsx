import React from "react";

const ShippingForm = () => {
    return (
        <div className="bg-white p-6 rounded shadow space-y-4">
            <h2 className="text-lg font-semibold">Địa chỉ giao hàng</h2>
            <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Họ" className="border px-4 py-2 rounded" />
                <input type="text" placeholder="Tên" className="border px-4 py-2 rounded" />
                <input type="text" placeholder="Công ty (tuỳ chọn)" className="col-span-2 border px-4 py-2 rounded" />
                <input type="text" placeholder="Địa chỉ" className="col-span-2 border px-4 py-2 rounded" />
                <input type="text" placeholder="Căn hộ, tầng, v.v. (tuỳ chọn)" className="col-span-2 border px-4 py-2 rounded" />
                <input type="text" placeholder="Phường/Xã" className="border px-4 py-2 rounded" />
                <input type="text" placeholder="Mã vùng" className="border px-4 py-2 rounded" />
                <select className="border px-4 py-2 rounded">
                    <option>Việt Nam</option>
                </select>
                <select className="border px-4 py-2 rounded">
                    <option>TP. HCM</option>
                </select>
            </div>
        </div>
    );
};

export default ShippingForm;
