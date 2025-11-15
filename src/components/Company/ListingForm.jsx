'use client'

import { useState } from 'react'
import { Upload, Eye, Zap, TrendingUp } from 'lucide-react'

const packages = [
  {
    id: 'free',
    name: 'Gói miễn phí',
    price: 0,
    days: 0,
    features: [
      'Hiển thị tin thương',
      'Không ưu tiên tìm kiếm',
      'Hỗ trợ cơ bản',
    ],
  },
  {
    id: 'premium',
    name: 'Gói nâi bật',
    price: 500000,
    days: 30,
    popular: true,
    features: [
      'Ưu tiên trong tìm kiếm',
      'Hiển thị nổi bật trên trang chủ',
      'Đánh dấu "Tin VIP"',
      'Hỗ trợ 24/7',
    ],
  },
  {
    id: 'advanced',
    name: 'Gói cấp cao',
    price: 1000000,
    days: 30,
    features: [
      'Tất cả các tính năng của gói nâi bật',
      'Hiển thị đầu trang trong vòng 7 ngày',
      'Báo cáo thống kê chi tiết',
      'Quảng bá qua email marketing',
      'Tư vấn chuyên nghiệp',
    ],
  },
]

const ListingForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    area: '',
    price: '',
  })
  const [selectedPackage, setSelectedPackage] = useState('free')
  const [images, setImages] = useState([])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = (e) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', { formData, selectedPackage, images })
  }

  const currentPackage = packages.find((p) => p.id === selectedPackage)

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-blue-900 mb-2">Đăng tin giao thương</h1>
        <p className="text-gray-600">
          Đăng tin mua bán, hợp tác kinh doanh để tìm kiếm những nhà cung cấp và khách hàng trên toàn quốc
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information Section */}
        <div className="p-8 border-2 border-gray-200 rounded-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Thông tin cơ bản</h2>
          <p className="text-sm text-gray-500 mb-6">Nhập những thông tin cơ bản về tin đăng của bạn</p>

          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tiêu đề tin đăng <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                placeholder="VD: Cung cấp nguồn lều thơm phiến chất lượng cao"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả chi tiết <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                placeholder="Mô tả chi tiết về sản phẩm/dịch vụ, điều kiện yêu cầu..."
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Tối đa 50 ký tự để tóm tắt cho thích nhìn lên trên</p>
            </div>

            {/* Category and Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thể loại tin đăng <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Chọn danh mục</option>
                  <option value="import">Hàng nhập khẩu</option>
                  <option value="domestic">Hàng trong nước</option>
                  <option value="service">Dịch vụ</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Khu vực <span className="text-red-500">*</span>
                </label>
                <select
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giá cả (Buy/Sell) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="price"
                placeholder="VD: 50.000.000 hạng, cần xem giá"
                value={formData.price}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Image Upload Section */}
        <div className="p-8 border-2 border-gray-200 rounded-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Hình ảnh</h2>
          <p className="text-sm text-gray-500 mb-6">Thêm những ảnh về sản phẩm để tiếp cận tốt hơn</p>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-dashed border-blue-300 rounded-lg p-12 text-center hover:bg-blue-100 transition-colors">
            <label className="cursor-pointer">
              <div className="flex flex-col items-center gap-4">
                <Upload className="w-12 h-12 text-blue-500" />
                <div>
                  <p className="font-semibold text-gray-700">Tải hình ảnh lên</p>
                  <p className="text-sm text-gray-500">PNG, JPG tối đa 5MB (50%)</p>
                </div>
              </div>
              <input
                type="file"
                multiple
                accept="image/png,image/jpeg"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

          {images.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-600">Đã chọn {images.length} hình ảnh</p>
            </div>
          )}
        </div>

        {/* Package Selection */}
        <div className="p-8 border-2 border-gray-200 rounded-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Chọn gói tin</h2>
          <p className="text-sm text-gray-500 mb-8">Lựa chọn gói phù hợp để nâng cao hiệu quả tiếp cận</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                onClick={() => setSelectedPackage(pkg.id)}
                className={`relative p-6 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedPackage === pkg.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-300 bg-white hover:border-blue-400'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-3 py-1 text-xs font-semibold rounded-full">
                      Phổ biến
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  {pkg.id === 'free' && <Eye className="w-8 h-8 text-gray-600" />}
                  {pkg.id === 'premium' && <Zap className="w-8 h-8 text-blue-600" />}
                  {pkg.id === 'advanced' && <TrendingUp className="w-8 h-8 text-blue-600" />}
                </div>

                <h3 className="font-bold text-gray-900 mb-2">{pkg.name}</h3>
                {pkg.price > 0 ? (
                  <p className="text-2xl font-bold text-blue-600 mb-1">
                    {(pkg.price / 1000000).toFixed(1).replace('.0', '')}.000.000đ
                  </p>
                ) : (
                  <p className="text-2xl font-bold text-gray-900 mb-1">{pkg.days} đ</p>
                )}
                <p className="text-xs text-gray-500 mb-6">/30 ngày</p>

                <ul className="space-y-2">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Package Summary */}
        <div className="p-6 border-2 border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Gói đã chọn:</p>
              <p className="font-bold text-gray-900">{currentPackage?.name}</p>
              <p className="text-xs text-gray-500 mt-1">
                Tin đăng sẽ được xoá sau{' '}
                {currentPackage?.days === 0 ? '24 giờ' : `${currentPackage?.days} ngày`}
              </p>
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg font-semibold"
            >
              Gửi duyệt tin
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default ListingForm
