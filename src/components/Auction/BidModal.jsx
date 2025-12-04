import React, { useState, useEffect } from "react";
import Modal from "../Modal";
import CountdownTimer from "./CountdownTimer";

const BidModal = ({ open, onClose, product, onBidSuccess }) => {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  // ❗ Không có dữ liệu → không render modal
  if (!product) return null;

  useEffect(() => {
    if (open) {
      setAmount("");
      setError("");
    }
  }, [open]);

  const submit = (e) => {
    e.preventDefault();

    const value = Number(amount);

    if (!value) {
      setError("Vui lòng nhập giá hợp lệ.");
      return;
    }
    if (value <= (product.currentBid || 0)) {
      setError("Giá thầu phải cao hơn giá hiện tại.");
      return;
    }

    const updated = {
      ...product,
      currentBid: value,
      highestBidder: "Bạn",
    };

    if (onBidSuccess) onBidSuccess(updated);

    alert("🎉 Đặt giá thành công!");
    onClose();
  };

  return (
    <Modal open={open} title={`Đặt giá - ${product.title}`} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        {/* Current price */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-500">Giá hiện tại</label>
            <div className="text-xl font-bold text-indigo-600">
              ₫{(product.currentBid || 0).toLocaleString("vi-VN")}
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-500">Thời gian còn lại</label>
            <CountdownTimer targetDate={product.endsAt} />
          </div>
        </div>

        {/* input */}
        <div>
          <label className="block text-sm text-gray-500 mb-1">Nhập giá mới</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setError("");
            }}
            min={(product.currentBid || 0) + 1}
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
