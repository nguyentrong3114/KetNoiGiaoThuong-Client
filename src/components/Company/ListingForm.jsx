"use client";

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Upload, X, Image, Crown, Zap, Star } from "lucide-react";
import { listingApi, subscriptionApi } from "../../services/apiClient";
import { Link } from "react-router-dom";

const ListingForm = ({ editId }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const isEditMode = !!editId;
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    type: "sell",
    price_cents: "",
    stock_qty: "",
    location_text: "",
    latitude: "",
    longitude: "",
    status: "draft",
  });

  const [subscriptionInfo, setSubscriptionInfo] = useState(null);
  
  // Images state - hỗ trợ cả URL cũ và file mới
  const [existingImages, setExistingImages] = useState([]); // Ảnh đã có (từ server)
  const [newFiles, setNewFiles] = useState([]); // File mới chọn (chưa upload)
  const [previewUrls, setPreviewUrls] = useState([]); // Preview URLs cho file mới
  const [uploadingImages, setUploadingImages] = useState(false);
  
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Load dữ liệu khi edit
  useEffect(() => {
    if (isEditMode) {
      loadListing();
    }
    loadSubscriptionInfo();
  }, [editId]);

  // Load thông tin gói subscription hiện tại
  const loadSubscriptionInfo = async () => {
    try {
      const response = await subscriptionApi.getCurrent();
      // API trả về trực tiếp object subscription (không có wrapper data)
      console.log("📦 Subscription info:", response);
      setSubscriptionInfo(response || null);
    } catch (err) {
      // 404 = User chưa có gói subscription - dùng gói Free
      console.log("ℹ️ No active subscription (Free plan)");
      setSubscriptionInfo(null);
    }
  };

  // Cleanup preview URLs khi unmount
  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const loadListing = async () => {
    setLoading(true);
    try {
      console.log("📥 Loading listing:", editId);
      const response = await listingApi.getById(editId);
      console.log("✅ Listing data:", response);
      
      if (response) {
        setFormData({
          title: response.title || "",
          description: response.description || "",
          category: response.category || "",
          type: response.type || "sell",
          price_cents: response.price_cents ? Math.round(response.price_cents / 100) : "",
          stock_qty: response.stock_qty || "",
          location_text: response.location_text || "",
          latitude: response.latitude || "",
          longitude: response.longitude || "",
          status: response.status || "draft",
        });
        
        // Load existing images
        // API có thể trả về images dạng array URLs hoặc array objects {id, url}
        const images = response.images || response.listing_images || [];
        const formattedImages = images.map((img, index) => {
          if (typeof img === 'string') {
            return { id: index, url: img };
          }
          return { id: img.id, url: img.url || img.image_url };
        });
        setExistingImages(formattedImages);
      }
    } catch (error) {
      console.error("❌ Error loading listing:", error);
      setMessage("❌ Không thể tải thông tin sản phẩm!");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý chọn file
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} quá lớn (tối đa 5MB)`);
        return false;
      }
      if (!file.type.startsWith('image/')) {
        alert(`File ${file.name} không phải là ảnh`);
        return false;
      }
      return true;
    });

    // Giới hạn tổng số ảnh
    const totalImages = existingImages.length + newFiles.length + validFiles.length;
    if (totalImages > 10) {
      alert("Tối đa 10 ảnh cho mỗi sản phẩm");
      return;
    }

    // Tạo preview URLs
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    
    setNewFiles(prev => [...prev, ...validFiles]);
    setPreviewUrls(prev => [...prev, ...newPreviews]);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Xóa ảnh đã có (từ server)
  const handleRemoveExistingImage = async (imageId, index) => {
    if (isEditMode && typeof imageId === 'number') {
      try {
        await listingApi.deleteImage(editId, imageId);
        console.log("✅ Deleted image:", imageId);
      } catch (error) {
        console.error("❌ Error deleting image:", error);
      }
    }
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  // Xóa file mới (chưa upload)
  const handleRemoveNewFile = (index) => {
    URL.revokeObjectURL(previewUrls[index]);
    setNewFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Ngăn double submit
    if (submitting || uploadingImages) {
      console.log("⚠️ Already submitting, ignoring...");
      return;
    }
    
    setSubmitting(true);
    setMessage("");
    
    try {
      if (!formData.title || !formData.price_cents) {
        setMessage("❌ Vui lòng nhập đầy đủ tiêu đề và giá!");
        setSubmitting(false);
        return;
      }

      const priceCents = parseInt(formData.price_cents) * 100;

      // Payload cơ bản
      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        type: formData.type,
        price_cents: priceCents,
        stock_qty: parseInt(formData.stock_qty) || 0,
        location_text: formData.location_text,
        latitude: parseFloat(formData.latitude) || null,
        longitude: parseFloat(formData.longitude) || null,
        images: existingImages.map(img => img.url), // Giữ lại URLs cũ
        status: formData.status,
        is_active: true,
        is_public: true,
      };

      console.log("📤 Submitting:", payload);
      
      let listingId = editId;
      
      if (isEditMode) {
        await listingApi.update(editId, payload);
        console.log("✅ Update response");
      } else {
        // Tạo idempotency key để tránh tạo duplicate khi double submit
        const idempotencyKey = `listing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const response = await listingApi.createWithIdempotency(payload, idempotencyKey);
        console.log("✅ Create response:", response);
        
        // Kiểm tra nếu là duplicate
        if (response?.is_duplicate) {
          console.log("ℹ️ Listing already exists (idempotent), using existing ID");
        }
        
        listingId = response?.data?.id || response?.id;
      }

      // Upload ảnh mới nếu có
      if (newFiles.length > 0 && listingId) {
        setUploadingImages(true);
        setMessage("📤 Đang upload ảnh...");
        
        try {
          await listingApi.uploadImages(listingId, newFiles);
          console.log("✅ Images uploaded");
        } catch (uploadError) {
          console.error("❌ Upload images error:", uploadError);
          setMessage("⚠️ Sản phẩm đã lưu nhưng upload ảnh thất bại: " + uploadError.message);
          setUploadingImages(false);
          // Vẫn redirect sau 2 giây để user có thể upload lại
          setTimeout(() => {
            navigate(`/dashboard/company/edit/${listingId}`);
          }, 2000);
          return;
        }
        setUploadingImages(false);
      }
      
      setMessage(isEditMode ? "✅ Cập nhật sản phẩm thành công!" : "✅ Đăng tin thành công!");
      
      setTimeout(() => {
        navigate("/dashboard/company");
      }, 1500);
      
    } catch (error) {
      console.error("❌ Error:", error);
      
      // Xử lý lỗi validation 422 (bao gồm trùng tên)
      if (error.message?.includes("tiêu đề này") || error.message?.includes("title")) {
        setMessage("❌ Bạn đã có bài đăng với tiêu đề này. Vui lòng đổi tiêu đề khác!");
      } else {
        setMessage("❌ " + (error.message || "Có lỗi xảy ra"));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      setSubmitting(true);
      await listingApi.delete(editId);
      setMessage("✅ Đã xóa sản phẩm!");
      setShowDeleteModal(false);
      setTimeout(() => {
        navigate("/dashboard/company");
      }, 1500);
    } catch (error) {
      console.error("❌ Error deleting:", error);
      setMessage("❌ " + (error.message || "Không thể xóa sản phẩm"));
    } finally {
      setSubmitting(false);
    }
  };

  const totalImages = existingImages.length + newFiles.length;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Đang tải thông tin sản phẩm...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-blue-900 mb-2">
          {isEditMode ? "Chỉnh sửa sản phẩm" : "Đăng tin giao thương"}
        </h1>
        <p className="text-gray-600">
          {isEditMode 
            ? "Cập nhật thông tin sản phẩm của bạn" 
            : "Đăng tin mua bán – hợp tác kinh doanh"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Basic Info */}
        <div className="p-8 border-2 border-gray-200 rounded-lg bg-white">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-gray-900">Thông tin cơ bản</h2>
            {isEditMode && (
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
              >
                <Trash2 size={18} />
                Xóa sản phẩm
              </button>
            )}
          </div>
          <p className="text-sm text-gray-500 mb-6">Nhập thông tin chi tiết về sản phẩm</p>

          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Tiêu đề <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                placeholder="VD: iPhone 15 Pro Max 256GB"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">Mô tả chi tiết</label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Mô tả chi tiết về sản phẩm..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Category & Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Danh mục</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Chọn danh mục</option>
                  <option value="Điện tử">Điện tử</option>
                  <option value="Thời trang">Thời trang</option>
                  <option value="Thực phẩm">Thực phẩm</option>
                  <option value="Nông sản">Nông sản</option>
                  <option value="Dịch vụ">Dịch vụ</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Loại tin</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="sell">Bán hàng</option>
                  <option value="buy">Mua hàng</option>
                  <option value="service">Dịch vụ</option>
                </select>
              </div>
            </div>

            {/* Price & Stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Giá (VNĐ) <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="number"
                  name="price_cents"
                  value={formData.price_cents}
                  onChange={handleInputChange}
                  placeholder="VD: 35000000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Số lượng</label>
                <input
                  type="number"
                  name="stock_qty"
                  value={formData.stock_qty}
                  onChange={handleInputChange}
                  placeholder="VD: 10"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Status (edit mode) */}
            {isEditMode && (
              <div>
                <label className="block text-sm font-medium mb-2">Trạng thái</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="draft">Nháp</option>
                  <option value="published">Đã đăng</option>
                  <option value="archived">Lưu trữ</option>
                </select>
              </div>
            )}

            {/* Location */}
            <div>
              <label className="block text-sm font-medium mb-2">Địa chỉ</label>
              <input
                type="text"
                name="location_text"
                value={formData.location_text}
                onChange={handleInputChange}
                placeholder="VD: Hà Nội"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>


        {/* Section 2: Images Upload */}
        <div className="p-8 border-2 border-gray-200 rounded-lg bg-white">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-gray-900">Hình ảnh sản phẩm</h2>
            <span className="text-sm text-gray-500">{totalImages}/10 ảnh</span>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            Upload tối đa 10 ảnh, mỗi ảnh tối đa 5MB (jpeg, png, webp)
          </p>

          {/* Upload Area */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition mb-6"
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">Click để chọn ảnh hoặc kéo thả vào đây</p>
            <p className="text-sm text-gray-400 mt-1">Hỗ trợ: JPG, PNG, WEBP (tối đa 5MB/ảnh)</p>
          </div>

          {/* Image Preview Grid */}
          {(existingImages.length > 0 || previewUrls.length > 0) && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {/* Existing Images */}
              {existingImages.map((img, index) => (
                <div key={`existing-${img.id || index}`} className="relative group aspect-square">
                  <img 
                    src={img.url} 
                    alt={`Ảnh ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg border-2 border-gray-200"
                    onError={(e) => { e.target.src = '/default-avatar.jpg'; }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition rounded-lg" />
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(img.id, index)}
                    className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition flex items-center justify-center shadow-lg"
                  >
                    <X size={16} />
                  </button>
                  {index === 0 && (
                    <span className="absolute bottom-2 left-2 px-2 py-1 bg-blue-600 text-white text-xs rounded font-medium">
                      Ảnh chính
                    </span>
                  )}
                </div>
              ))}

              {/* New Files Preview */}
              {previewUrls.map((url, index) => (
                <div key={`new-${index}`} className="relative group aspect-square">
                  <img 
                    src={url} 
                    alt={`Ảnh mới ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg border-2 border-green-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition rounded-lg" />
                  <button
                    type="button"
                    onClick={() => handleRemoveNewFile(index)}
                    className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition flex items-center justify-center shadow-lg"
                  >
                    <X size={16} />
                  </button>
                  <span className="absolute bottom-2 left-2 px-2 py-1 bg-green-500 text-white text-xs rounded font-medium">
                    Mới
                  </span>
                </div>
              ))}

              {/* Add More Button */}
              {totalImages < 10 && (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition"
                >
                  <Image className="w-8 h-8 text-gray-400 mb-1" />
                  <span className="text-sm text-gray-500">Thêm ảnh</span>
                </div>
              )}
            </div>
          )}

          {uploadingImages && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-blue-700">Đang upload ảnh...</span>
            </div>
          )}
        </div>

        {/* Section 3: Subscription Info - Hiển thị gói tháng hiện tại */}
        {!isEditMode && (
          <div className="p-8 border-2 border-gray-200 rounded-lg bg-white">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Quyền lợi đăng tin</h2>
            <p className="text-sm text-gray-500 mb-6">Tin đăng sẽ được hưởng quyền lợi theo gói tháng của bạn</p>

            {subscriptionInfo && subscriptionInfo.status === "active" ? (
              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-6 text-white">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    {(subscriptionInfo.plan?.slug === "enterprise" || subscriptionInfo.plan?.badge === "enterprise") && <Crown className="text-yellow-300" size={24} />}
                    {(subscriptionInfo.plan?.slug === "pro" || subscriptionInfo.plan?.badge === "pro") && <Zap className="text-purple-200" size={24} />}
                    {(subscriptionInfo.plan?.slug === "basic" || subscriptionInfo.plan?.badge === "basic") && <Star className="text-blue-200" size={24} />}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{subscriptionInfo.plan?.name}</h3>
                    <p className="text-purple-200 text-sm">Gói đang hoạt động</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-sm text-purple-200">Còn lại</p>
                    <p className="text-2xl font-bold">{subscriptionInfo.days_remaining} ngày</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <p className="text-purple-200 text-xs">Tin đăng</p>
                    <p className="text-lg font-bold">{subscriptionInfo.usage?.listings_used || 0}/{subscriptionInfo.plan?.features?.max_listings || "∞"}</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <p className="text-purple-200 text-xs">Ảnh/tin</p>
                    <p className="text-lg font-bold">{subscriptionInfo.plan?.features?.max_images_per_listing || 5}</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <p className="text-purple-200 text-xs">Tin nổi bật</p>
                    <p className="text-lg font-bold">{subscriptionInfo.plan?.features?.featured_listings || 0}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <Star className="text-gray-400" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">Gói miễn phí</h3>
                    <p className="text-sm text-gray-500">Bạn đang sử dụng gói Free</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-white rounded-lg p-3 text-center border">
                    <p className="text-gray-500 text-xs">Tin đăng</p>
                    <p className="text-lg font-bold text-gray-700">10</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center border">
                    <p className="text-gray-500 text-xs">Ảnh/tin</p>
                    <p className="text-lg font-bold text-gray-700">5</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center border">
                    <p className="text-gray-500 text-xs">Tin nổi bật</p>
                    <p className="text-lg font-bold text-gray-400">0</p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 text-sm mb-2">
                    💡 Nâng cấp gói để giảm chiết khấu và tăng hiển thị sản phẩm!
                  </p>
                  <Link 
                    to="/pricing" 
                    className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700"
                  >
                    Xem các gói nâng cấp →
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Section 4: Submit */}
        <div className="p-6 border-2 border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
          {message && (
            <div className={`mb-4 p-3 rounded-lg ${message.includes('✅') ? 'bg-green-100 text-green-700' : message.includes('📤') ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
              {message}
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div>
              {!isEditMode && subscriptionInfo?.status === "active" && (
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    (subscriptionInfo.plan?.slug === "enterprise" || subscriptionInfo.plan?.badge === "enterprise") ? "bg-yellow-100 text-yellow-700" :
                    (subscriptionInfo.plan?.slug === "pro" || subscriptionInfo.plan?.badge === "pro") ? "bg-purple-100 text-purple-700" :
                    "bg-blue-100 text-blue-700"
                  }`}>
                    {subscriptionInfo.plan?.name}
                  </span>
                  <span className="text-sm text-gray-600">
                    Còn {subscriptionInfo.days_remaining} ngày
                  </span>
                </div>
              )}
              {!isEditMode && (!subscriptionInfo || subscriptionInfo?.status !== "active") && (
                <p className="text-sm text-gray-600">Gói Free - Tối đa 10 tin đăng</p>
              )}
              {isEditMode && (
                <p className="text-sm text-gray-600">Nhấn nút để lưu thay đổi</p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate("/dashboard/company")}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={submitting || uploadingImages}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg font-semibold transition disabled:bg-gray-400 flex items-center gap-2"
              >
                {(submitting || uploadingImages) && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                {submitting ? "Đang xử lý..." : uploadingImages ? "Đang upload..." : isEditMode ? "Lưu thay đổi" : "Đăng tin"}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Xác nhận xóa</h3>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa sản phẩm "<span className="font-semibold">{formData.title}</span>"?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition"
              >
                Hủy
              </button>
              <button
                onClick={handleDelete}
                disabled={submitting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition disabled:bg-gray-400"
              >
                {submitting ? "Đang xóa..." : "Xóa"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingForm;
