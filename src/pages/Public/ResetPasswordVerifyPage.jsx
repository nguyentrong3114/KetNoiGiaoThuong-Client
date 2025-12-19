import React, { useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { authApi } from "../../services/apiClient";

const ResetPasswordVerifyPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const [errorOtp, setErrorOtp] = useState("");
  const [errorPass, setErrorPass] = useState("");
  const [errorConfirm, setErrorConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resending, setResending] = useState(false);

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const inputsRef = useRef([]);

  const handleOtpChange = (value, index) => {
    if (!/^[0-9]*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) inputsRef.current[index + 1].focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalOtp = otp.join("");
    let hasError = false;

    // ------------------ VALIDATION ------------------
    // OTP
    if (finalOtp.length !== 6) {
      setErrorOtp("Mã OTP phải gồm 6 số.");
      hasError = true;
    } else {
      setErrorOtp("");
    }

    // Password
    if (password.length < 6) {
      setErrorPass("Mật khẩu phải có ít nhất 6 ký tự.");
      hasError = true;
    } else {
      setErrorPass("");
    }

    // Confirm password
    if (confirmPass !== password) {
      setErrorConfirm("Mật khẩu xác nhận không trùng khớp.");
      hasError = true;
    } else {
      setErrorConfirm("");
    }

    if (hasError) return;

    // ------------------ SUBMIT API ------------------
    setLoading(true);
    
    try {
      const response = await authApi.resetPassword({
        email,
        otp: finalOtp,
        password,
        password_confirmation: confirmPass,
      });

      if (response?.status === "success") {
        setSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      console.error("Reset password error:", error);
      setErrorOtp(error.message || "Mã OTP không đúng hoặc đã hết hạn.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      setErrorOtp("Không tìm thấy email. Vui lòng thử lại từ trang quên mật khẩu.");
      return;
    }

    setResending(true);
    setErrorOtp("");

    try {
      const response = await authApi.resendVerificationOtp({ email });
      if (response?.status === "success") {
        alert("✅ Mã OTP mới đã được gửi đến email của bạn!");
        // Reset OTP inputs
        setOtp(["", "", "", "", "", ""]);
        inputsRef.current[0]?.focus();
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      setErrorOtp(error.message || "Không thể gửi lại mã OTP. Vui lòng thử lại sau.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white w-full max-w-md rounded-3xl shadow-xl p-10 border border-gray-200"
      >
        {/* TIÊU ĐỀ */}
        <h1 className="text-3xl font-extrabold text-blue-800 mb-3 text-center">Đặt lại mật khẩu</h1>
        <p className="text-gray-600 text-center mb-8">
          Nhập mã OTP gồm 6 số đã gửi đến email của bạn và tạo mật khẩu mới.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* MÃ OTP */}
          <div className="text-center">
            <label className="block text-gray-800 font-semibold mb-2">Mã xác thực (OTP)</label>

            <div className="flex justify-between gap-3 mt-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  ref={(el) => (inputsRef.current[index] = el)}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  className={`w-12 h-14 md:w-14 md:h-16 rounded-xl bg-gray-100 
                             text-center text-2xl font-semibold tracking-widest 
                             border ${errorOtp ? "border-red-500" : "border-gray-300"} shadow-sm 
                             focus:ring-2 focus:ring-blue-600 outline-none transition`}
                />
              ))}
            </div>

            {errorOtp && <p className="text-red-500 text-sm mt-2">{errorOtp}</p>}
          </div>

          {/* MẬT KHẨU MỚI */}
          <div className="relative">
            <label className="block font-semibold text-gray-800 mb-2">Mật khẩu mới</label>
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu mới"
              className={`w-full px-4 py-3 rounded-xl bg-gray-100 border ${
                errorPass ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-blue-600 outline-none`}
            />

            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-11 text-gray-500 hover:text-gray-700"
            >
              {showPass ? <EyeIcon className="w-5" /> : <EyeSlashIcon className="w-5" />}
            </button>

            {errorPass && <p className="text-red-500 text-sm mt-2">{errorPass}</p>}
          </div>

          {/* XÁC NHẬN MẬT KHẨU */}
          <div className="relative">
            <label className="block font-semibold text-gray-800 mb-2">Xác nhận mật khẩu</label>
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              placeholder="Nhập lại mật khẩu"
              className={`w-full px-4 py-3 rounded-xl bg-gray-100 border ${
                errorConfirm ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-blue-600 outline-none`}
            />

            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-4 top-11 text-gray-500 hover:text-gray-700"
            >
              {showConfirm ? <EyeIcon className="w-5" /> : <EyeSlashIcon className="w-5" />}
            </button>

            {errorConfirm && <p className="text-red-500 text-sm mt-2">{errorConfirm}</p>}
          </div>

          {/* SUCCESS MESSAGE */}
          {success && (
            <p className="text-green-600 text-sm text-center">
              ✅ Đổi mật khẩu thành công! Đang chuyển đến trang đăng nhập...
            </p>
          )}

          {/* NÚT SUBMIT */}
          <button
            type="submit"
            disabled={loading || success}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold 
                       text-lg py-3 rounded-full shadow-lg transition active:scale-95
                       disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Đang xử lý..." : success ? "Thành công!" : "Xác nhận đổi mật khẩu"}
          </button>
        </form>

        {/* RESEND OTP */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Không nhận được mã?{" "}
          <button
            type="button"
            disabled={resending}
            className="text-blue-700 hover:underline font-semibold disabled:text-gray-400"
            onClick={handleResendOtp}
          >
            {resending ? "Đang gửi..." : "Gửi lại mã"}
          </button>
        </p>

        {/* QUAY LẠI ĐĂNG NHẬP */}
        <p className="text-center text-gray-600 text-sm mt-4">
          Nhớ mật khẩu rồi?{" "}
          <Link to="/login" className="text-blue-700 hover:underline font-semibold">
            Đăng nhập
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default ResetPasswordVerifyPage;
