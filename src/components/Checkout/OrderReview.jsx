import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const OrderReview = () => {
  const navigate = useNavigate();

  const [coupon, setCoupon] = useState("");
  const [note, setNote] = useState("");
  const [agree, setAgree] = useState(false);

  const handleCheckout = () => {
    if (!agree) {
      alert("⚠️ Vui lòng đồng ý với chính sách bảo mật và điều khoản trước khi thanh toán.");
      return;
    }

    // Sau này thêm API tạo đơn hàng ở đây
    alert("🎉 Thanh toán thành công!\nCảm ơn bạn đã mua hàng.");

    navigate("/track-order");
  };

  return (
    <div className="bg-white p-6 rounded shadow space-y-4">
      <h2 className="text-lg font-semibold">Tổng kết đơn hàng</h2>

      <div className="text-sm space-y-3">
        {/* Sản phẩm */}
        <div className="flex justify-between text-gray-700">
          <span>1 sản phẩm</span>
          <span>$14.99</span>
        </div>

        {/* Mã giảm giá */}
        <div>
          <input
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            type="text"
            placeholder="Mã giảm giá hoặc thẻ quà tặng"
            className="w-full border px-4 py-2 rounded"
          />
          <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            Áp dụng
          </button>
        </div>

        {/* Phí giao hàng */}
        <div className="flex justify-between pt-2 text-gray-700">
          <span>Phí giao hàng</span>
          <span>$9.95</span>
        </div>

        {/* Tổng cộng */}
        <div className="flex justify-between font-bold text-lg pt-3">
          <span>Tổng cộng</span>
          <span>AUD $24.94</span>
        </div>

        <p className="text-xs text-gray-500">Đã bao gồm $2.26 thuế GST</p>

        {/* Ghi chú đơn hàng */}
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Ghi chú đơn hàng (tuỳ chọn)"
          className="w-full border px-4 py-2 rounded mt-2"
        />

        {/* Điều khoản */}
        <label className="flex items-center gap-2 text-sm mt-2">
          <input type="checkbox" checked={agree} onChange={() => setAgree(!agree)} />
          Tôi đồng ý với chính sách bảo mật và điều khoản
        </label>

        {/* NÚT THANH TOÁN */}
        <button
          onClick={handleCheckout}
          className="mt-4 w-full py-3 bg-green-600 text-white rounded-full 
                     font-semibold hover:bg-green-700 transition"
        >
          Thanh toán $24.94
        </button>
      </div>
    </div>
  );
};

export default OrderReview;
