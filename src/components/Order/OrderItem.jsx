import React from "react";

const OrderItem = ({ item }) => {
    return (
        <div className="flex items-center justify-between bg-white p-4 rounded shadow">
            <div className="flex items-center gap-4">
                <div className="text-3xl">{item.image}</div>
                <div>
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-sm text-gray-500">Giá: ${item.unitPrice.toFixed(2)}</div>
                </div>
            </div>
            <div className="text-right">
                <div className="text-sm">Số lượng: {item.quantity}</div>
                <div className="text-sm font-medium text-blue-600">
                    Tổng: ${(item.unitPrice * item.quantity).toFixed(2)}
                </div>
            </div>
        </div>
    );
};

export default OrderItem;
