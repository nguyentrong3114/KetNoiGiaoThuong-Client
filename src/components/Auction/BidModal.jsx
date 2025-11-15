import React, { useState, useEffect } from "react";
import Modal from "../Modal";
import CountdownTimer from "./CountdownTimer";

const BidModal = ({ open, onClose, product, onBidSuccess }) => {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  // Reset input mỗi khi mở modal
  useEffect(() => {
    if (open) {
      setAmount("");
      setError("");
    }
  }, [open]);

  const submit = (e) => {
    e.preventDefault();
    const value = Number(amount);

    // ❌ Validate
    if (!value) {
      setError("Vui lòng nhập giá hợp lệ.");
      return;
    }
    if (value <= product.currentBid) {
      setError("Giá thầu phải cao hơn giá hiện tại.");
      return;
    }

    // 🧩 Tạo object cập nhật giá thầu
    const updated = {
      ...product,
      currentBid: value,
      highestBidder: "Bạn",
    };

    // 💾 Lưu vào localStorage (đấu giá user tạo)
    const auctions = JSON.parse(localStorage.getItem("auctions") || "[]");
    const idx = auctions.findIndex((a) => a.id === product.id);

    if (idx !== -1) {
      auctions[idx] = updated;
      localStorage.setItem("auctions", JSON.stringify(auctions));
    }

    // Cập nhật UI ngay lập tức
    if (onBidSuccess) onBidSuccess(updated);

    alert("🎉 Đặt giá thành công!");

    onClose();
  };

  return (
    <Modal open={open} title={`Đặt giá - ${product?.title}`} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        {/* Current price & countdown */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-500">Giá hiện tại</label>
            <div className="text-xl font-bold text-indigo-600">
              ₫{product?.currentBid.toLocaleString("vi-VN")}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-500">Thời gian còn lại</label>
            <CountdownTimer targetDate={product?.endsAt} />
          </div>
        </div>

        {/* Bid input */}
        <div>
          <label className="block text-sm text-gray-500 mb-1">Nhập giá mới</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setError("");
            }}
            min={product?.currentBid + 1}
            className="w-full border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />

          {error && <div className="text-sm text-red-500 mt-1">{error}</div>}
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Hủy
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700"
          >
            Xác nhận
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default BidModal;
