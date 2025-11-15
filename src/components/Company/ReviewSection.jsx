const ReviewSection = () => {
  return (
    <div className="bg-gray-50 p-8 rounded-lg py-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Gửi phản hồi hoặc đánh giá</h3>

      <p className="text-sm text-gray-600 mb-6">
        Hãy cho chúng tôi biết trải nghiệm của bạn để cải thiện chất lượng tốt hơn.
      </p>

      {/* Star Rating */}
      <div className="mb-6">
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <button key={i} className="text-yellow-400 text-2xl hover:text-yellow-500 transition">
              ★
            </button>
          ))}
        </div>
      </div>

      {/* Textarea */}
      <textarea
        placeholder="Nhập nội dung đánh giá..."
        className="w-full p-3 border border-gray-300 rounded-lg text-sm resize-none mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={6}
      />

      {/* Submit */}
      <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
          />
        </svg>
        Gửi đánh giá
      </button>
    </div>
  );
};

export default ReviewSection;
