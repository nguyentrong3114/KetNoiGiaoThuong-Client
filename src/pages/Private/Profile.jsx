/* ============================================================
   📌 PROFILE PAGE – API CONNECTED
============================================================ */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiSettings, FiLogOut, FiLock } from "react-icons/fi";
import { profileApi, authApi } from "../../services/apiClient";

const Profile = () => {
  const navigate = useNavigate();

  /* ============================================================
      📌 FETCH PROFILE FROM API
  ============================================================= */
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("info");
  const [avatarPreview, setAvatarPreview] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Thử lấy từ /identity/profile trước
        const response = await profileApi.getProfile();
        if (response?.data) {
          setProfile(response.data);
          return;
        }
      } catch (error) {
        console.error("Error fetching profile from /identity/profile:", error);
      }
      
      // Fallback: Lấy từ /user
      try {
        const userResponse = await authApi.me();
        if (userResponse?.data) {
          setProfile(userResponse.data);
          return;
        } else if (userResponse) {
          // Response có thể không có wrapper data
          setProfile(userResponse);
          return;
        }
      } catch (error) {
        console.error("Error fetching user from /user:", error);
      }
      
      // Fallback cuối: Lấy từ localStorage
      try {
        const savedUser = localStorage.getItem("user");
        if (savedUser && savedUser !== "undefined") {
          setProfile(JSON.parse(savedUser));
          return;
        }
      } catch (e) {
        console.error("Error parsing localStorage user:", e);
      }
      
      setLoading(false);
    };

    fetchProfile().finally(() => setLoading(false));
  }, []);

  /* ============================================================
      📌 LOGOUT WITH API
  ============================================================= */
  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  // Admin không cần xác thực danh tính
  const userRole = profile?.role || JSON.parse(localStorage.getItem("user") || "{}")?.role;
  const isAdmin = userRole === "admin";
  
  const menuItems = [
    { key: "info", icon: <FiUser />, label: "Thông tin cá nhân" },
    // Chỉ hiển thị "Xác thực danh tính" cho seller và buyer, không hiển thị cho admin
    ...(!isAdmin ? [{ key: "verification", icon: <FiUser />, label: "Xác thực danh tính" }] : []),
    { key: "security", icon: <FiLock />, label: "Bảo mật" },
    { key: "settings", icon: <FiSettings />, label: "Cài đặt" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-2 mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Quay lại
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Hồ sơ của tôi</h1>
          <p className="text-gray-600 mt-1">Quản lý thông tin cá nhân và cài đặt tài khoản</p>
        </div>

        {loading && (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="animate-spin inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
            <p className="mt-4 text-gray-600">Đang tải...</p>
          </div>
        )}

        {!loading && !profile && (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <p className="text-gray-500">Không thể tải thông tin hồ sơ.</p>
          </div>
        )}

        {!loading && profile && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-6">
                {/* Avatar */}
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <img
                      src={avatarPreview || profile.avatar_url || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                      className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
                      alt="avatar"
                      onError={(e) => {
                        e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                      }}
                    />
                    <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <h3 className="font-bold text-gray-900 mt-3">{profile.full_name || profile.name}</h3>
                  <p className="text-sm text-gray-500">{profile.email}</p>
                  <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                    profile.role === "admin" ? "bg-red-100 text-red-700" :
                    profile.role === "seller" ? "bg-blue-100 text-blue-700" :
                    "bg-green-100 text-green-700"
                  }`}>
                    {profile.role === "admin" ? "👑 Admin" : 
                     profile.role === "seller" ? "🏢 Seller" : 
                     "👤 Buyer"}
                  </span>
                </div>

                {/* Menu */}
                <nav className="space-y-1">
                  {menuItems.map((item) => (
                    <button
                      key={item.key}
                      onClick={() => setActiveTab(item.key)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                        activeTab === item.key
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                  
                  <hr className="my-2" />
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition"
                  >
                    <FiLogOut className="text-xl" />
                    <span>Đăng xuất</span>
                  </button>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {activeTab === "info" && (
                <PersonalProfile 
                  profile={profile}
                  setProfile={setProfile}
                  avatarPreview={avatarPreview}
                  setAvatarPreview={setAvatarPreview}
                />
              )}
              {/* Chỉ hiển thị VerificationTab cho seller và buyer, không hiển thị cho admin */}
              {activeTab === "verification" && !isAdmin && <VerificationTab profile={profile} />}
              {activeTab === "security" && <SecurityTab />}
              {activeTab === "settings" && <SettingsTab />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

/* ============================================================
   ⭐ COMPONENT BÊN DƯỚI
============================================================ */

const PersonalProfile = ({ profile, setProfile, avatarPreview, setAvatarPreview }) => {
  const [formData, setFormData] = useState({
    full_name: profile.full_name || profile.name || "",
    email: profile.email || "",
    phone: profile.phone || "",
    birth_date: profile.birth_date || profile.birthDate || "",
    address: profile.address || "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  
  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleDateString("vi-VN");
    } catch {
      return dateStr;
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle avatar file upload
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    console.log("📁 File selected:", file);
    
    if (file) {
      console.log("🔍 File details:");
      console.log("- Name:", file.name);
      console.log("- Type:", file.type);
      console.log("- Size:", file.size, "bytes");
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        console.error("❌ Invalid file type:", file.type);
        setMessage("❌ Vui lòng chọn file ảnh!");
        return;
      }
      
      // Validate file size (max 2MB - backend limit)
      if (file.size > 2 * 1024 * 1024) {
        console.error("❌ File too large:", file.size);
        setMessage("❌ Kích thước ảnh không được vượt quá 2MB!");
        return;
      }
      
      console.log("✅ File validation passed");
      setAvatarFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        console.log("✅ Preview created");
      };
      reader.readAsDataURL(file);
      
      setMessage("");
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    
    try {
      let avatarUrl = profile.avatar_url;
      
      // 1. Upload avatar nếu có file mới
      if (avatarFile) {
        setMessage("📤 Đang upload avatar...");
        try {
          const uploadResponse = await profileApi.uploadAvatar(avatarFile);
          console.log("✅ Avatar uploaded:", uploadResponse);
          
          // Backend trả về URL của avatar
          if (uploadResponse?.data?.avatar_url) {
            avatarUrl = uploadResponse.data.avatar_url;
          } else if (uploadResponse?.avatar_url) {
            avatarUrl = uploadResponse.avatar_url;
          }
          
          setAvatarPreview(avatarUrl);
          setMessage("✅ Upload avatar thành công!");
        } catch (uploadError) {
          console.error("❌ Upload avatar error:", uploadError);
          setMessage("❌ Upload avatar thất bại: " + (uploadError.message || "Vui lòng thử lại"));
          setSaving(false);
          return; // Dừng lại nếu upload thất bại
        }
      }
      
      // 2. Update profile với avatar URL mới (nếu có thông tin khác thay đổi)
      if (formData.full_name !== profile.full_name || 
          formData.phone !== profile.phone || 
          formData.birth_date !== profile.birth_date || 
          formData.address !== profile.address) {
        setMessage("💾 Đang lưu thông tin...");
        const updateData = {
          ...formData,
          avatar_url: avatarUrl,
        };
        
        try {
          await profileApi.updateProfile(updateData);
          console.log("✅ Profile updated");
        } catch (apiError) {
          console.error("⚠️ API update failed:", apiError);
          setMessage("⚠️ Lưu thông tin thất bại: " + (apiError.message || "Vui lòng thử lại"));
        }
      }
      
      // 3. Cập nhật localStorage (chỉ update các field đã thay đổi)
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      const updatedUser = { 
        ...currentUser,
        full_name: formData.full_name,
        phone: formData.phone,
        birth_date: formData.birth_date,
        address: formData.address,
        avatar_url: avatarUrl,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      // 4. Cập nhật state profile ngay lập tức (giữ nguyên các field khác)
      setProfile(prev => ({
        ...prev,
        full_name: formData.full_name,
        phone: formData.phone,
        birth_date: formData.birth_date,
        address: formData.address,
        avatar_url: avatarUrl,
      }));
      
      // 5. Clear avatar file state
      setAvatarFile(null);
      
      setMessage("✅ Đã lưu thông tin thành công!");
      
      // Reload sau 1.5 giây để cập nhật navbar
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("❌ Save error:", error);
      setMessage("❌ Có lỗi xảy ra: " + (error.message || "Vui lòng thử lại"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* Header với avatar */}
      <div className="flex items-center justify-between mb-8 border-b pb-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img
              src={avatarPreview || profile.avatar_url || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
              className="w-20 h-20 rounded-full object-cover border-2 border-blue-500"
              alt="avatar"
              onError={(e) => {
                e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
              }}
            />
            <button className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1.5 hover:bg-blue-700">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
          <div>
            <h1 className="text-2xl font-bold">{profile.full_name || profile.name || "—"}</h1>
            <p className="text-gray-600">
              {profile.role === "seller" ? "🏢 Doanh nghiệp" : profile.role === "admin" ? "👑 Quản trị viên" : "👤 Thành viên"}
            </p>
            <p className="text-sm text-gray-500">
              Tham gia: {formatDate(profile.created_at)}
            </p>
          </div>
        </div>
        
        {/* Badges */}
        <div className="flex flex-col gap-2">
          {profile.email_verified_at && (
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
              ✓ Email đã xác minh
            </span>
          )}
          {(profile.is_verified === true || profile.is_verified === 1 || profile.is_verified === '1') && (
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
              ✓ Đã xác thực danh tính
            </span>
          )}
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            ● Đang online
          </span>
        </div>
      </div>

      {/* Form thông tin */}
      <div className="bg-gray-50 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Thông tin cá nhân</h2>
        
        {/* Avatar Upload */}
        <div className="mb-6 pb-6 border-b">
          <label className="block text-sm text-gray-600 font-medium mb-2">Ảnh đại diện</label>
          <div className="flex items-center gap-6">
            <img
              src={avatarPreview || profile.avatar_url || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
              className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
              alt="avatar preview"
              onError={(e) => {
                e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
              }}
            />
            <div className="flex-1">
              <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
              <label
                htmlFor="avatar-upload"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition"
              >
                📷 Chọn ảnh mới
              </label>
              <p className="text-xs text-gray-500 mt-2">
                JPG, PNG hoặc GIF. Tối đa 2MB.
              </p>
              {avatarFile && (
                <p className="text-sm text-green-600 mt-1">
                  ✓ Đã chọn: {avatarFile.name}
                </p>
              )}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600 font-medium">Họ và tên *</label>
            <input
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg mt-1 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Nhập họ và tên"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 font-medium">Email</label>
            <input
              name="email"
              value={formData.email}
              className="w-full px-3 py-2 border rounded-lg mt-1 bg-gray-100 cursor-not-allowed"
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">Email không thể thay đổi</p>
          </div>
          <div>
            <label className="text-sm text-gray-600 font-medium">Số điện thoại *</label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg mt-1 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Nhập số điện thoại"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 font-medium">Ngày sinh</label>
            <input
              name="birth_date"
              type="date"
              value={formData.birth_date}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg mt-1 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-gray-600 font-medium">Địa chỉ</label>
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg mt-1 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Nhập địa chỉ"
            />
          </div>
        </div>
        
        {message && (
          <div className={`mt-4 p-3 rounded-lg ${message.includes("✅") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
            {message}
          </div>
        )}
        
        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-6 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 font-medium"
        >
          {saving ? "⏳ Đang lưu..." : "💾 Lưu thay đổi"}
        </button>
      </div>

      {/* Thông tin hệ thống */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Thông tin hệ thống</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">ID tài khoản:</span>
            <span className="ml-2 font-mono font-medium">#{profile.id}</span>
          </div>
          <div>
            <span className="text-gray-600">Vai trò:</span>
            <span className="ml-2 font-medium capitalize">{profile.role}</span>
          </div>
          <div>
            <span className="text-gray-600">Quyền hạn:</span>
            <span className="ml-2 font-medium">{profile.rights || "Mặc định"}</span>
          </div>
          <div>
            <span className="text-gray-600">Trạng thái:</span>
            <span className="ml-2 font-medium capitalize">{profile.status}</span>
          </div>
          <div>
            <span className="text-gray-600">Ngày tạo:</span>
            <span className="ml-2">{formatDate(profile.created_at)}</span>
          </div>
          <div>
            <span className="text-gray-600">Cập nhật lần cuối:</span>
            <span className="ml-2">{formatDate(profile.updated_at)}</span>
          </div>
          {profile.email_verified_at && (
            <div className="md:col-span-2">
              <span className="text-gray-600">Email xác minh lúc:</span>
              <span className="ml-2">{formatDate(profile.email_verified_at)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};



const SecurityTab = () => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Bảo mật</h2>
      
      <div className="space-y-4">
        <div className="border rounded-lg p-4 hover:bg-gray-50 transition">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Đổi mật khẩu</h3>
              <p className="text-sm text-gray-600">Cập nhật mật khẩu để bảo mật tài khoản</p>
            </div>
            <button
              onClick={() => navigate("/reset")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Đổi mật khẩu
            </button>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Xác thực 2 bước</h3>
              <p className="text-sm text-gray-600">Tăng cường bảo mật với xác thực 2 lớp</p>
            </div>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
              Sắp ra mắt
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const VerificationTab = ({ profile }) => {
  const [verifyHistory, setVerifyHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  useEffect(() => {
    fetchVerifyHistory();
  }, []);
  
  const fetchVerifyHistory = async () => {
    try {
      const response = await profileApi.getVerifyHistory();
      setVerifyHistory(response.data || []);
    } catch (error) {
      console.error("Error fetching verify history:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const latestRequest = verifyHistory[0];
  // SỬ DỤNG profile.is_verified làm nguồn chính thức (đồng bộ với trang Thông tin cá nhân)
  // Nếu profile.is_verified = true thì đã xác thực, bất kể history
  const isVerified = profile?.is_verified === true || profile?.is_verified === 1 || profile?.is_verified === '1';
  // Chỉ pending khi chưa verified VÀ có request pending
  const isPending = !isVerified && latestRequest?.status === 'pending';
  
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Xác thực danh tính</h2>
      
      {/* Status Badge */}
      <div className="mb-6 p-4 rounded-lg border-2" style={{
        borderColor: isVerified ? '#10b981' : isPending ? '#f59e0b' : '#e5e7eb',
        backgroundColor: isVerified ? '#d1fae5' : isPending ? '#fef3c7' : '#f9fafb'
      }}>
        <div className="flex items-center gap-3">
          {isVerified && (
            <>
              <span className="text-3xl">✅</span>
              <div>
                <h3 className="font-bold text-green-700">Đã xác thực</h3>
                <p className="text-sm text-green-600">Tài khoản của bạn đã được xác minh</p>
              </div>
            </>
          )}
          {isPending && !isVerified && (
            <>
              <span className="text-3xl">⏳</span>
              <div>
                <h3 className="font-bold text-yellow-700">Đang chờ duyệt</h3>
                <p className="text-sm text-yellow-600">Yêu cầu xác thực của bạn đang được xem xét</p>
              </div>
            </>
          )}
          {!isVerified && !isPending && (
            <>
              <span className="text-3xl">⚠️</span>
              <div>
                <h3 className="font-bold text-gray-700">Chưa xác thực</h3>
                <p className="text-sm text-gray-600">Xác thực danh tính để tăng độ tin cậy</p>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Action Button */}
      {!isVerified && !isPending && (
        <button
          onClick={() => setShowForm(true)}
          className="mb-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          📄 Gửi yêu cầu xác thực
        </button>
      )}
      
      {/* Verify Form */}
      {showForm && <VerifyForm onSuccess={() => { setShowForm(false); fetchVerifyHistory(); }} onCancel={() => setShowForm(false)} />}
      
      {/* History */}
      <div className="mt-6">
        <h3 className="font-bold text-lg mb-4">Lịch sử xác thực</h3>
        {loading ? (
          <p className="text-gray-500">Đang tải...</p>
        ) : verifyHistory.length === 0 ? (
          <p className="text-gray-500">Chưa có lịch sử xác thực</p>
        ) : (
          <div className="space-y-3">
            {verifyHistory.map((item) => (
              <div key={item.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{item.document_type === 'id_card' ? 'CCCD/CMND' : item.document_type === 'business_license' ? 'Giấy phép KD' : 'Mã số thuế'}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.status === 'approved' ? 'bg-green-100 text-green-700' :
                    item.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {item.status === 'approved' ? '✓ Đã duyệt' : item.status === 'rejected' ? '✗ Từ chối' : '⏳ Chờ duyệt'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Ngày gửi: {new Date(item.created_at).toLocaleDateString('vi-VN')}</p>
                {item.admin_note && (
                  <p className="text-sm text-gray-700 mt-2 p-2 bg-gray-50 rounded">
                    <strong>Ghi chú:</strong> {item.admin_note}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const VerifyForm = ({ onSuccess, onCancel }) => {
  const [documentType, setDocumentType] = useState('id_card');
  const [documentUrl, setDocumentUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    
    try {
      await profileApi.submitVerifyRequest({
        document_type: documentType,
        document_url: documentUrl
      });
      setMessage('✅ Gửi yêu cầu thành công!');
      setTimeout(() => onSuccess(), 1500);
    } catch (error) {
      setMessage('❌ ' + (error.message || 'Có lỗi xảy ra'));
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div className="mb-6 p-6 border-2 border-blue-200 rounded-lg bg-blue-50">
      <h3 className="font-bold text-lg mb-4">Gửi yêu cầu xác thực</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Loại tài liệu</label>
          <select
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="id_card">CCCD/CMND</option>
            <option value="business_license">Giấy phép kinh doanh</option>
            <option value="tax_code">Mã số thuế</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">URL ảnh tài liệu</label>
          <input
            type="url"
            value={documentUrl}
            onChange={(e) => setDocumentUrl(e.target.value)}
            placeholder="https://example.com/document.jpg"
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Upload ảnh lên server trước, sau đó dán URL vào đây</p>
        </div>
        {message && (
          <div className={`mb-4 p-3 rounded ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {submitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

const SettingsTab = () => (
  <div className="bg-white rounded-2xl shadow-sm p-6">
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Cài đặt</h2>
    <p className="text-gray-500">Các tùy chọn cài đặt sẽ được cập nhật sớm.</p>
  </div>
);
