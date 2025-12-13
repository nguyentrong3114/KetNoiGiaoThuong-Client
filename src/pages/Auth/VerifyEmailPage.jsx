import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { authApi } from "../../services/apiClient";

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialEmail = location.state?.email || "";

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [errorOtp, setErrorOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resending, setResending] = useState(false);
  const inputsRef = useRef([]);

  const handleChange = (value, index) => {
    if (!/^[0-9]*$/.test(value)) return; // Chỉ cho nhập số

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Reset lỗi khi người dùng nhập lại
    if (errorOtp) setErrorOtp("");

    // Tự động chuyển sang ô kế tiếp
    if (value && index < 5) inputsRef.current[index + 1].focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalOtp = otp.join("");

    // ---------------- VALIDATION ----------------
    if (!email || !email.trim()) {
      setErrorOtp("Vui lòng nhập email.");
      return;
    }

    if (finalOtp.length !== 6) {
      setErrorOtp("Mã OTP phải gồm 6 số.");
      return;
    }

    setErrorOtp("");
    setLoading(true);

    // ---------- Submit API ----------
    try {
      // Debug log
      console.log("📧 Verify Email Request:", { email: email.trim(), otp: finalOtp });
      
      const response = await authApi.verifyEmail({
        email: email.trim(),
        otp: finalOtp,
      });

      console.log("✅ Verify Email Response:", response);

      if (response?.status === "success") {
        setSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      console.error("❌ Verify email error:", error);
      setErrorOtp(error.message || "Mã OTP không đúng hoặc đã hết hạn.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      setErrorOtp("Không tìm thấy email. Vui lòng đăng ký lại.");
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
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-blue-50 to-blue-100">
      {/* LEFT IMAGE */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden md:flex w-1/2 relative items-center justify-center"
      >
        <img
          src="https://images.unsplash.com/photo-1605902711622-cfb43c4437b5?auto=format&fit=crop&w=1200&q=80"
          alt="Verify"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-blue-700/40 backdrop-blur-sm"></div>

        <div className="relative text-center text-white px-10">
          <h2 className="text-4xl font-bold mb-4 drop-shadow-lg">Xác minh email</h2>
          <p className="text-blue-100 text-lg max-w-md mx-auto leading-relaxed">
            Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư để hoàn tất đăng ký.
          </p>
        </div>
      </motion.div>

      {/* RIGHT FORM */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full md:w-1/2 flex flex-col justify-center items-center px-6 md:px-16 lg:px-24 py-12 bg-white"
      >
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-extrabold text-blue-800 mb-4">Nhập mã xác thực</h1>
          <p className="text-gray-600 mb-4">Mã OTP gồm 6 chữ số đã được gửi đến email của bạn.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input - cho phép nhập nếu không có từ state */}
            <div>
              <label className="block text-gray-800 font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email đã đăng ký"
                className="w-full px-4 py-3 rounded-xl bg-gray-100 focus:ring-2 focus:ring-blue-500 border border-gray-300"
                disabled={!!initialEmail}
              />
              {initialEmail && (
                <p className="text-sm text-gray-500 mt-1">Email được tự động điền từ trang đăng ký</p>
              )}
            </div>

            {/* OTP 6 Ô */}
            <div>
              <div className="flex justify-between gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputsRef.current[index] = el)}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e.target.value, index)}
                    className={`w-12 h-14 md:w-14 md:h-16 rounded-xl 
                                text-center text-2xl font-semibold bg-gray-100 shadow-sm
                                outline-none transition
                                ${errorOtp ? "border border-red-500" : "border border-gray-300"}
                                focus:ring-2 focus:ring-blue-600`}
                  />
                ))}
              </div>

              {errorOtp && <p className="text-red-500 text-sm mt-2">{errorOtp}</p>}
            </div>

            {/* Success Message */}
            {success && (
              <p className="text-green-600 text-sm text-center">
                ✅ Xác minh thành công! Đang chuyển đến trang đăng nhập...
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || success}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold 
                         text-lg py-3 rounded-full shadow-md transition
                         disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Đang xác minh..." : success ? "Thành công!" : "Xác minh tài khoản"}
            </button>
          </form>

          {/* RESEND */}
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
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmailPage;
