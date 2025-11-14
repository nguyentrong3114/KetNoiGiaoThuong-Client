import React from "react";
import { useNavigate } from "react-router-dom";

const OrderReview = () => {
    const navigate = useNavigate();

    const handleCheckout = () => {
        // Sau này có thể thêm xử lý lưu đơn hàng tại đây
        navigate("/track-order");
    };

    return (
        <div className="bg-white p-6 rounded shadow space-y-4">
            <h2 className="text-lg font-semibold">Tổng kết đơn hàng</h2>
            <div className="text-sm space-y-2">
                <div className="flex justify-between">
                    <span>1 sản phẩm</span>
                    <span>$14.99</span>
                </div>

                <input
                    type="text"
                    placeholder="Mã giảm giá hoặc thẻ quà tặng"
                    className="w-full border px-4 py-2 rounded"
                />
                <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                    Áp dụng
                </button>

                <div className="flex justify-between pt-4">
                    <span>Phí giao hàng</span>
                    <span>$9.95</span>
                </div>

                <div className="flex justify-between font-bold text-lg pt-2">
                    <span>Tổng cộng</span>
                    <span>AUD $24.94</span>
                </div>

                <p className="text-xs text-gray-500">Đã bao gồm $2.26 thuế GST</p>

                <textarea
                    placeholder="Ghi chú đơn hàng (tuỳ chọn)"
                    className="w-full border px-4 py-2 rounded mt-2"
                />

                <label className="flex items-center gap-2 text-sm mt-2">
                    <input type="checkbox" />
                    Tôi đồng ý với chính sách bảo mật và điều khoản
                </label>

                <button
                    onClick={handleCheckout}
                    className="mt-4 w-full py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
                >
                    Thanh toán $24.94
                </button>
            </div>
        </div>
    );
};

export default OrderReview;
