import React from "react";

const PaymentMethod = () => {
    return (
        <div className="bg-white p-6 rounded shadow space-y-4">
            <h2 className="text-lg font-semibold">Thanh toán</h2>
            <p className="text-sm text-gray-500">Giao dịch được mã hoá và bảo mật</p>
            <div className="space-y-2">
                <input type="text" placeholder="Số thẻ" className="w-full border px-4 py-2 rounded" />
                <input type="text" placeholder="Tên chủ thẻ" className="w-full border px-4 py-2 rounded" />
                <input type="text" placeholder="Ngày hết hạn (MM/YY)" className="w-full border px-4 py-2 rounded" />
                <input type="text" placeholder="Mã bảo mật" className="w-full border px-4 py-2 rounded" />
            </div>
            <div className="grid grid-cols-3 gap-2 text-sm text-blue-600">
                <button>PayPal</button>
                <button>Afterpay</button>
                <button>Zip</button>
            </div>
        </div>
    );
};

export default PaymentMethod;
