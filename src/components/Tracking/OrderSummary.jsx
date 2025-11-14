import React from "react";

const OrderSummary = ({ summary }) => {
    return (
        <div className="bg-white p-6 rounded shadow space-y-2">
            <h2 className="text-lg font-semibold">Tổng kết đơn hàng</h2>
            <div className="text-sm space-y-1">
                <div className="flex justify-between">
                    <span>Giảm giá</span>
                    <span>-${summary.discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Giảm thêm (20%)</span>
                    <span>-${summary.extraDiscount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Phí giao hàng</span>
                    <span>${summary.delivery.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Thuế</span>
                    <span>+${summary.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2">
                    <span>Tổng cộng</span>
                    <span>${summary.total.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
};

export default OrderSummary;
