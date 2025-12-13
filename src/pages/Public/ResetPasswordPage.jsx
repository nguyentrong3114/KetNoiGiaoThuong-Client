import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, ShieldCheck } from "lucide-react";
import { authApi } from "../../services/apiClient";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [strength, setStrength] = useState({ color: "bg-red-500", label: "Weak" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "newPassword") {
      if (value.length > 8 && /[A-Z]/.test(value) && /\d/.test(value)) {
        setStrength({ color: "bg-green-500", label: "Strong" });
      } else if (value.length > 5) {
        setStrength({ color: "bg-yellow-500", label: "Medium" });
      } else {
        setStrength({ color: "bg-red-500", label: "Weak" });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }

    setLoading(true);

    try {
      const response = await authApi.changePassword({
        current_password: formData.currentPassword,
        password: formData.newPassword,
        password_confirmation: formData.confirmPassword,
      });

      if (response?.status === "success") {
        setSuccess(true);
        setTimeout(() => {
          navigate("/profile");
        }, 2000);
      }
    } catch (err) {
      console.error("Change password error:", err);
      setError(err.message || "Mật khẩu hiện tại không đúng.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 px-4">
      <div className="bg-white/90 backdrop-blur-xl w-full max-w-lg rounded-3xl shadow-xl p-10 border border-gray-100">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <ShieldCheck className="text-blue-600" size={40} />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">Reset Password</h1>
          <p className="text-gray-500 text-sm mt-2">
            Enter your current password and choose a strong new password.
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current password */}
          <div>
            <label className="text-sm text-gray-600 font-medium">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              placeholder="••••••••"
              value={formData.currentPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 
              focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm mt-1"
            />
          </div>

          {/* New password */}
          <div>
            <label className="text-sm text-gray-600 font-medium">New Password</label>
            <input
              type="password"
              name="newPassword"
              placeholder="••••••••"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 
              focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm mt-1"
            />

            {/* Strength meter */}
            <div className="flex items-center mt-2">
              <div className={`h-1.5 w-1/3 rounded-full ${strength.color}`}></div>
              <span className="ml-3 text-xs text-gray-500">{strength.label}</span>
            </div>
          </div>

          {/* Confirm password */}
          <div>
            <label className="text-sm text-gray-600 font-medium">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 
              focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm mt-1"
            />
          </div>

          {/* Error/Success Messages */}
          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}
          
          {success && (
            <p className="text-green-600 text-sm">✅ Đổi mật khẩu thành công! Đang chuyển trang...</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || success}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 
            hover:opacity-95 text-white font-semibold text-lg py-3 rounded-xl 
            shadow-lg transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Đang cập nhật..." : success ? "Thành công!" : "Update Password"}
          </button>
        </form>

        {/* Link */}
        <div className="text-center mt-6">
          <Link to="/forgot" className="text-blue-700 hover:underline text-sm font-medium">
            Forgot current password?
          </Link>
        </div>

        {/* Illustration */}
        <div className="mt-8 flex justify-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3064/3064197.png"
            className="w-16 opacity-90"
            alt="Reset Password"
          />
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
