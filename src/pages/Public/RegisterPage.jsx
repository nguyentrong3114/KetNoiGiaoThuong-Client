import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { authApi } from "../../services/apiClient";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    role: "buyer",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect nếu đã đăng nhập
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    
    if (token) {
      // Đã đăng nhập, redirect về dashboard tương ứng
      if (user?.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else if (user?.role === "seller") {
        navigate("/dashboard/company", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  }, [navigate]);

  // CHANGE INPUT
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // SUBMIT REGISTER — API CONNECTED
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.full_name || !formData.email || !formData.phone || !formData.password) {
      setErrorMsg("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Mật khẩu xác nhận không khớp.");
      return;
    }

    // ✅ VALIDATION: Kiểm tra email theo role
    const email = formData.email.toLowerCase();
    const personalEmailDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'];
    const isPersonalEmail = personalEmailDomains.some(domain => email.endsWith(`@${domain}`));

    if (formData.role === "seller" && isPersonalEmail) {
      setErrorMsg("⚠️ Doanh nghiệp phải đăng ký bằng email công ty (không được dùng Gmail, Yahoo, Hotmail, v.v.)");
      return;
    }

    if (formData.role === "buyer" && !isPersonalEmail) {
      // Cảnh báo nhẹ nhưng vẫn cho phép
      console.warn("Thành viên nên dùng email cá nhân");
    }

    setLoading(true);

    try {
      const response = await authApi.register({
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
      });

      if (response?.status === "success") {
        // Redirect đến trang verify email với email
        navigate("/verify-email", { state: { email: formData.email } });
      } else {
        setErrorMsg("Đăng ký thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Register error:", error);
      setErrorMsg(error.message || "Có lỗi xảy ra khi đăng ký.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-blue-50 to-blue-100">
      {/* LEFT IMAGE */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden md:flex w-1/2 relative items-center justify-center"
      >
        <img
          src="https://images.unsplash.com/photo-1605902711622-cfb43c4437b5?auto=format&fit=crop&w=1200&q=80"
          alt="Register Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-blue-800/70 to-blue-700/60"></div>

        <div className="relative text-center text-white px-8">
          <h2 className="text-4xl font-bold mb-4">
            Cùng nhau phát triển <br />
            <span className="text-blue-200">Kết Nối Giao Thương</span>
          </h2>
          <p className="text-blue-100 text-lg max-w-md mx-auto leading-relaxed">
            Mở rộng cơ hội, kết nối đối tác — cùng xây dựng cộng đồng doanh nghiệp Việt Nam bền
            vững.
          </p>
        </div>
      </motion.div>

      {/* RIGHT FORM */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full md:w-1/2 flex flex-col justify-center items-center px-6 md:px-16 lg:px-24 py-12 bg-white"
      >
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-extrabold text-blue-800 mb-3">Tạo tài khoản</h1>
          <p className="text-gray-500 mb-8">
            Tham gia cùng hàng nghìn doanh nghiệp trên nền tảng giao thương uy tín.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-gray-800 font-medium mb-1">Họ và tên</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Nhập họ và tên"
                className="w-full px-4 py-3 rounded-xl bg-gray-100 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-gray-800 font-medium mb-1">Số điện thoại</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Nhập số điện thoại"
                className="w-full px-4 py-3 rounded-xl bg-gray-100 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-gray-800 font-medium mb-2">Vai trò</label>
              <div className="flex items-center gap-6 text-gray-700">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="buyer"
                    checked={formData.role === "buyer"}
                    onChange={handleChange}
                  />
                  👤 Thành viên (cá nhân)
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value="seller"
                    checked={formData.role === "seller"}
                    onChange={handleChange}
                  />
                  🏢 Doanh nghiệp
                </label>
              </div>
              
              {/* Gợi ý email theo role */}
              {formData.role === "seller" && (
                <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                  ⚠️ <strong>Lưu ý:</strong> Doanh nghiệp phải đăng ký bằng email công ty (ví dụ: contact@company.com). 
                  Không được dùng Gmail, Yahoo, Hotmail.
                </div>
              )}
              {formData.role === "buyer" && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                  ℹ️ Thành viên có thể dùng email cá nhân (Gmail, Yahoo, v.v.)
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-800 font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={formData.role === "seller" ? "contact@company.com" : "example@gmail.com"}
                className="w-full px-4 py-3 rounded-xl bg-gray-100 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label className="block text-gray-800 font-medium mb-1">Mật khẩu</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu"
                className="w-full px-4 py-3 rounded-xl bg-gray-100 focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-500"
              >
                {showPassword ? <EyeIcon className="w-5" /> : <EyeSlashIcon className="w-5" />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label className="block text-gray-800 font-medium mb-1">Xác nhận mật khẩu</label>
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Nhập lại mật khẩu"
                className="w-full px-4 py-3 rounded-xl bg-gray-100 focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-9 text-gray-500"
              >
                {showConfirm ? <EyeIcon className="w-5" /> : <EyeSlashIcon className="w-5" />}
              </button>
            </div>

            {/* Error */}
            {errorMsg && <p className="text-red-600 text-sm font-medium">{errorMsg}</p>}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full ${
                loading ? "bg-gray-400" : "bg-blue-700 hover:bg-blue-800"
              } text-white font-semibold text-lg py-3 rounded-full shadow-md`}
            >
              {loading ? "Đang xử lý..." : "Đăng ký ngay"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-8">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-3 text-gray-500 text-sm">hoặc</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <button className="w-full border border-gray-300 rounded-xl py-3 flex items-center justify-center gap-3 hover:bg-gray-50">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" />
            <span className="text-gray-700 font-medium">Đăng ký bằng Google</span>
          </button>

          <p className="text-center text-sm text-gray-600 mt-8">
            Đã có tài khoản?{" "}
            <Link to="/login" className="text-blue-700 hover:underline font-semibold">
              Đăng nhập
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
