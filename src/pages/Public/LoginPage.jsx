import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { authApi } from "../../services/apiClient";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  // Input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

<<<<<<< HEAD
  /* ============================================================
      📌 SUBMIT LOGIN — API CONNECTED
  ============================================================= */
=======
  // Submit login
  // Submit login
>>>>>>> 17d795c47111f022496d9bbca35c46e032b555bd
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.email || !formData.password) {
<<<<<<< HEAD
      setErrorMsg("Vui lòng nhập đầy đủ thông tin.");
=======
      setErrorMsg("Vui lòng nhập email và mật khẩu.");
>>>>>>> 17d795c47111f022496d9bbca35c46e032b555bd
      return;
    }

    setLoading(true);

    try {
<<<<<<< HEAD
      console.log("📤 Sending login request...");
      const response = await authApi.login({
=======
      const res = await authApi.login({
>>>>>>> 17d795c47111f022496d9bbca35c46e032b555bd
        email: formData.email,
        password: formData.password,
      });

<<<<<<< HEAD
      console.log("🔐 Login response:", response);
      console.log("🔐 Response type:", typeof response);
      console.log("🔐 Response keys:", response ? Object.keys(response) : "null");

      // apiRequest trả về toàn bộ response: { status, message, data }
      // data chứa { access_token, user }
      const token = response?.data?.access_token;
      const user = response?.data?.user;

      console.log("📦 Token:", token ? token.substring(0, 20) + "..." : "null");
      console.log("📦 User:", user);

      if (token) {
        // Lưu token
        localStorage.setItem("token", token);
        console.log("✅ Token saved");
        
        // Fetch user info từ /api/user
        let userData = null;
        
        try {
          console.log("📡 Fetching user info from /user...");
          const userResponse = await authApi.me();
          console.log("📥 User response:", userResponse);
          
          // userResponse có thể là { data: {...} } hoặc trực tiếp user object
          userData = userResponse?.data || userResponse;
          console.log("📦 User data extracted:", userData);
        } catch (err) {
          console.error("❌ Error fetching user from /api/user:", err);
          
          // Nếu không lấy được từ /api/user, tạo user object cơ bản từ email
          userData = {
            id: 1,
            email: formData.email,
            full_name: formData.email.split("@")[0],
            role: formData.email.includes("admin") ? "admin" : "buyer",
          };
          console.log("📦 Created fallback user:", userData);
        }
        
        // Lưu user vào localStorage
        if (userData) {
          localStorage.setItem("user", JSON.stringify(userData));
          console.log("✅ User saved to localStorage");
          
          // Verify
          const savedUser = localStorage.getItem("user");
          console.log("🔍 Verify saved user:", savedUser);
        }
        
        // Redirect dựa vào role
        const role = userData?.role || "buyer";
        console.log("👤 User role:", role);
        
        if (role === "admin") {
          console.log("🚀 Redirecting to admin dashboard...");
          window.location.href = "/admin/dashboard";
        } else if (role === "seller") {
          console.log("🚀 Redirecting to company dashboard...");
          window.location.href = "/dashboard/company";
        } else {
          console.log("🚀 Redirecting to user dashboard...");
          window.location.href = "/dashboard";
        }
      } else {
        console.error("❌ No access_token in response");
        setErrorMsg("Đăng nhập thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      console.error("❌ Error type:", typeof error);
      console.error("❌ Error message:", error.message);
      console.error("❌ Error stack:", error.stack);
      
      // Xử lý các lỗi cụ thể
      let errorMessage = "Có lỗi xảy ra. Vui lòng thử lại.";
      
      if (error.message) {
        if (error.message.includes("verify your email") || error.message.includes("verify email")) {
          errorMessage = "Vui lòng xác thực email trước khi đăng nhập.";
        } else if (error.message.includes("Invalid credentials") || error.message.includes("không đúng")) {
          errorMessage = "Email hoặc mật khẩu không đúng.";
        } else if (error.message.includes("Network") || error.message.includes("Failed to fetch")) {
          errorMessage = "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.";
        } else {
          errorMessage = error.message;
        }
      }
      
      console.error("📝 Final error message:", errorMessage);
      setErrorMsg(errorMessage);
    } finally {
      setLoading(false);
=======
      // Token BE trả về
      const accessToken = res.data?.access_token;
      const refreshToken = res.data?.refresh_token;

      if (!accessToken) {
        throw new Error("Không nhận được access token từ máy chủ.");
      }

      // ========= 🔥 DECODE JWT ĐỂ LẤY ROLE 🔥 =========
      const decodeJWT = (token) => {
        try {
          const base64 = token.split(".")[1];
          return JSON.parse(atob(base64));
        } catch {
          return null;
        }
      };

      const payload = decodeJWT(accessToken);
      const role = payload?.role || "buyer"; // fallback nếu token không có role

      // ========= 🔥 LƯU TOKEN + ROLE + USER ĐỂ NAVBAR ĐỌC 🔥 =========
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken || "");
      localStorage.setItem("user_role", role);

      const userData = {
        role,
        email: formData.email,
        avatar: "/default-avatar.png",
      };

      localStorage.setItem("user", JSON.stringify(userData));
      window.dispatchEvent(new Event("storage")); // ⬅ Thông báo Navbar cập nhật ngay

      // ========= 🔥 REDIRECT THEO ROLE 🔥 =========
      setLoading(false);

      if (role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setLoading(false);
      setErrorMsg(err.message || "Sai email hoặc mật khẩu.");
>>>>>>> 17d795c47111f022496d9bbca35c46e032b555bd
    }
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
          <h1 className="text-4xl font-extrabold text-blue-800 mb-3">Đăng nhập</h1>
          <p className="text-gray-500 mb-8">
            Truy cập tài khoản của bạn để kết nối và phát triển cộng đồng doanh nghiệp Việt Nam.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-gray-800 font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Nhập email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-gray-100 text-gray-800 focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-4 py-3 rounded-xl bg-gray-100 text-gray-800 focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-500"
              >
                {showPassword ? <EyeIcon className="w-5" /> : <EyeSlashIcon className="w-5" />}
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
              } text-white font-semibold text-lg py-3 rounded-full shadow-md transition`}
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
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" />
            <span className="text-gray-700 font-medium">Đăng nhập bằng Google</span>
          </button>
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
          alt="Trade"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-blue-800/70 to-blue-700/60"></div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
