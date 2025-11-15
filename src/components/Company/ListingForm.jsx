"use client";

import { useState } from "react";
import { Upload, Eye, Zap, TrendingUp } from "lucide-react";

const packages = [
  {
    id: "free",
    name: "Gói miễn phí",
    price: 0,
    days: 1,
    features: ["Hiển thị tin thường", "Không ưu tiên tìm kiếm", "Hỗ trợ cơ bản"],
  },
  {
    id: "premium",
    name: "Gói nổi bật",
    price: 500000,
    days: 30,
    popular: true,
    features: [
      "Ưu tiên trong tìm kiếm",
      "Hiển thị nổi bật trên trang chủ",
      'Đánh dấu "Tin VIP"',
      "Hỗ trợ 24/7",
    ],
  },
  {
    id: "advanced",
    name: "Gói cao cấp",
    price: 1000000,
    days: 30,
    features: [
      "Bao gồm toàn bộ tính năng gói Nổi bật",
      "Đứng đầu danh sách trong 7 ngày",
      "Báo cáo thống kê chi tiết",
      "Quảng bá qua email marketing",
      "Tư vấn tối ưu hóa",
    ],
  },
];

const ListingForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    area: "",
    price: "",
  });

  const [selectedPackage, setSelectedPackage] = useState("free");
  const [images, setImages] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    if (e.target.files) {
      setImages([...e.target.files]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", {
      formData,
      selectedPackage,
      images,
    });
  };

  const currentPackage = packages.find((p) => p.id === selectedPackage);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-blue-900 mb-2">Đăng tin giao thương</h1>
        <p className="text-gray-600">
          Đăng tin mua bán – hợp tác kinh doanh để kết nối với hàng nghìn doanh nghiệp trên toàn
          quốc.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Basic Info */}
        <div className="p-8 border-2 border-gray-200 rounded-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Thông tin cơ bản</h2>
          <p className="text-sm text-gray-500 mb-6">
            Vui lòng nhập thông tin chi tiết về tin đăng của bạn.
          </p>

          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Tiêu đề tin đăng <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                placeholder="VD: Cung cấp hạt điều rang muối chất lượng cao"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Mô tả chi tiết <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Mô tả chi tiết về sản phẩm/dịch vụ..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Tối đa 50 ký tự mô tả ngắn sẽ được hiển thị ưu tiên.
              </p>
            </div>

            {/* Category & Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Danh mục <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Chọn danh mục</option>
                  <option value="import">Hàng nhập khẩu</option>
                  <option value="domestic">Hàng trong nước</option>
                  <option value="service">Dịch vụ</option>
                </select>
              </div>

              {/* Area */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Khu vực <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Chọn khu vực</option>
                  <option value="north">Miền Bắc</option>
                  <option value="central">Miền Trung</option>
                  <option value="south">Miền Nam</option>
                </select>
              </div>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Giá cả <span className="text-red-500">*</span>
              </label>
              <input
                required
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="VD: 50.000.000 / lô"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Image Upload */}
        <div className="p-8 border-2 border-gray-200 rounded-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Hình ảnh</h2>
          <p className="text-sm text-gray-500 mb-6">
            Tải hình ảnh giúp tin đăng thu hút và uy tín hơn.
          </p>

          <label className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-dashed border-blue-300 rounded-lg p-12 flex flex-col items-center gap-4 cursor-pointer text-center hover:bg-blue-100 transition">
            <Upload className="w-12 h-12 text-blue-500" />
            <div>
              <p className="font-semibold text-gray-700">Tải hình ảnh lên</p>
              <p className="text-sm text-gray-500">File PNG, JPG – tối đa 5MB</p>
            </div>
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>

          {images.length > 0 && (
            <p className="text-sm text-gray-600 mt-4">Đã chọn {images.length} hình ảnh</p>
          )}
        </div>

        {/* Section 3: Package selection */}
        <div className="p-8 border-2 border-gray-200 rounded-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Chọn gói tin</h2>
          <p className="text-sm text-gray-500 mb-8">
            Gói tin giúp tăng độ hiển thị và hiệu quả tìm kiếm.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                onClick={() => setSelectedPackage(pkg.id)}
                className={`relative p-6 rounded-lg border-2 cursor-pointer transition ${
                  selectedPackage === pkg.id
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-300 hover:border-blue-400"
                }`}
              >
                {/* Popular tag */}
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-3 py-1 text-xs font-semibold rounded-full">
                      Phổ biến
                    </span>
                  </div>
                )}

                {/* Icon */}
                <div className="mb-6">
                  {pkg.id === "free" && <Eye className="w-8 h-8 text-gray-600" />}
                  {pkg.id === "premium" && <Zap className="w-8 h-8 text-blue-600" />}
                  {pkg.id === "advanced" && <TrendingUp className="w-8 h-8 text-blue-600" />}
                </div>

                {/* Title */}
                <h3 className="font-bold text-gray-900 mb-2">{pkg.name}</h3>

                {/* Price */}
                {pkg.price > 0 ? (
                  <p className="text-2xl font-bold text-blue-600 mb-1">
                    {(pkg.price / 1000).toLocaleString()}đ
                  </p>
                ) : (
                  <p className="text-2xl font-bold text-gray-900 mb-1">Miễn phí</p>
                )}

                <p className="text-xs text-gray-500 mb-6">/ {pkg.days} ngày</p>

                {/* Features */}
                <ul className="space-y-2">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Summary */}
        <div className="p-6 border-2 border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Gói đang chọn:</p>
              <p className="font-bold text-gray-900">{currentPackage?.name}</p>
              <p className="text-xs text-gray-500 mt-1">
                Tin đăng sẽ tự xoá sau{" "}
                {currentPackage?.days === 1 ? "24 giờ" : `${currentPackage?.days} ngày`}
              </p>
            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg font-semibold transition"
            >
              Gửi duyệt tin
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ListingForm;
