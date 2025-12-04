import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const OrderReview = () => {
  const navigate = useNavigate();

  const [coupon, setCoupon] = useState("");
  const [note, setNote] = useState("");
  const [agree, setAgree] = useState(false);

  // ⭐ Không có dữ liệu đơn hàng — chờ API
  const orderItems = [];
  const subtotal = 0;
  const shippingFee = 0;
  const total = 0;

  const handleCheckout = () => {
    if (!agree) {
      alert("⚠️ Bạn cần đồng ý điều khoản trước khi thanh toán.");
      return;
    }

    alert("🎉 Thanh toán thành công!");
    navigate("/track-order");
  };

  return (
    <div className="bg-white p-6 rounded shadow space-y-4">
      <h2 className="text-lg font-semibold">Tổng kết đơn hàng</h2>

      {orderItems.length === 0 && (
        <p className="text-gray-500 text-sm">Chưa có sản phẩm trong đơn hàng.</p>
      )}

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

      {/* Không có shippingFee/subtotal → từ API sau */}
      <div className="flex justify-between text-gray-700">
        <span>Tạm tính</span>
        <span>{subtotal} đ</span>
      </div>

      <div className="flex justify-between text-gray-700">
        <span>Phí giao hàng</span>
        <span>{shippingFee} đ</span>
      </div>

      <div className="flex justify-between font-bold text-lg pt-3">
        <span>Tổng cộng</span>
        <span>{total} đ</span>
      </div>

      {/* Ghi chú */}
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

      {/* Thanh toán */}
      <button
        onClick={handleCheckout}
        className="mt-4 w-full py-3 bg-green-600 text-white rounded-full 
                   font-semibold hover:bg-green-700 transition"
      >
        Thanh toán
      </button>
    </div>
  );
};

export default OrderReview;
