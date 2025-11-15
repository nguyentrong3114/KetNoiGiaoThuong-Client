import React, { useState } from 'react';
import Modal from './Modal';
import CountdownTimer from './CountdownTimer';

const BidModal = ({ open, onClose, product }) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const num = Number(amount);
    if (!num || num <= product.currentBid) {
      setError('Vui lòng nhập số lớn hơn giá hiện tại');
      return;
    }
    // For now simulate bid submission
    console.log('BID SUBMIT', { productId: product.id, amount: num });
    // In a real app, call API then refresh product data
    onClose();
  };

  return (
    <Modal open={open} title={`Đặt giá - ${product?.title}`} onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-500">Giá hiện tại</label>
            <div className="text-xl font-bold">₫{product?.currentBid}</div>
          </div>
          <div>
            <label className="block text-sm text-gray-500">Thời gian còn lại</label>
            <div className="text-sm text-gray-600">
              <CountdownTimer targetDate={product?.endsAt} />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-500 mb-1">Nhập giá mới</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            min={product?.currentBid + 1}
          />
          {error && <div className="text-sm text-red-500 mt-1">{error}</div>}
        </div>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-200 rounded-md">
            Hủy
          </button>
          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow">
            Xác nhận
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default BidModal;
