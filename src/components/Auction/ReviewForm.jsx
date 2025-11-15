import React, { useState } from 'react';

const Star = ({ filled, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`text-2xl ${filled ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 transition`}
    aria-label={filled ? 'Star filled' : 'Star'}
  >
    ★
  </button>
);

const ReviewForm = ({ onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const submit = (e) => {
    e.preventDefault();
    onSubmit?.({ rating, comment });
    setRating(0);
    setComment('');
  };

  return (
    <form onSubmit={submit} className="bg-white rounded-lg shadow-sm p-5">
      <h4 className="font-semibold text-lg mb-3">Đánh giá</h4>
      <div className="flex items-center gap-2 mb-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} filled={i <= rating} onClick={() => setRating(i)} />
        ))}
        <span className="text-sm text-gray-500 ml-2">{rating}/5</span>
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full border border-gray-200 rounded-md p-3 h-28 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        placeholder="Viết nhận xét của bạn..."
      />
      <div className="flex justify-end mt-4">
        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow">
          Gửi đánh giá
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;
