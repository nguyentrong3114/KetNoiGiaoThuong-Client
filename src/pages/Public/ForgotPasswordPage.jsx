import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../../services/apiClient";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authApi.forgotPassword({ email });
      
      if (response?.status === "success") {
        setSuccess(true);
        // Chuyển sang trang verify sau 2 giây
        setTimeout(() => {
          navigate("/reset/verify", { state: { email } });
        }, 2000);
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      setError(err.message || "Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-md p-8 border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Forgot Current Password</h1>
        <p className="text-gray-500 text-sm mb-8">
          Enter the email you used to create your account so we can send you instructions on how to
          reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading || success}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
          
          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}
          
          {success && (
            <p className="text-green-600 text-sm">✅ Mã OTP đã được gửi đến email của bạn. Đang chuyển trang...</p>
          )}
          
          <button
            type="submit"
            disabled={loading || success}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold text-lg py-3 rounded-full transition-all disabled:bg-gray-400"
          >
            {loading ? "Đang gửi..." : success ? "Đã gửi!" : "Send"}
          </button>
        </form>

        <div className="mt-6">
          <Link
            to="/login"
            className="block w-full text-center border border-gray-300 py-3 rounded-full font-medium text-gray-700 hover:bg-gray-50 transition-all"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
