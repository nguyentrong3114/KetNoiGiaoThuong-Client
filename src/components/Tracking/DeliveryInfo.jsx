import React from "react";

const DeliveryInfo = ({ address, payment }) => {
    return (
        <div className="bg-white p-6 rounded shadow space-y-2">
            <h2 className="text-lg font-semibold">Thông tin giao hàng & thanh toán</h2>
            <div className="text-sm">
                <p><strong>Địa chỉ nhận hàng:</strong></p>
                <pre className="whitespace-pre-wrap text-gray-700">{address}</pre>
                <p className="mt-2"><strong>Phương thức thanh toán:</strong> {payment}</p>
            </div>
        </div>
    );
};

export default DeliveryInfo;
