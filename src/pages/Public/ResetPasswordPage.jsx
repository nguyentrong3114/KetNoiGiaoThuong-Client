import React, { useState } from "react";
import { Link } from "react-router-dom";

const ResetPasswordPage = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [strength, setStrength] = useState({ color: "bg-red-500", label: "Weak" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "newPassword") {
      // đánh giá độ mạnh mật khẩu
      if (value.length > 8 && /[A-Z]/.test(value) && /\d/.test(value)) {
        setStrength({ color: "bg-green-500", label: "Strong" });
      } else if (value.length > 5) {
        setStrength({ color: "bg-yellow-500", label: "Medium" });
      } else {
        setStrength({ color: "bg-red-500", label: "Weak" });
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Reset password:", formData);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-md p-8 border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">Reset Your Password</h1>
        <p className="text-gray-500 text-sm text-center mb-8">
          Please enter your current password and new password to reset your password
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="password"
              name="currentPassword"
              placeholder="Current Password*"
              value={formData.currentPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <input
              type="password"
              name="newPassword"
              placeholder="Enter New Password*"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex items-center mt-1">
              <div className={`h-1.5 w-1/4 rounded-full ${strength.color}`}></div>
              <span className="ml-2 text-xs text-gray-500">{strength.label}</span>
            </div>
          </div>

          <div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm New Password*"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold text-lg py-3 rounded-full transition-all"
          >
            Update password
          </button>
        </form>

        {/* LINK */}
        <div className="text-center mt-5">
          <Link to="/forgot" className="text-blue-700 hover:underline text-sm font-medium">
            Forgot Current Password?
          </Link>
        </div>

        {/* Illustration */}
        <div className="mt-8 flex justify-center">
          <img
            src="https://cdni.iconscout.com/illustration/premium/thumb/reset-password-illustration-download-in-svg-png-gif-file-formats--update-new-lock-data-security-pack-business-illustrations-6776994.png"
            alt="Reset Password"
            className="w-40"
          />
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
