import React from "react";

const steps = ["Order Confirmed", "Shipped", "Out for Delivery", "Delivered"];

const OrderStatus = ({ status }) => {
    return (
        <div className="bg-white p-6 rounded shadow">
            <h2 className="text-lg font-semibold mb-4">Trạng thái đơn hàng</h2>
            <div className="flex justify-between items-center">
                {steps.map((step, idx) => (
                    <div key={idx} className="flex-1 text-center">
                        <div
                            className={`w-4 h-4 mx-auto rounded-full ${step === status ? "bg-blue-600" : "bg-gray-300"
                                }`}
                        ></div>
                        <div className="text-sm mt-2">{step}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderStatus;
