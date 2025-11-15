const ProductDetails = () => {
  return (
    <div className="w-full">
      <div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">Đầm dáng chữ A</h3>
        <p className="text-gray-600 mb-6">400.000 VNĐ</p>

        {/* Bảng thông số sản phẩm */}
        <div className="mb-8">
          <table className="w-full text-sm">
            <tbody>
              {[
                ["Kích cỡ", "Free size"],
                ["Chất liệu", "Ankara"],
                ["Phong cách", "Vintage"],
                ["Độ dày vải", "Vừa – trung bình"],
                ["Họa tiết", "In họa tiết"],
                ["Phù hợp", "Đi chơi, hằng ngày"],
                ["Form dáng", "TBU"],
                ["Đóng/mở", "Thun tự nhiên"],
                ["Kích thước", "1917 / 1987"],
              ].map(([label, value], index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-3 text-gray-600 font-medium">{label}</td>
                  <td className="py-3 text-gray-900">{value}</td>
                </tr>
              ))}

              <tr>
                <td className="py-3 text-gray-600 font-medium">Loại sản phẩm</td>
                <td className="py-3 text-gray-900">
                  <a href="#" className="text-blue-600 underline">
                    Yêu cầu đo size riêng
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Mô tả */}
        <p className="text-sm text-gray-600 leading-relaxed mb-8">
          Sản phẩm được thiết kế theo phong cách hiện đại, mang lại sự thoải mái và tự tin. Chất
          liệu cao cấp, bền đẹp, đảm bảo trải nghiệm tốt nhất cho người mặc.
        </p>

        {/* Nút thao tác */}
        <div className="flex gap-4 mb-8">
          <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
            Thêm vào giỏ
          </button>
          <button className="flex-1 border-2 border-blue-600 text-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
            Thanh toán ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
