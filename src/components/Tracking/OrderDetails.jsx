import React from "react";

const OrderDetails = ({ items, orderId, date, deliveryDate }) => {
    return (
        <div className="bg-white p-6 rounded shadow space-y-2">
            <h2 className="text-lg font-semibold">Chi tiết đơn hàng</h2>
            <p className="text-sm text-gray-500">Mã đơn: {orderId}</p>
            <p className="text-sm text-gray-500">Ngày đặt: {date}</p>
            <p className="text-sm text-gray-500">Dự kiến giao: {deliveryDate}</p>
            <ul className="mt-4 space-y-2">
                {items.map((item, idx) => (
                    <li key={idx} className="flex justify-between text-sm">
                        <span>{item.name} x{item.quantity}</span>
                        <span>${item.price.toFixed(2)}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OrderDetails;
