import React from "react";

const OrderSummary = ({ totalItems, deliveryFee, subtotal }) => {
    return (
        <div className="bg-white p-6 rounded shadow">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span>Items total</span>
                    <span>${totalItems.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Delivery fee</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-4">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>
            </div>
            <button className="mt-6 w-full py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
                Checkout ${subtotal.toFixed(2)}
            </button>
        </div>
    );
};

export default OrderSummary;
