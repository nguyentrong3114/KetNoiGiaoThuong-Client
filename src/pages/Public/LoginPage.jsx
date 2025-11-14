import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // 🧩 Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 🧩 Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const { email, password } = formData;

    if (!email || !password) {
      setErrorMsg("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800)); // mô phỏng API
    setLoading(false);

    // 🟦 Kiểm tra tài khoản admin ( demo)
    if (email === "admin@gmail.com" && password === "admin123") {
      alert("Đăng nhập ADMIN thành công!");
      navigate("/admin/dashboard");
      return;
    }

    // 🟩 Tài khoản user thường (demo)
    if (email === "user@gmail.com" && password === "123456") {
      alert("Đăng nhập USER thành công!");

      // ⭐ Quan trọng: lưu user vào localStorage
      localStorage.setItem("role", "user");
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: "Người dùng",
          avatar: "/default-avatar.jpg",
        })
      );

      navigate("/");
      return;
    }

    // 🟥 Sai tài khoản
    setErrorMsg("Sai email hoặc mật khẩu.");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-blue-50 to-blue-100">
      {/* LEFT FORM */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full md:w-1/2 flex flex-col justify-center items-center px-6 md:px-16 lg:px-24 py-12 bg-white shadow-lg md:shadow-none"
      >
        <div className="w-full max-w-md">
          {/* Title */}
          <h1 className="text-4xl font-extrabold text-blue-800 mb-3">Đăng nhập</h1>
          <p className="text-gray-500 mb-8">
            Truy cập tài khoản của bạn để kết nối và phát triển cùng cộng đồng doanh nghiệp Việt
            Nam.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-gray-800 font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Nhập email của bạn"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-gray-100 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label className="block text-gray-800 font-medium mb-1">Mật khẩu</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Nhập mật khẩu"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-gray-100 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
              >
                {!showPassword ? (
                  <EyeIcon className="w-5 h-5" />
                ) : (
                  <EyeSlashIcon className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Error */}
            {errorMsg && <p className="text-red-600 text-sm font-medium">{errorMsg}</p>}

            {/* Remember / Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input type="checkbox" className="rounded" /> Ghi nhớ tôi
              </label>
              <Link to="/forgot" className="text-blue-600 hover:underline font-medium">
                Quên mật khẩu?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full ${
                loading ? "bg-gray-400" : "bg-blue-700 hover:bg-blue-800"
              } text-white font-semibold text-lg py-3 rounded-full transition-all shadow-md hover:shadow-lg`}
            >
              {loading ? "Đang xử lý..." : "Đăng nhập"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-8">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-3 text-gray-500 text-sm">hoặc</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          {/* Google Login */}
          <button className="w-full border border-gray-300 rounded-xl py-3 flex items-center justify-center gap-3 hover:bg-gray-50 transition-all shadow-sm">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
            <span className="text-gray-700 font-medium">Đăng nhập bằng Google</span>
          </button>

          {/* Register */}
          <p className="text-center text-sm text-gray-600 mt-8">
            Chưa có tài khoản?{" "}
            <Link to="/register" className="text-blue-700 hover:underline font-semibold">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </motion.div>

      {/* RIGHT IMAGE */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden md:flex w-1/2 relative items-center justify-center"
      >
        <img
          src="https://images.unsplash.com/photo-1605902711622-cfb43c4437b5?auto=format&fit=crop&w=1200&q=80"
          alt="Trade Connection Background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-blue-800/70 to-blue-700/60"></div>

        <div className="relative text-center text-white px-8">
          <h2 className="text-4xl font-bold mb-4 leading-tight drop-shadow-lg">
            Kết Nối Giao Thương
          </h2>
          <p className="text-blue-100 text-lg max-w-md mx-auto leading-relaxed">
            Nền tảng giao thương uy tín — nơi các doanh nghiệp hợp tác và phát triển bền vững.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
